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
<style>
body { font-family: Arial, sans-serif; font-size: 12px; }
table { width:100%; border-collapse: collapse; margin-top:20px; }
th,td { border:1px solid #ddd; padding:8px; }
th { background:#f5f5f5; }
.right { text-align:right; }
.total { font-weight:bold; }
</style>
</head>
<body>

<h2>PUJAONE – TAX INVOICE</h2>
<p>
<b>Invoice:</b> ${data.invoiceNumber}<br/>
<b>Date:</b> ${data.invoiceDate}
</p>

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
<tr><td colspan="4" class="right">Subtotal</td><td class="right">₹${data.subtotal}</td></tr>
<tr><td colspan="4" class="right">CGST (9%)</td><td class="right">₹${data.cgst}</td></tr>
<tr><td colspan="4" class="right">SGST (9%)</td><td class="right">₹${data.sgst}</td></tr>
<tr class="total"><td colspan="4" class="right">Total</td><td class="right">₹${data.total}</td></tr>
</tfoot>
</table>

<br/>
<img src="${data.qrCodeBase64}" width="100"/>

<p>GSTIN: 19ABCDE1234F1Z5</p>
<p>This is a computer generated invoice.</p>

</body>
</html>
`;
}
