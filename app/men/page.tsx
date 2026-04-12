// app/men/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  Church,
  Cross,
  Hand,
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
  Trees,
  Cloud,
  Sun,
  Home,
  Building2,
  Sword,
  Anchor,
  Flame,
  Wrench,
  Hammer,
  HardHat,
  Truck,
  Bike,
  Footprints,
  Flag,
  Bell,
  CheckCircle,
  Users2,
  MessageSquare,
  Video,
  Mic,
  Headphones,
  Upload,
  ImageIcon,
  FileAudio,
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ThumbsUp,
  Send,
  MoreVertical,
  Bookmark,
  Baby,
  Music,
  Gamepad,
  BookOpen,
} from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Import Header and Footer
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

// =============== TYPES ===============
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: 'devotional' | 'testimony' | 'teaching' | 'news' | 'challenge';
  tags: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
  isPublished: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
}

interface AudioSermon {
  id: string;
  title: string;
  speaker: string;
  description: string;
  audioUrl: string;
  duration: string;
  fileSize: string;
  category: string;
  date: Date;
  coverImage?: string;
  plays: number;
  downloads: number;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  event: string;
  date: Date;
  uploadedBy: string;
  likes: number;
  views: number;
}

interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: Date;
  imageCount: number;
  images: GalleryImage[];
}

// =============== EDITABLE CONTENT ===============

const MENS_FELLOWSHIP_INFO = {
  name: 'Iron Sharpens Iron',
  tagline: 'Forging godly men through faith, fellowship, and action!',
  founded: 2015,
  members_count: 120,
  meeting_day: 'Saturday',
  meeting_time: '7:00 AM - 9:00 AM',
  location: 'Fellowship Hall, Grace Community Church',
  vision: 'To raise a generation of godly men who lead their families, serve their church, and impact their communities with the love of Christ.',
  mission: 'To disciple men through authentic relationships, biblical teaching, and practical service opportunities.',
  email: 'men@gracechurch.org',
  phone: '+263 242 123 458',
  verse: 'As iron sharpens iron, so one man sharpens another. - Proverbs 27:17',
};

// Core Values
const CORE_VALUES = [
  {
    id: 1,
    title: 'Brotherhood',
    description: 'Building authentic relationships with other men who encourage and challenge you.',
    icon: Users2,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    title: 'Integrity',
    description: 'Living with honesty, accountability, and moral courage in every area of life.',
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    title: 'Servant Leadership',
    description: 'Following Christ\'s example by serving our families, church, and community.',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 4,
    title: 'Spiritual Growth',
    description: 'Pursuing a deeper relationship with God through prayer, Scripture, and discipleship.',
    icon: Flame,
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 5,
    title: 'Action',
    description: 'Putting faith into practice through service projects and community outreach.',
    icon: Footprints,
    color: 'bg-purple-100 text-purple-700',
  },
];

// Leadership Team
const LEADERSHIP = [
  {
    id: 1,
    name: 'Pastor James Makoni',
    title: 'Men\'s Ministry Director',
    bio: 'James has been leading men\'s ministry for 8 years and has a passion for discipleship and mentorship.',
    email: 'james.makoni@gracechurch.org',
    avatar: 'JM',
  },
  {
    id: 2,
    name: 'Elder Tendai Ncube',
    title: 'Discipleship Coordinator',
    bio: 'Tendai leads our small groups and one-on-one mentorship programs.',
    email: 'tendai.ncube@gracechurch.org',
    avatar: 'TN',
  },
  {
    id: 3,
    name: 'Dr. Samuel Moyo',
    title: 'Teaching Team Lead',
    bio: 'Samuel brings deep biblical insight and practical application to our teaching sessions.',
    email: 'samuel.moyo@gracechurch.org',
    avatar: 'SM',
  },
  {
    id: 4,
    name: 'Brother Michael Banda',
    title: 'Outreach Coordinator',
    bio: 'Michael organizes our community service projects and men\'s retreats.',
    email: 'michael.banda@gracechurch.org',
    avatar: 'MB',
  },
];

// Weekly Activities
const WEEKLY_ACTIVITIES = [
  {
    id: 1,
    day: 'Saturday',
    activities: [
      '6:45 AM - Coffee & Fellowship',
      '7:00 AM - Worship & Prayer',
      '7:30 AM - Bible Teaching',
      '8:15 AM - Small Group Discussion',
      '8:45 AM - Prayer & Breakfast',
    ],
  },
  {
    id: 2,
    day: 'Wednesday',
    activities: [
      '6:00 AM - Early Morning Prayer',
      '7:00 AM - Men\'s Bible Study',
    ],
  },
  {
    id: 3,
    day: 'Thursday',
    activities: [
      '7:00 PM - Accountability Groups',
      '8:30 PM - Evening Fellowship',
    ],
  },
];

