'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';
import { jsPDF } from 'jspdf';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  Search,
  X,
  Grid3x3,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Sparkles,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  DollarSign,
  Wallet,
  CreditCard,
  Banknote,
  Receipt,
  FileText,
  Calculator,
  TrendingUp,
  LayoutGrid,
  LayoutList,
  ArrowRight,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Building,
  Clock3,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  Share,
  Printer,
  BookmarkPlus,
  ThumbsUp,
  MessageSquare,
  Calendar,
  List,
  Fullscreen,
  Minimize,
  ArrowLeft,
  Home,
  Info,
  Award,
  Star,
  Zap,
  Users2,
  Clock4,
  MapPinned,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  BadgeDollarSign,
  PiggyBank,
  Landmark,
  QrCode,
  Scan,
  Smartphone,
  Laptop,
  Printer as PrinterIcon,
  FileDown,
  FileUp,
  Copy,
  Check,
  AlertTriangle,
  Info as InfoIcon,
  ExternalLink,
  MoreHorizontal,
  Settings,
  RefreshCw,
  Filter,
  CalendarRange,
  Percent,
  BadgeCheck,
  BadgeInfo,
  BadgeAlert,
  BadgeX,
  BadgePlus,
  BadgeMinus,
  BadgeDollarSign as BadgeDollar,
} from 'lucide-react';

// =============== IMPORTED COMPONENTS ===============
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const PAYMENT_REASONS = [
  { value: 'tithe', label: 'Tithe', icon: '💰', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'offering', label: 'Offering', icon: '🙏', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'subscription', label: 'Subscription', icon: '📅', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'project', label: 'Building/Project', icon: '🏗️', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'conference', label: 'Conference Fund', icon: '🎤', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'other', label: 'Other', icon: '📌', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵', color: 'bg-green-100 text-green-800' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', color: 'bg-blue-100 text-blue-800' },
  { value: 'ecocash', label: 'EcoCash', icon: '📱', color: 'bg-purple-100 text-purple-800' },
  { value: 'other_mobile', label: 'Other Mobile', icon: '📲', color: 'bg-amber-100 text-amber-800' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD $', symbol: '$' },
  { value: 'ZWL', label: 'ZWL', symbol: 'ZWL' },
  { value: 'ZAR', label: 'ZAR R', symbol: 'R' },
];

// =============== TYPES ===============
interface Payment {
  id: string;
  receipt_number: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  amount: number;
  currency: string;
  reason: string;
  reason_other: string | null;
  payment_method: string;
  payment_reference: string | null;
  payment_date: string;
  payment_time: string;
  amount_in_words: string | null;
  received_by: string;
  notes: string | null;
  church_name: string;
  church_address: string;
  church_phone: string;
  church_email: string;
  created_at: string;
  updated_at: string;
}

interface PaymentStats {
  total: number;
  total_amount: number;
  today_total: number;
  by_reason: Record<string, number>;
  by_method: Record<string, number>;
}

// =============== API FUNCTIONS ===============
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Fetching:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || `API error: ${response.status}`);
      } catch {
        throw new Error(errorText || `API error: ${response.status}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }
    return {} as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function getPayments(params?: {
  search?: string;
  reason?: string;
  payment_method?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}): Promise<Payment[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.reason) queryParams.append('reason', params.reason);
  if (params?.payment_method) queryParams.append('payment_method', params.payment_method);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  return fetchAPI<Payment[]>(`/payments/?${queryParams.toString()}`);
}

async function getPaymentsCount(params?: {
  search?: string;
  reason?: string;
  payment_method?: string;
  from_date?: string;
  to_date?: string;
}): Promise<number> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.reason) queryParams.append('reason', params.reason);
  if (params?.payment_method) queryParams.append('payment_method', params.payment_method);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  return fetchAPI<number>(`/payments/count?${queryParams.toString()}`);
}

async function getPaymentStats(): Promise<PaymentStats> {
  return fetchAPI<PaymentStats>('/payments/stats/overview');
}

async function createPayment(payment: any): Promise<Payment> {
  return fetchAPI<Payment>('/payments/', {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

async function getPayment(id: string): Promise<Payment> {
  return fetchAPI<Payment>(`/payments/${id}`);
}

async function updatePayment(id: string, payment: any): Promise<Payment> {
  return fetchAPI<Payment>(`/payments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payment),
  });
}

