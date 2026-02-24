import React from "react";
import { Printer, Download, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";

const ReceiptPrinter = ({ transaction, open, onClose }) => {
  if (!transaction) return null;
  

  const { data: settings, isLoading, refetch } = useSettings();

  const { user } = useAuth();
 

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const customerName = transaction.customer
        ? `${transaction.customer.customerFirstName || ''} ${transaction.customer.customerLastName || ''}`.trim()
        : 'Walk-in Customer';

    const generateReceiptHTML = () => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Receipt - ${transaction.transactionNumber || 'N/A'}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0mm !important;
    }

    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 80mm !important;
        height: auto !important;
        overflow: visible !important;
      }
      .receipt {
        width: 80mm !important;
        max-width: 80mm !important;
        margin: 0 !important;
        padding: 4mm 2.5mm !important;   /* very tight now */
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        background: white !important;
      }
      *, *::before, *::after {
        color: black !important;
        background: white !important;
        visibility: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print { display: none !important; }
      .receipt > *, .header, .meta, table, .totals, .payment, .points-container, .footer {
        page-break-inside: avoid !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Courier New', Courier, monospace;
      background: #f9fafb;
      padding: 8px;
      display: flex;
      justify-content: center;
    }

    .receipt {
      width: 100%;
      max-width: 360px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 10px 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      font-size: 11px;
      line-height: 1.25;
    }

    .header {
      text-align: center;
      padding-bottom: 6px;
      border-bottom: 1px dashed #d1d5db;
      margin-bottom: 8px;
    }

    .store-name {
      font-size: 18px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 2px;
    }

    .store-details {
      font-size: 9.5px;
      color: #4b5563;
      line-height: 1.2;
    }

    .meta {
      margin-bottom: 8px;
      font-size: 10.5px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .meta-label {
      color: #6b7280;
      font-weight: 500;
    }

    .meta-value {
      font-weight: 600;
      color: #111827;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 11px;
    }

    thead th {
      text-align: left;
      padding: 5px 2px;
      border-bottom: 1px solid #d1d5db;
      color: #374151;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
    }

    th:nth-child(2), th:nth-child(3) { text-align: right; }

    td {
      padding: 4px 2px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    .item-name {
      font-weight: 500;
      color: #111827;
    }

    .item-meta {
      font-size: 9.5px;
      color: #6b7280;
      margin-top: 1px;
    }

    .qty { text-align: center; }
    .amount { text-align: right; font-weight: 500; }

    .totals {
      margin-bottom: 8px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11.5px;
    }

    .total-row.discount {
      color: #047857;
    }

    .grand-total {
      font-size: 14px;
      font-weight: bold;
      border-top: 1px solid #111827;
      padding-top: 6px;
      margin-top: 4px;
    }

    .payment {
      text-align: center;
      padding: 8px 0;
      border-top: 1px dashed #d1d5db;
      margin: 8px 0;
    }

    .payment-method {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .payment-amount {
      font-size: 16px;
      font-weight: bold;
    }

    .change {
      font-size: 10.5px;
      color: #047857;
      margin-top: 3px;
    }

    .points-container {
      text-align: center;
      margin: 6px 0;
    }

    .points {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 500;
    }

    .footer {
      text-align: center;
      font-size: 10px;
      color: #4b5563;
      padding-top: 8px;
      border-top: 1px dashed #d1d5db;
    }

    .thank-you {
      font-size: 12px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 3px;
    }

    .no-print {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .btn {
      padding: 7px 14px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: #111827;
      color: white;
    }

    .btn-primary:hover { background: #030712; }

    .btn-outline {
      background: white;
      border: 1px solid #d1d5db;
      color: #111827;
    }

    .btn-outline:hover { background: #f3f4f6; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="store-name">${settings?.companyName || "STORE"}</div>
      <div class="store-details">
        ${settings?.address}<br>
        Tel: ${settings?.phone || "(212) 555-0123"}
      </div>
    </div>

    <div class="meta">
      <div class="meta-row">
        <span class="meta-label">Receipt #</span>
        <span class="meta-value">${transaction.transactionNumber || '—'}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Date</span>
        <span class="meta-value">${formatDate(transaction.timestamp)}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Customer</span>
        <span class="meta-value">${customerName || 'Guest'}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Cashier</span>
        <span class="meta-value">${user.firstName} ${user.lastName}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="qty">Qty</th>
            <th class="qty">Discount</th>
          <th class="amount">Price</th>
        </tr>
      </thead>
      <tbody>
        ${transaction.cartItems?.map(item => `
          <tr>
            <td>
              <div class="item-name">${item.name || 'Unknown Item'}</div>
              ${(item.color?.name || item.size) ? `
                <div class="item-meta">
                  ${item.color?.name ? `Color: ${item.color.name}` : ''}
                  ${item.color?.name && item.size ? ' • ' : ''}
                  ${item.size ? `Size: ${item.size}` : ''}
                </div>
              ` : ''}
            </td>
            <td class="qty">${item.quantity}</td>
            <td class="qty">${item.discountPercent || 0}%</td>
            <td class="amount">  ${settings?.currencySymbol}${(item.unitPrice * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('') || '<tr><td colspan="3" style="text-align:center; padding:8px 0;">No items</td></tr>'}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span> ${settings?.currencySymbol}${transaction.totals?.subtotal?.toFixed(2) || '0.00'}</span>
      </div>
      ${transaction.totals?.totalDiscount > 0 ? `
        <div class="total-row discount">
          <span>Discount</span>
          <span> ${settings?.currencySymbol}${transaction.totals.totalDiscount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="total-row">
        <span>Tax</span>
        <span> ${settings?.currencySymbol}${transaction.totals?.totalTax?.toFixed(2) || '0.00'}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <span> ${settings?.currencySymbol}${transaction.totals?.grandTotal?.toFixed(2) || '0.00'}</span>
      </div>
    </div>


    ${transaction.loyalty?.pointsEarned > 0 ? `
      <div class="points-container">
        <div class="points">Points Earned: ${transaction.loyalty.pointsEarned}</div>
      </div>
    ` : ''}

    <div class="footer">
      <div class="thank-you">Thank You For Shopping With Us!</div>
      <div>Returns accepted within 30 days with receipt</div>
     
    </div>

    <div class="no-print">
      <button class="btn btn-primary" onclick="window.print()">Print Receipt</button>
      <button class="btn btn-outline" onclick="window.close()">Close</button>
    </div>
  </div>
</body>
</html>
  `;
    };
    
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateReceiptHTML());
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    const handleDownloadPDF = () => {
        // For PDF download, we'll open in new window and let user print to PDF
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
            pdfWindow.document.write(generateReceiptHTML());
            pdfWindow.document.close();
            pdfWindow.focus();
        }
    };

    const handleDownloadTXT = () => {
        // Simple text receipt
        const textReceipt = `
${settings?.companyName }
${settings?.address }
${settings?.phone }
================================
Receipt #: ${transaction.transactionNumber}
Date: ${formatDate(transaction.timestamp)}
Customer: ${customerName}
Cashier: ${user.firstName} ${user.lastName}
================================
${transaction.cartItems?.map(item =>
            `${item.name} x${item.quantity} - ${settings?.currencySymbol}${(item.unitPrice * item.quantity).toFixed(2)}`
        ).join('\n')}
================================
Subtotal: ${settings?.currencySymbol}${transaction.totals?.subtotal?.toFixed(2) || '0.00'}
${transaction.totals?.totalDiscount > 0 ? `Discount: -${settings?.currencySymbol}${transaction.totals.totalDiscount.toFixed(2)}` : ''}
Tax: ${settings?.currencySymbol}${transaction.totals?.totalTax?.toFixed(2) || '0.00'}
TOTAL: ${settings?.currencySymbol}${transaction.totals?.grandTotal?.toFixed(2) || '0.00'}
================================
Payment: ${transaction.payment?.paymentMethod?.toUpperCase()}
${transaction.payment?.paymentMethod === 'cash' && transaction.payment?.changeDue ?
                `Change: ${settings?.currencySymbol}${transaction.payment.changeDue.toFixed(2)}` : ''}
================================
Thank You For Shopping With Us!

        `;

        const blob = new Blob([textReceipt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${transaction.transactionNumber}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md w-full max-w-[380px] overflow-y-auto p-6"> {/* Narrower like real receipt */}
                <SheetHeader className="mb-6 text-center">
                    <SheetTitle className="text-xl font-bold tracking-tight">Receipt Preview</SheetTitle>
                </SheetHeader>

                <div className="bg-white border rounded-lg shadow-sm overflow-hidden text-sm font-medium">
                    <div className="p-5 sm:p-6">
                        {/* Header – centered, branded */}
                        <div className="text-center mb-6">
                            {/* Replace with real logo if available */}
                            {/* <img src="/logo.png" alt="Fashion Store" className="h-10 mx-auto mb-2" /> */}
                            <h2 className="text-xl font-bold text-gray-900">{settings?.companyName || "STORE"}</h2>
                            <p className="text-xs text-gray-600 mt-1">{settings?.address || "123 Fashion Avenue"}</p>
                            <p className="text-xs text-gray-600">Tel: {settings?.phone || "(212) 555-0123"}</p>
                         {/* Optional but common */}
                        </div>

                        {/* Meta info – often left/right split or stacked */}
                        <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-6 pb-4 border-b border-gray-200">
                            <div>
                                <span className="text-gray-600">Receipt #</span>
                                <div className="font-semibold text-gray-900">{transaction.transactionNumber}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-600">Date</span>
                                <div className="font-semibold text-gray-900">{formatDate(transaction.timestamp)}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Customer</span>
                                <div className="font-semibold text-gray-900">{customerName || 'Guest'}</div>
                            </div>
                            {/* Add if available: Cashier, Payment */}
                            {/* <div className="text-right"><span className="text-gray-600">Payment</span><div>Visa ****1234</div></div> */}
                        </div>

                        {/* Items – classic POS table look */}
                        <div className="mb-6">
                            <div className="grid grid-cols-[3fr_1fr_2fr] gap-3 text-xs font-semibold text-gray-600 uppercase border-b pb-2 mb-3">
                                <div>Item</div>
                  <div className="text-center">Qty</div>
                  
                                <div className="text-right">Amount</div>
                            </div>

                            {transaction.cartItems?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-[3fr_1fr_2fr] gap-3 py-2.5 border-b border-gray-100 last:border-0 text-gray-900"
                                >
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        {(item.color?.name || item.size) && (
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {item.color?.name && `Color: ${item.color.name}`}
                                                {item.color?.name && item.size && ' • '}
                                                {item.size && `Size: ${item.size}`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">{item.quantity}</div>
                                    <div className="text-right font-semibold">
                                        {settings?.currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals – bold total stands out */}
                        <div className="space-y-2.5 pt-3 border-t border-gray-300">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Subtotal</span>
                  <span>{settings?.currencySymbol}{transaction.totals?.subtotal?.toFixed(2)}</span>
                            </div>
                            {transaction.totals?.totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-700">
                                    <span>Discount</span>
                    <span>{settings?.currencySymbol}{transaction.totals.totalDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            {/* Add tax line if you track it */}
                            {/* <div className="flex justify-between text-sm"><span>Tax</span><span>$12.34</span></div> */}
                            <div className="flex justify-between items-center pt-4 text-base font-bold border-t border-gray-400">
                                <span>Total</span>
                  <span className="text-lg">{settings?.currencySymbol}{transaction.totals?.grandTotal?.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer – loyalty, thank you, policy */}
                        <div className="mt-6 text-center text-xs text-gray-600 space-y-2">
                            {transaction.loyalty?.pointsEarned > 0 && (
                                <div className="inline-block bg-amber-50 text-amber-800 px-3 py-1 rounded text-sm font-medium">
                                    Points Earned: {transaction.loyalty.pointsEarned}
                                </div>
                            )}
                            <p className="font-medium mt-3">Thank You For Shopping With Us!</p>
                            <p>Returns within 30 days with receipt • Questions? Call us</p>
                            {/* Optional: QR for digital receipt / review / loyalty */}
                            {/* <div className="mt-2">Scan for digital copy → [QR placeholder]</div> */}
                        </div>
                    </div>
                </div>

                {/* Actions – keep similar but perhaps stack on mobile */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button onClick={handlePrint} className="flex-1 gap-2">
                        <Printer size={16} /> Print Receipt
                    </Button>
                    <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 gap-2">
                        <Download size={16} /> PDF
                    </Button>
                    <Button onClick={handleDownloadTXT} variant="outline" className="gap-2">
                        <FileText size={16} /> Text
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ReceiptPrinter;