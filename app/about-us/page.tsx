// app/about-us/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Church, 
  Heart, 
  Users, 
  Target, 
  BookOpen, 
  Globe,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Award,
  HandHeart,
  Lightbulb,
  Sparkles,
  Shield,
  Star,
  Cross,
  Music,
  Home,
  User,
  Clock,
  Coffee,
  Gift,
  TreePine,
  Mountain,
  Sun,
  Moon,
  Cloud,
  Waves,
  Flower2,
  HeartHandshake,
  Handshake,
  Trophy,
  Medal,
  Crown,
  Gem,
  Compass,
  Map,
  Navigation,
  Building,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Import Header and Footer
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// =============== EDITABLE CONTENT ===============
const CHURCH_INFO = {
  name: 'Grace Community Church',
  founded: 1985,
  denomination: 'Non-denominational Christian',
  members: 1200,
  location: '123 Faith Avenue, Harare, Zimbabwe',
  phone: '+263 242 123 456',
  email: 'info@gracechurch.org',
  website: 'www.gracechurch.org',
  service_times: [
    { day: 'Sunday', times: ['8:00 AM', '10:00 AM', '5:00 PM'] },
    { day: 'Wednesday', times: ['6:30 PM'] },
    { day: 'Friday', times: ['6:00 PM'] },
  ],
  vision: 'To glorify God by making disciples of all nations, demonstrating His love, and transforming communities through the power of the Gospel.',
  mission: 'To reach people with the love of Christ, grow them in their faith, and send them out to serve others.',
  core_values: [
    { icon: Heart, title: 'Love', description: 'We love God and love others unconditionally' },
    { icon: BookOpen, title: 'Truth', description: 'We are committed to biblical truth and teaching' },
    { icon: Users, title: 'Community', description: 'We grow together in authentic relationships' },
    { icon: HandHeart, title: 'Service', description: 'We serve our church and community selflessly' },
    { icon: Globe, title: 'Outreach', description: 'We share the Gospel locally and globally' },
    { icon: Star, title: 'Excellence', description: 'We strive for excellence in all we do' },
  ],
};

// Editable Leadership Team
const LEADERSHIP_TEAM = [
  {
    id: 1,
    name: 'Pastor John Smith',
    title: 'Senior Pastor',
    bio: 'Pastor John has been serving as Senior Pastor since 2010. He holds a Master of Divinity and has a passion for expository preaching and pastoral care.',
    email: 'john.smith@gracechurch.org',
    image: '',
  },
  {
    id: 2,
    name: 'Pastor Sarah Johnson',
    title: 'Associate Pastor',
    bio: 'Pastor Sarah oversees women\'s ministry and discipleship programs. She has a heart for helping people grow in their faith journey.',
    email: 'sarah.johnson@gracechurch.org',
    image: '',
  },
  {
    id: 3,
    name: 'Elder Michael Chen',
    title: 'Elder Board Chair',
    bio: 'Michael has been an elder for 15 years and brings wisdom in church governance and strategic planning.',
    email: 'michael.chen@gracechurch.org',
    image: '',
  },
  {
    id: 4,
    name: 'Deaconess Mary Williams',
    title: 'Deaconess',
    bio: 'Mary leads our benevolence ministry and coordinates care for families in need within our congregation.',
    email: 'mary.williams@gracechurch.org',
    image: '',
  },
];

// Editable Ministries
const MINISTRIES = [
  { id: 1, name: 'Worship Ministry', leader: 'David Thompson', members: 45, icon: Music },
  { id: 2, name: 'Children\'s Ministry', leader: 'Lisa Anderson', members: 30, icon: Home },
  { id: 3, name: 'Youth Ministry', leader: 'Mark Roberts', members: 65, icon: Users },
  { id: 4, name: 'Women\'s Ministry', leader: 'Sarah Johnson', members: 120, icon: Heart },
  { id: 5, name: 'Men\'s Ministry', leader: 'James Wilson', members: 85, icon: Shield },
  { id: 6, name: 'Outreach Ministry', leader: 'Peter Okonkwo', members: 40, icon: Globe },
];

// Editable Milestones/History
const MILESTONES = [
  { id: 1, year: 1985, event: 'Church Founded', description: 'Grace Community Church began with 25 members meeting in a school hall.' },
  { id: 2, year: 1990, event: 'First Building', description: 'Purchased our first permanent facility on Faith Avenue.' },
  { id: 3, year: 2000, event: 'Sanctuary Expansion', description: 'Completed major sanctuary renovation and expansion.' },
  { id: 4, year: 2010, event: 'New Leadership', description: 'Pastor John Smith became Senior Pastor.' },
  { id: 5, year: 2015, event: 'Missions Launch', description: 'Launched our first international mission partnership.' },
  { id: 6, year: 2020, event: 'Online Ministry', description: 'Expanded digital presence and online services.' },
];