async function deletePayment(id: string): Promise<void> {
  await fetchAPI(`/payments/${id}`, {
    method: 'DELETE',
  });
}

async function getLatestReceiptNumber(): Promise<string> {
  return fetchAPI<string>('/payments/receipts/latest');
}

// =============== HELPER FUNCTIONS ===============
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    return '';
  };
  
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);
  
  let result = convert(dollars) + ' Dollar' + (dollars !== 1 ? 's' : '');
  if (cents > 0) {
    result += ' and ' + convert(cents) + ' Cent' + (cents !== 1 ? 's' : '');
  }
  
  return result + ' Only';
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  try {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeStr;
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// =============== RECEIPT PDF GENERATOR ===============
const generateReceiptPDF = (payment: Payment) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Use black and white with elegant styling
  let y = margin + 10;

  // Header with church name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(payment.church_name || 'APOSTOLIC FAITH MISSION ZIMBABWE', margin, y);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Chegutu Town Assembly · Mid North Province', margin, y + 5);

  // Receipt title on right
  doc.setFont('helvetica', 'light');
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text('Receipt', pageWidth - margin, y, { align: 'right' });

  y += 15;

  // Double rule (1px top, 3px bottom)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineWidth(0.8);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

  y += 15;

  // Customer Details and Receipt Info in two columns
  // Left column - Customer Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('CUSTOMER DETAILS', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(payment.full_name, margin, y + 7);

  if (payment.email || payment.phone) {
    doc.setFont('helvetica', 'medium');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    let contactY = y + 14;
    if (payment.email) {
      doc.text(payment.email, margin, contactY);
      contactY += 5;
    }
    if (payment.phone) {
      doc.text(payment.phone, margin, contactY);
    }
  }

  // Right column - Receipt Info
  const receiptInfoX = pageWidth - margin;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('RECEIPT NUMBER:', receiptInfoX - 50, y);
  doc.setFont('helvetica', 'black');
  doc.setFontSize(8);
  doc.text(payment.receipt_number, receiptInfoX, y, { align: 'right' });

  doc.setFont('helvetica', 'medium');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const dateStr = formatDate(payment.payment_date);
  doc.text(`Date: ${dateStr}`, receiptInfoX, y + 5, { align: 'right' });

  y += 25;

  // Table header
  doc.setFont('helvetica', 'black');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('DESCRIPTION OF SERVICES', margin, y);
  doc.text('AMOUNT', pageWidth - margin, y, { align: 'right' });

  y += 3;

  // Hairline
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  // Description and amount
  const reasonDisplay = payment.reason === 'other' ? payment.reason_other : PAYMENT_REASONS.find(r => r.value === payment.reason)?.label || payment.reason;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(reasonDisplay || payment.reason, margin, y, { maxWidth: contentWidth * 0.7 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(formatCurrency(payment.amount, payment.currency), pageWidth - margin, y, { align: 'right' });

  y += 5;

  // Amount in words (italic)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const words = payment.amount_in_words || numberToWords(payment.amount);
  doc.text(words, margin, y, { maxWidth: contentWidth * 0.7 });

  y += 8;

  // Transaction Status
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);

  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Transaction Status', margin, y);
  
  doc.setFont('helvetica', 'black');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Paid In Full', pageWidth - margin, y, { align: 'right' });

  y += 15;

  // Payment Method and Total (right aligned)
  const paymentMethodX = pageWidth - margin - 60;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Payment Method', paymentMethodX, y);
  
  const methodLabel = PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label || payment.payment_method;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(methodLabel, pageWidth - margin, y, { align: 'right' });

  y += 3;

  // Thin line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(paymentMethodX, y, pageWidth - margin, y);

  y += 5;

  // Total Paid
  doc.setFont('helvetica', 'black');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Total Paid', paymentMethodX, y);
  
  doc.setFont('helvetica', 'black');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(payment.amount, payment.currency), pageWidth - margin, y, { align: 'right' });

  y += 20;

  // Signature lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  
  // Received by line
  doc.line(margin, y, margin + 50, y);
  doc.text(`Received by: ${payment.received_by}`, margin, y - 2);
  
  // Signature line
  doc.line(pageWidth - margin - 50, y, pageWidth - margin, y);
  doc.text('Signature', pageWidth - margin - 25, y - 2, { align: 'center' });

  y += 15;

  // Footer
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Thanks for doing business with us!', pageWidth / 2, y, { align: 'center' });

  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(
    'Thank you for choosing AFM Chegutu Assembly. Your generous giving supports the work of the ministry.',
    pageWidth / 2,
    y,
    { align: 'center', maxWidth: contentWidth * 0.8 }
  );

  return doc;
};

