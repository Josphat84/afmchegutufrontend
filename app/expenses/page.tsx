'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';
import * as XLSX from 'xlsx';
import {
  Search, Plus, Pencil, Trash2, TrendingDown, DollarSign,
  FileText, Receipt, CheckCircle2, XCircle, Clock, AlertCircle, Building,
  Zap, Users, Megaphone, Car, Printer, Package, Wrench, Heart, Globe,
  BookOpen, Music, ChevronDown, ChevronUp, X, Check, MoreHorizontal,
  RefreshCw, ShieldCheck, AlertTriangle, Target, BarChart3, ArrowUpRight, TrendingUp,
  ArrowDownRight, ChevronLeft, ChevronRight, Play, Pause, Undo2,
  PauseCircle, LayoutGrid, LayoutList, ChevronsUpDown, HelpCircle,
  Info, FileSpreadsheet,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface UserData { id: number; email: string; name: string; role: string; churchName?: string; }

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1920',
];

const EXPENSE_CATEGORIES = [
  { value: 'utilities',  label: 'Utilities',              icon: Zap,            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',  chart: '#EAB308', budget: 300  },
  { value: 'salaries',   label: 'Salaries & Staff',       icon: Users,          color: 'bg-blue-100 text-blue-800 border-blue-200',         chart: '#3B82F6', budget: 1200 },
  { value: 'building',   label: 'Building & Maintenance', icon: Building,       color: 'bg-stone-100 text-stone-800 border-stone-200',      chart: '#78716C', budget: 500  },
  { value: 'outreach',   label: 'Outreach & Missions',    icon: Globe,          color: 'bg-green-100 text-green-800 border-green-200',      chart: '#22C55E', budget: 400  },
  { value: 'events',     label: 'Events & Programs',      icon: Megaphone,      color: 'bg-pink-100 text-pink-800 border-pink-200',         chart: '#EC4899', budget: 350  },
  { value: 'office',     label: 'Office Supplies',        icon: Package,        color: 'bg-gray-100 text-gray-800 border-gray-200',         chart: '#6B7280', budget: 100  },
  { value: 'printing',   label: 'Printing & Publications',icon: Printer,        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',   chart: '#6366F1', budget: 80   },
  { value: 'transport',  label: 'Transport & Fuel',       icon: Car,            color: 'bg-orange-100 text-orange-800 border-orange-200',   chart: '#F97316', budget: 200  },
  { value: 'tithe',      label: 'Tithe Remittance',       icon: Heart,          color: 'bg-red-100 text-red-800 border-red-200',            chart: '#EF4444', budget: 600  },
  { value: 'children',   label: "Children's Ministry",    icon: BookOpen,       color: 'bg-cyan-100 text-cyan-800 border-cyan-200',         chart: '#06B6D4', budget: 150  },
  { value: 'youth',      label: 'Youth Ministry',         icon: Music,          color: 'bg-violet-100 text-violet-800 border-violet-200',   chart: '#8B5CF6', budget: 150  },
  { value: 'equipment',  label: 'Equipment & Technology', icon: Wrench,         color: 'bg-teal-100 text-teal-800 border-teal-200',         chart: '#14B8A6', budget: 200  },
  { value: 'other',      label: 'Miscellaneous',          icon: MoreHorizontal, color: 'bg-slate-100 text-slate-800 border-slate-200',      chart: '#94A3B8', budget: 100  },
];

const INCOME_CATEGORIES = [
  { value: 'tithes',          label: 'Tithes',           color: 'bg-purple-100 text-purple-800 border-purple-200', chart: '#9333EA' },
  { value: 'offerings',       label: 'Sunday Offerings', color: 'bg-green-100 text-green-800 border-green-200',    chart: '#22C55E' },
  { value: 'donations',       label: 'Donations',        color: 'bg-blue-100 text-blue-800 border-blue-200',       chart: '#3B82F6' },
  { value: 'fundraising',     label: 'Fundraising',      color: 'bg-amber-100 text-amber-800 border-amber-200',    chart: '#F59E0B' },
  { value: 'facility_rental', label: 'Facility Rental',  color: 'bg-teal-100 text-teal-800 border-teal-200',      chart: '#14B8A6' },
  { value: 'other',           label: 'Other Income',     color: 'bg-gray-100 text-gray-800 border-gray-200',       chart: '#6B7280' },
];

const PAYMENT_METHODS = [
  { value: 'cash',         label: 'Cash',          icon: '💵' },
  { value: 'bank',         label: 'Bank Transfer', icon: '🏦' },
  { value: 'ecocash',      label: 'EcoCash',       icon: '📱' },
  { value: 'cheque',       label: 'Cheque',        icon: '📄' },
  { value: 'other_mobile', label: 'Other Mobile',  icon: '📲' },
];

const CURRENCIES = [
  { value: 'USD', symbol: '$'   },
  { value: 'ZWL', symbol: 'ZWL' },
  { value: 'ZAR', symbol: 'R'   },
];

const STATUS_CONFIG = {
  pending:  { label: 'Pending',         icon: Clock,        color: 'bg-yellow-100 text-yellow-800 border-yellow-300', dot: 'bg-yellow-400' },
  approved: { label: 'Approved',        icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-300',   dot: 'bg-green-500'  },
  rejected: { label: 'Rejected',        icon: XCircle,      color: 'bg-red-100 text-red-800 border-red-300',         dot: 'bg-red-500'    },
  on_hold:  { label: 'On Hold',         icon: PauseCircle,  color: 'bg-blue-100 text-blue-800 border-blue-300',      dot: 'bg-blue-400'   },
};

// =============== TYPES ===============
type Status = 'pending' | 'approved' | 'rejected' | 'on_hold';

interface Expense {
  id: string; ref: string; description: string; category: string;
  amount: number; currency: string; payment_method: string;
  vendor: string; submitted_by: string; approved_by: string;
  status: Status; expense_date: string; notes: string;
  receipt_url?: string; rejection_reason?: string;
  is_recurring?: boolean; recurrence?: string;
}

interface ExpenseForm {
  description: string; category: string; amount: string; currency: string;
  payment_method: string; vendor: string; submitted_by: string;
  expense_date: string; notes: string; is_recurring: boolean; recurrence: string;
}

const EMPTY_FORM: ExpenseForm = {
  description: '', category: 'utilities', amount: '', currency: 'USD',
  payment_method: 'cash', vendor: '', submitted_by: '',
  expense_date: format(new Date(), 'yyyy-MM-dd'), notes: '',
  is_recurring: false, recurrence: 'monthly',
};

interface Payment {
  id: string; receipt_number: string; full_name: string;
  amount: number; currency: string; reason: string;
  payment_method: string; payment_date: string; received_by: string; notes?: string;
}

const PAYMENT_REASON_CONFIG: Record<string, { label: string; color: string; chart: string }> = {
  tithe:        { label: 'Tithes',        color: 'bg-purple-100 text-purple-800 border-purple-200', chart: '#9333EA' },
  offering:     { label: 'Offerings',     color: 'bg-green-100 text-green-800 border-green-200',    chart: '#22C55E' },
  subscription: { label: 'Subscription',  color: 'bg-blue-100 text-blue-800 border-blue-200',       chart: '#3B82F6' },
  project:      { label: 'Project Fund',  color: 'bg-amber-100 text-amber-800 border-amber-200',    chart: '#F59E0B' },
  conference:   { label: 'Conference',    color: 'bg-teal-100 text-teal-800 border-teal-200',       chart: '#14B8A6' },
  other:        { label: 'Other',         color: 'bg-gray-100 text-gray-800 border-gray-200',       chart: '#6B7280' },
};

// =============== HELPERS ===============
function getCat(value: string) {
  return EXPENSE_CATEGORIES.find(c => c.value === value) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}
function fmt(amount: number, currency = 'USD') {
  const sym = CURRENCIES.find(c => c.value === currency)?.symbol ?? '$';
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// =============== API ===============
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error((await res.text()) || `API error: ${res.status}`);
  if (res.status === 204) return {} as T;
  return res.json();
}
const api = {
  list:       ()                                  => fetchAPI<Expense[]>('/expenses/?limit=100'),
  create:     (d: Omit<Expense,'id'|'ref'>)       => fetchAPI<Expense>('/expenses/', { method: 'POST', body: JSON.stringify(d) }),
  update:     (id: string, d: Partial<Expense>)   => fetchAPI<Expense>(`/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  approve:       (id: string, by: string)         => fetchAPI<Expense>(`/expenses/${id}/approve?approved_by=${encodeURIComponent(by)}`, { method: 'PATCH' }),
  reject:        (id: string, reason?: string)    => fetchAPI<Expense>(`/expenses/${id}/reject${reason?`?reason=${encodeURIComponent(reason)}`:''}`, { method: 'PATCH' }),
  disapprove:    (id: string)                     => fetchAPI<Expense>(`/expenses/${id}/disapprove`, { method: 'PATCH' }),
  hold:          (id: string)                     => fetchAPI<Expense>(`/expenses/${id}/hold`,       { method: 'PATCH' }),
  remove:        (id: string)                     => fetchAPI<void>(`/expenses/${id}`,               { method: 'DELETE' }),
  uploadReceipt: async (id: string, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch(`${API_BASE_URL}/expenses/${id}/receipt`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Expense>;
  },
};

async function fetchAllPayments(): Promise<Payment[]> {
  const all: Payment[] = [];
  let offset = 0;
  while (true) {
    const page: Payment[] = await fetchAPI(`/payments/?limit=100&offset=${offset}`);
    all.push(...page);
    if (page.length < 100) break;
    offset += 100;
  }
  return all;
}

// =============== FULL-PAGE BACKGROUND ===============
function PageBackground() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx(p => (p + 1) % BG_IMAGES.length), 120000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {BG_IMAGES.map((url, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: `url('${url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      ))}
      {/* dark overlay so content stays readable */}
      <div className="absolute inset-0 bg-purple-950/60" />

      {/* controls bottom-right */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button onClick={() => setIdx(p => (p - 1 + BG_IMAGES.length) % BG_IMAGES.length)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition">
          <ChevronLeft className="w-3 h-3" />
        </button>
        {BG_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
        <button onClick={() => setIdx(p => (p + 1) % BG_IMAGES.length)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition">
          <ChevronRight className="w-3 h-3" />
        </button>
        <button onClick={() => setPlaying(p => !p)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition">
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

// =============== STAT CARD ===============
function StatCard({ icon: Icon, label, value, sub, trend, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trend?: 'up'|'down'|'neutral'; color: string;
}) {
  return (
    <Card className="relative overflow-hidden border border-white/20 bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/25 transition-all">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-white/70 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-lg font-bold text-white leading-tight">{value}</p>
            {sub && <p className="text-[10px] text-white/60 mt-0.5">{sub}</p>}
          </div>
          <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${color} bg-opacity-90`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-[10px] font-medium
            ${trend==='up'?'text-red-300':trend==='down'?'text-green-300':'text-white/50'}`}>
            {trend==='up'?<ArrowUpRight className="w-3 h-3"/>:trend==='down'?<ArrowDownRight className="w-3 h-3"/>:null}
            {trend==='up'?'Higher than last month':trend==='down'?'Lower than last month':'Stable'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============== NAME COMBO ===============
function NameCombo({ value, onChange, placeholder, names, listId }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; names: string[]; listId: string;
}) {
  return (
    <>
      <Input list={listId} placeholder={placeholder ?? 'Type or pick a name…'} value={value}
        onChange={e => onChange(e.target.value)} className="mt-1" />
      <datalist id={listId}>
        {names.map(n => <option key={n} value={n} />)}
      </datalist>
    </>
  );
}

// =============== BUDGET BAR ===============
function BudgetBar({ category, spent, budget }: { category: typeof EXPENSE_CATEGORIES[0]; spent: number; budget: number }) {
  const pct  = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  const Icon = category.icon;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">{category.label}</span>
        </div>
        <span className={`text-xs font-semibold ${over?'text-red-600':'text-gray-600'}`}>
          {fmt(spent)} / {fmt(budget)}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${over?'bg-red-500':pct>80?'bg-amber-500':'bg-purple-500'}`}
          style={{ width: `${pct}%` }} />
      </div>
      {over && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>Over budget by {fmt(spent-budget)}</p>}
    </div>
  );
}

// =============== ACTION BUTTONS ===============
function ActionButtons({ expense, onApprove, onReject, onDisapprove, onEdit, onDelete }: {
  expense: Expense;
  onApprove: ()=>void; onReject: ()=>void; onDisapprove: ()=>void;
  onEdit: ()=>void; onDelete: ()=>void;
}) {
  return (
    <div className="flex items-center gap-1">
      {expense.status === 'pending' && (
        <>
          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onApprove} className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition" aria-label="Approve">
                <Check className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Approve expense</TooltipContent>
          </Tooltip></TooltipProvider>

          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onReject} className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition" aria-label="Reject">
                <X className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reject expense</TooltipContent>
          </Tooltip></TooltipProvider>
        </>
      )}
      {expense.status === 'approved' && (
        <TooltipProvider><Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onDisapprove} className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 flex items-center justify-center transition">
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Disapprove (back to pending)</TooltipContent>
        </Tooltip></TooltipProvider>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}><Pencil className="w-3.5 h-3.5 mr-2"/>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-red-600"><Trash2 className="w-3.5 h-3.5 mr-2"/>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// =============== TABLE ROW ===============
function ExpenseRow({ expense, onApprove, onReject, onDisapprove, onEdit, onDelete, expanded, onToggle, selected, onSelect }: {
  expense: Expense; expanded: boolean; onToggle: ()=>void; selected: boolean; onSelect: ()=>void;
  onApprove:()=>void; onReject:()=>void; onDisapprove:()=>void; onEdit:()=>void; onDelete:()=>void;
}) {
  const cat    = getCat(expense.category);
  const CatIcon = cat.icon;
  const status = STATUS_CONFIG[expense.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-purple-50/60 transition-colors">
        <td className="px-2 py-3 w-8">
          {expense.status==='pending' && (
            <input type="checkbox" checked={selected} onChange={onSelect}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 cursor-pointer accent-purple-600"/>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <TooltipProvider><Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onToggle} className="flex items-center gap-1 text-xs font-mono text-purple-700 font-semibold hover:text-purple-900">
                  {expanded ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
                  {expense.ref}
                </button>
              </TooltipTrigger>
              <TooltipContent>{expanded ? 'Collapse' : 'Expand details'}</TooltipContent>
            </Tooltip></TooltipProvider>
            {expense.is_recurring && (
              <TooltipProvider><Tooltip>
                <TooltipTrigger><span className="text-xs bg-violet-100 text-violet-700 rounded px-1 py-0.5 font-medium">↻</span></TooltipTrigger>
                <TooltipContent>Recurring — {expense.recurrence}</TooltipContent>
              </Tooltip></TooltipProvider>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${cat.color}`}>
              <CatIcon className="w-3.5 h-3.5"/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 break-words">{expense.description}</p>
              <p className="text-xs text-gray-500">{cat.label}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{expense.vendor || '—'}</td>
        <td className="px-4 py-3 font-bold text-gray-800 text-sm">{fmt(expense.amount, expense.currency)}</td>
        <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-500">{format(new Date(expense.expense_date),'dd MMM yyyy')}</td>
        <td className="px-4 py-3">
          <Badge variant="outline" className={`text-xs ${status.color} flex items-center gap-1 w-fit`}>
            <StatusIcon className="w-3 h-3"/>{status.label}
          </Badge>
        </td>
        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
          <ActionButtons expense={expense} onApprove={onApprove} onReject={onReject}
            onDisapprove={onDisapprove} onEdit={onEdit} onDelete={onDelete}/>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-purple-50/40">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-gray-500 mb-0.5">Payment Method</p><p className="font-medium text-gray-700 capitalize">{expense.payment_method.replace('_',' ')}</p></div>
              <div><p className="text-xs text-gray-500 mb-0.5">Submitted By</p><p className="font-medium text-gray-700">{expense.submitted_by||'—'}</p></div>
              <div><p className="text-xs text-gray-500 mb-0.5">Approved By</p><p className="font-medium text-gray-700">{expense.approved_by||'—'}</p></div>
              {expense.notes && <div><p className="text-xs text-gray-500 mb-0.5">Notes</p><p className="font-medium text-gray-700">{expense.notes}</p></div>}
              {expense.receipt_url && (
                <div><p className="text-xs text-gray-500 mb-0.5">Receipt</p>
                  <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-600 hover:underline text-xs font-medium">
                    <FileText className="w-3 h-3"/>View Receipt
                  </a>
                </div>
              )}
              {expense.rejection_reason && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">Rejection Reason</p>
                  <p className="text-sm text-red-600 font-medium">{expense.rejection_reason}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// =============== GRID CARD ===============
function ExpenseCard({ expense, onApprove, onReject, onDisapprove, onEdit, onDelete }: {
  expense: Expense;
  onApprove:()=>void; onReject:()=>void; onDisapprove:()=>void; onEdit:()=>void; onDelete:()=>void;
}) {
  const cat    = getCat(expense.category);
  const CatIcon = cat.icon;
  const status = STATUS_CONFIG[expense.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${cat.color}`}>
              <CatIcon className="w-4 h-4"/>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono text-purple-600 font-semibold">{expense.ref}</p>
              <p className="text-sm font-medium text-gray-800 leading-tight break-words">{expense.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs ${status.color} flex items-center gap-1 flex-shrink-0`}>
            <StatusIcon className="w-3 h-3"/>{status.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-gray-900 text-base">{fmt(expense.amount, expense.currency)}</span>
          <span className="text-xs text-gray-500">{format(new Date(expense.expense_date),'dd MMM yy')}</span>
        </div>

        {expense.vendor && <p className="text-xs text-gray-500 break-words">📍 {expense.vendor}</p>}

        <div className="pt-1 border-t border-gray-100">
          <ActionButtons expense={expense} onApprove={onApprove} onReject={onReject}
            onDisapprove={onDisapprove} onEdit={onEdit} onDelete={onDelete}/>
        </div>
      </CardContent>
    </Card>
  );
}

// =============== CHART TOOLTIP ===============
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color??p.fill }} className="font-medium">{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
}

// =============== MAIN PAGE ===============
export default function ExpensesPage() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [user, setUser]               = useState<UserData|null>(null);
  const [churchName, setChurchName]   = useState('AFM Chegutu Assembly');
  const [expenses, setExpenses]       = useState<Expense[]>([]);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm]       = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense|null>(null);
  const [form, setForm]               = useState<ExpenseForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<Expense|null>(null);
  const [activeTab, setActiveTab]     = useState('expenses');
  const [isLoading, setIsLoading]     = useState(false);
  const [viewMode, setViewMode]       = useState<'table'|'grid'>('table');
  const [receiptFile, setReceiptFile] = useState<File|null>(null);
  const [rejectDialog, setRejectDialog] = useState<{id:string}|null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [budgets, setBudgets] = useState<Record<string,number>>(
    Object.fromEntries(EXPENSE_CATEGORIES.map(c=>[c.value, c.budget]))
  );
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState<Record<string,string>>({});
  const [reportDialog, setReportDialog] = useState(false);
  const [reportFrom, setReportFrom] = useState('');
  const [reportTo, setReportTo] = useState('');
  const [reportFmt, setReportFmt] = useState<'pdf'|'excel'>('pdf');
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());
  const [bulkRejectDialog, setBulkRejectDialog] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');
  const [paymentsList, setPaymentsList]   = useState<Payment[]>([]);
  const [directoryNames, setDirectoryNames] = useState<string[]>([]);

  // ---- AUTH ----
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const church   = localStorage.getItem('church');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      if (church) setChurchName(church);
    }
  }, []);

  const handleLogout = () => {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  };

  // ---- LOAD ----
  useEffect(() => {
    setIsLoading(true);
    api.list()
      .then(setExpenses)
      .catch(err => toast.error(`Failed to load: ${err.message}`))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchAllPayments().then(setPaymentsList).catch(()=>{});
    fetchAPI<{full_name:string}[]>('/directory/?limit=500')
      .then(members => setDirectoryNames(members.map(m => m.full_name)))
      .catch(()=>{});
  }, []);

  useEffect(() => { setSelectedIds(new Set()); }, [search, filterCat, filterStatus, filterMonth]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/budgets/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: {category:string;amount:number}[]) => {
        if (data.length) setBudgets(prev=>({...prev, ...Object.fromEntries(data.map(b=>[b.category,b.amount]))}));
      })
      .catch(()=>{});
  }, []);

  // ---- DERIVED ----
  const filtered = useMemo(() => expenses.filter(e => {
    const s = search.toLowerCase();
    const matchSearch = !search ||
      e.description.toLowerCase().includes(s) ||
      (e.vendor||'').toLowerCase().includes(s) ||
      e.ref.toLowerCase().includes(s) ||
      (e.submitted_by||'').toLowerCase().includes(s);
    const matchCat    = filterCat    === 'all' || e.category === filterCat;
    const matchStatus = filterStatus === 'all' || e.status   === filterStatus;
    const matchMonth  = filterMonth  === 'all' || e.expense_date.startsWith(filterMonth);
    return matchSearch && matchCat && matchStatus && matchMonth;
  }), [expenses, search, filterCat, filterStatus, filterMonth]);

  const approved = useMemo(()=>expenses.filter(e=>e.status==='approved'),[expenses]);
  const pending  = useMemo(()=>expenses.filter(e=>e.status==='pending'), [expenses]);
  const onHoldList = useMemo(()=>expenses.filter(e=>e.status==='on_hold'),[expenses]);

  const totalSpent   = approved.reduce((s,e)=>s+e.amount,0);
  const totalBudget  = EXPENSE_CATEGORIES.reduce((s,c)=>s+(budgets[c.value]??c.budget),0);
  const totalPending = pending.reduce((s,e)=>s+e.amount,0);

  const months = useMemo(()=>{
    const set = new Set(expenses.map(e=>e.expense_date.slice(0,7)));
    return Array.from(set).sort().reverse();
  },[expenses]);

  // ---- EXPAND / COLLAPSE ----
  const allIds     = filtered.map(e=>e.id);
  const toggleRow  = (id:string) => setExpandedIds(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const expandAll  = () => setExpandedIds(new Set(allIds));
  const collapseAll= () => setExpandedIds(new Set());

  // ---- CHART DATA ----
  const pieData = useMemo(()=>EXPENSE_CATEGORIES
    .map(cat=>({ name:cat.label, value:approved.filter(e=>e.category===cat.value).reduce((s,e)=>s+e.amount,0), fill:cat.chart }))
    .filter(d=>d.value>0),[approved]);

  const barData = useMemo(()=>{
    const byMonth:Record<string,{approved:number;pending:number}> = {};
    expenses.forEach(e=>{
      const m=e.expense_date.slice(0,7);
      if(!byMonth[m]) byMonth[m]={approved:0,pending:0};
      if(e.status==='approved') byMonth[m].approved+=e.amount;
      if(e.status==='pending')  byMonth[m].pending +=e.amount;
    });
    return Object.entries(byMonth).sort().slice(-6).map(([month,v])=>({
      month:format(new Date(month+'-01'),'MMM yy'), Approved:v.approved, Pending:v.pending,
    }));
  },[expenses]);

  const totalIncome   = useMemo(()=>paymentsList.reduce((s,r)=>s+r.amount,0),[paymentsList]);
  const thisMonthIncome = useMemo(()=>{
    const m = format(new Date(),'yyyy-MM');
    return paymentsList.filter(r=>r.payment_date.startsWith(m)).reduce((s,r)=>s+r.amount,0);
  },[paymentsList]);

  const incomePieData = useMemo(()=>
    Object.entries(PAYMENT_REASON_CONFIG).map(([key,rc])=>({
      name: rc.label,
      value: paymentsList.filter(r=>r.reason===key).reduce((s,r)=>s+r.amount,0),
      fill: rc.chart,
    })).filter(d=>d.value>0)
  ,[paymentsList]);

  const incomeBarData = useMemo(()=>{
    const byMonth: Record<string,number> = {};
    paymentsList.forEach(r=>{
      const m = r.payment_date.slice(0,7);
      byMonth[m] = (byMonth[m]||0) + r.amount;
    });
    return Object.entries(byMonth).sort().slice(-8).map(([m,v])=>({
      month: format(new Date(m+'-01'),'MMM yy'), amount: v,
    }));
  },[paymentsList]);

  const budgetAlerts = useMemo(()=>EXPENSE_CATEGORIES.map(cat=>({
    ...cat,
    budget: budgets[cat.value]??cat.budget,
    spent: approved.filter(e=>e.category===cat.value).reduce((s,e)=>s+e.amount,0),
  })).filter(c=>(budgets[c.value]??c.budget)>0 && c.spent>=(budgets[c.value]??c.budget)*0.8)
  ,[approved, budgets]);

  const recurringDue = useMemo(()=>{
    const thisMonth = format(new Date(),'yyyy-MM');
    const recurring = expenses.filter(e=>e.is_recurring);
    const seen = new Set<string>();
    const due: Expense[] = [];
    [...recurring].sort((a,b)=>b.expense_date.localeCompare(a.expense_date)).forEach(e=>{
      const key = `${e.description}|${e.category}`;
      if (!seen.has(key)) { seen.add(key); if (!e.expense_date.startsWith(thisMonth)) due.push(e); }
    });
    return due;
  },[expenses]);

  const budgetByCategory = useMemo(()=>EXPENSE_CATEGORIES.map(cat=>({
    ...cat,
    budget: budgets[cat.value]??cat.budget,
    spent: approved.filter(e=>e.category===cat.value).reduce((s,e)=>s+e.amount,0),
  })).filter(c=>c.spent>0||( budgets[c.value]??c.budget)>0),[approved, budgets]);

  // ---- CRUD ----
  function openAdd()  { setEditingExpense(null); setForm(EMPTY_FORM); setReceiptFile(null); setShowForm(true); }
  function openEdit(e:Expense) {
    setEditingExpense(e);
    setForm({ description:e.description, category:e.category, amount:String(e.amount),
      currency:e.currency, payment_method:e.payment_method, vendor:e.vendor||'',
      submitted_by:e.submitted_by||'', expense_date:e.expense_date, notes:e.notes||'',
      is_recurring:e.is_recurring??false, recurrence:e.recurrence||'monthly' });
    setReceiptFile(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.description.trim()||!form.amount||!form.expense_date) { toast.error('Fill in all required fields.'); return; }
    const amount = parseFloat(form.amount);
    if (isNaN(amount)||amount<=0) { toast.error('Enter a valid amount.'); return; }
    setIsLoading(true);
    try {
      let saved: Expense;
      if (editingExpense) {
        saved = await api.update(editingExpense.id,{...form,amount});
        setExpenses(prev=>prev.map(e=>e.id===editingExpense.id?saved:e));
        toast.success('Expense updated.');
      } else {
        saved = await api.create({...form,amount,approved_by:'',status:'pending'});
        setExpenses(prev=>[saved,...prev]);
        toast.success('Expense submitted for approval.');
      }
      if (receiptFile) {
        try {
          const withReceipt = await api.uploadReceipt(saved.id, receiptFile);
          setExpenses(prev=>prev.map(e=>e.id===saved.id?withReceipt:e));
        } catch(err:any){ toast.warning(`Saved but receipt upload failed: ${err.message}`); }
        setReceiptFile(null);
      }
      setShowForm(false);
    } catch(err:any){ toast.error(`Save failed: ${err.message}`); }
    finally { setIsLoading(false); }
  }

  async function handleDelete(e:Expense) {
    try { await api.remove(e.id); setExpenses(prev=>prev.filter(x=>x.id!==e.id)); setDeleteConfirm(null); toast.success('Deleted.'); }
    catch(err:any){ toast.error(`Delete failed: ${err.message}`); }
  }

  async function bulkApprove() {
    const ids = Array.from(selectedIds);
    let count = 0;
    for (const id of ids) {
      try { const u = await api.approve(id,'Rev. Lirani'); setExpenses(prev=>prev.map(e=>e.id===id?u:e)); count++; } catch{}
    }
    setSelectedIds(new Set());
    toast.success(`${count} expense${count!==1?'s':''} approved.`);
  }

  async function bulkReject(reason?: string) {
    const ids = Array.from(selectedIds);
    let count = 0;
    for (const id of ids) {
      try { const u = await api.reject(id,reason); setExpenses(prev=>prev.map(e=>e.id===id?u:e)); count++; } catch{}
    }
    setSelectedIds(new Set()); setBulkRejectDialog(false); setBulkRejectReason('');
    toast.warning(`${count} expense${count!==1?'s':''} rejected.`);
  }


  async function saveBudgets() {
    try {
      const payload = EXPENSE_CATEGORIES.map(c=>({
        category: c.value,
        amount: parseFloat(budgetDraft[c.value]??String(budgets[c.value]??c.budget))||0,
      }));
      const res = await fetch(`${API_BASE_URL}/budgets/bulk`, {
        method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved: {category:string;amount:number}[] = await res.json();
      setBudgets(prev=>({...prev,...Object.fromEntries(saved.map(b=>[b.category,b.amount]))}));
      setEditingBudget(false); setBudgetDraft({});
      toast.success('Budget allocations saved.');
    } catch(err:any){ toast.error(`Failed to save budgets: ${err.message}`); }
  }

  async function generateReport() {
    if (!reportFrom||!reportTo) { toast.error('Select both a start and end date.'); return; }
    setReportLoading(true);
    try {
      const data: Expense[] = [];
      let offset = 0;
      while (true) {
        const page: Expense[] = await fetchAPI(`/expenses/?limit=100&offset=${offset}&from_date=${reportFrom}&to_date=${reportTo}`);
        data.push(...page);
        if (page.length < 100) break;
        offset += 100;
      }
      const label = `${reportFrom}-to-${reportTo}`;
      if (reportFmt==='excel') {
        exportExcel(data, label);
      } else {
        await exportPDF(data, label);
      }
      setReportDialog(false);
    } catch(err:any){ toast.error(`Report failed: ${err.message}`); }
    finally { setReportLoading(false); }
  }

  async function act(id:string, fn:()=>Promise<Expense>, msg:string, warn=false) {
    try { const u=await fn(); setExpenses(prev=>prev.map(e=>e.id===id?u:e)); warn?toast.warning(msg):toast.success(msg); }
    catch(err:any){ toast.error(`Failed: ${err.message}`); }
  }

  // ---- EXCEL EXPORT ----
  function exportExcel(data?: Expense[], label?: string) {
    const rows = (data??filtered).map(e=>({
      'Reference':      e.ref,
      'Description':    e.description,
      'Category':       getCat(e.category).label,
      'Vendor':         e.vendor||'',
      'Amount':         e.amount,
      'Currency':       e.currency,
      'Payment Method': e.payment_method,
      'Date':           e.expense_date,
      'Status':         e.status,
      'Submitted By':   e.submitted_by||'',
      'Approved By':    e.approved_by||'',
      'Notes':          e.notes||'',
    }));
    const ws  = XLSX.utils.json_to_sheet(rows);
    const wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    // Column widths
    ws['!cols'] = [8,35,22,25,10,8,14,12,10,18,18,30].map(w=>({wch:w}));
    XLSX.writeFile(wb, `AFM-Chegutu-Expenses-${label??format(new Date(),'yyyy-MM-dd')}.xlsx`);
    toast.success('Excel workbook exported.');
  }

  // ---- PDF EXPORT ----
  async function exportPDF(data?: Expense[], label?: string) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const rows = data ?? filtered;
    const W = 297; const margin = 14;

    // Header band
    doc.setFillColor(88, 28, 135);
    doc.rect(0, 0, W, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('AFM Chegutu Assembly', margin, 10);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Expenses Report', margin, 17);
    doc.text(`Generated: ${format(new Date(),'dd MMMM yyyy')}`, W - margin, 17, { align: 'right' });

    // Column config
    const cols = [
      { label:'Ref',         x:margin,  w:20  },
      { label:'Description', x:34,      w:60  },
      { label:'Category',    x:94,      w:30  },
      { label:'Vendor',      x:124,     w:28  },
      { label:'Amount',      x:152,     w:24  },
      { label:'Date',        x:176,     w:24  },
      { label:'Status',      x:200,     w:22  },
      { label:'Approved By', x:222,     w:35  },
    ];

    // Table header row
    let y = 30;
    doc.setFillColor(237, 233, 254);
    doc.rect(margin - 2, y - 5, W - (margin * 2) + 4, 7, 'F');
    doc.setTextColor(60, 10, 100); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    cols.forEach(c => doc.text(c.label, c.x, y));

    // Data rows
    doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
    y += 7;
    rows.forEach((e, i) => {
      const descLines: string[] = doc.splitTextToSize(e.description, cols[1].w);
      const rowH = Math.max(6.5, descLines.length * 4.5);
      if (y + rowH > 190) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(250, 248, 255); doc.rect(margin - 2, y - 4.5, W - (margin * 2) + 4, rowH, 'F'); }
      const singles = [
        { ci: 0, val: e.ref },
        { ci: 2, val: getCat(e.category).label },
        { ci: 3, val: (e.vendor||'').slice(0,16) },
        { ci: 4, val: fmt(e.amount, e.currency) },
        { ci: 5, val: e.expense_date },
        { ci: 6, val: STATUS_CONFIG[e.status]?.label || e.status },
        { ci: 7, val: (e.approved_by||'').slice(0,18) },
      ];
      singles.forEach(({ ci, val }) => doc.text(String(val), cols[ci].x, y));
      doc.text(descLines, cols[1].x, y);
      y += rowH;
    });

    // Totals footer
    const totalAmt  = rows.filter(e=>e.status==='approved').reduce((s,e)=>s+e.amount,0);
    const pendingAmt = rows.filter(e=>e.status==='pending').reduce((s,e)=>s+e.amount,0);
    y += 3;
    doc.setDrawColor(180, 130, 220); doc.line(margin, y, W - margin, y); y += 5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(60, 10, 100);
    doc.text(`${rows.length} record${rows.length !== 1 ? 's' : ''}`, margin, y);
    doc.text(`Approved: ${fmt(totalAmt)}`, 110, y);
    doc.text(`Pending: ${fmt(pendingAmt)}`, 175, y);

    doc.save(`AFM-Chegutu-Expenses-${label??format(new Date(),'yyyy-MM-dd')}.pdf`);
    toast.success('PDF report exported.');
  }

  // ---- RENDER ----
  return (
    <div className="min-h-screen flex flex-col">
      <PageBackground />
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />
      <Toaster position="top-right" richColors />

      {/* ── HERO ── */}
      <section className="relative py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Financial Management</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Expenses & Budget</h1>
              <p className="text-purple-200 max-w-xl text-sm">
                Track, approve and analyse church expenditure.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={()=>{ setReportFrom(''); setReportTo(''); setReportDialog(true); }}
                    className="border-white/30 text-white hover:bg-white/10 bg-white/5 gap-2">
                    <FileText className="w-4 h-4" /> Period Report
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate a report for a specific date range</TooltipContent>
              </Tooltip></TooltipProvider>
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={()=>exportPDF()}
                    className="border-white/30 text-white hover:bg-white/10 bg-white/5 gap-2">
                    <Printer className="w-4 h-4" /> Export PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download current view as PDF</TooltipContent>
              </Tooltip></TooltipProvider>
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={()=>exportExcel()}
                    className="border-white/30 text-white hover:bg-white/10 bg-white/5 gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> Export Excel
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as Excel workbook (.xlsx)</TooltipContent>
              </Tooltip></TooltipProvider>
              <Button onClick={openAdd} className="bg-white text-purple-900 hover:bg-purple-50 font-semibold gap-2">
                <Plus className="w-4 h-4" /> Add Expense
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Total Approved"  value={`$${totalSpent.toLocaleString()}`}   sub="Approved expenses"              color="bg-purple-600 text-white" />
          <StatCard icon={Target}     label="Monthly Budget"  value={`$${totalBudget.toLocaleString()}`}  sub={`$${Math.max(totalBudget-totalSpent,0).toLocaleString()} left`} color="bg-blue-600 text-white" />
          <StatCard icon={Clock}      label="Pending Review"  value={`${pending.length}`}                  sub={`$${totalPending.toLocaleString()} awaiting`} trend={pending.length>3?'up':'neutral'} color="bg-amber-500 text-white" />
          <StatCard icon={Receipt}    label="Total Records"   value={`${expenses.length}`}                 sub={`${onHoldList.length} on hold`} color="bg-green-600 text-white" />
        </div>
      </section>

      {/* ── BODY ── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/20 backdrop-blur-md border border-white/20">
            <TabsTrigger value="expenses" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <Receipt className="w-4 h-4 mr-2"/>Expense Ledger
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <BarChart3 className="w-4 h-4 mr-2"/>Charts
            </TabsTrigger>
            <TabsTrigger value="budget" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <Target className="w-4 h-4 mr-2"/>Budget
            </TabsTrigger>
            <TabsTrigger value="income" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <TrendingUp className="w-4 h-4 mr-2"/>Income
            </TabsTrigger>
          </TabsList>

          {/* ── LEDGER TAB ── */}
          <TabsContent value="expenses" className="space-y-4">

            {/* Recurring reminder */}
            {recurringDue.length > 0 && (
              <div className="p-3 bg-violet-50/90 backdrop-blur-sm border border-violet-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-violet-800">Recurring expenses due this month</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {recurringDue.map(e=>(
                      <button key={e.id} onClick={()=>{ setEditingExpense(null); setForm({...EMPTY_FORM, description:e.description, category:e.category, payment_method:e.payment_method, vendor:e.vendor||'', submitted_by:e.submitted_by||'', amount:String(e.amount), is_recurring:true, recurrence:e.recurrence||'monthly'}); setShowForm(true); }}
                        className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-lg px-2 py-1 hover:bg-violet-200 transition">
                        + {e.description} ({getCat(e.category).label})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guide banner */}
            <div className="flex items-start gap-2 p-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 text-white text-xs">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-200"/>
              <span className="text-white/80">
                <strong className="text-white">How to use:</strong> Click a <strong className="text-white">Ref number</strong> (↓) to expand details.
                Use <strong className="text-white">✓</strong> to approve, <strong className="text-white">✕</strong> to reject, <strong className="text-white">↩</strong> to disapprove.
                Switch between <strong className="text-white">table</strong> and <strong className="text-white">grid</strong> views using the icons top-right.
                In table view, <strong className="text-white">tick the checkboxes</strong> on pending rows to select multiple — a floating bar will appear at the bottom to approve or reject them all at once.
              </span>
            </div>

            {/* Filters row */}
            <Card className="border border-white/20 bg-white/85 backdrop-blur-md shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <Input placeholder="Search description, vendor, ref…" value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 bg-white"/>
                    {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400 hover:text-gray-600"/></button>}
                  </div>
                  <Select value={filterCat} onValueChange={setFilterCat}>
                    <SelectTrigger className="w-full md:w-48 bg-white"><SelectValue placeholder="Category"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {EXPENSE_CATEGORIES.map(c=><SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-36 bg-white"><SelectValue placeholder="Status"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-full md:w-36 bg-white"><SelectValue placeholder="Month"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {months.map(m=><SelectItem key={m} value={m}>{format(new Date(m+'-01'),'MMMM yyyy')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Toolbar row */}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{filtered.length} record{filtered.length!==1?'s':''}</span>
                    {(search||filterCat!=='all'||filterStatus!=='all'||filterMonth!=='all') && (
                      <button onClick={()=>{setSearch('');setFilterCat('all');setFilterStatus('all');setFilterMonth('all');}}
                        className="text-purple-600 hover:underline flex items-center gap-1">
                        <RefreshCw className="w-3 h-3"/>Clear filters
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Expand / collapse — table only */}
                    {viewMode === 'table' && (
                      <>
                        <TooltipProvider><Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={expandAll} className="h-7 text-xs gap-1">
                              <ChevronsUpDown className="w-3 h-3"/>Expand all
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Show details for all rows</TooltipContent>
                        </Tooltip></TooltipProvider>
                        <TooltipProvider><Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={collapseAll} className="h-7 text-xs gap-1">
                              <ChevronUp className="w-3 h-3"/>Collapse all
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hide all expanded rows</TooltipContent>
                        </Tooltip></TooltipProvider>
                      </>
                    )}
                    {/* View toggle */}
                    <div className="flex border rounded-lg overflow-hidden">
                      <TooltipProvider><Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={()=>setViewMode('table')}
                            className={`px-2 py-1.5 transition ${viewMode==='table'?'bg-purple-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
                            <LayoutList className="w-3.5 h-3.5"/>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Table view</TooltipContent>
                      </Tooltip></TooltipProvider>
                      <TooltipProvider><Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={()=>setViewMode('grid')}
                            className={`px-2 py-1.5 transition ${viewMode==='grid'?'bg-purple-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
                            <LayoutGrid className="w-3.5 h-3.5"/>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Grid view</TooltipContent>
                      </Tooltip></TooltipProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TABLE VIEW */}
            {viewMode === 'table' && (
              <Card className="border border-white/20 bg-white/85 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="px-2 py-3 w-8">
                          {(() => {
                            const pendingInView = filtered.filter(e=>e.status==='pending');
                            const allSelected = pendingInView.length>0 && pendingInView.every(e=>selectedIds.has(e.id));
                            return <input type="checkbox" checked={allSelected}
                              onChange={()=>setSelectedIds(allSelected ? new Set() : new Set(pendingInView.map(e=>e.id)))}
                              className="w-4 h-4 rounded border-gray-300 accent-purple-600 cursor-pointer"/>;
                          })()}
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <div className="flex items-center gap-1">Ref <HelpCircle className="w-3 h-3 text-gray-300"/></div>
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Vendor</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                          <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-40 animate-spin"/>
                          <p className="text-sm">Loading expenses…</p>
                        </td></tr>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                          <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                          <p className="font-medium">No expenses found</p>
                          <p className="text-xs mt-1">Adjust filters or click <strong>Add Expense</strong> to get started</p>
                        </td></tr>
                      ) : filtered.map(expense=>(
                        <ExpenseRow key={expense.id} expense={expense}
                          expanded={expandedIds.has(expense.id)} onToggle={()=>toggleRow(expense.id)}
                          selected={selectedIds.has(expense.id)} onSelect={()=>setSelectedIds(prev=>{ const n=new Set(prev); n.has(expense.id)?n.delete(expense.id):n.add(expense.id); return n; })}
                          onApprove={()=>act(expense.id,()=>api.approve(expense.id,'Rev. Lirani'),'Approved.')}
                          onReject={()=>{ setRejectReason(''); setRejectDialog({id:expense.id}); }}
                          onDisapprove={()=>act(expense.id,()=>api.disapprove(expense.id),'Moved back to pending.')}
                          onEdit={()=>openEdit(expense)} onDelete={()=>setDeleteConfirm(expense)}/>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length > 0 && (
                  <div className="bg-gray-50/80 border-t px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{filtered.length} records shown</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Filtered approved total:</span>
                      <span className="font-bold text-purple-700">
                        ${filtered.filter(e=>e.status==='approved').reduce((s,e)=>s+e.amount,0).toLocaleString('en-US',{minimumFractionDigits:2})}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              isLoading ? (
                <div className="text-center py-16 text-white/60">
                  <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-40 animate-spin"/>
                  <p>Loading expenses…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-white/60">
                  <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40"/>
                  <p className="font-medium">No expenses found</p>
                  <p className="text-xs mt-1">Adjust filters or add a new expense</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(expense=>(
                    <ExpenseCard key={expense.id} expense={expense}
                      onApprove={()=>act(expense.id,()=>api.approve(expense.id,'Rev. Lirani'),'Approved.')}
                      onReject={()=>{ setRejectReason(''); setRejectDialog({id:expense.id}); }}
                      onDisapprove={()=>act(expense.id,()=>api.disapprove(expense.id),'Moved back to pending.')}
                      onEdit={()=>openEdit(expense)} onDelete={()=>setDeleteConfirm(expense)}/>
                  ))}
                </div>
              )
            )}

            {/* Alert banners */}
            {pending.length > 0 && (
              <div className="p-4 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-sm font-semibold text-amber-800">{pending.length} expense{pending.length>1?'s':''} awaiting your decision</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Use <strong>✓ Approve</strong> or <strong>✕ Reject</strong> on each pending row.
                  </p>
                </div>
              </div>
            )}
            {onHoldList.length > 0 && (
              <div className="p-4 bg-blue-50/90 backdrop-blur-sm border border-blue-200 rounded-xl flex items-start gap-3">
                <PauseCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-sm font-semibold text-blue-800">{onHoldList.length} expense{onHoldList.length>1?'s':''} on hold</p>
                  <p className="text-xs text-blue-600 mt-0.5">These have been deferred — use <strong>✓</strong> to approve or <strong>↩</strong> to return to pending review.</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── CHARTS TAB ── */}
          <TabsContent value="charts">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Spending by Category</CardTitle>
                  <p className="text-xs text-gray-500">Approved expenses only</p>
                </CardHeader>
                <CardContent>
                  {pieData.length===0 ? <p className="text-center text-gray-400 py-12 text-sm">No approved expenses yet</p> : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                          dataKey="value" nameKey="name" paddingAngle={3}
                          label={({name,percent})=>`${(name??'').split(' ')[0]} ${((percent??0)*100).toFixed(0)}%`} labelLine={false}>
                          {pieData.map((entry,i)=><Cell key={i} fill={entry.fill}/>)}
                        </Pie>
                        <ReTooltip content={<ChartTooltip/>}/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Monthly Spending Trend</CardTitle>
                  <p className="text-xs text-gray-500">Last 6 months — approved vs pending</p>
                </CardHeader>
                <CardContent>
                  {barData.length===0 ? <p className="text-center text-gray-400 py-12 text-sm">No data yet</p> : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="month" tick={{fontSize:11}}/>
                        <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v}`}/>
                        <ReTooltip content={<ChartTooltip/>}/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                        <Bar dataKey="Approved" fill="#7C3AED" radius={[4,4,0,0]}/>
                        <Bar dataKey="Pending"  fill="#F59E0B" radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Cumulative Approved Spend</CardTitle>
                  <p className="text-xs text-gray-500">Running total over time</p>
                </CardHeader>
                <CardContent>
                  {barData.length===0 ? <p className="text-center text-gray-400 py-12 text-sm">No data yet</p> : (()=>{
                    let running=0;
                    const areaData=barData.map(d=>{running+=d.Approved;return{month:d.month,'Cumulative Spend':running};});
                    return (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={areaData}>
                          <defs>
                            <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                          <XAxis dataKey="month" tick={{fontSize:11}}/>
                          <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v}`}/>
                          <ReTooltip content={<ChartTooltip/>}/>
                          <Area type="monotone" dataKey="Cumulative Spend" stroke="#7C3AED" strokeWidth={2} fill="url(#purple)"/>
                        </AreaChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(['approved','pending','on_hold','rejected'] as Status[]).map(s=>{
                    const group=expenses.filter(e=>e.status===s);
                    const total=group.reduce((x,e)=>x+e.amount,0);
                    const pct  =expenses.length?(group.length/expenses.length)*100:0;
                    const cfg  =STATUS_CONFIG[s]; const Icon=cfg.icon;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cfg.color}`}><Icon className="w-4 h-4"/></div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 capitalize">{cfg.label}</span>
                            <span className="text-gray-500">{group.length} · {fmt(total)}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s==='approved'?'bg-green-500':s==='pending'?'bg-amber-500':s==='on_hold'?'bg-blue-500':'bg-red-500'}`}
                              style={{width:`${pct}%`}}/>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Top Vendors</CardTitle>
                  <p className="text-xs text-gray-500">By approved spend</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(()=>{
                    const map:Record<string,number>={};
                    approved.forEach(e=>{const v=e.vendor||'Unknown';map[v]=(map[v]||0)+e.amount;});
                    const entries=Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,6);
                    return entries.length===0
                      ? <p className="text-center text-gray-400 py-6 text-sm">No approved expenses yet</p>
                      : entries.map(([vendor,amount],i)=>(
                        <div key={vendor} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                          <span className="flex-1 text-sm text-gray-700 truncate">{vendor}</span>
                          <span className="text-sm font-semibold text-gray-800">{fmt(amount)}</span>
                        </div>
                      ));
                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── BUDGET TAB ── */}
          <TabsContent value="budget">
            {budgetAlerts.length > 0 && (
              <div className="space-y-2 mb-3">
                {budgetAlerts.map(cat=>{
                  const pct = Math.round((cat.spent/cat.budget)*100);
                  const over = cat.spent >= cat.budget;
                  return (
                    <div key={cat.value} className={`flex items-center gap-3 p-3 rounded-xl border ${over?'bg-red-50 border-red-200':'bg-amber-50 border-amber-200'}`}>
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${over?'text-red-500':'text-amber-500'}`}/>
                      <p className={`text-sm flex-1 ${over?'text-red-800':'text-amber-800'}`}>
                        <strong>{cat.label}</strong> — {over?'over budget':'approaching limit'} ({pct}% used: {fmt(cat.spent)} of {fmt(cat.budget)})
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={()=>{ setBudgetDraft({}); setEditingBudget(true); }}
                className="bg-white/80 backdrop-blur-sm gap-2 border-white/30 text-purple-900 hover:bg-white">
                <Pencil className="w-3.5 h-3.5"/>Edit Budget Allocations
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600"/>Budget vs Actual — by Category
                    </CardTitle>
                    <p className="text-xs text-gray-500">Based on approved expenses only. Red bars indicate over-budget categories.</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {budgetByCategory.length===0
                      ? <p className="text-center text-gray-400 py-8 text-sm">No approved expenses to display yet.</p>
                      : budgetByCategory.map(cat=><BudgetBar key={cat.value} category={cat} spent={cat.spent} budget={cat.budget}/>)}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-200"/>
                      <h3 className="font-semibold">Overall Budget Health</h3>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-200">Spent</span>
                        <span className="font-bold">{Math.round((totalSpent/totalBudget)*100)}%</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-700"
                          style={{width:`${Math.min((totalSpent/totalBudget)*100,100)}%`}}/>
                      </div>
                    </div>
                    <Separator className="bg-white/20"/>
                    <div className="space-y-2 text-sm">
                      {[
                        {label:'Total Budget',   val:fmt(totalBudget),  cls:''},
                        {label:'Approved Spend', val:fmt(totalSpent),   cls:'text-green-300'},
                        {label:'Pending',        val:fmt(totalPending), cls:'text-amber-300'},
                      ].map(row=>(
                        <div key={row.label} className="flex justify-between">
                          <span className="text-purple-200">{row.label}</span>
                          <span className={`font-semibold ${row.cls}`}>{row.val}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
                        <span className="text-purple-200">Remaining</span>
                        <span className={`font-bold ${totalBudget-totalSpent<0?'text-red-300':'text-white'}`}>{fmt(Math.max(totalBudget-totalSpent,0))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">Top Spending Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {budgetByCategory.sort((a,b)=>b.spent-a.spent).slice(0,5).map(cat=>{
                      const Icon=cat.icon;
                      return (
                        <div key={cat.value} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0 ${cat.color}`}>
                            <Icon className="w-3.5 h-3.5"/>
                          </div>
                          <p className="flex-1 text-xs font-medium text-gray-700 truncate">{cat.label}</p>
                          <span className="text-xs font-bold text-gray-800">{fmt(cat.spent)}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <div className="p-4 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600"/>
                    <p className="text-xs font-semibold text-purple-800">Financial Accountability</p>
                  </div>
                  <p className="text-xs text-purple-600 leading-relaxed">
                    All expenses require pastoral approval. On-hold expenses are deferred and do not count toward approved spend. Records are retained for audit and annual report.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── INCOME TAB ── */}
          <TabsContent value="income" className="space-y-4">
            {/* Source note with link */}
            <div className="flex items-center gap-2 p-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 text-white text-xs">
              <Info className="w-4 h-4 flex-shrink-0 text-green-300"/>
              <span className="text-white/80 flex-1">
                Income is sourced from the Receipts page. This tab is read-only.
              </span>
              <a href="/receipts"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 rounded-lg text-green-200 hover:text-white transition-all font-medium whitespace-nowrap">
                <Receipt className="w-3.5 h-3.5"/>Go to Receipts
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp}   label="Total Income"   value={fmt(totalIncome)}             sub={`${paymentsList.length} receipts`}  color="bg-green-600 text-white"/>
              <StatCard icon={DollarSign}   label="This Month"     value={fmt(thisMonthIncome)}         sub="Income this month"                  color="bg-teal-600 text-white"/>
              <StatCard icon={TrendingDown} label="Total Expenses" value={fmt(totalSpent)}              sub="Approved expenses"                  color="bg-red-500 text-white"/>
              <StatCard icon={Target}       label="Net Position"   value={fmt(totalIncome-totalSpent)}  sub={totalIncome-totalSpent>=0?'Surplus':'Deficit'} color={totalIncome-totalSpent>=0?'bg-purple-600 text-white':'bg-orange-600 text-white'}/>
            </div>

            {/* Charts row */}
            {paymentsList.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pie chart */}
                <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800">Income by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={incomePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                            dataKey="value" paddingAngle={3}
                            label={({name,percent})=>`${(name as string).split(' ')[0]} ${((percent as number)*100).toFixed(0)}%`}
                            labelLine={false}>
                            {incomePieData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                          </Pie>
                          <ReTooltip formatter={(v)=>[fmt(Number(v??0)),'Amount']}/>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 w-full sm:w-auto sm:min-w-[130px]">
                        {incomePieData.map(d=>(
                          <div key={d.name} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                            <span className="text-xs text-gray-600 flex-1">{d.name}</span>
                            <span className="text-xs font-semibold text-gray-800">{fmt(d.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar chart – income over time */}
                <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800">Monthly Income Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={incomeBarData} margin={{top:4,right:8,left:0,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v as number).toLocaleString()}`} width={60}/>
                        <ReTooltip formatter={(v)=>[fmt(Number(v??0)),'Income']} contentStyle={{borderRadius:'8px',fontSize:'12px'}}/>
                        <Bar dataKey="amount" fill="#22C55E" radius={[4,4,0,0]} name="Income"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Category breakdown bars */}
            {paymentsList.length > 0 && (
              <Card className="border border-white/20 bg-white/90 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-semibold text-gray-700">Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(PAYMENT_REASON_CONFIG).map(([key,rc])=>{
                    const total = paymentsList.filter(r=>r.reason===key).reduce((s,r)=>s+r.amount,0);
                    if (!total) return null;
                    const pct = totalIncome>0?(total/totalIncome)*100:0;
                    const count = paymentsList.filter(r=>r.reason===key).length;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:rc.chart}}/>
                            <span className="text-sm text-gray-700 font-medium">{rc.label}</span>
                            <span className="text-xs text-gray-400">{count} receipt{count!==1?'s':''}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">{pct.toFixed(1)}%</span>
                            <span className="text-sm font-bold text-gray-800 w-24 text-right">{fmt(total)}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:rc.chart}}/>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Payments table */}
            <Card className="border border-white/20 bg-white/85 backdrop-blur-md shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-600"/>Receipt History
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">{paymentsList.length} records · {fmt(totalIncome)} total</p>
              </CardHeader>
              <CardContent className="p-0">
                {paymentsList.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                    <p className="font-medium">No payments recorded yet</p>
                    <p className="text-xs mt-1">Issue receipts from the Receipts page to see income here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Receipt #</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payer</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                      </tr></thead>
                      <tbody>
                        {paymentsList.map(r=>{
                          const rc = PAYMENT_REASON_CONFIG[r.reason] ?? PAYMENT_REASON_CONFIG['other'];
                          return (
                            <tr key={r.id} className="border-b border-gray-100 hover:bg-green-50/40 transition-colors">
                              <td className="px-4 py-3 text-xs font-mono text-green-700 font-semibold">{r.receipt_number}</td>
                              <td className="px-4 py-3">
                                <p className="text-sm font-medium text-gray-800">{r.full_name}</p>
                                {r.received_by && <p className="text-xs text-gray-500">received by {r.received_by}</p>}
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <Badge variant="outline" className={`text-xs ${rc.color}`}>{rc.label}</Badge>
                              </td>
                              <td className="px-4 py-3 font-bold text-green-700">{fmt(r.amount, r.currency)}</td>
                              <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{format(new Date(r.payment_date),'dd MMM yyyy')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-600"/>
              {editingExpense?'Edit Expense':'Submit New Expense'}
            </DialogTitle>
            <DialogDescription>
              {editingExpense?'Update the expense details below.':'New expenses are submitted as Pending until approved by leadership.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="md:col-span-2">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Monthly electricity bill" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className="mt-1"/>
            </div>
            <div>
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={form.category} onValueChange={v=>setForm(p=>({...p,category:v}))}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>{EXPENSE_CATEGORIES.map(c=><SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vendor / Supplier</Label>
              <Input placeholder="e.g. ZESA Holdings" value={form.vendor} onChange={e=>setForm(p=>({...p,vendor:e.target.value}))} className="mt-1"/>
            </div>
            <div>
              <Label>Amount <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} className="mt-1"/>
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={v=>setForm(p=>({...p,currency:v}))}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c=><SelectItem key={c.value} value={c.value}>{c.value}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={form.payment_method} onValueChange={v=>setForm(p=>({...p,payment_method:v}))}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>{PAYMENT_METHODS.map(m=><SelectItem key={m.value} value={m.value}>{m.icon} {m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={form.expense_date} onChange={e=>setForm(p=>({...p,expense_date:e.target.value}))} className="mt-1"/>
            </div>
            <div>
              <Label>Submitted By</Label>
              <NameCombo listId="submitted-by-list" value={form.submitted_by}
                onChange={v=>setForm(p=>({...p,submitted_by:v}))} names={directoryNames}/>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any additional details…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} className="mt-1 resize-none" rows={3}/>
            </div>
            <div className="md:col-span-2">
              <Label>Receipt / Invoice</Label>
              <input type="file" accept="image/*,.pdf"
                onChange={e=>setReceiptFile(e.target.files?.[0]||null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"/>
              {receiptFile && <p className="text-xs text-green-600 mt-1">📎 {receiptFile.name}</p>}
              {editingExpense?.receipt_url && !receiptFile && (
                <p className="text-xs text-gray-500 mt-1">Current: <a href={editingExpense.receipt_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">View receipt</a></p>
              )}
            </div>
            <div className="md:col-span-2 flex items-center gap-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
              <input type="checkbox" id="is_recurring" checked={form.is_recurring}
                onChange={e=>setForm(p=>({...p,is_recurring:e.target.checked}))}
                className="w-4 h-4 rounded accent-violet-600 cursor-pointer"/>
              <Label htmlFor="is_recurring" className="cursor-pointer text-violet-800 font-medium">Recurring expense</Label>
              {form.is_recurring && (
                <Select value={form.recurrence} onValueChange={v=>setForm(p=>({...p,recurrence:v}))}>
                  <SelectTrigger className="w-36 h-8 text-sm bg-white"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={()=>setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-purple-700 hover:bg-purple-800 text-white">
              {editingExpense?<><Check className="w-4 h-4 mr-2"/>Save Changes</>:<><Plus className="w-4 h-4 mr-2"/>Submit Expense</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── BUDGET EDIT DIALOG ── */}
      <Dialog open={editingBudget} onOpenChange={setEditingBudget}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600"/>Edit Budget Allocations
            </DialogTitle>
            <DialogDescription>Set the monthly budget for each expense category. Changes are saved to the database.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {EXPENSE_CATEGORIES.map(cat=>{
              const Icon = cat.icon;
              const current = budgets[cat.value]??cat.budget;
              return (
                <div key={cat.value} className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${cat.color}`}>
                    <Icon className="w-4 h-4"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{cat.label}</p>
                    <Input type="number" min="0" step="10"
                      value={budgetDraft[cat.value]??String(current)}
                      onChange={e=>setBudgetDraft(p=>({...p,[cat.value]:e.target.value}))}
                      className="h-8 text-sm"/>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">USD/mo</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-3 bg-purple-50 rounded-xl text-xs text-purple-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0"/>
            Total monthly budget: <strong>${EXPENSE_CATEGORIES.reduce((s,c)=>s+(parseFloat(budgetDraft[c.value]??String(budgets[c.value]??c.budget))||0),0).toLocaleString()}</strong>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={()=>{ setEditingBudget(false); setBudgetDraft({}); }}>Cancel</Button>
            <Button onClick={saveBudgets} className="bg-purple-700 hover:bg-purple-800 text-white">
              <Check className="w-4 h-4 mr-2"/>Save Budgets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── PERIOD REPORT DIALOG ── */}
      <Dialog open={reportDialog} onOpenChange={setReportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600"/>Period Report
            </DialogTitle>
            <DialogDescription>Generate a report for a specific date range — export as PDF or Excel.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label>From Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={reportFrom} onChange={e=>setReportFrom(e.target.value)} className="mt-1"/>
            </div>
            <div>
              <Label>To Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={reportTo} onChange={e=>setReportTo(e.target.value)} className="mt-1"/>
            </div>
            <div>
              <Label>Format</Label>
              <Select value={reportFmt} onValueChange={v=>setReportFmt(v as 'pdf'|'excel')}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report (landscape A4)</SelectItem>
                  <SelectItem value="excel">Excel Workbook (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={()=>setReportDialog(false)}>Cancel</Button>
            <Button onClick={generateReport} disabled={!reportFrom||!reportTo||reportLoading}
              className="bg-purple-700 hover:bg-purple-800 text-white">
              {reportLoading ? 'Generating…' : reportFmt==='pdf'
                ? <><Printer className="w-4 h-4 mr-2"/>Generate PDF</>
                : <><FileSpreadsheet className="w-4 h-4 mr-2"/>Generate Excel</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── BULK FLOATING BAR ── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 border border-white/10">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button size="sm" onClick={bulkApprove} className="bg-green-500 hover:bg-green-600 text-white h-8 gap-1.5 text-xs">
            <Check className="w-3.5 h-3.5"/>Approve All
          </Button>
          <Button size="sm" onClick={()=>{ setBulkRejectReason(''); setBulkRejectDialog(true); }} className="bg-red-500 hover:bg-red-600 text-white h-8 gap-1.5 text-xs">
            <X className="w-3.5 h-3.5"/>Reject All
          </Button>
          <button onClick={()=>setSelectedIds(new Set())} className="text-white/50 hover:text-white ml-1"><X className="w-4 h-4"/></button>
        </div>
      )}

      {/* ── BULK REJECT DIALOG ── */}
      <Dialog open={bulkRejectDialog} onOpenChange={()=>{ setBulkRejectDialog(false); setBulkRejectReason(''); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5"/>Reject {selectedIds.size} Expense{selectedIds.size!==1?'s':''}</DialogTitle>
            <DialogDescription>Provide a reason that will apply to all selected expenses.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for rejection…" value={bulkRejectReason} onChange={e=>setBulkRejectReason(e.target.value)} className="mt-2 resize-none" rows={3}/>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={()=>setBulkRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={()=>bulkReject(bulkRejectReason||undefined)}>
              <XCircle className="w-4 h-4 mr-2"/>Confirm Reject All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── INCOME ADD/EDIT DIALOG ── */}
      {/* ── REJECT DIALOG ── */}
      <Dialog open={!!rejectDialog} onOpenChange={()=>{ setRejectDialog(null); setRejectReason(''); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5"/>Reject Expense</DialogTitle>
            <DialogDescription>Provide a reason so the submitter knows what to correct.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <Label>Reason for rejection</Label>
            <Textarea placeholder="e.g. Missing receipt, duplicate entry, over budget…"
              value={rejectReason} onChange={e=>setRejectReason(e.target.value)}
              className="mt-1 resize-none" rows={3}/>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={()=>{ setRejectDialog(null); setRejectReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={async()=>{
              if (!rejectDialog) return;
              await act(rejectDialog.id, ()=>api.reject(rejectDialog.id, rejectReason||undefined), 'Rejected.', true);
              setRejectDialog(null); setRejectReason('');
            }}><XCircle className="w-4 h-4 mr-2"/>Confirm Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ── */}
      <Dialog open={!!deleteConfirm} onOpenChange={()=>setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="w-5 h-5"/>Delete Expense</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{deleteConfirm?.ref}</strong>? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={()=>setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={()=>deleteConfirm&&handleDelete(deleteConfirm)}><Trash2 className="w-4 h-4 mr-2"/>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
