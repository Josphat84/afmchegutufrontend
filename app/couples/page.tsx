// app/couples/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Heart, 
  Star,
  Music,
  Coffee,
  Camera,
  Award,
  Clock,
  User,
  MessageCircle,
  Share2,
  HeartHandshake,
  Sparkles,
  Zap,
  Crown,
  Trophy,
  Gift,
  Rocket,
  Compass,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Church,
  Cross,
  HandHeart,
  Shield,
  Target,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Briefcase,
  GraduationCap,
  Laptop,
  Palette,
  Dumbbell,
  Utensils,
  Car,
  Plane,
  Mountain,
  Baby,
  Smile,
  Book,
  Pencil,
  Flower,
  Trees,
  Cloud,
  Sun,
  Moon,
  Rainbow,
  Home,
  Building2,
  Wine,
  PartyPopper,
  Cake,
  Gem,
  Infinity,
  Hand,
  Bell,
  CheckCircle,
  Users2,
  MessageSquare,
  Video,
  Mic,
  Headphones,
} from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

// Import Header and Footer
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

// =============== EDITABLE CONTENT ===============

const COUPLES_INFO = {
  name: 'Two Becoming One',
  tagline: 'Building strong marriages that honor God and bless families!',
  founded: 2012,
  couples_count: 85,
  meeting_day: 'Friday',
  meeting_time: '6:30 PM - 9:00 PM',
  location: 'Fellowship Hall, AFM Chegutu',
  vision: 'To see every marriage thrive through Christ-centered relationships, open communication, and unconditional love.',
  mission: 'To equip couples with biblical principles, practical tools, and supportive community for lifelong, joyful marriages.',
  email: 'couples@afmchegutu.org',
  phone: '+263 242 123 457',
};

// Marriage Stages
const MARRIAGE_STAGES = [
  {
    id: 1,
    name: 'Newlyweds',
    years: '0-3 years',
    icon: Gem,
    description: 'Building strong foundations, communication skills, and blending two lives together.',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 2,
    name: 'Growing Together',
    years: '4-10 years',
    icon: Trees,
    description: 'Navigating careers, children, and deepening your connection through life\'s changes.',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 3,
    name: 'Established Couples',
    years: '11-20 years',
    icon: Infinity,
    description: 'Renewing commitment, mentoring others, and leaving a legacy of love.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    name: 'Empty Nesters',
    years: '20+ years',
    icon: Home,
    description: 'Rediscovering each other, new adventures, and enjoying the fruits of a lifetime together.',
    color: 'bg-[#86BBD8]/20 text-[#2A4D69]',
  },
];

// Leadership Team
const LEADERSHIP = [
  {
    id: 1,
    name: 'Pastor John & Mary Chikowero',
    title: 'Couples Ministry Directors',
    bio: 'Married for 28 years, John and Mary have a passion for helping couples build Christ-centered marriages. They have 3 children and 2 grandchildren.',
    email: 'john.mary@afmchegutu.org',
  },
  {
    id: 2,
    name: 'Elder Thomas & Grace Moyo',
    title: 'Marriage Mentors',
    bio: 'With 35 years of marriage experience, Thomas and Grace lead our premarital counseling and marriage enrichment programs.',
    email: 'thomas.grace@afmchegutu.org',
  },
  {
    id: 3,
    name: 'Dr. Samuel & Ruth Ndlovu',
    title: 'Counseling Coordinators',
    bio: 'Samuel is a licensed Christian counselor and Ruth is a life coach. Together they facilitate our marriage workshops and retreats.',
    email: 'samuel.ruth@afmchegutu.org',
  },
  {
    id: 4,
    name: 'David & Sarah Chikwanda',
    title: 'Young Couples Coordinators',
    bio: 'Married for 6 years with two young children, David and Sarah understand the unique challenges facing young couples today.',
    email: 'david.sarah@afmchegutu.org',
  },
];