// =============== PAYMENT CARD COMPONENT with Expand/Collapse ===============
const PaymentCard = ({ 
  payment, 
  onView, 
  onEdit, 
  onDelete, 
  onDownload,
  isExpanded,
  onToggleExpand 
}: { 
  payment: Payment; 
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  onDownload: (payment: Payment) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200/40 overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-5">
        {/* Header with expand/collapse button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Receipt className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-mono">{payment.receipt_number}</p>
              <p className="font-medium text-gray-900">{payment.full_name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleExpand(payment.id)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Always visible info */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
          <Badge className={PAYMENT_REASONS.find(r => r.value === payment.reason)?.color || 'bg-gray-100'}>
            {PAYMENT_REASONS.find(r => r.value === payment.reason)?.icon} {PAYMENT_REASONS.find(r => r.value === payment.reason)?.label || payment.reason}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {formatShortDate(payment.payment_date)}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {payment.received_by}
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-purple-100 space-y-3">
            {/* Payment method and reference */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <p className="font-medium flex items-center gap-1">
                  {PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.icon} 
                  {PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label}
                </p>
              </div>
              {payment.payment_reference && (
                <div>
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="font-medium text-xs">{payment.payment_reference}</p>
                </div>
              )}
            </div>

            {/* Contact info */}
            {(payment.email || payment.phone) && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Contact</p>
                <div className="space-y-1 text-sm">
                  {payment.email && <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {payment.email}</p>}
                  {payment.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {payment.phone}</p>}
                </div>
              </div>
            )}

            {/* Notes */}
            {payment.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{payment.notes}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onView(payment)}
              >
                <Eye className="h-3 w-3 mr-1" /> View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(payment)}
              >
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
                onClick={() => onDelete(payment.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => onDownload(payment)}
              >
                <Download className="h-3 w-3 mr-1" /> PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============== PAYMENT DETAIL MODAL ===============
const PaymentDetailModal = ({ payment, open, onClose, onDownload, onEdit }: {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  onDownload: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
}) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-purple-600" />
            Payment Receipt
          </DialogTitle>
          <DialogDescription>
            Receipt Number: <span className="font-mono font-bold">{payment.receipt_number}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Receipt Preview */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{payment.church_name || 'APOSTOLIC FAITH MISSION ZIMBABWE'}</h3>
                <p className="text-sm text-gray-600">Chegutu Town Assembly · Mid North Province</p>
              </div>
              <h2 className="text-3xl font-light text-gray-400">Receipt</h2>
            </div>

            <div className="border-t border-b-4 border-black h-1 mb-6" />

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[9px] uppercase font-bold tracking-wider mb-2">Customer Details</p>
                <p className="text-lg font-bold">{payment.full_name}</p>
                {payment.email && <p className="text-sm text-gray-600 mt-1">{payment.email}</p>}
                {payment.phone && <p className="text-sm text-gray-600">{payment.phone}</p>}
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1">
                  Receipt Number: <span className="font-black">{payment.receipt_number}</span>
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider">
                  Date: {formatDate(payment.payment_date)}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-wider mb-2">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <hr className="border-black mb-4" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <p className="text-sm font-bold">
                    {PAYMENT_REASONS.find(r => r.value === payment.reason)?.label || payment.reason}
                  </p>
                  {payment.reason === 'other' && payment.reason_other && (
                    <p className="text-xs italic text-gray-600 mt-1">{payment.reason_other}</p>
                  )}
                  <p className="text-xs text-gray-500 italic mt-2">
                    {payment.amount_in_words || numberToWords(payment.amount)}
                  </p>
                </div>
                <span className="text-sm font-bold">{formatCurrency(payment.amount, payment.currency)}</span>
              </div>

              <div className="border-y border-black py-2">
                <div className="flex justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider">Transaction Status</span>
                  <span className="text-[9px] font-black uppercase italic">Paid In Full</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-56">
                <div className="flex justify-between text-[9px] font-bold uppercase mb-2">
                  <span>Payment Method</span>
                  <span>{PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label}</span>
                </div>
                <hr className="border-black mb-3" />
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black uppercase tracking-wider">Total Paid</span>
                  <span className="text-lg font-black">{formatCurrency(payment.amount, payment.currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-black">
              <p className="text-xs">Received by: {payment.received_by}</p>
              <p className="text-xs">Signature: ____________________</p>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm font-bold italic">Thanks for your generosity!</p>
              <p className="text-xs text-gray-600 mt-2">
                Thank you for choosing AFM Chegutu Assembly. Your giving supports the work of the ministry.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
                onEdit(payment);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={() => onDownload(payment)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============== PAYMENT FORM MODAL (for Create/Edit) ===============
const PaymentFormModal = ({ open, onClose, onSave, payment }: {
  open: boolean;
  onClose: () => void;
  onSave: (payment: any) => void;
  payment?: Payment | null;
}) => {
  const [formData, setFormData] = useState({
    full_name: payment?.full_name || '',
    email: payment?.email || '',
    phone: payment?.phone || '',
    address: payment?.address || '',
    amount: payment?.amount?.toString() || '',
    currency: payment?.currency || 'USD',
    reason: payment?.reason || 'tithe',
    reason_other: payment?.reason_other || '',
    payment_method: payment?.payment_method || 'cash',
    payment_reference: payment?.payment_reference || '',
    payment_date: payment?.payment_date || new Date().toISOString().split('T')[0],
    payment_time: payment?.payment_time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    received_by: payment?.received_by || '',
    notes: payment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setFormData({
        full_name: payment.full_name || '',
        email: payment.email || '',
        phone: payment.phone || '',
        address: payment.address || '',
        amount: payment.amount?.toString() || '',
        currency: payment.currency || 'USD',
        reason: payment.reason || 'tithe',
        reason_other: payment.reason_other || '',
        payment_method: payment.payment_method || 'cash',
        payment_reference: payment.payment_reference || '',
        payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
        payment_time: payment.payment_time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        received_by: payment.received_by || '',
        notes: payment.notes || '',
      });
    }
  }, [payment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.received_by.trim()) newErrors.received_by = 'Received by is required';
    if (formData.reason === 'other' && !formData.reason_other.trim()) {
      newErrors.reason_other = 'Please specify the reason';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    const paymentData = {
      ...formData,
      amount: Number(formData.amount),
      amount_in_words: numberToWords(Number(formData.amount)),
    };
    
    try {
      await onSave(paymentData);
      onClose();
    } catch (error) {
      console.error('Failed to save payment:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent flex items-center gap-2">
            <Wallet className="h-6 w-6 text-purple-600" />
            {payment ? 'Edit Payment' : 'Record New Payment'}
          </DialogTitle>
          <DialogDescription>
            {payment ? 'Update the payment details below.' : 'Enter the payment details below. A receipt will be generated automatically.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs defaultValue="payer" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="payer">Payer Info</TabsTrigger>
              <TabsTrigger value="payment">Payment Details</TabsTrigger>
              <TabsTrigger value="receipt">Receipt Info</TabsTrigger>
            </TabsList>

            {/* Payer Info Tab */}
            <TabsContent value="payer" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter payer's full name"
                    className={errors.full_name ? 'border-red-500' : ''}
                  />
                  {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+263 77 123 4567"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Payer's address"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Payment Details Tab */}
            <TabsContent value="payment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(v) => setFormData({ ...formData, currency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select
                    value={formData.reason}
                    onValueChange={(v) => setFormData({ ...formData, reason: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_REASONS.map(reason => (
                        <SelectItem key={reason.value} value={reason.value}>
                          <span className="flex items-center gap-2">
                            <span>{reason.icon}</span>
                            <span>{reason.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.reason === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="reason_other">Specify Reason *</Label>
                    <Input
                      id="reason_other"
                      value={formData.reason_other}
                      onChange={(e) => setFormData({ ...formData, reason_other: e.target.value })}
                      placeholder="Please specify"
                      className={errors.reason_other ? 'border-red-500' : ''}
                    />
                    {errors.reason_other && <p className="text-xs text-red-500">{errors.reason_other}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(v) => setFormData({ ...formData, payment_method: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          <span className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            <span>{method.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_reference">Reference/Transaction ID</Label>
                  <Input
                    id="payment_reference"
                    value={formData.payment_reference}
                    onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                    placeholder="Transaction reference"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_date">Payment Date *</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_time">Payment Time *</Label>
                  <Input
                    id="payment_time"
                    type="time"
                    value={formData.payment_time}
                    onChange={(e) => setFormData({ ...formData, payment_time: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Receipt Info Tab */}
            <TabsContent value="receipt" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="received_by">Received By (Your Name) *</Label>
                  <Input
                    id="received_by"
                    value={formData.received_by}
                    onChange={(e) => setFormData({ ...formData, received_by: e.target.value })}
                    placeholder="e.g., Pastor T. Moyo"
                    className={errors.received_by ? 'border-red-500' : ''}
                  />
                  {errors.received_by && <p className="text-xs text-red-500">{errors.received_by}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2 bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Receipt Preview</p>
                      <p className="text-sm text-gray-600 mt-1">
                        A receipt will be generated with a unique receipt number and 
                        can be downloaded as PDF after saving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {payment ? 'Update Payment' : 'Save Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =============== MAIN PAGE ===============
export default function PaymentsPage() {
  const router = useRouter();
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Data
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  
  // Expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  
  // Stats
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    total_amount: 0,
    today_total: 0,
    by_reason: {},
    by_method: {},
  });

  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
  }, []);

  // Load data
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [searchTerm, selectedReason, selectedMethod, currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments({
        search: searchTerm || undefined,
        reason: selectedReason !== 'all' ? selectedReason : undefined,
        payment_method: selectedMethod !== 'all' ? selectedMethod : undefined,
        from_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        to_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
      });
      setPayments(data);
      
      const count = await getPaymentsCount({
        search: searchTerm || undefined,
        reason: selectedReason !== 'all' ? selectedReason : undefined,
        payment_method: selectedMethod !== 'all' ? selectedMethod : undefined,
        from_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        to_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
      });
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Toggle expanded
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Expand all
  const expandAll = () => {
    setExpandedItems(new Set(payments.map(p => p.id)));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  // Handle save payment
  const handleSavePayment = async (paymentData: any) => {
    try {
      if (editingPayment) {
        const updated = await updatePayment(editingPayment.id, paymentData);
        setPayments(payments.map(p => p.id === editingPayment.id ? updated : p));
        toast.success('Payment updated successfully');
      } else {
        const newPayment = await createPayment(paymentData);
        setPayments([newPayment, ...payments]);
        toast.success('Payment recorded successfully');
      }
      await fetchStats();
      setEditingPayment(null);
    } catch (error: any) {
      console.error('Failed to save payment:', error);
      toast.error(error.message || 'Failed to save payment');
      throw error;
    }
  };

  // Handle edit
  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      await fetchStats();
      toast.success('Payment deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete payment:', error);
      toast.error(error.message || 'Failed to delete payment');
    }
  };

  // Handle download PDF
  const handleDownloadPDF = (payment: Payment) => {
    try {
      const doc = generateReceiptPDF(payment);
      doc.save(`receipt-${payment.receipt_number}.pdf`);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  // Handle view payment
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailModalOpen(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedReason('all');
    setSelectedMethod('all');
    setDateRange({ from: null, to: null });
    setCurrentPage(0);
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-purple-800">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <Header isLoggedIn={isAdmin} user={null} churchName="AFM Chegutu" onLogout={() => {}} />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-blue-900/30" />
      </div>
      
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto py-10 px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-3">
                <Wallet className="h-10 w-10" />
                Payments & Offerings
              </h1>
              <p className="text-lg text-purple-100">
                Record and manage tithes, offerings, and donations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingPayment(null);
                  setFormModalOpen(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Record Payment
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`bg-white/10 backdrop-blur-sm border-white/30 ${
                  viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`bg-white/10 backdrop-blur-sm border-white/30 ${
                  viewMode === 'list' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Payments</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Receipt className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-green-200/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(stats.total_amount, 'USD')}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-blue-200/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Today's Total</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(stats.today_total, 'USD')}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <CalendarIcon className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-amber-200/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Top Reason</p>
                    <p className="text-3xl font-bold text-gray-900 capitalize">
                      {Object.entries(stats.by_reason)
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100">
                    <TrendingUp className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-200/40 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, receipt number, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 bg-white/80 border-purple-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Expand/Collapse All */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  className="bg-white/80 border-purple-200"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  className="bg-white/80 border-purple-200"
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Collapse All
                </Button>
              </div>

              {/* Reason Filter */}
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="w-full lg:w-[150px] bg-white/80 border-purple-200">
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  {PAYMENT_REASONS.map(reason => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <span className="flex items-center gap-2">
                        <span>{reason.icon}</span>
                        <span>{reason.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Method Filter */}
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger className="w-full lg:w-[150px] bg-white/80 border-purple-200">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {PAYMENT_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      <span className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span>{method.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Filter - Using mode="single" for each calendar */}
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-white/80 border-purple-200">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.from ? format(dateRange.from, 'LLL dd, y') : 'Start Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from || undefined}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-white/80 border-purple-200">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.to ? format(dateRange.to, 'LLL dd, y') : 'End Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to || undefined}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDateRange({ from: null, to: null })}
                    className="text-purple-700 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedReason !== 'all' || selectedMethod !== 'all' || dateRange.from) && (
                <Button variant="ghost" onClick={clearFilters} className="text-purple-700 hover:text-purple-800">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Payments Grid/List */}
          {payments.length === 0 ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl">
              <Receipt className="h-12 w-12 mx-auto text-white/60 mb-4" />
              <p className="text-white text-lg">No payments found</p>
              <Button
                onClick={() => {
                  setEditingPayment(null);
                  setFormModalOpen(true);
                }}
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Your First Payment
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onView={handleViewPayment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownloadPDF}
                  isExpanded={expandedItems.has(payment.id)}
                  onToggleExpand={toggleExpanded}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-200/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-100/80 to-blue-100/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Receipt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-purple-600">{payment.receipt_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-purple-100 text-purple-800">
                                {getInitials(payment.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{payment.full_name}</p>
                              {payment.email && <p className="text-xs text-gray-500">{payment.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={PAYMENT_REASONS.find(r => r.value === payment.reason)?.color}>
                            {PAYMENT_REASONS.find(r => r.value === payment.reason)?.icon} {PAYMENT_REASONS.find(r => r.value === payment.reason)?.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-blue-50">
                            {PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.icon} {PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatShortDate(payment.payment_date)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPayment(payment)}
                            className="hover:bg-purple-100"
                          >
                            <Eye className="h-4 w-4 text-purple-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(payment)}
                            className="hover:bg-purple-100"
                          >
                            <Pencil className="h-4 w-4 text-purple-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(payment.id)}
                            className="hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPDF(payment)}
                            className="hover:bg-purple-100"
                          >
                            <Download className="h-4 w-4 text-purple-700" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-purple-100">
                  <p className="text-sm text-gray-600">
                    Showing {startItem}-{endItem} of {totalCount} payments
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Payment Form Modal */}
      <PaymentFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPayment(null);
        }}
        onSave={handleSavePayment}
        payment={editingPayment}
      />

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onDownload={handleDownloadPDF}
        onEdit={handleEdit}
      />
      
      <Footer />
    </>
  );
}