"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Download,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  FileSpreadsheet,
  X,
  ExternalLink,
  Calendar,
  Crown,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { subscriptionService } from "@/services/subscription.service";
import { paymentService } from "@/services/payment.service";

export interface PaymentTransaction {
  id: string;
  order_id: string;
  user_id?: string;
  plan_id?: string;
  plan_name?: string;
  amount: number;
  base_amount?: number;
  gst_amount?: number;
  currency?: string;
  billing_cycle?: string;
  status: "success" | "pending" | "initiated" | "cancelled" | "failed" | string;
  purchased_credits?: number;
  provider_reference?: string;
  external_transaction_id?: string;
  payment_mode?: string;
  payment_gateway?: string;
  payment_url?: string;
  created_at?: string;
  updated_at?: string;
  verified_at?: string;
  failure_reason?: string;
}

// Helper to determine payment mode if not explicitly recorded
function getPaymentMode(tx: PaymentTransaction): string {
  if (tx.payment_mode) return tx.payment_mode;
  const raw = ((tx.order_id || "") + " " + (tx.provider_reference || "") + " " + (tx.payment_url || "")).toLowerCase();
  if (raw.includes("cashfree") || raw.includes("sub_") || raw.includes("mandate") || raw.includes("autopay")) {
    return "AutoPay Mandate";
  }
  if (raw.includes("upi") || raw.includes("qr") || raw.includes("vpa") || raw.includes("gpay") || raw.includes("paytm")) {
    return "UPI AutoPay / QR";
  }
  if (raw.includes("netbanking") || raw.includes("nb") || raw.includes("bank") || raw.includes("enach")) {
    return "eNACH Net Banking";
  }
  if (raw.includes("card") || raw.includes("debit") || raw.includes("credit")) {
    return "Card AutoPay Mandate";
  }
  return "AutoPay / UPI Mandate";
}

// Helper to determine payment gateway provider
function getPaymentGateway(tx: PaymentTransaction): string {
  if (tx.payment_gateway) return tx.payment_gateway;
  const raw = ((tx.order_id || "") + " " + (tx.payment_url || "")).toLowerCase();
  if (raw.includes("cashfree") || raw.includes("sub_")) {
    return "Cashfree AutoPay";
  }
  return "Cashfree Subscriptions";
}

