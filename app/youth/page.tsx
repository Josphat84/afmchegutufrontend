// app/youth/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Heart, 
  Star,
  Music,
  Gamepad,
  BookOpen,
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
  Medal,
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
  Users as UsersIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Heart as HeartIcon,
  Star as StarIcon,
  BookOpen as BibleIcon,
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
  Compass as CompassIcon,
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

const YOUTH_INFO = {
  name: 'Ignite Youth',
  tagline: 'Empowering the next generation to impact the world for Christ',
  founded: 2005,
  members: 250,
  meeting_day: 'Friday',
  meeting_time: '6:00 PM - 9:00 PM',
  location: 'Youth Center, 123 Faith Avenue, Harare',
  vision: 'To raise a generation of young people who love God, live purposefully, and lead courageously.',
  mission: 'To connect youth to Christ, help them grow in their faith, discover their purpose, and impact their world.',
  email: 'youth@gracechurch.org',
  phone: '+263 242 123 456',
  social: {
    instagram: '@igniteyouth',
    facebook: 'IgniteYouthMinistry',
    twitter: '@igniteyouth',
  },
};

// Leadership Team
const LEADERSHIP = [
  {
    id: 1,
    name: 'Pastor David Okonkwo',
    title: 'Youth Pastor',
    bio: 'Pastor David has a passion for seeing young people discover their identity in Christ and walk in their purpose.',
    email: 'david.okonkwo@gracechurch.org',
    image: '',
  },
  {
    id: 2,
    name: 'Sarah Moyo',
    title: 'Youth Coordinator',
    bio: 'Sarah oversees youth programs and events, ensuring everything runs smoothly and effectively.',
    email: 'sarah.moyo@gracechurch.org',
    image: '',
  },
  {
    id: 3,
    name: 'Michael Banda',
    title: 'Worship Leader',
    bio: 'Michael leads the youth worship team, creating an atmosphere for young people to encounter God.',
    email: 'michael.banda@gracechurch.org',
    image: '',
  },
  {
    id: 4,
    name: 'Tendai Ncube',
    title: 'Events Coordinator',
    bio: 'Tendai plans and coordinates all youth events, camps, and outreach programs.',
    email: 'tendai.ncube@gracechurch.org',
    image: '',
  },
];

// Exciting Events
const EVENTS = [
  {
    id: 1,
    title: 'Summer Camp 2024',
    date: 'December 15-20, 2024',
    location: 'Mashonaland Christian Centre',
    description: 'A 5-day life-changing camp with worship, workshops, games, and outdoor adventures. Theme: "Arise and Shine"',
    image: '',
    spots_left: 50,
    price: '$50',
    registration_deadline: 'December 10, 2024',
    type: 'camp',
  },
  {
    id: 2,
    title: 'Friday Night Live',
    date: 'Every Friday',
    location: 'Youth Center',
    description: 'Weekly youth service with powerful worship, relevant teaching, great fellowship, and fun games.',
    image: '',
    recurring: true,
    type: 'weekly',
  },
  {
    id: 3,
    title: 'Leadership Conference',
    date: 'March 8-10, 2025',
    location: 'Grace Convention Centre',
    description: 'Equipping young leaders to make an impact in their schools, churches, and communities.',
    image: '',
    spots_left: 100,
    price: '$20',
    type: 'conference',
  },
  {
    id: 4,
    title: 'Community Outreach Day',
    date: 'Every Last Saturday',
    location: 'Various Locations',
    description: 'Serving the less privileged through feeding programs, home visits, and community clean-ups.',
    image: '',
    recurring: true,
    type: 'outreach',
  },
  {
    id: 5,
    title: 'Movie Night',
    date: 'First Friday of every month',
    location: 'Youth Center',
    description: 'Watch inspiring Christian movies followed by discussion and snacks.',
    image: '',
    recurring: true,
    type: 'fellowship',
  },
  {
    id: 6,
    title: 'Sports Tournament',
    date: 'April 12-13, 2025',
    location: 'Community Sports Ground',
    description: 'Football, basketball, and volleyball tournament. Prizes for winners!',
    image: '',
    spots_left: 200,
    type: 'sports',
  },
];

// Fellowship Programs
const FELLOWSHIPS = [
  {
    id: 1,
    name: 'Monday Morning Prayer',
    time: '5:00 AM - 6:00 AM',
    location: 'Prayer Room',
    description: 'Start your week with prayer and worship.',
    icon: Heart,
  },
  {
    id: 2,
    name: 'Tuesday Bible Study',
    time: '4:00 PM - 5:30 PM',
    location: 'Youth Center',
    description: 'Deep dive into God\'s Word with practical application.',
    icon: BookOpen,
  },
  {
    id: 3,
    name: 'Wednesday Worship Rehearsal',
    time: '4:00 PM - 6:00 PM',
    location: 'Sanctuary',
    description: 'For those interested in worship ministry.',
    icon: Music,
  },
  {
    id: 4,
    name: 'Thursday Game Night',
    time: '5:00 PM - 7:00 PM',
    location: 'Youth Center',
    description: 'Board games, video games, and fellowship.',
    icon: Gamepad,
  },
];

