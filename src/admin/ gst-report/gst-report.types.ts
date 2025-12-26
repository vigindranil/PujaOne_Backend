export interface GstReportRow {
  booking_id: string;
  invoice_number: string;
  invoice_date: string;

  puja_amount: number;
  samagri_amount: number;

  cgst_puja: number;
  sgst_puja: number;

  cgst_samagri: number;
  sgst_samagri: number;

  total_tax: number;
  grand_total: number;
}
