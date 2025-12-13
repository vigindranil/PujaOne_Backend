import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PujaGalleryService {
  constructor(private readonly supabase: SupabaseService) {}

  // ============================
  // UPLOAD IMAGE (ADMIN)
  // ============================
  async upload(
    puja_id: string,
    file: Express.Multer.File,
    sortOrder = 1,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // 🔍 1️⃣ Check puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    // 📦 2️⃣ Upload to storage
    const ext = file.originalname.split('.').pop();
    const filePath = `${puja_id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await this.supabase.client.storage
      .from('puja-gallery')
      .upload(filePath, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new BadRequestException(uploadError.message);
    }

    // 🌐 3️⃣ Public URL
    const { data: urlData } = this.supabase.client.storage
      .from('puja-gallery')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    // 🧾 4️⃣ Insert DB record
    const { data, error } = await this.supabase.client
      .from('puja_gallery')
      .insert({
        puja_id,
        image_url: publicUrl,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // LIST IMAGES (PUBLIC)
  // ============================
  async findAll(puja_id: string) {
    // 🔍 Validate puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    const { data, error } = await this.supabase.client
      .from('puja_gallery')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // DELETE IMAGE (ADMIN)
  // ============================
  async remove(id: string) {
    // 🔍 Check exists
    const { data: record } = await this.supabase.client
      .from('puja_gallery')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!record) {
      throw new NotFoundException('Gallery image not found');
    }

    const { error } = await this.supabase.client
      .from('puja_gallery')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    // ⚠️ Optional future enhancement:
    // delete file from storage using record.image_url

    return { message: 'Image deleted successfully' };
  }
}