// Special Events
const SPECIAL_EVENTS = [
  {
    id: 1,
    title: 'Men\'s Retreat 2024',
    date: 'September 20-22, 2024',
    location: 'Nyanga National Park',
    description: 'A weekend of spiritual renewal, outdoor adventures, and brotherhood. Includes hiking, campfire discussions, and worship.',
    cost: '$85 per person',
    spots_left: 25,
    icon: Mountain,
  },
  {
    id: 2,
    title: 'Father-Son Campout',
    date: 'November 8-10, 2024',
    location: 'Lake Chivero',
    description: 'Build lasting memories with your son! Fishing, games, and meaningful conversations around the campfire.',
    cost: '$40 per family',
    spots_left: 30,
    icon: Trees,
  },
  {
    id: 3,
    title: 'Men\'s Conference',
    date: 'March 14-15, 2025',
    location: 'Grace Convention Centre',
    description: 'Powerful speakers, workshops, and worship focused on equipping men for godly leadership.',
    cost: '$35 early bird',
    spots_left: 100,
    icon: Users2,
  },
  {
    id: 4,
    title: 'Service Saturday',
    date: 'Monthly - Last Saturday',
    location: 'Various Locations',
    description: 'Putting faith into action through community service projects in our city.',
    cost: 'Free',
    spots_left: 50,
    icon: Wrench,
  },
];

// Programs
const PROGRAMS = [
  {
    id: 1,
    title: 'One-on-One Mentoring',
    description: 'Connect with an older, wiser man for personal discipleship and growth.',
    icon: User,
  },
  {
    id: 2,
    title: 'Small Groups',
    description: 'Weekly gatherings of 6-8 men for Bible study, prayer, and accountability.',
    icon: Users2,
  },
  {
    id: 3,
    title: 'Man2Man Podcast',
    description: 'Weekly discussions on faith, family, work, and the challenges men face.',
    icon: Mic,
  },
  {
    id: 4,
    title: 'Financial Freedom',
    description: 'Biblical principles for managing money, getting out of debt, and generous giving.',
    icon: DollarSign,
  },
  {
    id: 5,
    title: 'Workplace Witness',
    description: 'Equipping men to live out their faith with integrity in the workplace.',
    icon: Briefcase,
  },
  {
    id: 6,
    title: 'Fatherhood Forum',
    description: 'Practical wisdom for being a godly father at every stage.',
    icon: Baby,
  },
  {
    id: 7,
    title: 'Sports Outreach',
    description: 'Soccer, basketball, and golf events for fellowship and evangelism.',
    icon: Trophy,
  },
  {
    id: 8,
    title: 'Men\'s Breakfast',
    description: 'Monthly Saturday breakfast with great food and inspiring testimonies.',
    icon: Coffee,
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'David Chen',
    years: 3,
    text: 'Men\'s fellowship has been a game-changer for me. I\'ve found brothers who hold me accountable and help me grow in my faith.',
  },
  {
    id: 2,
    name: 'Pastor Thomas Moyo',
    years: 8,
    text: 'The mentorship program connected me with a godly man who has guided me through some of the toughest seasons of my life.',
  },
  {
    id: 3,
    name: 'Michael Banda',
    years: 2,
    text: 'I came looking for community and found a family. These men have become like brothers to me.',
  },
  {
    id: 4,
    name: 'Samuel Ndlovu',
    years: 5,
    text: 'The teaching is practical and biblical. I\'ve grown more in the last few years than in the previous decade.',
  },
];

// Background images - Using local placeholders to avoid domain issues
const backgroundImages = [
  {
    url: "/images/men-fellowship-bg-1.jpg",
    location: "Men's Fellowship",
    fallbackColor: "from-blue-900 to-slate-900"
  },
  {
    url: "/images/men-fellowship-bg-2.jpg",
    location: "Men Praying",
    fallbackColor: "from-slate-800 to-blue-900"
  },
  {
    url: "/images/men-fellowship-bg-3.jpg",
    location: "Mountain Retreat",
    fallbackColor: "from-blue-800 to-slate-800"
  },
];

