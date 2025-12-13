import { Injectable, BadRequestException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CreateSamagriKitDto } from "./dto/create-kit.dto";
import { UpdateSamagriKitDto } from "./dto/update-kit.dto";
import { AddKitItemDto } from "./dto/add-kit-item.dto";
import { UpdateKitItemDto } from "./dto/update-kit-item.dto";

@Injectable()
export class SamagriKitsService {
  constructor(private supabase: SupabaseService) {}

  // ⭐ Create Kit
  async create(dto: CreateSamagriKitDto) {
    const { data, error } = await this.supabase.client
      .from("samagri_kits")
      .insert(dto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Get kits for a Puja
  async findByPuja(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from("samagri_kits")
      .select("*")
      .eq("puja_id", puja_id)
      .eq("is_active", true);

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Update Kit
  async update(id: string, dto: UpdateSamagriKitDto) {
    const { data, error } = await this.supabase.client
      .from("samagri_kits")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Delete Kit
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from("samagri_kits")
      .delete()
      .eq("id", id);

    if (error) throw new BadRequestException(error.message);
    return { message: "Kit deleted" };
  }

  // ⭐ Add item inside kit
  async addItem(dto: AddKitItemDto) {
    const { data, error } = await this.supabase.client
      .from("samagri_kit_items")
      .insert(dto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Update Item
  async updateItem(id: string, dto: UpdateKitItemDto) {
    const { data, error } = await this.supabase.client
      .from("samagri_kit_items")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Delete Item
  async removeItem(id: string) {
    const { error } = await this.supabase.client
      .from("samagri_kit_items")
      .delete()
      .eq("id", id);

    if (error) throw new BadRequestException(error.message);
    return { message: "Item removed" };
  }
}