// Career Guidance Programs
const CAREER_PROGRAMS = [
  {
    id: 1,
    title: 'Career Expo',
    date: 'May 10, 2025',
    description: 'Meet professionals from various fields: Medicine, Engineering, Law, Business, ICT.',
    speakers: ['Dr. Tendai Makoni', 'Eng. James Moyo', 'Advocate Sarah Dube'],
  },
  {
    id: 2,
    title: 'University Prep Workshop',
    date: 'June 15, 2025',
    description: 'Learn about university applications, scholarship opportunities, and campus life.',
  },
  {
    id: 3,
    title: 'Entrepreneurship Bootcamp',
    date: 'July 20-22, 2025',
    description: 'Learn how to start and grow your own business. Mentorship from successful young entrepreneurs.',
  },
  {
    id: 4,
    title: 'CV & Interview Skills',
    date: 'August 10, 2025',
    description: 'Get practical tips on writing CVs, preparing for interviews, and job searching.',
  },
];

// Small Groups
const SMALL_GROUPS = [
  {
    id: 1,
    name: 'Young Men\'s Group',
    leader: 'Michael Banda',
    day: 'Tuesday',
    time: '4:00 PM',
    location: 'Youth Center Room 1',
    age_group: '13-18',
    description: 'Discussing issues young men face and growing together.',
  },
  {
    id: 2,
    name: 'Young Women\'s Group',
    leader: 'Sarah Moyo',
    day: 'Wednesday',
    time: '4:00 PM',
    location: 'Youth Center Room 2',
    age_group: '13-18',
    description: 'Building confidence, faith, and sisterhood.',
  },
  {
    id: 3,
    name: 'Worship Team',
    leader: 'Michael Banda',
    day: 'Thursday',
    time: '4:00 PM',
    location: 'Sanctuary',
    age_group: '15-25',
    description: 'Develop your musical gifts and lead worship.',
  },
  {
    id: 4,
    name: 'Prayer Warriors',
    leader: 'Tendai Ncube',
    day: 'Monday',
    time: '5:00 AM',
    location: 'Prayer Room',
    age_group: 'All',
    description: 'Interceding for the youth and community.',
  },
];

// Trips & Adventures
const TRIPS = [
  {
    id: 1,
    title: 'Mountain Climbing Expedition',
    date: 'September 12-14, 2025',
    location: 'Nyanga Mountains',
    description: '3-day hiking and camping trip. Build resilience and enjoy God\'s creation.',
    cost: '$30',
  },
  {
    id: 2,
    title: 'Beach Mission Trip',
    date: 'October 20-27, 2025',
    location: 'Kariba',
    description: 'Combine outreach with fun! Evangelism, games, and swimming.',
    cost: '$80',
  },
  {
    id: 3,
    title: 'Youth Conference Trip',
    date: 'November 15-17, 2025',
    location: 'Bulawayo',
    description: 'Join thousands of youth for a powerful conference.',
    cost: '$50',
  },
];

// Financial Literacy Programs
const FINANCE_PROGRAMS = [
  {
    id: 1,
    title: 'Money Management 101',
    description: 'Learn budgeting, saving, and avoiding debt.',
    schedule: 'First Saturday of every month',
  },
  {
    id: 2,
    title: 'Investment Club',
    description: 'Learn about stocks, real estate, and building wealth.',
    schedule: 'Every Wednesday at 5 PM',
  },
  {
    id: 3,
    title: 'Side Hustle Workshop',
    description: 'How to make money online and start a small business.',
    schedule: 'Quarterly workshops',
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Tinashe M.',
    age: 17,
    text: 'Ignite Youth changed my life. I found purpose, made great friends, and discovered my calling in worship ministry.',
  },
  {
    id: 2,
    name: 'Rudo C.',
    age: 16,
    text: 'The career guidance helped me choose my degree path. Now I\'m studying what I love!',
  },
  {
    id: 3,
    name: 'Takunda S.',
    age: 19,
    text: 'Through the leadership training, I now lead a small group and mentor younger teens. Best decision ever!',
  },
];

// Core Values
const CORE_VALUES = [
  { icon: Heart, title: 'Love', description: 'We love God and love others unconditionally' },
  { icon: BookOpen, title: 'Truth', description: 'We stand on God\'s Word as our foundation' },
  { icon: Users, title: 'Community', description: 'We do life together in authentic relationships' },
  { icon: Rocket, title: 'Purpose', description: 'We help youth discover and fulfill their destiny' },
  { icon: Star, title: 'Excellence', description: 'We give our best in everything we do' },
  { icon: Globe, title: 'Impact', description: 'We make a difference in our schools and communities' },
];

// Background images
const backgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=90&w=2070",
    location: "Youth Group"
  },
  {
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=90&w=2070",
    location: "Youth Worship"
  },
];