// =============== MOCK DATA ===============
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Ways to Lead Your Family with Love',
    content: '<p>As men, we are called to lead our families with the same sacrificial love Christ showed the church. Here are five practical ways to do this...</p><p>1. Pray with and for your family daily<br>2. Serve your wife as Christ serves the church<br>3. Be present and engaged with your children<br>4. Model integrity in all you do<br>5. Create a culture of grace in your home</p>',
    excerpt: 'Practical wisdom for leading your family with Christ-like love and intentionality.',
    author: { name: 'Pastor James Makoni', avatar: 'JM' },
    category: 'teaching',
    tags: ['Family', 'Leadership', 'Love'],
    coverImage: '/images/blog-family-leadership.jpg',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    likes: 45,
    comments: [],
    isPublished: true,
  },
  {
    id: '2',
    title: 'My Journey from Addiction to Freedom',
    content: '<p>I never thought I would be standing here today sharing my testimony. For years, I was trapped in addiction, hiding from my family, my church, and my God...</p><p>But God never gave up on me. Through the men\'s fellowship, I found brothers who loved me unconditionally and pointed me to the only One who could truly set me free.</p>',
    excerpt: 'A powerful testimony of how God broke the chains of addiction and restored a family.',
    author: { name: 'Michael Banda', avatar: 'MB' },
    category: 'testimony',
    tags: ['Testimony', 'Freedom', 'Recovery'],
    coverImage: '/images/blog-testimony.jpg',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    likes: 89,
    comments: [],
    isPublished: true,
  },
  {
    id: '3',
    title: 'Daily Devotional: The Armor of God',
    content: '<p>Ephesians 6:10-18 reminds us that we are in a spiritual battle every single day. As men, we are called to stand firm and fight for our families, our faith, and our future...</p><p>This 7-day devotional will walk you through each piece of the armor of God and how to put it on daily.</p>',
    excerpt: 'A 7-day devotional on putting on the full armor of God daily.',
    author: { name: 'Dr. Samuel Moyo', avatar: 'SM' },
    category: 'devotional',
    tags: ['Devotional', 'Spiritual Warfare', 'Prayer'],
    coverImage: '/images/blog-devotional.jpg',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    likes: 67,
    comments: [],
    isPublished: true,
  },
];

const mockAudioSermons: AudioSermon[] = [
  {
    id: '1',
    title: 'The Call to Godly Manhood',
    speaker: 'Pastor James Makoni',
    description: 'Exploring what it truly means to be a man of God in today\'s world.',
    audioUrl: '#',
    duration: '45:23',
    fileSize: '15.6 MB',
    category: 'Manhood',
    date: new Date('2024-03-09'),
    coverImage: '/images/audio-manhood.jpg',
    plays: 234,
    downloads: 89,
  },
  {
    id: '2',
    title: 'Overcoming Temptation',
    speaker: 'Elder Tendai Ncube',
    description: 'Biblical strategies for resisting temptation and walking in purity.',
    audioUrl: '#',
    duration: '38:15',
    fileSize: '13.2 MB',
    category: 'Purity',
    date: new Date('2024-03-02'),
    coverImage: '/images/audio-purity.jpg',
    plays: 456,
    downloads: 167,
  },
  {
    id: '3',
    title: 'Leading with Integrity',
    speaker: 'Dr. Samuel Moyo',
    description: 'Practical wisdom for maintaining integrity in business, family, and ministry.',
    audioUrl: '#',
    duration: '52:07',
    fileSize: '17.8 MB',
    category: 'Leadership',
    date: new Date('2024-02-24'),
    plays: 189,
    downloads: 72,
  },
];

