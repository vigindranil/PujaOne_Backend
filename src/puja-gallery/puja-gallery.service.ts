import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PujaGalleryService {
  constructor(private supabase: SupabaseService) {}

  async upload(puja_id: string, file: Express.Multer.File, sortOrder = 1) {
    if (!file) throw new BadRequestException("Image file is required");

    const ext = file.originalname.split('.').pop();
    const filePath = `${puja_id}/${Date.now()}.${ext}`;

    // 🔥 Upload to storage
    const { error: uploadError } = await this.supabase.client.storage
      .from('puja-gallery')
      .upload(filePath, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new BadRequestException(uploadError.message);
    }

    // 🔥 Public URL
    const { data: urlData } = this.supabase.client.storage
      .from('puja-gallery')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    // 🔥 Insert DB record
    const { data: dbData, error: dbError } = await this.supabase.client
      .from('puja_gallery')
      .insert({
        puja_id,
        image_url: publicUrl,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (dbError) {
      throw new BadRequestException(dbError.message);
    }

    return dbData;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_gallery')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order');

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_gallery')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);

    return { message: "Image deleted" };
  }
}
