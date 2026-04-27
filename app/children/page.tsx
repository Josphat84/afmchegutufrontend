// app/children/page.tsx
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
  ToyBrick,
  Paintbrush,
  Smile,
  Apple,
  Book,
  Pencil,
  Scissors,
  Music2,
  Drama,
  Flower,
  Trees,
  Cloud,
  Sun,
  Moon,
  Rainbow,
  Bug,
  Bird,
  Fish,
  Cat,
  Dog,
  Rabbit,
  Blocks,
  Puzzle,
  Microscope,
  Shapes,
  Home,
  School,
  Hospital,
  Flame,
  Library,
  Building2,
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

const CHILDREN_INFO = {
  name: 'Kingdom Kids',
  tagline: 'Growing in faith, love, and wisdom - one child at a time!',
  founded: 2010,
  children_count: 180,
  age_groups: ['Toddlers (2-4)', 'Pre-School (5-6)', 'Juniors (7-9)', 'Tweens (10-12)', 'Teens (13-17)'],
  meeting_day: 'Sunday',
  meeting_time: '9:00 AM - 12:00 PM',
  location: "Children's Wing, AFM Chegutu",
  vision: 'To raise a generation of children who know God, love His Word, and live out their faith with joy and confidence.',
  mission: 'To create a safe, fun, and engaging environment where children encounter God, learn biblical truths, and develop life skills.',
  email: 'children@afmchegutu.org',
  phone: '+263 242 123 456',
};

// Age Groups with details
const AGE_GROUPS = [
  {
    id: 1,
    name: 'Little Lambs',
    age_range: '2-4 years',
    icon: Baby,
    description: 'Play-based learning with Bible stories, songs, and activities.',
    ratio: '1:4 caregiver ratio',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 2,
    name: 'Radiant Rainbows',
    age_range: '5-6 years',
    icon: Rainbow,
    description: 'Interactive Bible lessons, crafts, and memory verses.',
    ratio: '1:6 teacher ratio',
    color: 'bg-[#86BBD8]/20 text-[#2A4D69]',
  },
  {
    id: 3,
    name: 'Mighty Warriors',
    age_range: '7-9 years',
    icon: Shield,
    description: 'Dynamic teaching, character building, and group activities.',
    ratio: '1:8 teacher ratio',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    name: 'Kingdom Builders',
    age_range: '10-12 years',
    icon: Crown,
    description: 'In-depth Bible study, leadership training, and service projects.',
    ratio: '1:10 teacher ratio',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 5,
    name: 'Impact Teens',
    age_range: '13-17 years',
    icon: Star,
    description: 'Youth discussions, mentorship, and outreach opportunities.',
    ratio: '1:12 leader ratio',
    color: 'bg-orange-100 text-orange-700',
  },
];

// Leadership Team
const LEADERSHIP = [
  {
    id: 1,
    name: 'Mrs. Grace Makoni',
    title: 'Children\'s Ministry Director',
    bio: 'Grace has over 15 years of experience in children\'s education and ministry. She holds a degree in Early Childhood Development.',
    email: 'grace.makoni@afmchegutu.org',
  },
  {
    id: 2,
    name: 'Auntie Mercy Banda',
    title: 'Little Lambs Coordinator',
    bio: 'Mercy is passionate about toddlers and has a heart for nurturing young children in a loving environment.',
    email: 'mercy.banda@afmchegutu.org',
  },
  {
    id: 3,
    name: 'Uncle Tendai Ncube',
    title: 'Mighty Warriors Coordinator',
    bio: 'Tendai leads the boys\' ministry and loves teaching children through sports and hands-on activities.',
    email: 'tendai.ncube@afmchegutu.org',
  },
  {
    id: 4,
    name: 'Auntie Rutendo Moyo',
    title: 'Impact Teens Coordinator',
    bio: 'Rutendo mentors teenagers and helps them navigate faith, identity, and life challenges.',
    email: 'rutendo.moyo@afmchegutu.org',
  },
];

// Weekly Activities
const WEEKLY_ACTIVITIES = [
  {
    id: 1,
    day: 'Sunday',
    activities: [
      '9:00 AM - Worship & Praise',
      '9:30 AM - Bible Lesson',
      '10:15 AM - Snack Time',
      '10:30 AM - Crafts & Activities',
      '11:15 AM - Memory Verse',
      '11:30 AM - Games & Fellowship',
    ],
  },
  {
    id: 2,
    day: 'Tuesday',
    activities: [
      '3:00 PM - After-school Bible Club',
      '4:00 PM - Homework Help',
      '5:00 PM - Arts & Crafts',
    ],
  },
  {
    id: 3,
    day: 'Thursday',
    activities: [
      '3:00 PM - Music & Choir Practice',
      '4:00 PM - Drama & Skits',
      '5:00 PM - Games & Recreation',
    ],
  },
  {
    id: 4,
    day: 'Saturday',
    activities: [
      '9:00 AM - Kids Church',
      '10:00 AM - Bible Adventure',
      '11:00 AM - Outdoor Activities',
    ],
  },
];

