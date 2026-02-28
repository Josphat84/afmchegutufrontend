'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calculator,
  FileText,
  Users,
  UserPlus,
  CalendarDays,
  Clock,
  Video,
  BookOpen,
  Church,
  Bell,
  Mail,
  MapPin,
  Phone,
  Heart,
  Gift,
  Cross,
  Music,
  Mic,
  Camera,
  Wifi,
  FileCheck,
  ClipboardCheck,
  Settings,
  Shield,
  Database,
  Layers,
  Server,
  BarChart3,
  LineChart,
  Eye,
  AlertTriangle,
  Package,
  LogIn,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ChevronUp,
  Download,
  Upload,
  Printer,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Volume2,
  Film,
  MessageSquare,
  ThumbsUp,
  Star,
  Award,
  Trophy,
  Crown,
  Gem,
  HeartHandshake,
  HandCoins,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  CalendarRange,
  UsersRound,
  UserCheck,
  UserX,
  Baby,
  HeartPulse,
  Stethoscope,
  BookHeart,
  BookMarked,
  Library,
  Newspaper,
  Podcast,
  Radio,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Mailbox,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Projector,
  Speaker,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// =============== IMPORTED COMPONENTS ===============
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthForm } from '@/components/AuthForm';

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
  .animate-fade-in-up-slow {
    animation: fade-in-up-slow 1.8s ease-out forwards;
  }
  .animate-float-slow {
    animation: float-slow 4s ease-in-out infinite;
  }