export default function TransactionReportPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
  const [selectedTxForDetails, setSelectedTxForDetails] = useState<PaymentTransaction | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "PENDING" | "CANCELLED" | "FAILED">("ALL");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await subscriptionService.getBillingReport();
      const txs: PaymentTransaction[] = report?.payment_transactions || [];
      setTransactions(txs);
    } catch (err: any) {
      console.error("Failed to load transactions", err);
      setError(err?.response?.data?.detail || "Failed to load transactions from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifyPending = async (orderId: string) => {
    try {
      setVerifyingOrderId(orderId);
      await paymentService.verifyPayment(orderId);
      await fetchTransactions();
    } catch (err) {
      console.error("Manual verify failed", err);
    } finally {
      setVerifyingOrderId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPaymentModeFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Status filter
        if (statusFilter !== "ALL") {
          const st = (tx.status || "").toUpperCase();
          if (statusFilter === "PENDING" && (st === "PENDING" || st === "INITIATED")) {
            // match
          } else if (statusFilter === "FAILED" && st === "FAILED") {
            // match
          } else if (statusFilter === "CANCELLED" && (st === "CANCELLED" || st === "EXPIRED")) {
            // match
          } else if (statusFilter === "SUCCESS" && st === "SUCCESS") {
            // match
          } else if (st !== statusFilter) {
            return false;
          }
        }

        // Payment Mode filter
        if (paymentModeFilter !== "ALL") {
          const mode = getPaymentMode(tx).toLowerCase();
          if (!mode.includes(paymentModeFilter.toLowerCase())) {
            return false;
          }
        }

        // Date range filter
        if (dateFrom) {
          const fromTime = new Date(dateFrom).setHours(0, 0, 0, 0);
          const txTime = tx.created_at ? new Date(tx.created_at).getTime() : 0;
          if (txTime < fromTime) return false;
        }

        if (dateTo) {
          const toTime = new Date(dateTo).setHours(23, 59, 59, 999);
          const txTime = tx.created_at ? new Date(tx.created_at).getTime() : 0;
          if (txTime > toTime) return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchOrder = (tx.order_id || "").toLowerCase().includes(q);
          const matchId = (tx.id || "").toLowerCase().includes(q);
          const matchPlan = (tx.plan_name || tx.plan_id || "").toLowerCase().includes(q);
          const matchRef = (tx.provider_reference || tx.external_transaction_id || "").toLowerCase().includes(q);
          const matchMode = getPaymentMode(tx).toLowerCase().includes(q);
          return matchOrder || matchId || matchPlan || matchRef || matchMode;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, statusFilter, paymentModeFilter, dateFrom, dateTo, searchTerm, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Statistics calculation
  const stats = useMemo(() => {
    const successList = transactions.filter((t) => t.status === "success");
    const cancelledList = transactions.filter((t) => t.status === "cancelled");
    const failedList = transactions.filter((t) => t.status === "failed");
    const totalSpent = successList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCredits = successList.reduce((acc, curr) => acc + (curr.purchased_credits || 0), 0);

    return {
      totalCount: transactions.length,
      successCount: successList.length,
      cancelledCount: cancelledList.length,
      failedCount: failedList.length,
      totalSpent,
      totalCredits,
    };
  }, [transactions]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPORT: Download CSV Report
  // ─────────────────────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      "S.No",
      "Transaction ID",
      "Payment Reference",
      "Plan Name",
      "Amount (INR)",
      "Payment Mode",
      "Payment Gateway",
      "Transaction Date",
      "Transaction Time",
      "Payment Status",
      "Credits Purchased",
      "Failure Reason",
    ];

    const rows = filteredTransactions.map((tx, idx) => {
      const dateStr = tx.created_at ? format(new Date(tx.created_at), "yyyy-MM-dd") : "N/A";
      const timeStr = tx.created_at ? format(new Date(tx.created_at), "hh:mm:ss a") : "N/A";
      const mode = getPaymentMode(tx);
      const gateway = getPaymentGateway(tx);

      return [
        idx + 1,
        `"${tx.order_id || tx.id || ""}"`,
        `"${tx.provider_reference || tx.external_transaction_id || tx.order_id || ""}"`,
        `"${tx.plan_name || tx.plan_id || "Subscription Plan"}"`,
        (tx.amount || 0).toFixed(2),
        `"${mode}"`,
        `"${gateway}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${(tx.status || "").toUpperCase()}"`,
        tx.purchased_credits || 0,
        `"${(tx.failure_reason || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DhandaGrow_AutoPay_Transactions_Report_${format(new Date(), "yyyyMMdd_HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPORT: Download Full Report as PDF
  // ─────────────────────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) return;
    try {
      setIsExportingPdf(true);
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      // Header Branding
      doc.setFillColor(15, 16, 21);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 80, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(240, 68, 155);
      doc.text("DhandaGrow AI", 40, 42);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 190);
      doc.text("Official Subscription & AutoPay Transactions Audit Report", 40, 60);

      doc.setFontSize(9);
      doc.setTextColor(160, 160, 170);
      const generatedAt = `Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`;
      doc.text(generatedAt, doc.internal.pageSize.getWidth() - 40, 42, { align: "right" });
      doc.text(`Customer: ${user?.name || user?.email || "Account Holder"}`, doc.internal.pageSize.getWidth() - 40, 58, { align: "right" });

      // Summary KPI banner
      const totalFilteredSpent = filteredTransactions
        .filter((t) => t.status === "success")
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

      const summaryText = `Total Records: ${filteredTransactions.length}  |  Successful: ${
        filteredTransactions.filter((t) => t.status === "success").length
      } (₹${totalFilteredSpent.toFixed(2)})  |  Pending: ${
        filteredTransactions.filter((t) => t.status === "pending" || t.status === "initiated").length
      }  |  Failed/Cancelled: ${
        filteredTransactions.filter((t) => t.status === "failed" || t.status === "cancelled").length
      }`;

      doc.setFillColor(32, 23, 53);
      doc.roundedRect(40, 95, doc.internal.pageSize.getWidth() - 80, 26, 4, 4, "F");
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(summaryText, 52, 112);

      // AutoTable data
      const tableRows = filteredTransactions.map((tx, idx) => {
        const dateStr = tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy") : "N/A";
        const timeStr = tx.created_at ? format(new Date(tx.created_at), "hh:mm a") : "N/A";
        const mode = getPaymentMode(tx);
        const gateway = getPaymentGateway(tx);

        return [
          idx + 1,
          tx.order_id || tx.id || "N/A",
          tx.plan_name || tx.plan_id || "Plan",
          `₹${(tx.amount || 0).toFixed(2)}`,
          mode,
          gateway,
          dateStr,
          timeStr,
          (tx.status || "").toUpperCase(),
          tx.purchased_credits || 0,
        ];
      });

      autoTable(doc, {
        startY: 135,
        head: [
          [
            "S.No",
            "Transaction ID",
            "Plan Name",
            "Amount",
            "Payment Mode",
            "Payment Gateway",
            "Date",
            "Time",
            "Status",
            "Credits",
          ],
        ],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [110, 44, 180],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8.5,
          halign: "left",
        },
        styles: {
          fontSize: 8,
          cellPadding: 5,
          valign: "middle",
          textColor: [40, 40, 40],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 252],
        },
        columnStyles: {
          0: { cellWidth: 32, halign: "center" },
          1: { cellWidth: 120, fontStyle: "bold" },
          2: { cellWidth: 100 },
          3: { cellWidth: 65, halign: "right", fontStyle: "bold" },
          4: { cellWidth: 80 },
          5: { cellWidth: 110 },
          6: { cellWidth: 70 },
          7: { cellWidth: 60 },
          8: { cellWidth: 65, halign: "center" },
          9: { cellWidth: 50, halign: "center" },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 8) {
            const raw = String(data.cell.raw);
            if (raw === "SUCCESS") {
              data.cell.styles.textColor = [16, 149, 106];
              data.cell.styles.fontStyle = "bold";
            } else if (raw === "PENDING" || raw === "INITIATED") {
              data.cell.styles.textColor = [217, 119, 6];
              data.cell.styles.fontStyle = "bold";
            } else {
              data.cell.styles.textColor = [220, 38, 38];
              data.cell.styles.fontStyle = "bold";
            }
          }
        },
      });

      // Footer disclaimer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 150);
        doc.text(
          `Page ${i} of ${pageCount} — Finunique Small Private Limited | DhandaGrow AI (System-generated report)`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 20,
          { align: "center" }
        );
      }

      doc.save(`DhandaGrow_AutoPay_Transaction_Report_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RECEIPT: Download Single Transaction Receipt as PDF
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDownloadReceipt = async (tx: PaymentTransaction) => {
    try {
      setIsDownloadingReceipt(tx.order_id || tx.id);
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const width = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(15, 16, 21);
      doc.rect(0, 0, width, 110, "F");

      // Company Branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(240, 68, 155);
      doc.text("DhandaGrow AI", 45, 48);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 190);
      doc.text("Finunique Small Private Limited", 45, 66);
      doc.text("Official Billing & Payment Receipt", 45, 80);
      doc.text("Support: care@dhandagrow.com | www.dhandagrow.com", 45, 94);

      // Receipt Title & Badge on Right
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("TAX INVOICE / RECEIPT", width - 45, 48, { align: "right" });

      const isSuccess = tx.status === "success";
      const statusLabel = isSuccess ? "PAID" : (tx.status || "PENDING").toUpperCase();

      doc.setFillColor(isSuccess ? 16 : 220, isSuccess ? 149 : 38, isSuccess ? 106 : 38);
      doc.roundedRect(width - 125, 62, 80, 22, 3, 3, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(statusLabel, width - 85, 76, { align: "center" });

      // Meta Info Grid
      doc.setDrawColor(225, 225, 235);
      doc.line(45, 130, width - 45, 130);

      // Left Column: Customer details
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 50);
      doc.text("BILLED TO:", 45, 150);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(70, 70, 80);
      doc.text(`Name: ${user?.name || user?.full_name || "Valued Customer"}`, 45, 168);
      doc.text(`Email: ${user?.email || "N/A"}`, 45, 184);
      doc.text(`Phone: ${user?.phone || user?.phone_number || "N/A"}`, 45, 200);

      // Right Column: Invoice & Transaction details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 50);
      doc.text("TRANSACTION DETAILS:", width - 240, 150);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 80);
      doc.text(`Transaction ID: ${tx.order_id || tx.id}`, width - 240, 168);
      doc.text(`Gateway Ref: ${tx.provider_reference || tx.external_transaction_id || tx.order_id}`, width - 240, 184);
      const formattedDate = tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy, hh:mm:ss a") : "Recent";
      doc.text(`Date & Time: ${formattedDate}`, width - 240, 200);
      doc.text(`Payment Mode: ${getPaymentMode(tx)}`, width - 240, 216);

      // Itemized Table
      const tableTop = 250;
      doc.setFillColor(242, 242, 248);
      doc.rect(45, tableTop, width - 90, 26, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 70);
      doc.text("ITEM DESCRIPTION", 55, tableTop + 17);
      doc.text("BILLING CYCLE", 280, tableTop + 17);
      doc.text("AI CREDITS", 380, tableTop + 17);
      doc.text("AMOUNT (INR)", width - 55, tableTop + 17, { align: "right" });

      // Table Row
      const rowTop = tableTop + 36;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 50);
      doc.text(`${tx.plan_name || tx.plan_id || "Subscription Plan"}`, 55, rowTop);
      doc.text(`${tx.billing_cycle || "Monthly"}`, 280, rowTop);
      doc.text(`${tx.purchased_credits || "Plan Standard"}`, 380, rowTop);
      doc.setFont("helvetica", "bold");
      doc.text(`₹${(tx.amount || 0).toFixed(2)}`, width - 55, rowTop, { align: "right" });

      doc.setDrawColor(230, 230, 240);
      doc.line(45, rowTop + 15, width - 45, rowTop + 15);

      // Calculations / Breakdown
      const baseAmount = tx.base_amount || (tx.amount ? Math.round((tx.amount / 1.18) * 100) / 100 : 0);
      const gstAmount = tx.gst_amount || (tx.amount ? Math.round((tx.amount - baseAmount) * 100) / 100 : 0);

      const calcTop = rowTop + 35;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 90);
      doc.text("Subtotal (Base Amount):", width - 200, calcTop);
      doc.text(`₹${baseAmount.toFixed(2)}`, width - 55, calcTop, { align: "right" });

      doc.text("GST (18% Integrated):", width - 200, calcTop + 16);
      doc.text(`₹${gstAmount.toFixed(2)}`, width - 55, calcTop + 16, { align: "right" });

      doc.setDrawColor(200, 200, 215);
      doc.line(width - 200, calcTop + 24, width - 45, calcTop + 24);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 30);
      doc.text("Total Paid:", width - 200, calcTop + 40);
      doc.text(`₹${(tx.amount || 0).toFixed(2)}`, width - 55, calcTop + 40, { align: "right" });

      // Verification seal / Security Note
      const sealTop = 450;
      doc.setFillColor(248, 248, 252);
      doc.roundedRect(45, sealTop, width - 90, 70, 6, 6, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(110, 44, 180);
      doc.text("AUTHENTICATION & SECURITY VERIFICATION", 58, sealTop + 22);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 100);
      doc.text(
        `This is a digitally generated and verified payment receipt issued by Finunique PayIn Gateway for DhandaGrow AI.\nPayment Provider: ${getPaymentGateway(
          tx
        )} | Reference: ${tx.provider_reference || tx.order_id}\nSensitive payment credentials (CVV, PIN, full card numbers) are never stored or printed.`,
        58,
        sealTop + 38
      );

      // Terms & Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 160);
      doc.text(
        "Terms & Conditions apply. Subscriptions are billed per selected tier. For billing inquiries, contact billing@dhandagrow.com.",
        width / 2,
        doc.internal.pageSize.getHeight() - 40,
        { align: "center" }
      );
      doc.text(
        "© " + new Date().getFullYear() + " Finunique Small Private Limited. All rights reserved.",
        width / 2,
        doc.internal.pageSize.getHeight() - 26,
        { align: "center" }
      );

      doc.save(`Receipt_${tx.order_id || tx.id}.pdf`);
    } catch (err) {
      console.error("Receipt generation failed:", err);
    } finally {
      setIsDownloadingReceipt(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 animate-in fade-in duration-300 px-3 sm:px-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <Link href="/subscription" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Billing &amp; Plans</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Transaction &amp; AutoPay Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-[#f0449b]" />
            <span>Transaction &amp; AutoPay Report</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time payment audit log and recurring AutoPay mandate settlement ledger across all plans.
          </p>
        </div>

        {/* Navigation Tabs (1st: Plan, 2nd: Transaction & AutoPay, 3rd: Credit) */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/subscription"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white bg-surface border border-border hover:border-brand-purple/40 transition-all cursor-pointer shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-brand-purple" />
            <span>Plan</span>
          </Link>

          <Link
            href="/subscription/transactions"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-purple/20 border border-brand-purple/50 shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-brand-purple" />
            <span>Transaction &amp; AutoPay</span>
          </Link>

          <Link
            href="/subscription/credits"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white bg-surface border border-border hover:border-brand-purple/40 transition-all cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-brand-purple fill-brand-purple" />
            <span>Credit</span>
          </Link>

          <Button
            variant="outline"
            onClick={fetchTransactions}
            disabled={loading}
            className="border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs cursor-pointer h-9 px-3 ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs cursor-pointer h-9 px-3"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={filteredTransactions.length === 0 || isExportingPdf}
            className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs cursor-pointer h-9 px-3"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            )}
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-[#0f1015] border-white/10 shadow-md">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-medium text-text-muted">Total Orders</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalCount}</div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Lifetime payment requests</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1015] border-white/10 shadow-md">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-medium text-text-muted">Successful Payments</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span>{stats.successCount}</span>
              <span className="text-xs font-semibold text-text-muted">
                (₹{stats.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-0.5 block">Verified &amp; active</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1015] border-white/10 shadow-md">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-medium text-text-muted">Purchased Credits</span>
            <div className="text-2xl font-bold text-brand-purple mt-1 flex items-center gap-1.5">
              <Zap className="w-5 h-5 fill-brand-purple text-brand-purple" />
              <span>{stats.totalCredits}</span>
            </div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Total plan credits credited</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1015] border-white/10 shadow-md">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-medium text-text-muted">Cancelled &amp; Failed</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">
              <span>{stats.cancelledCount + stats.failedCount}</span>
              <span className="text-xs text-text-muted">
                ({stats.cancelledCount} canc. / {stats.failedCount} fail)
              </span>
            </div>
            <span className="text-[11px] text-text-muted mt-0.5 block">Zero charges deducted</span>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter & Date Range Controls */}
      <div className="bg-[#0f1015] p-4 rounded-2xl border border-white/10 space-y-3.5 shadow-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Transaction ID, Plan Name, Gateway Reference, or Mode..."
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-text-muted focus:outline-none focus:border-[#f0449b]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {(["ALL", "SUCCESS", "PENDING", "CANCELLED", "FAILED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-md"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>

        {/* Secondary Filters: Mode + Date From + Date To + Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/5 text-xs">
          {/* Payment Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-[11px] font-medium whitespace-nowrap">Mode:</span>
            <select
              value={paymentModeFilter}
              onChange={(e) => {
                setPaymentModeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#f0449b]"
            >
              <option value="ALL" className="bg-[#12131a] text-white">All Payment Modes</option>
              <option value="UPI" className="bg-[#12131a] text-white">UPI / QR Code</option>
              <option value="Net Banking" className="bg-[#12131a] text-white">Net Banking</option>
              <option value="Card" className="bg-[#12131a] text-white">Credit / Debit Card</option>
            </select>
          </div>

          {/* Date From */}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted text-[11px] font-medium whitespace-nowrap">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#f0449b] [color-scheme:dark]"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted text-[11px] font-medium whitespace-nowrap">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#f0449b] [color-scheme:dark]"
            />
          </div>

          {/* Reset Filters button */}
          {(searchTerm || statusFilter !== "ALL" || paymentModeFilter !== "ALL" || dateFrom || dateTo) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#f0449b] hover:text-[#ff65b3] transition-colors font-medium ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <span className="text-text-muted text-[11px]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value={5} className="bg-[#12131a] text-white">5</option>
              <option value={10} className="bg-[#12131a] text-white">10</option>
              <option value={20} className="bg-[#12131a] text-white">20</option>
              <option value={50} className="bg-[#12131a] text-white">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Transactions Table (10 Columns) */}
      <Card className="bg-[#0f1015] border-white/10 overflow-hidden shadow-md">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#f0449b] animate-spin" />
            <p className="text-sm text-text-muted">Loading transactions from backend database...</p>
          </div>
        ) : error ? (
          <div className="py-16 px-4 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-white font-medium">{error}</p>
            <Button onClick={fetchTransactions} variant="outline" className="text-xs border-white/10 text-white">
              Retry
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <CreditCard className="w-10 h-10 text-text-muted/40 mx-auto" />
            <p className="text-sm text-white font-semibold">No transactions found</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {searchTerm || statusFilter !== "ALL" || paymentModeFilter !== "ALL" || dateFrom || dateTo
                ? "No payment records match your search criteria or selected filters."
                : "No payment transactions have been recorded yet. Select any plan to create an order."}
            </p>
            {(searchTerm || statusFilter !== "ALL" || paymentModeFilter !== "ALL" || dateFrom || dateTo) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs border-white/10 text-white mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-text-muted">
              <thead className="text-[11px] uppercase bg-white/[0.03] text-text-muted border-b border-white/10 tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 font-semibold text-center w-12">S.No.</th>
                  <th className="px-4 py-3.5 font-semibold">Transaction ID</th>
                  <th className="px-4 py-3.5 font-semibold">Plan Name</th>
                  <th className="px-4 py-3.5 font-semibold">Amount</th>
                  <th className="px-4 py-3.5 font-semibold">Payment Mode</th>
                  <th className="px-4 py-3.5 font-semibold">Payment Gateway</th>
                  <th className="px-4 py-3.5 font-semibold">Date</th>
                  <th className="px-4 py-3.5 font-semibold">Time</th>
                  <th className="px-4 py-3.5 font-semibold text-center">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedTransactions.map((tx, idx) => {
                  const serialNo = (currentPage - 1) * pageSize + idx + 1;
                  const isSuccess = tx.status === "success";
                  const isPending = tx.status === "pending" || tx.status === "initiated";
                  const isCancelled = tx.status === "cancelled" || tx.status === "expired";
                  const isFailed = tx.status === "failed";
                  const isVerifying = verifyingOrderId === tx.order_id;
                  const isDownloadingThis = isDownloadingReceipt === (tx.order_id || tx.id);
                  const displayId = tx.order_id || tx.id || "N/A";
                  const paymentMode = getPaymentMode(tx);
                  const gateway = getPaymentGateway(tx);

                  const dateStr = tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy") : "N/A";
                  const timeStr = tx.created_at ? format(new Date(tx.created_at), "hh:mm:ss a") : "N/A";

                  return (
                    <tr
                      key={tx.order_id || tx.id || idx}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* 1. S.No. */}
                      <td className="px-4 py-3.5 text-center text-text-muted font-mono text-[11px]">
                        {serialNo}
                      </td>

                      {/* 2. Transaction ID */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-purple-300">{displayId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(displayId)}
                            className="hover:text-white transition-colors cursor-pointer text-text-muted"
                            title="Copy Transaction ID"
                          >
                            {copiedId === displayId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {tx.provider_reference && tx.provider_reference !== displayId && (
                          <div className="text-[10px] text-text-muted font-normal mt-0.5 truncate max-w-[140px]">
                            Ref: {tx.provider_reference}
                          </div>
                        )}
                      </td>

                      {/* 3. Plan Name */}
                      <td className="px-4 py-3.5 font-semibold text-white">
                        <div>{tx.plan_name || tx.plan_id || "Subscription Plan"}</div>
                        {tx.purchased_credits ? (
                          <div className="text-[10px] text-[#f0449b] font-medium flex items-center gap-1 mt-0.5">
                            <Zap className="w-2.5 h-2.5 fill-[#f0449b]" />
                            <span>{tx.purchased_credits} credits</span>
                          </div>
                        ) : null}
                      </td>

                      {/* 4. Amount */}
                      <td className="px-4 py-3.5 font-bold text-white text-sm whitespace-nowrap">
                        ₹{(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* 5. Payment Mode */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-neutral-300">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[11px]">
                          {paymentMode}
                        </span>
                      </td>

                      {/* 6. Payment Gateway / Provider */}
                      <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">
                        <span className="text-[11px] text-neutral-400">{gateway}</span>
                      </td>

                      {/* 7. Transaction Date */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* 8. Transaction Time */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {timeStr}
                      </td>

                      {/* 9. Payment Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isSuccess
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : isPending
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : isCancelled
                              ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isPending ? (
                            <Clock className="w-3 h-3" />
                          ) : isCancelled ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          <span>{tx.status}</span>
                        </span>
                      </td>

                      {/* 10. Action: View Details and Download Receipt */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTxForDetails(tx)}
                            title="View Transaction Details"
                            className="h-8 px-2 text-neutral-300 hover:text-white hover:bg-white/[0.08] cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-[#f0449b]" />
                            <span className="text-[11px]">Details</span>
                          </Button>

                          {/* Download Receipt Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isDownloadingThis}
                            onClick={() => handleDownloadReceipt(tx)}
                            title="Download Official Receipt (PDF)"
                            className="h-8 px-2 text-neutral-300 hover:text-white hover:bg-white/[0.08] cursor-pointer"
                          >
                            {isDownloadingThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : (
                              <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                            )}
                            <span className="text-[11px]">Receipt</span>
                          </Button>

                          {/* Verify button if pending */}
                          {isPending && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isVerifying}
                              onClick={() => handleVerifyPending(tx.order_id)}
                              className="h-8 px-2 text-[11px] border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                            >
                              {isVerifying ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-1" />
                              )}
                              <span>Verify</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
            <div>
              Showing{" "}
              <strong className="text-white">
                {(currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(currentPage * pageSize, filteredTransactions.length)}
              </strong>{" "}
              of <strong className="text-white">{filteredTransactions.length}</strong> transactions
              {filteredTransactions.length !== transactions.length && (
                <span className="text-neutral-500 ml-1">
                  (filtered from {transactions.length} total)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 border-white/10 text-white bg-white/[0.03] hover:bg-white/[0.08]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="px-3 py-1 font-semibold text-white">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 p-0 border-white/10 text-white bg-white/[0.03] hover:bg-white/[0.08]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TRANSACTION DETAILS MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {selectedTxForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e0f17] border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-[#fc9a5d]/20 to-[#f0449b]/20 border border-[#f0449b]/30 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-[#f0449b]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Transaction Details</h3>
                  <p className="text-[11px] text-text-muted">
                    Order Ref: {selectedTxForDetails.order_id || selectedTxForDetails.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTxForDetails(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Amount & Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div>
                  <span className="text-[11px] text-text-muted block">Transaction Amount</span>
                  <span className="text-2xl font-extrabold text-white mt-0.5 block">
                    ₹{(selectedTxForDetails.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase">
                    Currency: {selectedTxForDetails.currency || "INR"}
                  </span>
                </div>

                <div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                      selectedTxForDetails.status === "success"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : selectedTxForDetails.status === "pending" || selectedTxForDetails.status === "initiated"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : selectedTxForDetails.status === "cancelled" || selectedTxForDetails.status === "expired"
                        ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {selectedTxForDetails.status === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : selectedTxForDetails.status === "pending" || selectedTxForDetails.status === "initiated" ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : selectedTxForDetails.status === "cancelled" || selectedTxForDetails.status === "expired" ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{selectedTxForDetails.status}</span>
                  </span>
                </div>
              </div>

              {/* Failure Reason Alert (if failed/cancelled) */}
              {(selectedTxForDetails.status === "failed" || selectedTxForDetails.status === "cancelled") && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Transaction Not Completed</span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-300">
                    Reason: {selectedTxForDetails.failure_reason || "User cancelled payment or session expired."}
                  </p>
                </div>
              )}

              {/* Customer Information */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Customer Details
                </span>
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="text-text-muted text-[10px] block">Customer Name</span>
                    <span className="text-white font-medium">{user?.name || user?.full_name || "Account User"}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Email Address</span>
                    <span className="text-white font-medium truncate block">{user?.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Phone Number</span>
                    <span className="text-white font-medium">{user?.phone || user?.phone_number || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Account Status</span>
                    <span className="text-emerald-400 font-medium">Verified Active</span>
                  </div>
                </div>
              </div>

              {/* Plan & Subscription Details */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Subscription Plan Details
                </span>
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="text-text-muted text-[10px] block">Purchased Plan</span>
                    <span className="text-white font-bold">
                      {selectedTxForDetails.plan_name || selectedTxForDetails.plan_id || "Subscription Plan"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Billing Cycle</span>
                    <span className="text-white font-medium">
                      {selectedTxForDetails.billing_cycle || "Monthly / Standard"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">AI Credits Included</span>
                    <span className="text-[#f0449b] font-bold flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 fill-[#f0449b]" />
                      <span>{selectedTxForDetails.purchased_credits || 0} credits</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Gateway Settlement</span>
                    <span className="text-white font-medium">Auto-activated</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway & Transaction IDs */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Payment Gateway Information
                </span>
                <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-[11px]">Payment Mode:</span>
                    <span className="text-white font-medium">{getPaymentMode(selectedTxForDetails)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-[11px]">Gateway Provider:</span>
                    <span className="text-white font-medium">{getPaymentGateway(selectedTxForDetails)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-[11px]">Unique Order ID:</span>
                    <div className="flex items-center gap-1 font-mono text-purple-300">
                      <span>{selectedTxForDetails.order_id || selectedTxForDetails.id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedTxForDetails.order_id || selectedTxForDetails.id)}
                        className="hover:text-white"
                      >
                        {copiedId === (selectedTxForDetails.order_id || selectedTxForDetails.id) ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  {selectedTxForDetails.provider_reference && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-[11px]">Gateway Ref:</span>
                      <span className="font-mono text-neutral-300">{selectedTxForDetails.provider_reference}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-[11px]">Created At:</span>
                    <span className="font-mono text-neutral-300">
                      {selectedTxForDetails.created_at
                        ? format(new Date(selectedTxForDetails.created_at), "dd MMM yyyy, hh:mm:ss a")
                        : "N/A"}
                    </span>
                  </div>
                  {selectedTxForDetails.verified_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-[11px]">Verified At:</span>
                      <span className="font-mono text-emerald-400">
                        {format(new Date(selectedTxForDetails.verified_at), "dd MMM yyyy, hh:mm:ss a")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PCI-DSS Security & Privacy note */}
              <div className="flex items-start gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  PCI-DSS Encrypted. Sensitive payment information (card CVV, expiration, full numbers, UPI PIN) is
                  never stored or displayed on the platform.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTxForDetails(null)}
                className="border-white/10 text-white hover:bg-white/5 text-xs cursor-pointer"
              >
                Close
              </Button>

              <Button
                size="sm"
                onClick={() => handleDownloadReceipt(selectedTxForDetails)}
                className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Receipt</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
