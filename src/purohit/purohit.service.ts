import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

@Injectable()
export class PurohitService {
  constructor(private supabase: SupabaseService) {}

  // ------------------------------------
  // ADMIN: CREATE PUROHIT IN ONE SHOT
  // ------------------------------------
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

    if (userError) throw new Error(userError.message);

    const { data: purohit, error: pErr } = await this.supabase.client
      .from('purohits')
      .insert({
        user_id: user.id,
        name: dto.name,
        phone: dto.phone,
        experience_years: dto.experienceYears,
        languages: dto.languages,
        specialization: dto.specialization,
        bio: dto.bio,
        rating: 5,
        completed_pujas: 0,
        available: true,
      })
      .select('*')
      .single();

    if (pErr) throw new Error(pErr.message);

    return {
      message: 'Purohit created successfully',
      userId: user.id,
      purohitId: purohit.id,
      temporaryPassword: tempPassword,
    };
  }

  // ------------------------------------
  // LIST
  // ------------------------------------
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  // ------------------------------------
  // GET ONE
  // ------------------------------------
  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ------------------------------------
  // UPDATE (ADMIN)
  // ------------------------------------
  async update(id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update(dto)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ------------------------------------
  // UPDATE AVAILABILITY
  // ------------------------------------
  async updateAvailability(id: string, available: boolean) {
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update({ available })
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  // ------------------------------------
  // UPLOAD AVATAR (ADVANCED)
  // ------------------------------------
  async uploadAvatar(id: string, file: Express.Multer.File) {
    const bucket = 'purohit-avatars';

    // Validate File
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, WEBP allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${id}-${Date.now()}.${ext}`;

    // Remove Old Avatar If Exists
    const { data: existing } = await this.supabase.client
      .from('purohits')
      .select('profile_image_url')
      .eq('id', id)
      .single();

    if (existing?.profile_image_url) {
      const oldFile = existing.profile_image_url.split('/').pop();
      if (oldFile) {
        await this.supabase.storage.from(bucket).remove([oldFile]);
      }
    }

    // Compress Image
    const compressed = await sharp(file.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload New File
    const { error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, compressed, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    // Generate Signed URL (24 hours)
    const { data: signed } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 60 * 60 * 24);

    const signedUrl = signed?.signedUrl ?? null;
    if (!signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    // Update DB
    const { data, error } = await this.supabase.client
      .from('purohits')
      .update({ profile_image_url: fileName })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return {
      message: 'Avatar updated successfully',
      signed_url: signedUrl,
      purohit: data,
    };
  }

  // ------------------------------------
  // GET SIGNED AVATAR URL
  // ------------------------------------
  async getAvatar(id: string) {
  // Fetch only the public profile_image_url from DB
  const { data, error } = await this.supabase.client
    .from('purohits')
    .select('profile_image_url')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  if (!data?.profile_image_url) {
    throw new Error('No avatar found for this Purohit');
  }

  // Just return the stored public URL
  return {
    url: data.profile_image_url,
  };
}

}