// Weekly Activities
const WEEKLY_ACTIVITIES = [
  {
    id: 1,
    day: 'Friday',
    activities: [
      '6:30 PM - Dinner & Fellowship',
      '7:15 PM - Worship & Prayer',
      '7:45 PM - Teaching & Discussion',
      '8:30 PM - Small Group Breakouts',
      '9:00 PM - Dessert & Connection',
    ],
  },
  {
    id: 2,
    day: 'Wednesday',
    activities: [
      '7:00 PM - Midweek Prayer for Marriages',
      '8:00 PM - Online Bible Study (Zoom)',
    ],
  },
  {
    id: 3,
    day: 'Saturday',
    activities: [
      '9:00 AM - Monthly Couples Breakfast (First Saturday)',
      '3:00 PM - Date Night Planning Workshop (Second Saturday)',
    ],
  },
];

// Special Events
const SPECIAL_EVENTS = [
  {
    id: 1,
    title: 'Marriage Retreat 2024',
    date: 'October 18-20, 2024',
    location: 'Victoria Falls Resort',
    description: 'A weekend getaway to refresh your marriage! Includes worship, teaching, date nights, and adventure activities.',
    cost: '$250 per couple',
    spots_left: 15,
  },
  {
    id: 2,
    title: 'Valentine\'s Dinner & Dance',
    date: 'February 14, 2025',
    location: 'AFM Chegutu Convention',
    description: 'Romantic evening with fine dining, live music, dancing, and a special message on love.',
    cost: '$60 per couple',
    spots_left: 50,
  },
  {
    id: 3,
    title: 'Premarital Counseling Course',
    date: 'Starts January 11, 2025',
    location: 'Church Conference Room',
    description: '8-week course for engaged and seriously dating couples covering communication, finances, intimacy, and conflict resolution.',
    cost: '$40 per couple',
    spots_left: 12,
  },
  {
    id: 4,
    title: 'Couples Game Night',
    date: 'Monthly - Last Friday',
    location: 'Fellowship Hall',
    description: 'Fun, laughter, and friendly competition! Bring your favorite board game and a snack to share.',
    cost: 'Free',
    spots_left: 100,
  },
];

// Programs & Resources
const PROGRAMS = [
  {
    id: 1,
    title: 'Marriage Mentoring',
    description: 'Connect with an experienced couple for guidance, support, and friendship.',
    icon: HeartHandshake,
  },
  {
    id: 2,
    title: 'Date Night Ideas',
    description: 'Monthly curated date night ideas, local recommendations, and creative ways to connect.',
    icon: Coffee,
  },
  {
    id: 3,
    title: 'Financial Peace for Couples',
    description: 'Biblical principles for managing money together without conflict.',
    icon: DollarSign,
  },
  {
    id: 4,
    title: 'Communication Workshop',
    description: 'Learn to listen, understand, and speak each other\'s love language.',
    icon: MessageSquare,
  },
  {
    id: 5,
    title: 'Prayer Partners',
    description: 'Commit to praying together daily and watch God transform your marriage.',
    icon: Hand,
  },
  {
    id: 6,
    title: 'Parenting Together',
    description: 'Navigate parenting challenges as a united team.',
    icon: Baby,
  },
  {
    id: 7,
    title: 'Couples Book Club',
    description: 'Read and discuss marriage-building books together.',
    icon: Book,
  },
  {
    id: 8,
    title: 'Adventure Dates',
    description: 'Monthly group outings for hiking, dancing, cooking classes, and more.',
    icon: Mountain,
  },
];

// Marriage Principles
const PRINCIPLES = [
  {
    id: 1,
    title: 'Christ at the Center',
    description: 'A threefold cord is not quickly broken. Keep God first in your marriage.',
    icon: Cross,
    verse: 'Ecclesiastes 4:12',
  },
  {
    id: 2,
    title: 'Unconditional Love',
    description: 'Love bears all things, believes all things, hopes all things, endures all things.',
    icon: Heart,
    verse: '1 Corinthians 13:7',
  },
  {
    id: 3,
    title: 'Servant Leadership',
    description: 'Husbands, love your wives as Christ loved the church and gave Himself for her.',
    icon: Crown,
    verse: 'Ephesians 5:25',
  },
  {
    id: 4,
    title: 'Mutual Respect',
    description: 'Submit to one another out of reverence for Christ.',
    icon: HandHeart,
    verse: 'Ephesians 5:21',
  },
  {
    id: 5,
    title: 'Forgiveness',
    description: 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.',
    icon: Sparkles,
    verse: 'Ephesians 4:32',
  },
  {
    id: 6,
    title: 'Unity',
    description: 'What God has joined together, let no one separate.',
    icon: Infinity,
    verse: 'Mark 10:9',
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    couple: 'Michael & Precious Banda',
    years_married: 8,
    text: 'This ministry saved our marriage. Through mentoring and the Friday night gatherings, we learned to communicate and pray together. We\'re stronger than ever!',
  },
  {
    id: 2,
    couple: 'Tendai & Chipo Moyo',
    years_married: 15,
    text: 'The marriage retreat was a game-changer for us. We reconnected in ways we hadn\'t experienced in years. Thank you, Couples Ministry!',
  },
  {
    id: 3,
    couple: 'James & Lisa Makoni',
    years_married: 3,
    text: 'As newlyweds, we felt so welcomed. The mentorship program paired us with an amazing couple who has guided us through our first years of marriage.',
  },
  {
    id: 4,
    couple: 'Pastor David & Esther Ncube',
    years_married: 25,
    text: 'Even after 25 years of marriage and ministry, we find refreshment and encouragement in this community. Every couple needs this!',
  },
];

