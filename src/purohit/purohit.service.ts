import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

@Injectable()
export class PurohitService {
  constructor(private supabase: SupabaseService) {}

  // =====================================
  // ADMIN: CREATE PUROHIT (ONE SHOT)
  // =====================================
  async createOneShot(dto: any) {
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const { data: user, error: userError } = await this.supabase.client
      .from('users')
      .insert({
        name: dto.name,
        phone: dto.phone,
        role: 'PUROHIT',
        password_hash: passwordHash,
      })
      .select('*')
      .single();

    if (userError) {
      throw new BadRequestException(
        `Failed to create user: ${userError.message}`,
      );
    }

    const { data: purohit, error: pErr } = await this.supabase.client
      .from('purohits')
      .insert({
        user_id: user.id,
        name: dto.name,
        phone: dto.phone,
        experience_years: dto.experienceYears,
        languages: dto.languages,
        specialization: dto.specialization,
        bio: dto.bio ?? null,
        rating: 5,
        completed_pujas: 0,
        available: true,
      })
      .select('*')
      .single();

    if (pErr) {
      throw new BadRequestException(
        `Failed to create purohit profile: ${pErr.message}`,
      );
    }

    return {
      message: 'Purohit created successfully',
      userId: user.id,
      purohitId: purohit.id,
      temporaryPassword: tempPassword,
    };
  }

  // =====================================
  // LIST ALL
  // =====================================
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .select('*');

    if (error) {
      throw new BadRequestException(
        `Failed to fetch purohits: ${error.message}`,
      );
    }

    return data ?? [];
  }

  // =====================================
  // GET ONE
  // =====================================
  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to fetch purohit: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Purohit not found (ID=${id})`);
    }

    return data;
  }

  // =====================================
  // UPDATE (ADMIN)
  // =====================================
  async update(id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update(dto)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to update purohit: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Purohit not found (ID=${id})`);
    }

    return data;
  }

  // =====================================
  // UPDATE AVAILABILITY
  // =====================================
  async updateAvailability(id: string, available: boolean) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update({ available })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to update availability: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Purohit not found (ID=${id})`);
    }

    return data;
  }

  // =====================================
  // UPLOAD AVATAR (ADVANCED)
  // =====================================
  async uploadAvatar(id: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, WEBP images allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }

    const bucket = 'purohit-avatars';
    const fileName = `${id}-${Date.now()}.jpg`;

    // 🔥 Fetch old avatar
    const { data: existing } = await this.supabase.client
      .from('purohits')
      .select('profile_image_url')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      throw new NotFoundException(`Purohit not found (ID=${id})`);
    }

    // 🔥 Remove old avatar
    if (existing.profile_image_url) {
      await this.supabase.storage
        .from(bucket)
        .remove([existing.profile_image_url]);
    }

    // 🔥 Compress image
    const compressed = await sharp(file.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();

    // 🔥 Upload
    const { error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, compressed, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      throw new InternalServerErrorException(
        `Avatar upload failed: ${uploadError.message}`,
      );
    }

    // 🔥 Update DB
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update({ profile_image_url: fileName })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error || !data) {
      throw new InternalServerErrorException(
        'Avatar uploaded but failed to update DB',
      );
    }

    return {
      message: 'Avatar updated successfully',
      image_path: fileName,
      purohit: data,
    };
  }

  // =====================================
  // GET AVATAR (PUBLIC)
  // =====================================
  async getAvatar(id: string) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .select('profile_image_url')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to fetch avatar: ${error.message}`,
      );
    }

    if (!data?.profile_image_url) {
      throw new NotFoundException('No avatar found for this purohit');
    }

    return {
      image_path: data.profile_image_url,
    };
  }
}
