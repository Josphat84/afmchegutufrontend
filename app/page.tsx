'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, TrendingDown, Users, CalendarDays, Clock,
  BookOpen, Bell, MapPin, Phone, Heart, Gift, Music, Video,
  Package, LogIn, ChevronLeft, ChevronRight, Pause, Play,
  ArrowRight, PlayCircle, HeartHandshake, Wallet, Shield,
  Flower, Baby, BarChart3, Receipt, FileText, CheckCircle,
  AlertTriangle, Star, Mail, Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthForm } from '@/components/AuthForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== ANIMATION STYLES ===============
const animationStyles = `
  @keyframes fade-in-up-slow {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes ken-burns {
    0% { transform: scale(1); }
    100% { transform: scale(1.08); }
  }
  .animate-fade-in-up-slow { animation: fade-in-up-slow 1.8s ease-out forwards; }
  .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
  .animate-ken-burns { animation: ken-burns 20s ease-in-out infinite alternate; }
`;

// =============== BACKGROUND IMAGES ===============
const backgroundImages = [
  { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=90&w=2070", caption: "A family of believers dedicated to the apostolic doctrine." },
  { url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=90&w=2073", caption: "Where faith comes alive" },
  { url: "https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=90&w=2070", caption: "Encounter God through powerful worship" },
  { url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=90&w=2070", caption: "A house of prayer for all nations" },
  { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=90&w=2089", caption: "Growing together in faith and love" },
];

// =============== TYPES ===============
type ColorType = 'purple' | 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'emerald' | 'cyan' | 'rose' | 'pink' | 'orange' | 'teal';

interface UserData { id: number; email: string; name: string; role: string; churchName?: string; avatar?: string; }

interface ExpenseStats {
  total: number; pending_count: number; approved_count: number; rejected_count: number;
  total_approved_amount: number; total_pending_amount: number;
}
interface PaymentStats { total: number; total_amount: number; today_total: number; }
interface Event {
  id: string; title: string; event_start_date?: string; event_start_time?: string;
  location?: string; venue?: string; type: string; is_published: boolean; excerpt?: string; featured_image?: string;
}

// =============== MANAGEMENT PAGES ===============
const MGMT_PAGES = [
  { title: "Believers Directory", description: "Member profiles, departments, positions and contact details.", icon: Users,     href: "/directory", color: "blue"   as ColorType },
  { title: "Payments & Offerings", description: "Issue formal receipts for tithes, offerings and donations.",  icon: Wallet,    href: "/receipts", color: "green"  as ColorType },
  { title: "Expense Management",  description: "Track, approve and analyse church expenditure and budgets.",   icon: Receipt,   href: "/expenses", color: "purple" as ColorType },
  { title: "Events & Notices",    description: "Manage upcoming events, announcements and RSVPs.",             icon: CalendarDays, href: "/events", color: "amber"  as ColorType },
  { title: "Equipment Inventory", description: "Track church equipment, status and maintenance schedules.",    icon: Package,   href: "/equipment",color: "teal"   as ColorType },
];

// =============== DEPARTMENTS ===============
const DEPARTMENTS = [
  { name: "Ladies Fellowship",  icon: Heart,         description: "Virtuous women building godly homes.",              color: "rose"   as ColorType },
  { name: "Youth Ministry",     icon: Users,         description: "Empowering the next generation for Christ.",        color: "blue"   as ColorType },
  { name: "Sunday School",      icon: BookOpen,      description: "Nurturing children in the way of the Lord.",        color: "green"  as ColorType },
  { name: "Men's Fellowship",   icon: HeartHandshake,description: "Raising godly men for the family and church.",      color: "purple" as ColorType },
  { name: "Choir",              icon: Music,         description: "Leading the congregation in worship through song.",  color: "amber"  as ColorType },
  { name: "Prayer Team",        icon: Heart,         description: "Interceding for the church and community.",         color: "indigo" as ColorType },
];

const PASTORS = {
  name: "Rev. Lirani & Mrs Lirani",
  title: "Senior Pastors, AFM Chegutu Assembly",
  message: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. (Jeremiah 29:11) Dear friends, it is our joy to welcome you to AFM Chegutu. Whether you are searching for faith, looking for a church home, or simply curious, you are welcome here.",
  image: "https://images.unsplash.com/photo-1566492031773-4fbd0d1d8f8b",
};

// =============== HELPERS ===============
function getColorClasses(color: ColorType) {
  const m: Record<ColorType, { light: string; icon: string; border: string }> = {
    purple:  { light: 'bg-purple-100/70',  icon: 'text-purple-700',  border: 'border-purple-200/60'  },
    blue:    { light: 'bg-blue-100/70',    icon: 'text-blue-700',    border: 'border-blue-200/60'    },
    green:   { light: 'bg-green-100/70',   icon: 'text-green-700',   border: 'border-green-200/60'   },
    amber:   { light: 'bg-amber-100/70',   icon: 'text-amber-700',   border: 'border-amber-200/60'   },
    red:     { light: 'bg-red-100/70',     icon: 'text-red-700',     border: 'border-red-200/60'     },
    indigo:  { light: 'bg-indigo-100/70',  icon: 'text-indigo-700',  border: 'border-indigo-200/60'  },
    emerald: { light: 'bg-emerald-100/70', icon: 'text-emerald-700', border: 'border-emerald-200/60' },
    cyan:    { light: 'bg-cyan-100/70',    icon: 'text-cyan-700',    border: 'border-cyan-200/60'    },
    rose:    { light: 'bg-rose-100/70',    icon: 'text-rose-700',    border: 'border-rose-200/60'    },
    pink:    { light: 'bg-pink-100/70',    icon: 'text-pink-700',    border: 'border-pink-200/60'    },
    orange:  { light: 'bg-orange-100/70',  icon: 'text-orange-700',  border: 'border-orange-200/60'  },
    teal:    { light: 'bg-teal-100/70',    icon: 'text-teal-700',    border: 'border-teal-200/60'    },
  };
  return m[color];
}

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// =============== BACKGROUND SLIDESHOW ===============
function BackgroundSlideshow() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx(p => (p + 1) % backgroundImages.length), 120000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="fixed inset-0 z-0">
      {backgroundImages.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000 ease-in-out" style={{ opacity: i === idx ? 1 : 0 }}>
          <div className="absolute inset-0 animate-ken-burns"
            style={{ backgroundImage: `url('${img.url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" />
        </div>
      ))}

      <button onClick={() => setIdx(p => (p - 1 + backgroundImages.length) % backgroundImages.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={() => setIdx(p => (p + 1) % backgroundImages.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button onClick={() => setPlaying(p => !p)}
          className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white transition">
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
        {backgroundImages.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* Caption */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-white/70 text-sm text-center italic">
        {backgroundImages[idx].caption}
      </div>
    </div>
  );
}

// =============== SMALL COMPONENTS ===============
function MinistryCard({ name, icon: Icon, description, color }: { name: string; icon: React.ElementType; description: string; color: ColorType }) {
  const c = getColorClasses(color);
  return (
    <Card className="border-purple-200/40 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={`p-3 rounded-xl ${c.light} w-fit mb-4`}><Icon className={`h-6 w-6 ${c.icon}`} /></div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }: { event: Event }) {
  const dateStr = event.event_start_date
    ? new Date(event.event_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recurring';
  const timeStr = event.event_start_time ? event.event_start_time.slice(0, 5) : '';
  const place = event.venue || event.location || '';
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100 flex items-start gap-4 hover:shadow-md transition">
      <div className="p-3 rounded-lg bg-purple-100 flex-shrink-0">
        <CalendarDays className="h-5 w-5 text-purple-700" />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-gray-800 leading-tight">{event.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{dateStr}{timeStr ? ` · ${timeStr}` : ''}</p>
        {place && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 flex-shrink-0" />{place}</p>}
        {event.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.excerpt}</p>}
      </div>
    </div>
  );
}

function MgmtCard({ page, index }: { page: typeof MGMT_PAGES[0]; index: number }) {
  const Icon = page.icon;
  const c = getColorClasses(page.color);
  return (
    <Link href={page.href} className="block group animate-fade-in-up-slow" style={{ animationDelay: `${index * 60}ms` }}>
      <Card className="h-full bg-white/90 backdrop-blur-sm border-purple-200/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <CardContent className="p-6">
          <div className={`p-3 rounded-xl ${c.light} w-fit mb-4`}>
            <Icon className={`h-6 w-6 ${c.icon}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">{page.title}</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{page.description}</p>
          <div className="flex items-center text-purple-700 font-medium text-sm">
            <span>Open</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// =============== ADMIN DASHBOARD ===============
function AdminDashboard({ user, churchName }: { user: UserData; churchName: string }) {
  const [expStats, setExpStats] = useState<ExpenseStats | null>(null);
  const [payStats, setPayStats] = useState<PaymentStats | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/expenses/stats/overview`).then(r => r.json()).then(setExpStats).catch(() => {});
    fetch(`${API_BASE_URL}/payments/stats/overview`).then(r => r.json()).then(setPayStats).catch(() => {});
    fetch(`${API_BASE_URL}/directory/?limit=1`, { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.headers.get('x-total-count') ? parseInt(r.headers.get('x-total-count')!) : r.json().then((d: unknown[]) => d.length))
      .then(setMemberCount).catch(() => {});
    fetch(`${API_BASE_URL}/events/?limit=3`).then(r => r.json()).then((data: Event[]) =>
      setUpcomingEvents(data.filter(e => e.is_published).slice(0, 3))
    ).catch(() => {});
  }, []);

  const net = (payStats?.total_amount ?? 0) - (expStats?.total_approved_amount ?? 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name}!</h1>
        <p className="text-purple-200 text-sm">{churchName} · Management Dashboard</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members',     value: memberCount !== null ? String(memberCount) : '—',              icon: Users,      bg: 'bg-blue-600'   },
          { label: 'Total Income',      value: payStats ? fmt(payStats.total_amount) : '—',                   icon: TrendingUp, bg: 'bg-green-600'  },
          { label: 'Approved Expenses', value: expStats ? fmt(expStats.total_approved_amount) : '—',          icon: Receipt,    bg: 'bg-purple-600' },
          { label: 'Net Position',      value: expStats && payStats ? fmt(net) : '—',                         icon: BarChart3,  bg: net >= 0 ? 'bg-teal-600' : 'bg-orange-600' },
        ].map(m => (
          <div key={m.label} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{m.label}</p>
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Alert: pending expenses */}
      {expStats && expStats.pending_count > 0 && (
        <Link href="/expenses">
          <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-xl p-4 flex items-center gap-3 hover:bg-amber-100/90 transition cursor-pointer">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {expStats.pending_count} expense{expStats.pending_count !== 1 ? 's' : ''} awaiting approval — {fmt(expStats.total_pending_amount)}
              </p>
              <p className="text-xs text-amber-600">Click to review in Expense Manager</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </div>
        </Link>
      )}

      {/* Quick actions + upcoming events */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Management pages */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 drop-shadow">Management Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MGMT_PAGES.map((p, i) => <MgmtCard key={p.href} page={p} index={i} />)}
          </div>
        </div>

        {/* Upcoming events from API */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white drop-shadow">Upcoming Events</h2>
            <Link href="/events" className="text-xs text-purple-200 hover:text-white underline">View all →</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-center text-white/60 border border-white/20">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}

          {/* Today's receipts */}
          {payStats && (
            <div className="mt-4 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Today's offerings</p>
                <p className="text-xl font-bold text-green-700">{fmt(payStats.today_total)}</p>
              </div>
              <Link href="/receipts" className="ml-auto text-xs text-green-700 underline hover:text-green-900">Open →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============== MAIN PAGE ===============
export default function ChurchPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [loading, setLoading] = useState(true);
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const church   = localStorage.getItem('church');
    if (token && userData) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
        if (church) setChurchName(church);
      } catch {
        ['token','user','church'].forEach(k => localStorage.removeItem(k));
      }
    }
    setLoading(false);

    // Load public events regardless of login state
    fetch(`${API_BASE_URL}/events/?limit=4`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Event[]) => setPublicEvents(data.filter(e => e.is_published).slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-purple-800 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />
      <BackgroundSlideshow />

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12">
          {isLoggedIn && user ? (
            <AdminDashboard user={user} churchName={churchName} />
          ) : (
            <>
              {/* ── HERO ── */}
              <section className="text-center mb-20 animate-fade-in-up-slow pt-8">
                <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Apostolic Faith Mission · Chegutu Town Assembly
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                  AFM Chegutu Town
                </h1>
                <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                  A family of believers dedicated to the apostolic doctrine — come as you are, leave transformed.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="#visit">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl">
                      Plan Your Visit
                    </Button>
                  </a>
                  <Link href="/receipts">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                      <Gift className="w-4 h-4 mr-2" /> Give Online
                    </Button>
                  </Link>
                </div>
              </section>

              {/* ── PASTOR'S WELCOME ── */}
              <section className="mb-20">
                <div className="flex flex-col md:flex-row gap-10 items-center bg-white/85 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
                  <div className="md:w-1/3 flex-shrink-0">
                    <img src={PASTORS.image} alt="Pastors" className="rounded-xl shadow-lg w-full object-cover aspect-square" />
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-3">A Word From Our Pastors</p>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to AFM Chegutu</h2>
                    <p className="text-gray-600 italic mb-6 leading-relaxed">"{PASTORS.message}"</p>
                    <p className="font-bold text-purple-800">{PASTORS.name}</p>
                    <p className="text-sm text-gray-500">{PASTORS.title}</p>
                  </div>
                </div>
              </section>

              {/* ── SERVICE TIMES banner ── */}
              <section className="mb-20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: CalendarDays, label: 'Sunday Worship',  detail: '09:00 AM · Main Sanctuary' },
                    { icon: BookOpen,     label: 'Bible Study',     detail: 'Wednesdays · 05:30 PM' },
                    { icon: Music,        label: 'Youth Night',     detail: 'Fridays · 07:00 PM' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-5 flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{s.label}</p>
                        <p className="text-sm text-white/70">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── MINISTRIES ── */}
              <section className="mb-20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white drop-shadow mb-2">Our Assembly</h2>
                  <p className="text-purple-200">Departments and ministries serving together</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DEPARTMENTS.map(d => <MinistryCard key={d.name} {...d} />)}
                </div>
              </section>

              {/* ── EVENTS ── */}
              <section className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white drop-shadow">Upcoming Events</h2>
                    <p className="text-purple-200 text-sm mt-1">What's happening at AFM Chegutu</p>
                  </div>
                  <Link href="/events" className="text-purple-200 hover:text-white underline underline-offset-2 text-sm">
                    View all →
                  </Link>
                </div>
                {publicEvents.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-10 text-center text-white/60 border border-white/20">
                    <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No upcoming events at the moment. Check back soon.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {publicEvents.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                )}
              </section>

              {/* ── GIVING CTA ── */}
              <section className="mb-20">
                <div className="bg-gradient-to-r from-purple-800/85 to-blue-800/85 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Support Our Assembly</h2>
                  <p className="text-purple-100 max-w-xl mx-auto mb-8 leading-relaxed">
                    Your generous giving enables us to reach our community, support our ministries, and fulfil the Great Commission.
                  </p>
                  <Link href="/receipts">
                    <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100 shadow-xl font-bold">
                      <Gift className="w-5 h-5 mr-2" /> Give Now
                    </Button>
                  </Link>
                </div>
              </section>

              {/* ── CONTACT / VISIT ── */}
              <section id="visit" className="mb-10">
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Come Visit Us</h2>
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">Address</p>
                      <p className="text-sm text-gray-600">Hintonville, Chegutu</p>
                      <p className="text-sm text-gray-600">Zimbabwe</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">Service Times</p>
                      <p className="text-sm text-gray-600">Sunday · 09:00 AM</p>
                      <p className="text-sm text-gray-600">Wednesday · 05:30 PM</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <Phone className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">Contact</p>
                      <p className="text-sm text-gray-600">+263 77 123 4567</p>
                      <p className="text-sm text-gray-600">info@afmchegutu.org</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