// Date Night Ideas
const DATE_NIGHT_IDEAS = [
  { id: 1, title: 'Sunset Picnic', location: 'Cleveland Dam', cost: 'Free', icon: Sun },
  { id: 2, title: 'Cooking Class Together', location: 'The Culinary Studio', cost: '$40', icon: Utensils },
  { id: 3, title: 'Hiking Adventure', location: 'Domboshava Hills', cost: '$5 entry', icon: Mountain },
  { id: 4, title: 'Coffee & Conversation', location: 'Cafe Bistro', cost: '$10', icon: Coffee },
  { id: 5, title: 'Game Night In', location: 'Your Home', cost: 'Free', icon: PartyPopper },
  { id: 6, title: 'Sunset Cruise', location: 'Lake Chivero', cost: '$30', icon: Compass },
];

// Background images
const backgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=90&w=2070",
    location: "Couple Sunset"
  },
  {
    url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=90&w=2069",
    location: "Couple Walking"
  },
  {
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=90&w=2070",
    location: "Couple Holding Hands"
  },
];

// =============== COMPONENTS ===============

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full bg-rose-100">
          <Icon className="h-6 w-6 text-rose-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const StageCard = ({ stage }: { stage: any }) => {
  const Icon = stage.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${stage.color} shadow-lg`}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <h3 className="font-bold text-foreground text-lg mb-1">{stage.name}</h3>
        <p className="text-sm text-primary font-medium mb-2">{stage.years}</p>
        <p className="text-sm text-muted-foreground">{stage.description}</p>
      </CardContent>
    </Card>
  );
};

const ProgramCard = ({ program }: { program: any }) => {
  const Icon = program.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-100">
            <Icon className="h-5 w-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{program.title}</h4>
            <p className="text-xs text-muted-foreground">{program.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event }: { event: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-rose-100">
          <Calendar className="h-6 w-6 text-rose-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground">{event.title}</h3>
            <Badge variant="outline">{event.cost}</Badge>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          {event.spots_left && (
            <div className="flex items-center justify-between">
              <Badge variant="outline">{event.spots_left} spots left</Badge>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">Register</Button>
            </div>
          )}
          {!event.spots_left && (
            <Button variant="outline" size="sm" className="w-full">Learn More</Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const PrincipleCard = ({ principle }: { principle: any }) => {
  const Icon = principle.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md text-center">
      <CardContent className="p-6">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-rose-100">
            <Icon className="h-6 w-6 text-rose-600" />
          </div>
        </div>
        <h4 className="font-bold text-foreground mb-2">{principle.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{principle.description}</p>
        <Badge variant="outline" className="text-xs">{principle.verse}</Badge>
      </CardContent>
    </Card>
  );
};

const LeadershipCard = ({ person }: { person: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-rose-200">
          <AvatarFallback className="bg-rose-100 text-rose-700 text-lg font-bold">
            {person.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-foreground">{person.name}</h3>
          <p className="text-sm text-rose-600 font-medium">{person.title}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{person.bio}</p>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{person.email}</span>
      </div>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
    <CardContent className="p-6">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
      </div>
      <p className="text-muted-foreground mb-4 italic text-center">"{testimonial.text}"</p>
      <div className="text-center">
        <p className="font-semibold text-foreground">{testimonial.couple}</p>
        <p className="text-xs text-muted-foreground">Married {testimonial.years_married} years</p>
      </div>
    </CardContent>
  </Card>
);

const DateNightCard = ({ idea }: { idea: any }) => {
  const Icon = idea.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-rose-500" />
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm">{idea.title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{idea.location}</span>
              <span>•</span>
              <span>{idea.cost}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============== MAIN PAGE ===============
export default function CouplesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Town Assembly');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ 
    husband_name: '',
    wife_name: '',
    email: '', 
    phone: '', 
    years_married: '',
    message: '' 
  });

  // Rotating wallpaper
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const church = localStorage.getItem('church');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      if (church) setChurchName(church);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('church');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for reaching out! We\'ll contact you soon.');
    setContactDialogOpen(false);
    setRegisterDialogOpen(false);
    setContactForm({ husband_name: '', wife_name: '', email: '', phone: '', years_married: '', message: '' });
  };

  const statsData = [
    { icon: Users2, value: COUPLES_INFO.couples_count.toString(), label: "Couples Connected" },
    { icon: Calendar, value: "15+", label: "Events Yearly" },
    { icon: Heart, value: "20+", label: "Mentor Couples" },
    { icon: Infinity, value: "4", label: "Life Stages" },
  ];

  return (
    <TooltipProvider>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${image.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentWallpaperIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        {/* Romantic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-pink-500/20" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4 gap-2">
                <div className="animate-pulse">
                  <Heart className="h-8 w-8 text-rose-400" />
                </div>
                <div className="animate-pulse delay-100">
                  <Infinity className="h-8 w-8 text-[#86BBD8]/80" />
                </div>
                <div className="animate-pulse delay-200">
                  <Gem className="h-8 w-8 text-pink-400" />
                </div>
                <div className="animate-pulse delay-300">
                  <Crown className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Couples Ministry • Est. {COUPLES_INFO.founded}
              </Badge>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                {COUPLES_INFO.name}
              </h1>
              <p className="text-base sm:text-xl text-white/90 mb-8 leading-relaxed">
                {COUPLES_INFO.tagline}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-rose-600 to-[#2A4D69] hover:from-rose-700 hover:to-[#1e3a52] text-white shadow-lg" onClick={() => setRegisterDialogOpen(true)}>
                  <Heart className="h-5 w-5 mr-2" /> Join Our Community
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" onClick={() => setActiveTab('events')}>
                  Upcoming Events
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto pb-1 mb-8 -mx-1">
                <TabsList className="inline-flex min-w-full sm:w-full sm:grid sm:grid-cols-5 h-11 bg-white/15 backdrop-blur-sm rounded-xl p-1 gap-0.5">
                  <TabsTrigger value="about" className="text-xs sm:text-sm rounded-lg whitespace-nowrap text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#2A4D69] data-[state=active]:shadow-sm">About</TabsTrigger>
                  <TabsTrigger value="stages" className="text-xs sm:text-sm rounded-lg whitespace-nowrap text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#2A4D69] data-[state=active]:shadow-sm">Life Stages</TabsTrigger>
                  <TabsTrigger value="programs" className="text-xs sm:text-sm rounded-lg whitespace-nowrap text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#2A4D69] data-[state=active]:shadow-sm">Programs</TabsTrigger>
                  <TabsTrigger value="events" className="text-xs sm:text-sm rounded-lg whitespace-nowrap text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#2A4D69] data-[state=active]:shadow-sm">Events</TabsTrigger>
                  <TabsTrigger value="resources" className="text-xs sm:text-sm rounded-lg whitespace-nowrap text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#2A4D69] data-[state=active]:shadow-sm">Resources</TabsTrigger>
                </TabsList>
              </div>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-rose-100">
                          <Target className="h-8 w-8 text-rose-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                      <p className="text-muted-foreground leading-relaxed">{COUPLES_INFO.vision}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-[#86BBD8]/20">
                          <Rocket className="h-8 w-8 text-[#2A4D69]" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                      <p className="text-muted-foreground leading-relaxed">{COUPLES_INFO.mission}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Biblical Principles */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Cross className="h-6 w-6" /> Biblical Foundation for Marriage
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PRINCIPLES.map((principle) => (
                      <PrincipleCard key={principle.id} principle={principle} />
                    ))}
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6" /> Weekly Gatherings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {WEEKLY_ACTIVITIES.map((day) => (
                      <Card key={day.day} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold text-center text-rose-700">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Clock className="h-3 w-3 text-rose-500 mt-0.5" />
                                <span className="text-muted-foreground">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Leadership */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Meet Our Leadership Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LEADERSHIP.map((person) => (
                      <LeadershipCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Couples Testimonials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TESTIMONIALS.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Life Stages Tab */}
              <TabsContent value="stages" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Every Season of Marriage Matters</h2>
                  <p className="text-white/80 max-w-2xl mx-auto">
                    Whether you're just starting out or celebrating decades together, we have a place for you.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MARRIAGE_STAGES.map((stage) => (
                    <StageCard key={stage.id} stage={stage} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setRegisterDialogOpen(true)} className="bg-gradient-to-r from-rose-600 to-[#2A4D69]">
                    Find Your Community
                  </Button>
                </div>
              </TabsContent>

              {/* Programs Tab */}
              <TabsContent value="programs" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROGRAMS.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SPECIAL_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">View Full Calendar</Button>
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-8">
                {/* Date Night Ideas */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Coffee className="h-6 w-6" /> Date Night Ideas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DATE_NIGHT_IDEAS.map((idea) => (
                      <DateNightCard key={idea.id} idea={idea} />
                    ))}
                  </div>
                </div>

                {/* Recommended Resources */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Recommended Resources</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <Book className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                        <h3 className="font-bold mb-2">The 5 Love Languages</h3>
                        <p className="text-sm text-muted-foreground mb-4">by Gary Chapman</p>
                        <Badge>Book Study Available</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <Headphones className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                        <h3 className="font-bold mb-2">Marriage Podcast</h3>
                        <p className="text-sm text-muted-foreground mb-4">Weekly discussions on marriage topics</p>
                        <Badge>Listen Now</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <Video className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                        <h3 className="font-bold mb-2">Video Series</h3>
                        <p className="text-sm text-muted-foreground mb-4">"Building a Godly Marriage"</p>
                        <Badge>8-Part Series</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Prayer Request */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Hand className="h-12 w-12 text-rose-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Need Prayer for Your Marriage?</h3>
                    <p className="text-muted-foreground mb-4">
                      Our prayer team is ready to stand with you. Submit a confidential prayer request.
                    </p>
                    <Button variant="outline" onClick={() => setContactDialogOpen(true)}>
                      Submit Prayer Request
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <Card className="bg-gradient-to-r from-rose-600 via-[#2A4D69] to-pink-600 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Invest in Your Marriage!</h2>
                <p className="text-white/90 mb-6">
                  Join a community of couples committed to growing together in faith and love.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-gray-100" onClick={() => setRegisterDialogOpen(true)}>
                    Join Couples Ministry
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => setContactDialogOpen(true)}>
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-rose-700">Join Couples Ministry</DialogTitle>
            <DialogDescription>
              We're excited to connect with you! Fill out the form below to get involved.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="husband_name">Husband's Name *</Label>
              <Input
                id="husband_name"
                value={contactForm.husband_name}
                onChange={(e) => setContactForm({ ...contactForm, husband_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="wife_name">Wife's Name *</Label>
              <Input
                id="wife_name"
                value={contactForm.wife_name}
                onChange={(e) => setContactForm({ ...contactForm, wife_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="years_married">Years Married</Label>
              <Select onValueChange={(v) => setContactForm({ ...contactForm, years_married: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="0-3">0-3 years</SelectItem>
                  <SelectItem value="4-10">4-10 years</SelectItem>
                  <SelectItem value="11-20">11-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">What are you hoping to get out of Couples Ministry?</Label>
              <Textarea
                id="message"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Tell us about your interests..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-rose-600 to-[#2A4D69]">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Contact Couples Ministry</DialogTitle>
            <DialogDescription>
              Have questions or need prayer? We're here for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact_name">Your Name *</Label>
              <Input
                id="contact_name"
                value={contactForm.husband_name}
                onChange={(e) => setContactForm({ ...contactForm, husband_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact_message">Message *</Label>
              <Textarea
                id="contact_message"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                placeholder="How can we help you?"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-rose-600 to-[#2A4D69]">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}