export function invoiceHtmlTemplate(data: {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  itemsHtml: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  qrCodeBase64: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Tax Invoice</title>

<style>
  body { font-family: Inter, Arial, sans-serif; font-size:12px; color:#222; }
  .container { width:800px; margin:auto; padding:30px; border:1px solid #eee; }
  .header { display:flex; justify-content:space-between; }
  .logo { font-size:22px; font-weight:bold; color:#6a1b9a; }
  .invoice-title { text-align:right; }
  table { width:100%; border-collapse:collapse; margin-top:20px; }
  th,td { border:1px solid #ddd; padding:8px; }
  th { background:#f5f5f5; }
  .right { text-align:right; }
  .total { font-weight:bold; background:#fafafa; }
  .footer { margin-top:30px; font-size:11px; color:#666; }
</style>
</head>

<body>
<div class="container">

<div class="header">
  <div class="logo">PUJAONE</div>
  <div class="invoice-title">
    <div><b>TAX INVOICE</b></div>
    <div>Invoice No: ${data.invoiceNumber}</div>
    <div>Date: ${data.invoiceDate}</div>
  </div>
</div>

<hr/>

<p>
<b>Billed To:</b><br/>
${data.customerName}<br/>
${data.customerEmail}
</p>

<table>
<thead>
<tr>
  <th>Description</th>
  <th>HSN</th>
  <th>Qty</th>
  <th>Rate</th>
  <th>Amount</th>
</tr>
</thead>

<tbody>
${data.itemsHtml}
</tbody>

<tfoot>
<tr>
  <td colspan="4" class="right">Subtotal</td>
  <td class="right">₹${data.subtotal}</td>
</tr>
<tr>
  <td colspan="4" class="right">CGST (9%)</td>
  <td class="right">₹${data.cgst}</td>
</tr>
<tr>
  <td colspan="4" class="right">SGST (9%)</td>
  <td class="right">₹${data.sgst}</td>
</tr>
<tr class="total">
  <td colspan="4" class="right">Total</td>
  <td class="right">₹${data.total}</td>
</tr>
</tfoot>
</table>

<div class="footer">
  <p>GSTIN: 19ABCDE1234F1Z5</p>
  <p>This is a computer generated invoice.</p>
  <img src="${data.qrCodeBase64}" width="90"/>
</div>

</div>
</body>
</html>
`;
}