// =============== COMPONENTS ===============

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const ValueCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const EventCard = ({ event }: { event: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground">{event.title}</h3>
            {event.recurring && <Badge variant="secondary">Weekly</Badge>}
            {event.type && <Badge variant="outline" className="ml-2">{event.type}</Badge>}
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
            {event.price && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          {event.spots_left && (
            <div className="flex items-center justify-between">
              <Badge variant="outline">{event.spots_left} spots left</Badge>
              <Button size="sm">Register</Button>
            </div>
          )}
          {!event.spots_left && !event.recurring && (
            <Button variant="outline" size="sm" className="w-full">Learn More</Button>
          )}
          {event.recurring && (
            <Button variant="outline" size="sm" className="w-full">Join This Week</Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const GroupCard = ({ group }: { group: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{group.name}</h4>
          <p className="text-xs text-muted-foreground">Led by {group.leader}</p>
        </div>
        <Badge variant="outline">{group.age_group}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{group.description}</p>
      <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{group.day}, {group.time}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{group.location}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
    <CardContent className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary" />
        </div>
      </div>
      <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
      <div>
        <p className="font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">Age {testimonial.age}</p>
      </div>
    </CardContent>
  </Card>
);

const LeadershipCard = ({ person }: { person: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {person.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-foreground">{person.name}</h3>
          <p className="text-sm text-primary font-medium">{person.title}</p>
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

const ProgramCard = ({ program, icon: Icon }: { program: any; icon: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{program.title}</h4>
          <p className="text-xs text-muted-foreground">{program.description}</p>
          {program.schedule && <p className="text-xs text-muted-foreground mt-1">📅 {program.schedule}</p>}
          {program.date && <p className="text-xs text-muted-foreground mt-1">📅 {program.date}</p>}
          {program.cost && <p className="text-xs text-primary mt-1">💰 {program.cost}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

// =============== MAIN PAGE ===============
export default function YouthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('Grace Community Church');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

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
    toast.success('Message sent! We\'ll get back to you soon.');
    setContactDialogOpen(false);
    setContactForm({ name: '', email: '', message: '' });
  };

  const statsData = [
    { icon: Users, value: YOUTH_INFO.members.toString(), label: "Active Youth" },
    { icon: Calendar, value: "25+", label: "Events Yearly" },
    { icon: Heart, value: "12+", label: "Small Groups" },
    { icon: Globe, value: "8+", label: "Outreaches" },
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Youth Ministry • Est. {YOUTH_INFO.founded}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {YOUTH_INFO.name}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {YOUTH_INFO.tagline}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100" onClick={() => setActiveTab('events')}>
                  Upcoming Events
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" onClick={() => setContactDialogOpen(true)}>
                  Get Involved
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-6 mb-8 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="trips">Trips</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-blue-100">
                          <Target className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                      <p className="text-muted-foreground leading-relaxed">{YOUTH_INFO.vision}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-green-100">
                          <Rocket className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                      <p className="text-muted-foreground leading-relaxed">{YOUTH_INFO.mission}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Core Values */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Core Values</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CORE_VALUES.map((value, index) => (
                      <ValueCard key={index} {...value} />
                    ))}
                  </div>
                </div>

                {/* Weekly Fellowships */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Weekly Fellowships</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {FELLOWSHIPS.map((fellowship) => {
                      const Icon = fellowship.icon;
                      return (
                        <Card key={fellowship.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
                          <CardContent className="p-4 text-center">
                            <div className="flex justify-center mb-3">
                              <div className="p-2 rounded-full bg-primary/10">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">{fellowship.name}</h3>
                            <p className="text-xs text-muted-foreground">{fellowship.time}</p>
                            <p className="text-xs text-muted-foreground mt-2">{fellowship.description}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">What Our Youth Say</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                </div>

                {/* Leadership */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Leadership</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LEADERSHIP.map((person) => (
                      <LeadershipCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">View All Events</Button>
                </div>
              </TabsContent>

              {/* Groups Tab */}
              <TabsContent value="groups" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SMALL_GROUPS.map((group) => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setContactDialogOpen(true)}>Join a Group</Button>
                </div>
              </TabsContent>

              {/* Career Guidance Tab */}
              <TabsContent value="career" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CAREER_PROGRAMS.map((program) => (
                    <ProgramCard key={program.id} program={program} icon={GraduationCap} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setContactDialogOpen(true)}>Register for Career Guidance</Button>
                </div>
              </TabsContent>

              {/* Financial Literacy Tab */}
              <TabsContent value="finance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FINANCE_PROGRAMS.map((program) => (
                    <ProgramCard key={program.id} program={program} icon={DollarSign} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setContactDialogOpen(true)}>Join Finance Club</Button>
                </div>
              </TabsContent>

              {/* Trips Tab */}
              <TabsContent value="trips" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TRIPS.map((trip) => (
                    <ProgramCard key={trip.id} program={trip} icon={Mountain} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setContactDialogOpen(true)}>Book a Trip</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="bg-gradient-to-r from-primary/90 to-primary/70 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                <p className="text-white/90 mb-6">
                  We'd love to have you! Come check out our next meeting and see what God is doing in our youth.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" onClick={() => setActiveTab('events')}>
                    Upcoming Events
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

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Get Involved</DialogTitle>
            <DialogDescription>
              Fill out the form and we'll get back to you with more information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="I'm interested in joining the youth ministry..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}