const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Morning Prayer',
    description: 'Men gathered for early morning prayer',
    imageUrl: '/images/gallery-prayer.jpg',
    thumbnailUrl: '/images/gallery-prayer-thumb.jpg',
    event: 'Saturday Fellowship',
    date: new Date('2024-03-09'),
    uploadedBy: 'James Makoni',
    likes: 34,
    views: 156,
  },
  {
    id: '2',
    title: 'Men\'s Retreat 2023',
    description: 'Group photo at Nyanga',
    imageUrl: '/images/gallery-retreat.jpg',
    thumbnailUrl: '/images/gallery-retreat-thumb.jpg',
    event: 'Men\'s Retreat',
    date: new Date('2023-09-22'),
    uploadedBy: 'Michael Banda',
    likes: 78,
    views: 345,
  },
  {
    id: '3',
    title: 'Community Service',
    description: 'Building project in the community',
    imageUrl: '/images/gallery-service.jpg',
    thumbnailUrl: '/images/gallery-service-thumb.jpg',
    event: 'Service Saturday',
    date: new Date('2024-02-24'),
    uploadedBy: 'Tendai Ncube',
    likes: 56,
    views: 234,
  },
  {
    id: '4',
    title: 'Father-Son Campout',
    description: 'Dads and sons at Lake Chivero',
    imageUrl: '/images/gallery-campout.jpg',
    thumbnailUrl: '/images/gallery-campout-thumb.jpg',
    event: 'Campout',
    date: new Date('2023-11-10'),
    uploadedBy: 'James Makoni',
    likes: 92,
    views: 412,
  },
  {
    id: '5',
    title: 'Men\'s Breakfast',
    description: 'Monthly fellowship breakfast',
    imageUrl: '/images/gallery-breakfast.jpg',
    thumbnailUrl: '/images/gallery-breakfast-thumb.jpg',
    event: 'Men\'s Breakfast',
    date: new Date('2024-03-02'),
    uploadedBy: 'Samuel Moyo',
    likes: 45,
    views: 189,
  },
  {
    id: '6',
    title: 'Bible Study Group',
    description: 'Wednesday morning study',
    imageUrl: '/images/gallery-biblestudy.jpg',
    thumbnailUrl: '/images/gallery-biblestudy-thumb.jpg',
    event: 'Bible Study',
    date: new Date('2024-03-06'),
    uploadedBy: 'Tendai Ncube',
    likes: 28,
    views: 123,
  },
];

const mockAlbums: GalleryAlbum[] = [
  {
    id: '1',
    title: 'Men\'s Retreat 2023',
    description: 'A weekend of spiritual renewal in Nyanga',
    coverImage: '/images/album-retreat.jpg',
    date: new Date('2023-09-22'),
    imageCount: 45,
    images: mockGalleryImages.filter(img => img.event === 'Men\'s Retreat'),
  },
  {
    id: '2',
    title: 'Service Projects 2023-2024',
    description: 'Serving our community together',
    coverImage: '/images/album-service.jpg',
    date: new Date('2024-02-24'),
    imageCount: 28,
    images: mockGalleryImages.filter(img => img.event === 'Service Saturday'),
  },
];

// =============== COMPONENTS ===============