`;

// =============== TYPES ===============
type ColorType = 'purple' | 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'emerald' | 'cyan' | 'rose';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  churchName?: string;
  avatar?: string;
}

// =============== FEATURE PAGES DATA ===============
const FEATURE_PAGES = [
  {
    title: "Believers Directory",
    description: "Complete member management with personal details, departments, positions, and church involvement tracking.",
    icon: Users,
    href: "/directory",
    color: "blue" as ColorType,
    stats: "Manage 500+ members"
  },
  {
    title: "Payments & Offerings",
    description: "Record tithes, offerings, and donations with automatic receipt generation and PDF downloads.",
    icon: Wallet,
    href: "/receipts",
    color: "green" as ColorType,
    stats: "Track finances"
  },
  {
    title: "Equipment Directory",
    description: "Inventory management for church equipment including status, maintenance schedules, and assignment tracking.",
    icon: Package,
    href: "/equipment",
    color: "amber" as ColorType,
    stats: "Manage assets"
  },
  {
    title: "Events & Notices",
    description: "Upcoming church events, announcements, and calendar management with RSVP functionality.",
    icon: CalendarDays,
    href: "/events",
    color: "purple" as ColorType,
    stats: "Stay updated"
  },
];

// =============== PUBLIC CHURCH DATA ===============
const DEPARTMENTS = [
  { name: "Ladies Fellowship", icon: Heart, description: "Virtuous women building godly homes.", color: "rose" as ColorType },
  { name: "Youth Ministry", icon: Users, description: "Empowering the next generation for Christ.", color: "blue" as ColorType },
  { name: "Sunday School", icon: BookOpen, description: "Nurturing children in the way of the Lord.", color: "green" as ColorType },
  { name: "Men's Fellowship", icon: HeartHandshake, description: "Raising godly men for the family and church.", color: "purple" as ColorType },
  { name: "Choir", icon: Music, description: "Leading the congregation in worship through song.", color: "amber" as ColorType },
  { name: "Prayer Team", icon: Heart, description: "Interceding for the church and community.", color: "indigo" as ColorType },
];

const UPCOMING_EVENTS = [
  { id: 1, title: "Sunday Worship Service", date: "Every Sunday", time: "09:00 AM", location: "Main Sanctuary" },
  { id: 2, title: "Midweek Bible Study", date: "Wednesdays", time: "06:00 PM", location: "Fellowship Hall" },
  { id: 3, title: "Youth Night", date: "Fridays", time: "07:00 PM", location: "Youth Center" },
  { id: 4, title: "Women's Conference", date: "March 15-17", time: "09:00 AM", location: "Civic Centre" },
];

const LATEST_SERMONS = [
  { id: 1, title: "The Power of Prayer", speaker: "Rev. Lirani", date: "Feb 15, 2026", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3" },
  { id: 2, title: "Walking by Faith", speaker: "Mrs. Lirani", date: "Feb 08, 2026", image: "https://images.unsplash.com/photo-1490730141103-6ac217a94b88" },
];

const PASTORS = {
  name: "Rev. Lirani & Mrs Lirani",
  title: "Senior Pastors",
  message: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. (Jeremiah 29:11) Dear friends, it is our joy to welcome you to AFM Chegutu. Whether you are searching for faith, looking for a church home, or simply curious, you are welcome here.",
  image: "https://images.unsplash.com/photo-1566492031773-4fbd0d1d8f8b",
};

// =============== DASHBOARD DATA (when logged in) ===============
interface FinancialMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}

interface QuickAction {
  icon: any;
  label: string;
  color: ColorType;
  link: string;
}

interface ServiceSchedule {
  id: number;
  title: string;
  time: string;
  date: string;
  type: string;
  speaker: string;
  location: string;
  attendees: number;
}

interface RecentDonation {
  id: number;
  name: string;
  amount: number;
  type: string;
  date: string;
  status: 'completed' | 'pending';
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'conference' | 'meeting' | 'service' | 'outreach';
  attendees: number;
}

// Helper for dashboard colors
function getColorClasses(color: ColorType) {
  const colorMap: Record<ColorType, { light: string; icon: string; border: string }> = {
    purple: { light: 'bg-purple-100/70', icon: 'text-purple-700', border: 'border-purple-200/60' },
    blue: { light: 'bg-blue-100/70', icon: 'text-blue-700', border: 'border-blue-200/60' },
    green: { light: 'bg-green-100/70', icon: 'text-green-700', border: 'border-green-200/60' },
    amber: { light: 'bg-amber-100/70', icon: 'text-amber-700', border: 'border-amber-200/60' },
    red: { light: 'bg-red-100/70', icon: 'text-red-700', border: 'border-red-200/60' },
    indigo: { light: 'bg-indigo-100/70', icon: 'text-indigo-700', border: 'border-indigo-200/60' },
    emerald: { light: 'bg-emerald-100/70', icon: 'text-emerald-700', border: 'border-emerald-200/60' },
    cyan: { light: 'bg-cyan-100/70', icon: 'text-cyan-700', border: 'border-cyan-200/60' },
    rose: { light: 'bg-rose-100/70', icon: 'text-rose-700', border: 'border-rose-200/60' },
  };
  return colorMap[color];
}

// =============== PUBLIC PAGE SECTIONS ===============
function MinistryCard({ name, icon: Icon, description, color }: { name: string; icon: any; description: string; color: ColorType }) {
  const colors = getColorClasses(color);
  return (
    <Card className="border-purple-200/40 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={`p-3 rounded-xl ${colors.light} w-fit mb-4`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }: { event: typeof UPCOMING_EVENTS[0] }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100 flex items-start gap-4 hover:shadow-md transition">
      <div className="p-3 rounded-lg bg-purple-100">
        <CalendarDays className="h-5 w-5 text-purple-700" />
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{event.title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {event.date} at {event.time}
        </p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {event.location}
        </p>
      </div>
    </div>
  );
}

function SermonCard({ sermon }: { sermon: typeof LATEST_SERMONS[0] }) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition">
      <div className="relative h-48 overflow-hidden">
        <img src={sermon.image} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
          <span>{sermon.date}</span>
          <span>•</span>
          <span>{sermon.speaker}</span>
        </div>
        <h4 className="font-bold text-gray-800 group-hover:text-purple-700 transition">{sermon.title}</h4>
      </div>
    </div>
  );
}

// =============== FEATURE CARD COMPONENT ===============
function FeatureCard({ feature, index }: { feature: typeof FEATURE_PAGES[0]; index: number }) {
  const Icon = feature.icon;
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };
  
  return (
    <Link href={feature.href} className="block group animate-fade-in-up-slow" style={{ animationDelay: `${index * 100}ms` }}>
      <Card className="h-full bg-white/90 backdrop-blur-sm border-purple-200/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors[feature.color as keyof typeof colors]} bg-opacity-80`}>
              <Icon className={`h-6 w-6`} />
            </div>
            <Badge variant="outline" className="bg-white/50">
              {feature.stats}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {feature.description}
          </p>
          
          <div className="flex items-center text-purple-700 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Access Page</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// =============== DASHBOARD COMPONENTS (when logged in) ===============
