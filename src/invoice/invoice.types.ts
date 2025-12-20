export type AddonSource = 'PACKAGE' | 'CUSTOM';

export interface BookingAddonRow {
  quantity: number;
  price: number;
  source: AddonSource;
  puja_addons: {
    title: string;
  };
}

export interface BookingUser {
  name: string;
  email: string;
}

export interface BookingRow {
  id: string;
  pricing_id?: string | null;
  puja_id: string;

  samagri_included?: boolean;
  samagri_kit_id?: string | null;

  users: BookingUser;
  booking_addons: BookingAddonRow[];
}
