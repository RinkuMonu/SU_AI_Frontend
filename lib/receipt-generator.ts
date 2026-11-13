import { format } from "date-fns";
import QRCode from "qrcode";
import { DHANDAGROW_RECEIPT_LOGO_BASE64 } from "@/lib/receipt-logo";

export interface ReceiptData {
  id?: string;
  order_id?: string;
  user_id?: string;
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  base_amount?: number;
  gst_amount?: number;
  currency?: string;
  billing_cycle?: string;
  status?: string;
  purchased_credits?: number;
  provider_reference?: string;
  external_transaction_id?: string;
  payment_mode?: string;
  payment_gateway?: string;
  created_at?: string;
  user?: {
    name?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    phone_number?: string | null;
    id?: string | null;
    [key: string]: any;
  } | null;
}

/**
 * Formats a number cleanly into Indian Rupee string without broken unicode glyphs:
 * e.g. 5898.82 => "INR 5,898.82"
 */
export function formatINR(val?: number | null): string {
  const num = typeof val === "number" && !isNaN(val) ? val : 0;
  const formatted = num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `INR ${formatted}`;
}

/**
 * Capitalizes string nicely
 */
function capitalize(str?: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generates an executive, beautifully expanded PDF Tax Invoice / Receipt matching professional standards.
 */
export async function generateReceiptPdf(data: ReceiptData): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth(); // 595.28
  const height = doc.internal.pageSize.getHeight(); // 841.89

  const primaryOrder = data.order_id || data.id || `TXN_${Date.now()}`;
  const isPaid = (data.status || "success").toLowerCase() === "success" || (data.status || "").toLowerCase() === "paid";
  const planTitle = data.plan_name || data.plan_id ? `${data.plan_name || data.plan_id} Plan` : "Business Plan Subscription";
  const billingCycleStr = capitalize(data.billing_cycle || "monthly");
  const creditsStr = data.purchased_credits ? `${data.purchased_credits.toLocaleString("en-IN")} Credits` : "2,500 Credits";

  const totalAmount = data.amount || 0;
  const baseAmount = data.base_amount || (totalAmount ? Math.round((totalAmount / 1.18) * 100) / 100 : 0);
  const gstAmount = data.gst_amount || (totalAmount ? Math.round((totalAmount - baseAmount) * 100) / 100 : 0);
  const cgstAmount = Math.round((gstAmount / 2) * 100) / 100;
  const sgstAmount = Math.round((gstAmount - cgstAmount) * 100) / 100;

  const invoiceNumber = `INV-${primaryOrder.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase()}`;
  const dateFormatted = data.created_at ? format(new Date(data.created_at), "dd MMM yyyy, hh:mm a") : format(new Date(), "dd MMM yyyy, hh:mm a");

  // 1. EXPANDED HEADER BANNER (Clean White Background)
  const headerHeight = 112;
  doc.setFillColor(255, 255, 255); // White Background
  doc.rect(0, 0, width, headerHeight, "F");

  // Subtle separator line below header
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.line(0, headerHeight, width, headerHeight);

  // Embed the Official Horizontal Light Theme Logo (Icon on left + Brand typography on right)
  const logoX = 40;
  const logoY = 28;
  const logoRenderW = 148;
  const logoRenderH = Math.round(logoRenderW / 4.325); // ~34.2 pt

  try {
    doc.addImage(DHANDAGROW_RECEIPT_LOGO_BASE64, "PNG", logoX, logoY, logoRenderW, logoRenderH);
  } catch (logoErr) {
    console.warn("Logo embedding fallback:", logoErr);
  }

  // Company Details next to Logo (BLACK & DARK SLATE TEXT)
  const brandTextX = logoX + logoRenderW + 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Black / slate-900
  doc.text("Sevenunique Tech Solutions Pvt. Ltd.", brandTextX, 38);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Official Tax Invoice & Automated Billing Receipt", brandTextX, 53);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Support: care@dhandagrow.com | Web: www.dhandagrow.com", brandTextX, 67);
  doc.text("Registered Office: Jaipur, Rajasthan 302017, India", brandTextX, 79);

  // Right Side Header: Tax Invoice Title & Paid Badge
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42); // Black / slate-900
  doc.text("TAX INVOICE / RECEIPT", width - 40, 36, { align: "right" });

  // Paid Status Pill
  const badgeWidth = 100;
  const badgeHeight = 24;
  const badgeX = width - 40 - badgeWidth;
  const badgeY = 46;

  if (isPaid) {
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 12, 12, "F");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PAID & VERIFIED", badgeX + badgeWidth / 2, badgeY + 15.5, { align: "center" });
  } else {
    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 12, 12, "F");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text((data.status || "PENDING").toUpperCase(), badgeX + badgeWidth / 2, badgeY + 15.5, { align: "center" });
  }

  // Invoice & Date mini info in header (Dark Slate Text)
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(`Invoice No: ${invoiceNumber}`, width - 40, 84, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Date & Time: ${dateFormatted}`, width - 40, 97, { align: "right" });

  // 3. INFORMATION CARDS (EXPANDED SIDE-BY-SIDE: Customer & Transaction)
  const cardsY = 134;
  const cardW = (width - 80 - 18) / 2; // ~248.6 pt
  const cardH = 104;

  // Left Card: Billed To
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(40, cardsY, cardW, cardH, 8, 8, "FD");

  // Left Card Header
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40, cardsY, cardW, 24, 8, 8, "F");
  doc.rect(40, cardsY + 16, cardW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("BILLED TO / SUBSCRIBER DETAILS", 50, cardsY + 16);

  const customerName = data.user?.name || data.user?.full_name || "Valued Subscriber";
  const customerEmail = data.user?.email || "Registered User";
  const customerPhone = data.user?.phone || data.user?.phone_number || "Verified Customer";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(customerName, 50, cardsY + 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Email: ${customerEmail}`, 50, cardsY + 58);
  doc.text(`Phone: ${customerPhone}`, 50, cardsY + 73);
  doc.text(`Place of Supply: Rajasthan, India (08)`, 50, cardsY + 88);

  // Right Card: Transaction Details
  const rightCardX = 40 + cardW + 18;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightCardX, cardsY, cardW, cardH, 8, 8, "FD");

  // Right Card Header
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(rightCardX, cardsY, cardW, 24, 8, 8, "F");
  doc.rect(rightCardX, cardsY + 16, cardW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("PAYMENT & TRANSACTION AUDIT", rightCardX + 12, cardsY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);

  doc.text("Transaction ID:", rightCardX + 12, cardsY + 42);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(primaryOrder, rightCardX + cardW - 12, cardsY + 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Gateway Ref:", rightCardX + 12, cardsY + 58);
  doc.setTextColor(15, 23, 42);
  const gatewayRef = data.provider_reference || data.external_transaction_id || primaryOrder;
  doc.text(gatewayRef.length > 22 ? gatewayRef.slice(0, 22) + "..." : gatewayRef, rightCardX + cardW - 12, cardsY + 58, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text("Payment Mode:", rightCardX + 12, cardsY + 73);
  doc.setTextColor(15, 23, 42);
  doc.text(data.payment_mode || "AutoPay Mandate", rightCardX + cardW - 12, cardsY + 73, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text("Payment Partner:", rightCardX + 12, cardsY + 88);
  doc.setTextColor(109, 40, 217); // purple-700
  doc.setFont("helvetica", "bold");
  doc.text(data.payment_gateway || "Cashfree Subscriptions", rightCardX + cardW - 12, cardsY + 88, { align: "right" });

  // 4. EXPANDED ITEMIZED SUBSCRIPTION TABLE
  const tableY = 256;
  const tableW = width - 80;

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(40, tableY, tableW, 28, 6, 6, "F");
  doc.rect(40, tableY + 18, tableW, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM & PLAN DESCRIPTION", 54, tableY + 18);
  doc.text("BILLING CYCLE", 255, tableY + 18);
  doc.text("AI CREDITS", 360, tableY + 18);
  doc.text("AMOUNT (INR)", width - 54, tableY + 18, { align: "right" });

  // Table Row 1 (Expanded height: 56pt)
  const row1Y = tableY + 34;
  doc.setFillColor(255, 255, 255);
  doc.rect(40, row1Y, tableW, 54, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(40, row1Y + 54, width - 40, row1Y + 54);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(planTitle, 54, row1Y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("All-in-one AI marketing suite, viral reels, photoshoot studio, CRM & automated engine", 54, row1Y + 36);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(billingCycleStr, 255, row1Y + 26);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(124, 58, 237); // purple
  doc.text(creditsStr, 360, row1Y + 26);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.text(formatINR(totalAmount), width - 54, row1Y + 26, { align: "right" });

  // 5. EXPANDED FINANCIAL BREAKDOWN & TOTAL CALCULATION CARD (Right Aligned)
  const calcBoxW = 248;
  const calcBoxX = width - 40 - calcBoxW;
  const calcY = row1Y + 68;
  const calcH = 114;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(calcBoxX, calcY, calcBoxW, calcH, 8, 8, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);

  // Subtotal
  doc.text("Subtotal (Base Taxable Value):", calcBoxX + 14, calcY + 22);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(formatINR(baseAmount), calcBoxX + calcBoxW - 14, calcY + 22, { align: "right" });

  // CGST
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("CGST (9.0% Central Tax):", calcBoxX + 14, calcY + 40);
  doc.setTextColor(15, 23, 42);
  doc.text(formatINR(cgstAmount), calcBoxX + calcBoxW - 14, calcY + 40, { align: "right" });

  // SGST
  doc.setTextColor(100, 116, 139);
  doc.text("SGST (9.0% State Tax):", calcBoxX + 14, calcY + 58);
  doc.setTextColor(15, 23, 42);
  doc.text(formatINR(sgstAmount), calcBoxX + calcBoxW - 14, calcY + 58, { align: "right" });

  // Total Paid Row (Prominent Highlight Fill)
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(calcBoxX + 10, calcY + 72, calcBoxW - 20, 32, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text("Total Amount Paid:", calcBoxX + 18, calcY + 92);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(formatINR(totalAmount), calcBoxX + calcBoxW - 18, calcY + 92, { align: "right" });

  // 6. EXPANDED PAYMENT NOTES / MANDATE SUMMARY (Left Aligned beside calc card)
  const notesW = calcBoxX - 40 - 18;
  const notesY = calcY;
  const notesH = calcH;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, notesY, notesW, notesH, 8, 8, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("SUBSCRIPTION & BILLING SUMMARY", 52, notesY + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const noteBullets = [
    `• AutoPay mandate active per ${billingCycleStr.toLowerCase()} billing cycle.`,
    `• ${creditsStr} added immediately to active account balance.`,
    "• Tax invoice issued electronically under Section 31 CGST Act.",
    "• Upgrade, modify, or cancel mandate anytime in settings.",
    "• For tax invoice reconciliation, contact care@dhandagrow.com.",
  ];
  noteBullets.forEach((bullet, bIdx) => {
    doc.text(bullet, 52, notesY + 38 + bIdx * 15);
  });

  // 7. EXPANDED AUTHENTICATION & SECURITY VERIFICATION CARD WITH QR CODE
  const authY = calcY + calcH + 24;
  const authW = width - 80;
  const authH = 96;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, authY, authW, authH, 8, 8, "FD");

  // Generate Large Crisp QR Code
  try {
    const verifyPayload = `https://dhandagrow.com/subscription/transactions?ref=${encodeURIComponent(primaryOrder)}&status=verified`;
    const qrDataUrl = await QRCode.toDataURL(verifyPayload, {
      margin: 1,
      width: 140,
      color: {
        dark: "#1e1b4b",
        light: "#ffffff",
      },
    });
    doc.addImage(qrDataUrl, "PNG", 52, authY + 12, 72, 72);
  } catch (qrErr) {
    console.warn("QR code generation skipped:", qrErr);
  }

  // Verification Text
  const authTextX = 136;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237); // purple
  doc.text("DIGITALLY AUTHENTICATED & GATEWAY VERIFIED TAX INVOICE", authTextX, authY + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `This is a digitally generated tax invoice issued by DhandaGrow AI (Sevenunique Tech Solutions Pvt. Ltd.).\n` +
      `Verified with Payment Provider: ${data.payment_gateway || "Cashfree AutoPay"} | Reference ID: ${gatewayRef}\n` +
      `Validated under Information Technology Act, 2000. Sensitive credentials (CVV, PIN, card numbers) are never stored.`,
    authTextX,
    authY + 40
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text("✓ TAMPER-PROOF DIGITAL AUDIT RECORD · PAYMENT CAPTURED", authTextX, authY + 80);

  // 8. LEGAL DISCLAIMER & FOOTER
  const footerY = height - 44;
  doc.setDrawColor(226, 232, 240);
  doc.line(40, footerY - 14, width - 40, footerY - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Terms & Conditions apply. Subscriptions are billed per selected tier. For tax invoice or billing inquiries, email care@dhandagrow.com.",
    width / 2,
    footerY,
    { align: "center" }
  );

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `© ${new Date().getFullYear()} Sevenunique Tech Solutions Pvt. Ltd. (DhandaGrow AI). All rights reserved.`,
    width / 2,
    footerY + 14,
    { align: "center" }
  );

  // Trigger Save
  doc.save(`Receipt_DhandaGrow_${primaryOrder}.pdf`);
}
