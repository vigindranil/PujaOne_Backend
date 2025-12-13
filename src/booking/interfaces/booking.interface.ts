export interface Booking {
  id: string;
  user_id: string;
  purohit_id?: string;
  puja_type_id: string;
  date: string;
  time_slot: string;
  address: string;
  address_meta?: any;
  samagri_included: boolean;
  samagri_kit_id?: string;
  status: string;
  payment_status: string;
  price: number;
  created_at: string;
}