// Editable Beliefs
const BELIEFS = [
  { id: 1, icon: Cross, title: 'The Bible', description: 'We believe the Bible is the inspired, infallible Word of God and the final authority for faith and life.' },
  { id: 2, icon: Heart, title: 'The Trinity', description: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { id: 3, icon: Star, title: 'Salvation', description: 'We believe salvation is a gift of God\'s grace received through faith in Jesus Christ alone.' },
  { id: 4, icon: Church, title: 'The Church', description: 'We believe the Church is the body of Christ, called to worship, grow, and serve together.' },
  { id: 5, icon: HandHeart, title: 'Baptism & Communion', description: 'We believe in believer\'s baptism by immersion and the regular observance of the Lord\'s Supper.' },
  { id: 6, icon: Globe, title: 'The Great Commission', description: 'We are called to make disciples of all nations, baptizing them and teaching them to obey Christ.' },
];

// Background images
const backgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1438032945732-2d4be58e2c1f?auto=format&fit=crop&q=90&w=2070",
    location: "Church Interior"
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=90&w=2070",
    location: "Mountain View"
  },
];

// =============== STAT CARD ===============
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

// =============== VALUE CARD ===============
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

// =============== LEADERSHIP CARD ===============
const LeadershipCard = ({ person }: { person: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {person.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{person.name}</h3>
          <p className="text-sm text-primary font-medium">{person.title}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{person.bio}</p>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span className="text-xs">{person.email}</span>
      </div>
    </CardContent>
  </Card>
);

// =============== MINISTRY CARD ===============
const MinistryCard = ({ ministry }: { ministry: any }) => {
  const Icon = ministry.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{ministry.name}</h4>
            <p className="text-xs text-muted-foreground">Led by {ministry.leader}</p>
          </div>
          <Badge variant="secondary">{ministry.members} members</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// =============== MAIN PAGE ===============
export default function AboutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('Grace Community Church');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

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

  const statsData = [
    { icon: Church, value: CHURCH_INFO.founded.toString(), label: "Year Founded" },
    { icon: Users, value: CHURCH_INFO.members.toLocaleString(), label: "Members" },
    { icon: Globe, value: "15+", label: "Countries Reached" },
    { icon: Heart, value: "30+", label: "Ministries" },
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
                {CHURCH_INFO.founded} • Established
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                About {CHURCH_INFO.name}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                A community of faith, hope, and love dedicated to glorifying God and serving our neighbors.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Our Beliefs
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  Plan a Visit
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

        {/* Vision & Mission */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">{CHURCH_INFO.vision}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">{CHURCH_INFO.mission}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Core Values</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                These principles guide everything we do as a church community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHURCH_INFO.core_values.map((value, index) => (
                <ValueCard key={index} {...value} />
              ))}
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">What We Believe</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Our core theological beliefs and statements of faith
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BELIEFS.map((belief) => {
                const Icon = belief.icon;
                return (
                  <Card key={belief.id} className="bg-white/90 backdrop-blur-sm border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{belief.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{belief.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our History / Timeline */}
        <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Journey</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Tracing God's faithfulness throughout our history
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white/20 hidden md:block"></div>
              <div className="space-y-8">
                {MILESTONES.map((milestone, index) => (
                  <div key={milestone.id} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6`}>
                    <div className="flex-1 md:text-right">
                      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg w-full">
                        <CardContent className="p-4">
                          <Badge className="mb-2 bg-primary text-white">{milestone.year}</Badge>
                          <h3 className="font-semibold text-foreground mb-1">{milestone.event}</h3>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex-none">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Times */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Service Times</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Join us for worship and fellowship throughout the week
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {CHURCH_INFO.service_times.map((service, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.day}</h3>
                    {service.times.map((time, i) => (
                      <p key={i} className="text-muted-foreground">{time}</p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Leadership</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Meet the dedicated team serving our church family
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {LEADERSHIP_TEAM.map((person) => (
                <LeadershipCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        </section>

        {/* Ministries */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Ministries</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Ways to get involved and serve our community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MINISTRIES.map((ministry) => (
                <MinistryCard key={ministry.id} ministry={ministry} />
              ))}
            </div>
          </div>
        </section>

        {/* Location & Contact */}
        <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Location
                  </h3>
                  <p className="text-muted-foreground mb-4">{CHURCH_INFO.location}</p>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Map View - Google Maps Integration</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" /> Get in Touch
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{CHURCH_INFO.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{CHURCH_INFO.email}</span>
                    </div>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-2">Office Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="bg-gradient-to-r from-primary/90 to-primary/70 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Join Our Family</h2>
                <p className="text-white/90 mb-6">
                  Whether you're new to faith or looking for a church home, we'd love to welcome you!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Plan Your Visit
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </TooltipProvider>
  );
}