// Safe Image component with fallback
const SafeImage = ({ src, alt, className, fill, ...props }: { src: string; alt: string; className?: string; fill?: boolean; [key: string]: any }) => {
  const [error, setError] = useState(false);
  
  if (error || !src || src.startsWith('/images/')) {
    // Return a colored div as fallback for missing images
    return (
      <div 
        className={`bg-gradient-to-br from-blue-400 to-slate-600 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : {}}
      >
        <ImageIcon className="h-8 w-8 text-white/50" />
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      onError={() => setError(true)}
      {...props}
    />
  );
};

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500">{label}</p>
    </CardContent>
  </Card>
);

const ValueCard = ({ value }: { value: any }) => {
  const Icon = value.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${value.color} shadow-lg`}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{value.title}</h3>
        <p className="text-sm text-gray-500">{value.description}</p>
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
          <div className="p-2 rounded-lg bg-blue-100">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">{program.title}</h4>
            <p className="text-xs text-gray-500">{program.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const Icon = event.icon;
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{event.title}</h3>
              <Badge variant="outline">{event.cost}</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{event.description}</p>
            {event.spots_left && (
              <div className="flex items-center justify-between">
                <Badge variant="outline">{event.spots_left} spots left</Badge>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Register</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LeadershipCard = ({ person }: { person: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-blue-200">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-bold">
            {person.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-gray-800">{person.name}</h3>
          <p className="text-sm text-blue-600 font-medium">{person.title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">{person.bio}</p>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-gray-500">{person.email}</span>
      </div>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
    <CardContent className="p-6">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Heart className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <p className="text-gray-500 mb-4 italic text-center">"{testimonial.text}"</p>
      <div className="text-center">
        <p className="font-semibold text-gray-800">{testimonial.name}</p>
        <p className="text-xs text-gray-500">Member for {testimonial.years} years</p>
      </div>
    </CardContent>
  </Card>
);

const BlogPostCard = ({ post, onLike, onComment, onEdit, onDelete }: { 
  post: BlogPost; 
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden">
      {post.coverImage && (
        <div className="relative h-48 w-full bg-gradient-to-br from-blue-400 to-slate-600">
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {post.author.avatar || post.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-800">{post.author.name}</p>
              <p className="text-xs text-gray-500">
                {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{post.category}</Badge>
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
        <div className="mb-3">
          {showFullContent ? (
            <div 
              className="text-gray-500 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-500">{post.excerpt}</p>
          )}
          {post.content && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => onLike(post.id)}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {showComments && (
          <div className="mt-4">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={() => {
                  if (commentText.trim()) {
                    onComment(post.id);
                    setCommentText('');
                  }
                }}
                disabled={!commentText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {post.comments.length > 0 && (
              <div className="space-y-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AudioCard = ({ audio, onPlay, onDownload }: { 
  audio: AudioSermon; 
  onPlay: (audio: AudioSermon) => void;
  onDownload: (audio: AudioSermon) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="flex">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-400 to-slate-600">
          {audio.coverImage && (
            <SafeImage
              src={audio.coverImage}
              alt={audio.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{audio.title}</h4>
              <p className="text-sm text-gray-500">{audio.speaker}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{audio.duration}</span>
                <span>{audio.fileSize}</span>
                <span>{audio.date.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      onPlay(audio);
                    }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onDownload(audio)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{audio.category}</Badge>
            <span className="text-xs text-gray-500">
              <Headphones className="h-3 w-3 inline mr-1" />
              {audio.plays} plays
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const GalleryImageCard = ({ image, onView, onLike }: { 
  image: GalleryImage; 
  onView: (image: GalleryImage) => void;
  onLike: (id: string) => void;
}) => (
  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden group cursor-pointer" onClick={() => onView(image)}>
    <div className="relative aspect-square bg-gradient-to-br from-blue-400 to-slate-600">
      <SafeImage
        src={image.thumbnailUrl || image.imageUrl}
        alt={image.title}
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Eye className="h-8 w-8 text-white" />
      </div>
    </div>
    <CardContent className="p-3">
      <h5 className="font-medium text-gray-800 text-sm truncate">{image.title}</h5>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">{image.event}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onLike(image.id);
          }}
        >
          <Heart className="h-3 w-3 mr-1" />
          <span className="text-xs">{image.likes}</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CreateBlogDialog = ({ open, onOpenChange, onSave, initialData }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Partial<BlogPost>) => void;
  initialData?: BlogPost;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'devotional',
    tags: initialData?.tags?.join(', ') || '',
    coverImage: initialData?.coverImage || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            Share your thoughts, testimonies, and teachings with the men's fellowship.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt/Summary *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content (HTML supported) *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(v) => setFormData({ ...formData, category: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="devotional">Devotional</SelectItem>
                <SelectItem value="testimony">Testimony</SelectItem>
                <SelectItem value="teaching">Teaching</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Prayer, Leadership, Family"
            />
          </div>
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="/images/your-image.jpg or https://..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? 'Update' : 'Publish'} Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UploadAudioDialog = ({ open, onOpenChange, onUpload }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (audio: Partial<AudioSermon>) => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    description: '',
    category: 'Sermon',
    audioFile: null as File | null,
    coverImage: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, audioFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      onUpload({
        title: formData.title,
        speaker: formData.speaker,
        description: formData.description,
        category: formData.category,
        audioUrl: '#',
        duration: '32:15',
        fileSize: formData.audioFile ? `${(formData.audioFile.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
        coverImage: formData.coverImage,
      });
      
      toast.success('Audio uploaded successfully!');
      setIsUploading(false);
      setUploadProgress(0);
      setFormData({ title: '', speaker: '', description: '', category: 'Sermon', audioFile: null, coverImage: '' });
      onOpenChange(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Audio Sermon</DialogTitle>
          <DialogDescription>
            Share teachings and messages with the men's fellowship.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="audioTitle">Title *</Label>
            <Input
              id="audioTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="speaker">Speaker *</Label>
            <Input
              id="speaker"
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sermon">Sermon</SelectItem>
                <SelectItem value="Teaching">Teaching</SelectItem>
                <SelectItem value="Testimony">Testimony</SelectItem>
                <SelectItem value="Podcast">Podcast</SelectItem>
                <SelectItem value="Worship">Worship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Audio File *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileSelect}
                required={!formData.audioFile}
              />
              <FileAudio className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              {formData.audioFile ? (
                <div>
                  <p className="text-sm font-medium">{formData.audioFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.audioFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm">Click to select or drag and drop</p>
                  <p className="text-xs text-gray-500">MP3, M4A, WAV up to 100MB</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="audioCover">Cover Image URL (optional)</Label>
            <Input
              id="audioCover"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="/images/your-image.jpg or https://..."
            />
          </div>
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isUploading || !formData.audioFile}>
              {isUploading ? 'Uploading...' : 'Upload Audio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UploadImageDialog = ({ open, onOpenChange, onUpload }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (image: Partial<GalleryImage>) => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event: '',
    imageFile: null as File | null,
    imagePreview: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ 
        ...formData, 
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      onUpload({
        title: formData.title,
        description: formData.description,
        event: formData.event,
        imageUrl: formData.imagePreview,
        thumbnailUrl: formData.imagePreview,
      });
      
      toast.success('Image uploaded successfully!');
      setIsUploading(false);
      setUploadProgress(0);
      setFormData({ title: '', description: '', event: '', imageFile: null, imagePreview: '' });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>
            Share photos from men's fellowship events and gatherings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Photo *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                required={!formData.imageFile}
              />
              {formData.imagePreview ? (
                <div className="relative h-40 w-full">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="object-contain rounded-lg w-full h-full"
                  />
                </div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Click to select a photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="imageTitle">Title *</Label>
            <Input
              id="imageTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="imageDescription">Description</Label>
            <Textarea
              id="imageDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="event">Event/Album *</Label>
            <Input
              id="event"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              placeholder="e.g., Men's Retreat 2024"
              required
            />
          </div>
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isUploading || !formData.imageFile}>
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const LightboxModal = ({ image, onClose, onNext, onPrevious, hasNext, hasPrevious }: {
  image: GalleryImage | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  if (!image) return null;

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black/95">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={onNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
          <div className="relative w-full h-[80vh] bg-gradient-to-br from-blue-900 to-slate-900">
            <SafeImage
              src={image.imageUrl}
              alt={image.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="font-bold text-lg">{image.title}</h3>
            {image.description && <p className="text-sm text-white/80">{image.description}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>{image.event}</span>
              <span>{image.date.toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> {image.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {image.views}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============== MAIN PAGE ===============
export default function MensFellowshipPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('Grace Community Church');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '' 
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [audioSermons, setAudioSermons] = useState<AudioSermon[]>(mockAudioSermons);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(mockGalleryImages);
  const [albums, setAlbums] = useState<GalleryAlbum[]>(mockAlbums);
  
  const [createBlogOpen, setCreateBlogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [uploadAudioOpen, setUploadAudioOpen] = useState(false);
  const [uploadImageOpen, setUploadImageOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryView, setGalleryView] = useState<'grid' | 'albums'>('grid');
  
  const [currentAudio, setCurrentAudio] = useState<AudioSermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleCreateBlog = (post: Partial<BlogPost>) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      author: { name: user?.name || 'Anonymous', avatar: user?.name?.[0] },
      category: post.category || 'devotional',
      tags: post.tags || [],
      coverImage: post.coverImage,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      comments: [],
      isPublished: true,
    };
    setBlogPosts([newPost, ...blogPosts]);
    toast.success('Blog post published!');
  };

  const handleUpdateBlog = (post: Partial<BlogPost>) => {
    if (!editingPost) return;
    setBlogPosts(blogPosts.map(p => 
      p.id === editingPost.id 
        ? { ...p, ...post, updatedAt: new Date() }
        : p
    ));
    setEditingPost(undefined);
    toast.success('Blog post updated!');
  };

  const handleDeleteBlog = (id: string) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
    toast.success('Blog post deleted!');
  };

  const handleLikeBlog = (id: string) => {
    setBlogPosts(blogPosts.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const handleCommentBlog = (id: string) => {
    toast.success('Comment added!');
  };

  const handleUploadAudio = (audio: Partial<AudioSermon>) => {
    const newAudio: AudioSermon = {
      id: Date.now().toString(),
      title: audio.title || '',
      speaker: audio.speaker || '',
      description: audio.description || '',
      audioUrl: audio.audioUrl || '#',
      duration: audio.duration || '0:00',
      fileSize: audio.fileSize || '0 MB',
      category: audio.category || 'Sermon',
      date: new Date(),
      coverImage: audio.coverImage,
      plays: 0,
      downloads: 0,
    };
    setAudioSermons([newAudio, ...audioSermons]);
  };

  const handlePlayAudio = (audio: AudioSermon) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
    setAudioSermons(audioSermons.map(a => 
      a.id === audio.id ? { ...a, plays: a.plays + 1 } : a
    ));
  };

  const handleDownloadAudio = (audio: AudioSermon) => {
    setAudioSermons(audioSermons.map(a => 
      a.id === audio.id ? { ...a, downloads: a.downloads + 1 } : a
    ));
    toast.success(`Downloading ${audio.title}...`);
  };

  const handleUploadImage = (image: Partial<GalleryImage>) => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      title: image.title || '',
      description: image.description,
      imageUrl: image.imageUrl || '',
      thumbnailUrl: image.thumbnailUrl || image.imageUrl || '',
      event: image.event || 'General',
      date: new Date(),
      uploadedBy: user?.name || 'Anonymous',
      likes: 0,
      views: 0,
    };
    setGalleryImages([newImage, ...galleryImages]);
    
    const existingAlbum = albums.find(a => a.title === newImage.event);
    if (existingAlbum) {
      setAlbums(albums.map(a => 
        a.id === existingAlbum.id 
          ? { ...a, imageCount: a.imageCount + 1, images: [...a.images, newImage] }
          : a
      ));
    } else {
      const newAlbum: GalleryAlbum = {
        id: Date.now().toString(),
        title: newImage.event,
        description: '',
        coverImage: newImage.thumbnailUrl,
        date: new Date(),
        imageCount: 1,
        images: [newImage],
      };
      setAlbums([...albums, newAlbum]);
    }
  };

  const handleLikeImage = (id: string) => {
    setGalleryImages(galleryImages.map(img => 
      img.id === id ? { ...img, likes: img.likes + 1 } : img
    ));
  };

  const handleViewImage = (image: GalleryImage) => {
    const index = galleryImages.findIndex(img => img.id === image.id);
    setLightboxIndex(index);
    setLightboxImage(image);
    setGalleryImages(galleryImages.map(img => 
      img.id === image.id ? { ...img, views: img.views + 1 } : img
    ));
  };

  const handleLightboxNext = () => {
    const nextIndex = lightboxIndex + 1;
    if (nextIndex < galleryImages.length) {
      setLightboxIndex(nextIndex);
      setLightboxImage(galleryImages[nextIndex]);
    }
  };

  const handleLightboxPrevious = () => {
    const prevIndex = lightboxIndex - 1;
    if (prevIndex >= 0) {
      setLightboxIndex(prevIndex);
      setLightboxImage(galleryImages[prevIndex]);
    }
  };

  const statsData = [
    { icon: Users2, value: MENS_FELLOWSHIP_INFO.members_count.toString(), label: "Men Connected" },
    { icon: Calendar, value: "10+", label: "Events Yearly" },
    { icon: HeartHandshake, value: "25+", label: "Mentors" },
    { icon: Flag, value: "5", label: "Core Values" },
  ];

  const isAdmin = isLoggedIn;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              background: `linear-gradient(to bottom right, ${index === 0 ? '#1e3a5f, #0f172a' : index === 1 ? '#0f172a, #1e3a5f' : '#1e3a5f, #0f172a'})`,
              opacity: index === currentWallpaperIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-slate-500/20 to-blue-500/20" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4 gap-2">
                <div className="animate-pulse">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div className="animate-pulse delay-100">
                  <Sword className="h-8 w-8 text-slate-400" />
                </div>
                <div className="animate-pulse delay-200">
                  <Crown className="h-8 w-8 text-amber-400" />
                </div>
                <div className="animate-pulse delay-300">
                  <Anchor className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Men's Fellowship • Est. {MENS_FELLOWSHIP_INFO.founded}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {MENS_FELLOWSHIP_INFO.name}
              </h1>
              <p className="text-xl text-white/90 mb-4 leading-relaxed">
                {MENS_FELLOWSHIP_INFO.tagline}
              </p>
              <p className="text-lg text-white/70 mb-8 italic">
                "{MENS_FELLOWSHIP_INFO.verse}"
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white shadow-lg" onClick={() => setRegisterDialogOpen(true)}>
                  <Users2 className="h-5 w-5 mr-2" /> Join the Fellowship
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" onClick={() => setActiveTab('events')}>
                  Upcoming Events
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-7 mb-8 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

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
                      <p className="text-gray-500 leading-relaxed">{MENS_FELLOWSHIP_INFO.vision}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-slate-100">
                          <Rocket className="h-8 w-8 text-slate-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                      <p className="text-gray-500 leading-relaxed">{MENS_FELLOWSHIP_INFO.mission}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Core Values</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {CORE_VALUES.map((value) => (
                      <ValueCard key={value.id} value={value} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6" /> Weekly Gatherings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {WEEKLY_ACTIVITIES.map((day) => (
                      <Card key={day.day} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold text-center text-blue-700">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Clock className="h-3 w-3 text-blue-500 mt-0.5" />
                                <span className="text-gray-500">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Leadership Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LEADERSHIP.map((person) => (
                      <LeadershipCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Testimonials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TESTIMONIALS.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="blog" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Men's Fellowship Blog</h2>
                  {isAdmin && (
                    <Button onClick={() => { setEditingPost(undefined); setCreateBlogOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" /> New Post
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <BlogPostCard 
                      key={post.id} 
                      post={post} 
                      onLike={handleLikeBlog}
                      onComment={handleCommentBlog}
                      onEdit={isAdmin ? (p) => { setEditingPost(p); setCreateBlogOpen(true); } : undefined}
                      onDelete={isAdmin ? handleDeleteBlog : undefined}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Audio Sermons & Teachings</h2>
                  {isAdmin && (
                    <Button onClick={() => setUploadAudioOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" /> Upload Audio
                    </Button>
                  )}
                </div>
                
                {currentAudio && (
                  <Card className="bg-gradient-to-r from-blue-600 to-slate-700 text-white border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <div className="flex-1">
                          <h4 className="font-bold">Now Playing: {currentAudio.title}</h4>
                          <p className="text-sm text-white/80">{currentAudio.speaker}</p>
                        </div>
                        <Volume2 className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {audioSermons.map((audio) => (
                    <AudioCard 
                      key={audio.id} 
                      audio={audio} 
                      onPlay={handlePlayAudio}
                      onDownload={handleDownloadAudio}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
                    <div className="flex gap-1">
                      <Button 
                        variant={galleryView === 'grid' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setGalleryView('grid')}
                        className={galleryView === 'grid' ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm'}
                      >
                        All Photos
                      </Button>
                      <Button 
                        variant={galleryView === 'albums' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setGalleryView('albums')}
                        className={galleryView === 'albums' ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm'}
                      >
                        Albums
                      </Button>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button onClick={() => setUploadImageOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" /> Upload Photo
                    </Button>
                  )}
                </div>

                {galleryView === 'grid' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <GalleryImageCard 
                        key={image.id} 
                        image={image} 
                        onView={handleViewImage}
                        onLike={handleLikeImage}
                      />
                    ))}
                  </div>
                )}

                {galleryView === 'albums' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {albums.map((album) => (
                      <Card 
                        key={album.id} 
                        className="bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-slate-600">
                          <SafeImage
                            src={album.coverImage}
                            alt={album.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="font-bold text-lg">{album.title}</h3>
                            <p className="text-sm text-white/80">{album.imageCount} photos</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SPECIAL_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">View Full Calendar</Button>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Our Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROGRAMS.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Recommended Books</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>Wild at Heart - John Eldredge</li>
                        <li>Disciplines of a Godly Man</li>
                        <li>The Man in the Mirror</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Headphones className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Podcasts</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>Man2Man Weekly</li>
                        <li>Iron Sharpens Iron</li>
                        <li>Men in the Arena</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Video className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Video Series</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>33 The Series</li>
                        <li>Stepping Up</li>
                        <li>The Resolution for Men</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Hand className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Need Prayer or Mentorship?</h3>
                    <p className="text-gray-500 mb-4">
                      We're here to support you. Reach out for prayer or to connect with a mentor.
                    </p>
                    <Button onClick={() => setContactDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      Contact Us
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="bg-gradient-to-r from-blue-600 via-slate-700 to-blue-600 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Become the Man God Called You to Be!</h2>
                <p className="text-white/90 mb-6">
                  Join a brotherhood of men committed to growing in faith, leading with integrity, and making a difference.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setRegisterDialogOpen(true)}>
                    Join Men's Fellowship
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

      <CreateBlogDialog 
        open={createBlogOpen} 
        onOpenChange={setCreateBlogOpen}
        onSave={editingPost ? handleUpdateBlog : handleCreateBlog}
        initialData={editingPost}
      />

      <UploadAudioDialog 
        open={uploadAudioOpen} 
        onOpenChange={setUploadAudioOpen}
        onUpload={handleUploadAudio}
      />

      <UploadImageDialog 
        open={uploadImageOpen} 
        onOpenChange={setUploadImageOpen}
        onUpload={handleUploadImage}
      />

      <LightboxModal 
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
        onNext={handleLightboxNext}
        onPrevious={handleLightboxPrevious}
        hasNext={lightboxIndex < galleryImages.length - 1}
        hasPrevious={lightboxIndex > 0}
      />

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">Join Men's Fellowship</DialogTitle>
            <DialogDescription>
              We're excited to have you join us! Fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
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
              <Label htmlFor="message">What are you hoping to get out of Men's Fellowship?</Label>
              <Textarea
                id="message"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-slate-700">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Contact Men's Fellowship</DialogTitle>
            <DialogDescription>
              Have questions or need prayer? We're here for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact_name">Your Name *</Label>
              <Input
                id="contact_name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
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
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-slate-700">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}