// Special Events
const SPECIAL_EVENTS = [
  {
    id: 1,
    title: 'Kids Camp 2024',
    date: 'August 12-16, 2024',
    location: 'Mashonaland Christian Centre',
    description: '5 days of fun, games, Bible lessons, and adventure! Theme: "Superheroes of Faith"',
    age_group: '7-12 years',
    cost: '$30',
    spots_left: 50,
  },
  {
    id: 2,
    title: 'Christmas Party',
    date: 'December 14, 2024',
    location: 'Church Hall',
    description: 'Gift giving, games, nativity play, and festive treats!',
    age_group: 'All ages',
    cost: 'Free',
    spots_left: 100,
  },
  {
    id: 3,
    title: 'Easter Egg Hunt',
    date: 'April 19, 2025',
    location: 'Church Grounds',
    description: 'Egg hunt, Easter story, crafts, and refreshments.',
    age_group: '2-12 years',
    cost: '$5',
    spots_left: 80,
  },
  {
    id: 4,
    title: 'Parents & Kids Conference',
    date: 'October 10-11, 2025',
    location: 'AFM Chegutu Convention',
    description: 'Equipping parents and children to grow together in faith.',
    age_group: 'Parents + Children',
    cost: '$20 per family',
    spots_left: 60,
  },
];

// Programs & Activities
const PROGRAMS = [
  {
    id: 1,
    title: 'Bible Explorers',
    description: 'Interactive Bible stories with puppets, props, and activities.',
    icon: BookOpen,
    age_group: '5-9 years',
  },
  {
    id: 2,
    title: 'Memory Masters',
    description: 'Learn and recite scripture verses with rewards and recognition.',
    icon: Star,
    age_group: '7-12 years',
  },
  {
    id: 3,
    title: 'Creative Corner',
    description: 'Arts, crafts, painting, and creative expression.',
    icon: Paintbrush,
    age_group: '4-10 years',
  },
  {
    id: 4,
    title: 'Music Makers',
    description: 'Learn songs, play instruments, and join the children\'s choir.',
    icon: Music,
    age_group: '6-12 years',
  },
  {
    id: 5,
    title: 'Science & Faith',
    description: 'Explore God\'s creation through fun science experiments.',
    icon: Microscope,
    age_group: '8-12 years',
  },
  {
    id: 6,
    title: 'Sports Academy',
    description: 'Football, netball, athletics, and team building.',
    icon: Dumbbell,
    age_group: '8-17 years',
  },
  {
    id: 7,
    title: 'Drama Club',
    description: 'Act out Bible stories and perform in church services.',
    icon: Drama,
    age_group: '7-14 years',
  },
  {
    id: 8,
    title: 'Coding for Kids',
    description: 'Introduction to computer programming and digital skills.',
    icon: Laptop,
    age_group: '10-17 years',
  },
];

// Safety & Security
const SAFETY_MEASURES = [
  {
    id: 1,
    title: 'Background Checks',
    description: 'All volunteers undergo thorough background checks.',
    icon: Shield,
  },
  {
    id: 2,
    title: 'Check-in/Check-out System',
    description: 'Secure electronic check-in and check-out with parent pick-up tags.',
    icon: Heart,
  },
  {
    id: 3,
    title: 'First Aid Certified',
    description: 'Trained first aid responders in every class.',
    icon: HeartHandshake,
  },
  {
    id: 4,
    title: 'Security Team',
    description: 'Dedicated security personnel on site.',
    icon: Shield,
  },
];

// Parent Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mrs. Tendai M.',
    child_age: 6,
    text: 'My daughter loves coming to church! The teachers are amazing and she has learned so many Bible verses.',
  },
  {
    id: 2,
    name: 'Mr. & Mrs. Chikwanda',
    child_age: 9,
    text: 'The children\'s ministry has been a blessing to our family. Our son has grown spiritually and socially.',
  },
  {
    id: 3,
    name: 'Mrs. Sarah N.',
    child_age: 4,
    text: 'The Little Lambs class is wonderful! My toddler feels safe and loved, and she\'s learning about Jesus.',
  },
];