function DashboardMetric({ metric }: { metric: FinancialMetric }) {
  const Icon = metric.icon;
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${metric.trend === 'up' ? 'bg-green-100' : metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'}`}>
            <Icon className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
          {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : metric.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
          {metric.change}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
    </div>
  );
}

function DashboardQuickAction({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  const colors = getColorClasses(action.color);
  return (
    <Link href={action.link} className="group block">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-100 hover:shadow-2xl hover:scale-[1.02] transition">
        <div className={`p-3 rounded-lg ${colors.light} w-fit mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
        <span className="text-sm font-medium text-gray-800">{action.label}</span>
      </div>
    </Link>
  );
}

// =============== MAIN PAGE ===============
export default function ChurchPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('Grace Community Church');
  const [loading, setLoading] = useState(true);

  // Mock dashboard data (only used when logged in)
  const financialMetrics: FinancialMetric[] = [
    { label: 'Monthly Tithes', value: '$28,450', change: '+15.2%', trend: 'up', icon: DollarSign },
    { label: 'Weekly Offerings', value: '$8,920', change: '+8.5%', trend: 'up', icon: Gift },
    { label: 'Annual Budget', value: '$350,000', change: 'On Track', trend: 'neutral', icon: PieChart },
    { label: 'Outreach Funds', value: '$12,500', change: '+22.1%', trend: 'up', icon: HeartHandshake },
  ];
  const quickActions: QuickAction[] = [
    { icon: UserPlus, label: 'Add Member', color: 'blue', link: '/members/add' },
    { icon: DollarSign, label: 'Record Donation', color: 'green', link: '/donations/add' },
    { icon: CalendarDays, label: 'Schedule Event', color: 'purple', link: '/events/add' },
    { icon: Video, label: 'Start Live Stream', color: 'red', link: '/live' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const church = localStorage.getItem('church');
    if (token && userData) {
      try {
        const parsedUser: UserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        if (church) setChurchName(church);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('church');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('church');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-purple-800 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
            filter: 'brightness(1.05) contrast(1.1) saturate(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-blue-900/30" />
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12">
          {isLoggedIn ? (
            // ---------- ADMIN DASHBOARD (when logged in) ----------
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-purple-100">Manage {churchName}</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action) => (
                  <DashboardQuickAction key={action.label} action={action} />
                ))}
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {financialMetrics.map((metric) => (
                  <DashboardMetric key={metric.label} metric={metric} />
                ))}
              </div>

              {/* Placeholder for more dashboard content */}
              <Card className="bg-white/90 backdrop-blur-sm border-purple-200/40">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <p className="text-gray-600">Your full dashboard with members, donations, and reports will appear here.</p>
                </CardContent>
              </Card>
            </>
          ) : (
            // ---------- PUBLIC CHURCH WEBSITE (when not logged in) ----------
            <>
              {/* Hero Section */}
              <section className="text-center mb-16 animate-fade-in-up-slow">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  AFM Chegutu Town
                </h1>
                <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
                  A family of believers dedicated to the apostolic doctrine.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Plan Your Visit
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                    Watch Live
                  </Button>
                </div>
              </section>

              {/* ========== FEATURED PAGES SECTION ========== */}
              <section className="mb-20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                    Church Management Tools
                  </h2>
                  <p className="text-lg text-purple-100 max-w-2xl mx-auto">
                    Everything you need to manage your church effectively in one place
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FEATURE_PAGES.map((feature, index) => (
                    <FeatureCard key={feature.href} feature={feature} index={index} />
                  ))}
                </div>
              </section>

              {/* Pastor's Welcome */}
              <section className="mb-20">
                <div className="flex flex-col md:flex-row gap-10 items-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
                  <div className="md:w-1/3">
                    <img src={PASTORS.image} alt="Pastors" className="rounded-xl shadow-lg w-full h-auto object-cover" />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">A Word From Our Pastors</h2>
                    <p className="text-gray-600 italic mb-4">"{PASTORS.message}"</p>
                    <p className="font-bold text-purple-800">{PASTORS.name}</p>
                    <p className="text-sm text-gray-500">{PASTORS.title}</p>
                  </div>
                </div>
              </section>

              {/* Ministries */}
              <section className="mb-20">
                <h2 className="text-3xl font-bold text-white text-center mb-10 drop-shadow">Our Assembly</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DEPARTMENTS.map((dept) => (
                    <MinistryCard key={dept.name} {...dept} />
                  ))}
                </div>
              </section>

              {/* Upcoming Events & Sermons */}
              <div className="grid lg:grid-cols-2 gap-10 mb-20">
                {/* Events */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 drop-shadow">Upcoming Events</h2>
                  <div className="space-y-4">
                    {UPCOMING_EVENTS.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/events" className="text-purple-200 hover:text-white underline underline-offset-2">
                      View All Events →
                    </Link>
                  </div>
                </div>

                {/* Sermons */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 drop-shadow">Latest Sermons</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {LATEST_SERMONS.map((sermon) => (
                      <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/sermons" className="text-purple-200 hover:text-white underline underline-offset-2">
                      More Sermons →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Giving */}
              <section className="mb-20 text-center">
                <div className="bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm rounded-2xl p-10 border border-white/20">
                  <h2 className="text-3xl font-bold text-white mb-4">Support Our Assembly</h2>
                  <p className="text-purple-100 max-w-2xl mx-auto mb-6">
                    Your generous giving helps us reach our community with the love of Christ.
                  </p>
                  <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
                    Give Online
                  </Button>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Visit Us</h2>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-gray-600">Hintonville, Chegutu, Zimbabwe</p>
                    </div>
                    <div>
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-semibold">Service Times</p>
                      <p className="text-sm text-gray-600">Sunday 09:00 | Wednesday 17:30</p>
                    </div>
                    <div>
                      <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-semibold">Contact</p>
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