// Memory Verses by Age
const MEMORY_VERSES = [
  { age: '2-4', verse: 'God is love. - 1 John 4:8', emoji: '❤️' },
  { age: '5-6', verse: 'I can do all things through Christ. - Philippians 4:13', emoji: '💪' },
  { age: '7-9', verse: 'Trust in the Lord with all your heart. - Proverbs 3:5', emoji: '🤝' },
  { age: '10-12', verse: 'For I know the plans I have for you, declares the Lord. - Jeremiah 29:11', emoji: '📖' },
  { age: '13-17', verse: 'Don\'t let anyone look down on you because you are young. - 1 Timothy 4:12', emoji: '🌟' },
];

// Background images
const backgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=90&w=2070",
    location: "Children Playing"
  },
  {
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=90&w=2070",
    location: "Kids Ministry"
  },
];

// =============== COMPONENTS ===============

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full bg-pink-100">
          <Icon className="h-6 w-6 text-pink-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const AgeGroupCard = ({ group }: { group: any }) => {
  const Icon = group.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${group.color} shadow-lg`}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <h3 className="font-bold text-foreground text-lg mb-1">{group.name}</h3>
        <p className="text-sm text-primary font-medium mb-2">{group.age_range}</p>
        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
        <Badge variant="outline" className="text-xs">{group.ratio}</Badge>
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
          <div className="p-2 rounded-lg bg-pink-100">
            <Icon className="h-5 w-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{program.title}</h4>
            <p className="text-xs text-muted-foreground">{program.description}</p>
            <Badge variant="outline" className="text-xs mt-1">{program.age_group}</Badge>
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
        <div className="p-3 rounded-lg bg-pink-100">
          <Calendar className="h-6 w-6 text-pink-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground">{event.title}</h3>
            <Badge variant="outline">{event.age_group}</Badge>
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
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{event.cost}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          {event.spots_left && (
            <div className="flex items-center justify-between">
              <Badge variant="outline">{event.spots_left} spots left</Badge>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">Register</Button>
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

const SafetyCard = ({ safety }: { safety: any }) => {
  const Icon = safety.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-2 rounded-full bg-green-100">
            <Icon className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <h4 className="font-semibold text-foreground text-sm">{safety.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{safety.description}</p>
      </CardContent>
    </Card>
  );
};

const LeadershipCard = ({ person }: { person: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-pink-200">
          <AvatarFallback className="bg-pink-100 text-pink-700 text-lg font-bold">
            {person.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-foreground">{person.name}</h3>
          <p className="text-sm text-pink-600 font-medium">{person.title}</p>
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
    <CardContent className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
          <Heart className="h-8 w-8 text-pink-600" />
        </div>
      </div>
      <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
      <div>
        <p className="font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">Parent of {testimonial.child_age}-year-old</p>
      </div>
    </CardContent>
  </Card>
);

// =============== MAIN PAGE ===============
export default function ChildrenPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Town Assembly');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    child_name: '', 
    child_age: '', 
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
    toast.success('Registration submitted! We\'ll contact you soon.');
    setRegisterDialogOpen(false);
    setContactForm({ name: '', email: '', phone: '', child_name: '', child_age: '', message: '' });
  };

  const statsData = [
    { icon: Users, value: CHILDREN_INFO.children_count.toString(), label: "Children Enrolled" },
    { icon: Calendar, value: "20+", label: "Events Yearly" },
    { icon: Heart, value: "35+", label: "Volunteers" },
    { icon: Star, value: "5", label: "Age Groups" },
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
        {/* Colorful overlay for children's page */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4 gap-2">
                <div className="animate-bounce">
                  <Baby className="h-8 w-8 text-pink-400" />
                </div>
                <div className="animate-bounce delay-100">
                  <ToyBrick className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="animate-bounce delay-200">
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <div className="animate-bounce delay-300">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Children's Ministry • Est. {CHILDREN_INFO.founded}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {CHILDREN_INFO.name}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {CHILDREN_INFO.tagline}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-[#2A4D69] hover:from-pink-700 hover:to-[#1e3a52] text-white shadow-lg" onClick={() => setRegisterDialogOpen(true)}>
                  <Heart className="h-5 w-5 mr-2" /> Register My Child
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" onClick={() => setActiveTab('programs')}>
                  Explore Programs
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
                <TabsTrigger value="agegroups">Age Groups</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="parents">Parents</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-pink-100">
                          <Target className="h-8 w-8 text-pink-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                      <p className="text-muted-foreground leading-relaxed">{CHILDREN_INFO.vision}</p>
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
                      <p className="text-muted-foreground leading-relaxed">{CHILDREN_INFO.mission}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6" /> Weekly Activities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {WEEKLY_ACTIVITIES.map((day) => (
                      <Card key={day.day} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold text-center text-pink-700">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Clock className="h-3 w-3 text-pink-500 mt-0.5" />
                                <span className="text-muted-foreground">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Memory Verses */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <BookOpen className="h-6 w-6" /> Memory Verses by Age
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {MEMORY_VERSES.map((verse) => (
                      <Card key={verse.age} className="bg-white/90 backdrop-blur-sm border-0 shadow-md text-center">
                        <CardContent className="p-4">
                          <div className="text-3xl mb-2">{verse.emoji}</div>
                          <Badge className="mb-2 bg-pink-100 text-pink-700">Ages {verse.age}</Badge>
                          <p className="text-sm font-medium text-foreground">{verse.verse}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Leadership */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Meet Our Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LEADERSHIP.map((person) => (
                      <LeadershipCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Parent Testimonials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Age Groups Tab */}
              <TabsContent value="agegroups" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AGE_GROUPS.map((group) => (
                    <AgeGroupCard key={group.id} group={group} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button onClick={() => setRegisterDialogOpen(true)} className="bg-gradient-to-r from-pink-600 to-[#2A4D69]">
                    Register Your Child
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
                  <Button variant="outline" size="lg">View Calendar</Button>
                </div>
              </TabsContent>

              {/* Safety Tab */}
              <TabsContent value="safety" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Your Child's Safety is Our Priority</h2>
                  <p className="text-white/80 max-w-2xl mx-auto">
                    We take every precaution to ensure a safe and secure environment for your children.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SAFETY_MEASURES.map((safety) => (
                    <SafetyCard key={safety.id} safety={safety} />
                  ))}
                </div>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mt-8">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Safe Church Policy</h3>
                    <p className="text-muted-foreground">
                      We are committed to providing a safe environment for all children. All volunteers undergo background checks, 
                      and our facilities are monitored by security cameras. We maintain a strict check-in/check-out system to ensure 
                      children are only released to authorized guardians.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Parents Tab */}
              <TabsContent value="parents" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-600" /> Get Involved
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Volunteer as a helper or teacher</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Join the parents' prayer group</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Contribute snacks or supplies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Attend parent-teacher meetings</span>
                        </li>
                      </ul>
                      <Button className="w-full mt-6 bg-pink-600 hover:bg-pink-700" onClick={() => setContactDialogOpen(true)}>
                        Volunteer Today
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-pink-600" /> Parent Resources
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Monthly parent newsletter</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Parenting workshops and seminars</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Family devotion guides</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                          <span>Prayer resources for families</span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full mt-6">Download Resources</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="bg-gradient-to-r from-pink-600 via-[#2A4D69] to-[#6B7B8E] text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Join Our Children's Ministry!</h2>
                <p className="text-white/90 mb-6">
                  Give your child the gift of growing in faith, making friends, and having fun in a safe, loving environment.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100" onClick={() => setRegisterDialogOpen(true)}>
                    Register My Child
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => setContactDialogOpen(true)}>
                    Volunteer
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
            <DialogTitle className="text-2xl font-bold text-pink-700">Register Your Child</DialogTitle>
            <DialogDescription>
              Fill out the form below to enroll your child in our children's ministry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
              <Input
                id="parent_name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
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
              <Label htmlFor="child_name">Child's Name *</Label>
              <Input
                id="child_name"
                value={contactForm.child_name}
                onChange={(e) => setContactForm({ ...contactForm, child_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="child_age">Child's Age *</Label>
              <Select onValueChange={(v) => setContactForm({ ...contactForm, child_age: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-4">2-4 years (Little Lambs)</SelectItem>
                  <SelectItem value="5-6">5-6 years (Radiant Rainbows)</SelectItem>
                  <SelectItem value="7-9">7-9 years (Mighty Warriors)</SelectItem>
                  <SelectItem value="10-12">10-12 years (Kingdom Builders)</SelectItem>
                  <SelectItem value="13-17">13-17 years (Impact Teens)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Special Notes (allergies, medical conditions, etc.)</Label>
              <Textarea
                id="message"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Any important information we should know..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-pink-600 to-[#2A4D69]">Submit Registration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Volunteer With Us</DialogTitle>
            <DialogDescription>
              Join our team of dedicated children's ministry volunteers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="volunteer_name">Name</Label>
              <Input
                id="volunteer_name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="volunteer_email">Email</Label>
              <Input
                id="volunteer_email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="volunteer_phone">Phone</Label>
              <Input
                id="volunteer_phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="volunteer_message">Why would you like to volunteer?</Label>
              <Textarea
                id="volunteer_message"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-pink-600 to-[#2A4D69]">Submit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}