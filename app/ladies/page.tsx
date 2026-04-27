// app/ladies/page.tsx
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
  Moon,
  Home,
  Building2,
  Flower,
  Gem,
  Baby,
  Music,
  Gamepad2,
  BookOpen,
  Book,
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
  Scissors,
  Paintbrush,
  ShoppingBag,
  Wine,
  Cake,
  PartyPopper,
  Smile,
  Feather,
  Bird,
  Leaf,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  category: 'devotional' | 'testimony' | 'teaching' | 'news' | 'lifestyle';
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

const LADIES_FELLOWSHIP_INFO = {
  name: 'Daughters of the King',
  tagline: 'Empowering women to live boldly, love deeply, and shine brightly for Christ!',
  founded: 2013,
  members_count: 150,
  meeting_day: 'Tuesday',
  meeting_time: '10:00 AM - 12:00 PM',
  location: 'Fellowship Hall, AFM Chegutu',
  vision: 'To see every woman know her worth in Christ, discover her God-given purpose, and flourish in every season of life.',
  mission: 'To create a safe, nurturing community where women grow in faith, build authentic friendships, and serve with compassion.',
  email: 'women@afmchegutu.org',
  phone: '+263 242 123 459',
  verse: 'She is clothed with strength and dignity, and she laughs without fear of the future. - Proverbs 31:25',
};

// Core Values
const CORE_VALUES = [
  {
    id: 1,
    title: 'Sisterhood',
    description: 'Building authentic, supportive relationships where women encourage and uplift one another.',
    icon: HeartHandshake,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 2,
    title: 'Identity in Christ',
    description: 'Discovering who we are as beloved daughters of the King and living from that truth.',
    icon: Crown,
    color: 'bg-[#86BBD8]/20 text-[#2A4D69]',
  },
  {
    id: 3,
    title: 'Mentorship',
    description: 'Older women teaching younger women, sharing wisdom across generations.',
    icon: Users2,
    color: 'bg-rose-100 text-rose-700',
  },
  {
    id: 4,
    title: 'Growth',
    description: 'Continually growing in faith, character, and our relationship with God.',
    icon: Flower,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 5,
    title: 'Service',
    description: 'Using our gifts to serve our families, church, and community with love.',
    icon: Hand,
    color: 'bg-amber-100 text-amber-700',
  },
];

// Leadership Team
const LEADERSHIP = [
  {
    id: 1,
    name: 'Mrs. Grace Makoni',
    title: 'Women\'s Ministry Director',
    bio: 'Grace has a heart for women to know their worth in Christ. She has led the women\'s ministry for 7 years and is a certified biblical counselor.',
    email: 'grace.makoni@afmchegutu.org',
    avatar: 'GM',
  },
  {
    id: 2,
    name: 'Auntie Mercy Banda',
    title: 'Mentorship Coordinator',
    bio: 'Mercy oversees our Titus 2 mentorship program, connecting women across generations for discipleship.',
    email: 'mercy.banda@afmchegutu.org',
    avatar: 'MB',
  },
  {
    id: 3,
    name: 'Mrs. Rutendo Moyo',
    title: 'Prayer Ministry Lead',
    bio: 'Rutendo leads our prayer gatherings and intercessory team, believing in the power of women united in prayer.',
    email: 'rutendo.moyo@afmchegutu.org',
    avatar: 'RM',
  },
  {
    id: 4,
    name: 'Sister Chipo Ncube',
    title: 'Events & Outreach Coordinator',
    bio: 'Chipo organizes our retreats, conferences, and community service projects with creativity and excellence.',
    email: 'chipo.ncube@afmchegutu.org',
    avatar: 'CN',
  },
];

// Weekly Activities
const WEEKLY_ACTIVITIES = [
  {
    id: 1,
    day: 'Tuesday',
    activities: [
      '9:45 AM - Coffee & Connection',
      '10:00 AM - Worship & Prayer',
      '10:30 AM - Bible Teaching',
      '11:15 AM - Small Group Discussion',
      '11:45 AM - Fellowship & Refreshments',
    ],
  },
  {
    id: 2,
    day: 'Thursday',
    activities: [
      '6:00 PM - Evening Prayer Gathering',
      '7:00 PM - Women\'s Bible Study',
      '8:30 PM - Dessert & Fellowship',
    ],
  },
  {
    id: 3,
    day: 'Saturday',
    activities: [
      '8:00 AM - Prayer Walk (First Saturday)',
      '10:00 AM - Craft & Connect (Second Saturday)',
      '2:00 PM - Mentorship Meetups (Third Saturday)',
    ],
  },
];

// Special Events
const SPECIAL_EVENTS = [
  {
    id: 1,
    title: 'Women\'s Retreat 2024',
    date: 'October 4-6, 2024',
    location: 'Troutbeck Resort, Nyanga',
    description: 'A weekend of rest, renewal, and sisterhood. Includes worship, teaching, pampering, and beautiful mountain views.',
    cost: '$120 per person',
    spots_left: 30,
    icon: Mountain,
  },
  {
    id: 2,
    title: 'Mother-Daughter Tea Party',
    date: 'November 16, 2024',
    location: 'Grace Gardens',
    description: 'A special afternoon of tea, treats, and creating memories. For mothers and daughters of all ages!',
    cost: '$15 per person',
    spots_left: 60,
    icon: Coffee,
  },
  {
    id: 3,
    title: 'Women\'s Conference 2025',
    date: 'May 9-10, 2025',
    location: 'AFM Chegutu Convention',
    description: '"Flourish" - A conference to help women thrive in every area of life. Dynamic speakers, worship, and workshops.',
    cost: '$45 early bird',
    spots_left: 150,
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Craft & Fellowship Day',
    date: 'Monthly - Second Saturday',
    location: 'Fellowship Hall',
    description: 'Bring your knitting, scrapbooking, or any craft! A relaxed time of creativity and connection.',
    cost: 'Free',
    spots_left: 40,
    icon: Scissors,
  },
];

// Programs
const PROGRAMS = [
  {
    id: 1,
    title: 'Titus 2 Mentoring',
    description: 'Older women mentoring younger women in faith, marriage, parenting, and life.',
    icon: HeartHandshake,
  },
  {
    id: 2,
    title: 'Prayer Sisters',
    description: 'Be paired with a prayer partner for mutual encouragement and intercession.',
    icon: Hand,
  },
  {
    id: 3,
    title: 'She Reads Truth',
    description: 'Book club and Bible study groups meeting in homes throughout the week.',
    icon: BookOpen,
  },
  {
    id: 4,
    title: 'Single & Satisfied',
    description: 'Support and fellowship for single women navigating life, career, and faith.',
    icon: Gem,
  },
  {
    id: 5,
    title: 'Married & Thriving',
    description: 'Encouragement and biblical wisdom for wives at every stage of marriage.',
    icon: Heart,
  },
  {
    id: 6,
    title: 'Moms Connect',
    description: 'Fellowship and support for mothers with children of all ages.',
    icon: Baby,
  },
  {
    id: 7,
    title: 'Creative Hands',
    description: 'Using arts, crafts, and creativity for fellowship and outreach.',
    icon: Paintbrush,
  },
  {
    id: 8,
    title: 'Women in Business',
    description: 'Networking and support for women entrepreneurs and professionals.',
    icon: Briefcase,
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chikwanda',
    years: 4,
    text: 'The women\'s ministry has been a lifeline for me. I\'ve found genuine friendships and grown so much in my faith.',
  },
  {
    id: 2,
    name: 'Mavis Dube',
    years: 2,
    text: 'Through the Titus 2 program, I was paired with a mentor who has walked with me through some of my darkest days.',
  },
  {
    id: 3,
    name: 'Precious Moyo',
    years: 6,
    text: 'I came to this church feeling lonely and lost. These women embraced me and showed me the love of Jesus.',
  },
  {
    id: 4,
    name: 'Linda Ndlovu',
    years: 3,
    text: 'The women\'s retreat changed my life. I encountered God in a powerful way and found my purpose.',
  },
];

// =============== MOCK DATA ===============
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Finding Your Worth in Christ, Not the World',
    content: '<p>For years, I struggled with my self-worth. I looked to achievements, relationships, and appearance to define me. But it was never enough...</p><p>Then I discovered the truth of who I am in Christ. I am chosen, loved, redeemed, and called for a purpose. This changed everything.</p>',
    excerpt: 'Discover the freedom that comes from knowing your true identity as a daughter of the King.',
    author: { name: 'Grace Makoni', avatar: 'GM' },
    category: 'teaching',
    tags: ['Identity', 'Worth', 'Freedom'],
    coverImage: '/images/women-blog-identity.jpg',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12'),
    likes: 78,
    comments: [],
    isPublished: true,
  },
  {
    id: '2',
    title: 'My Journey Through Grief to Hope',
    content: '<p>When I lost my mother, I thought my world had ended. The grief was overwhelming, and I didn\'t know how to move forward...</p><p>But God met me in my pain. Through the prayers of my sisters in Christ and the comfort of His Word, I found hope again.</p>',
    excerpt: 'A testimony of God\'s faithfulness through seasons of loss and sorrow.',
    author: { name: 'Rutendo Moyo', avatar: 'RM' },
    category: 'testimony',
    tags: ['Grief', 'Hope', 'Healing'],
    coverImage: '/images/women-blog-hope.jpg',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08'),
    likes: 112,
    comments: [],
    isPublished: true,
  },
  {
    id: '3',
    title: '5 Tips for a More Peaceful Home',
    content: '<p>As women, we often carry the weight of creating a peaceful atmosphere in our homes. But it doesn\'t have to be overwhelming...</p><p>Here are five practical ways to cultivate peace, starting with your own heart.</p>',
    excerpt: 'Practical wisdom for creating a home filled with peace, joy, and the presence of God.',
    author: { name: 'Mercy Banda', avatar: 'MB' },
    category: 'lifestyle',
    tags: ['Home', 'Peace', 'Family'],
    coverImage: '/images/women-blog-home.jpg',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    likes: 56,
    comments: [],
    isPublished: true,
  },
];

const mockAudioSermons: AudioSermon[] = [
  {
    id: '1',
    title: 'The Proverbs 31 Woman: Myth or Model?',
    speaker: 'Grace Makoni',
    description: 'A fresh look at the Proverbs 31 woman and what she means for us today.',
    audioUrl: '#',
    duration: '42:18',
    fileSize: '14.5 MB',
    category: 'Teaching',
    date: new Date('2024-03-10'),
    coverImage: '/images/women-audio-proverbs31.jpg',
    plays: 345,
    downloads: 123,
  },
  {
    id: '2',
    title: 'Praying with Power and Purpose',
    speaker: 'Rutendo Moyo',
    description: 'Learn to pray with confidence, persistence, and expectation.',
    audioUrl: '#',
    duration: '35:42',
    fileSize: '12.2 MB',
    category: 'Prayer',
    date: new Date('2024-03-03'),
    coverImage: '/images/women-audio-prayer.jpg',
    plays: 567,
    downloads: 234,
  },
  {
    id: '3',
    title: 'Friendships That Flourish',
    speaker: 'Chipo Ncube',
    description: 'Building and maintaining godly friendships in every season of life.',
    audioUrl: '#',
    duration: '48:05',
    fileSize: '16.5 MB',
    category: 'Relationships',
    date: new Date('2024-02-25'),
    plays: 289,
    downloads: 98,
  },
];

const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Women\'s Retreat 2023',
    description: 'Beautiful sisters at Troutbeck',
    imageUrl: '/images/women-gallery-retreat.jpg',
    thumbnailUrl: '/images/women-gallery-retreat-thumb.jpg',
    event: 'Women\'s Retreat',
    date: new Date('2023-10-06'),
    uploadedBy: 'Grace Makoni',
    likes: 67,
    views: 234,
  },
  {
    id: '2',
    title: 'Mother-Daughter Tea',
    description: 'Precious moments together',
    imageUrl: '/images/women-gallery-tea.jpg',
    thumbnailUrl: '/images/women-gallery-tea-thumb.jpg',
    event: 'Tea Party',
    date: new Date('2023-11-18'),
    uploadedBy: 'Chipo Ncube',
    likes: 89,
    views: 345,
  },
  {
    id: '3',
    title: 'Prayer Gathering',
    description: 'Women united in prayer',
    imageUrl: '/images/women-gallery-prayer.jpg',
    thumbnailUrl: '/images/women-gallery-prayer-thumb.jpg',
    event: 'Prayer Meeting',
    date: new Date('2024-02-15'),
    uploadedBy: 'Rutendo Moyo',
    likes: 45,
    views: 178,
  },
  {
    id: '4',
    title: 'Craft & Connect',
    description: 'Creativity and fellowship',
    imageUrl: '/images/women-gallery-craft.jpg',
    thumbnailUrl: '/images/women-gallery-craft-thumb.jpg',
    event: 'Craft Day',
    date: new Date('2024-03-09'),
    uploadedBy: 'Mercy Banda',
    likes: 34,
    views: 156,
  },
  {
    id: '5',
    title: 'Conference 2023',
    description: '"Flourish" Women\'s Conference',
    imageUrl: '/images/women-gallery-conference.jpg',
    thumbnailUrl: '/images/women-gallery-conference-thumb.jpg',
    event: 'Conference',
    date: new Date('2023-05-12'),
    uploadedBy: 'Grace Makoni',
    likes: 156,
    views: 567,
  },
  {
    id: '6',
    title: 'Bible Study Group',
    description: 'Tuesday morning fellowship',
    imageUrl: '/images/women-gallery-bible.jpg',
    thumbnailUrl: '/images/women-gallery-bible-thumb.jpg',
    event: 'Bible Study',
    date: new Date('2024-03-05'),
    uploadedBy: 'Chipo Ncube',
    likes: 23,
    views: 98,
  },
];

const mockAlbums: GalleryAlbum[] = [
  {
    id: '1',
    title: 'Women\'s Retreat 2023',
    description: 'A weekend of rest and renewal in Nyanga',
    coverImage: '/images/women-album-retreat.jpg',
    date: new Date('2023-10-06'),
    imageCount: 45,
    images: mockGalleryImages.filter(img => img.event === 'Women\'s Retreat'),
  },
  {
    id: '2',
    title: 'Flourish Conference 2023',
    description: 'Empowering women to thrive',
    coverImage: '/images/women-album-conference.jpg',
    date: new Date('2023-05-12'),
    imageCount: 78,
    images: mockGalleryImages.filter(img => img.event === 'Conference'),
  },
];

// =============== COMPONENTS ===============

const SafeImage = ({ src, alt, className, fill, ...props }: { src: string; alt: string; className?: string; fill?: boolean; [key: string]: any }) => {
  const [error, setError] = useState(false);
  
  if (error || !src || src.startsWith('/images/')) {
    return (
      <div 
        className={`bg-gradient-to-br from-pink-400 to-[#2A4D69] flex items-center justify-center ${className}`}
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
        <div className="p-3 rounded-full bg-pink-100">
          <Icon className="h-6 w-6 text-pink-600" />
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
          <div className="p-2 rounded-lg bg-pink-100">
            <Icon className="h-5 w-5 text-pink-600" />
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
          <div className="p-3 rounded-lg bg-pink-100">
            <Icon className="h-6 w-6 text-pink-600" />
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
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">Register</Button>
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
        <Avatar className="h-16 w-16 border-2 border-pink-200">
          <AvatarFallback className="bg-pink-100 text-pink-700 text-lg font-bold">
            {person.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-gray-800">{person.name}</h3>
          <p className="text-sm text-pink-600 font-medium">{person.title}</p>
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
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
          <Heart className="h-8 w-8 text-pink-600" />
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
        <div className="relative h-48 w-full bg-gradient-to-br from-pink-400 to-[#2A4D69]">
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
              <AvatarFallback className="bg-pink-100 text-pink-700">
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
              className="p-0 h-auto text-pink-600"
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
        <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-400 to-[#2A4D69]">
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
    <div className="relative aspect-square bg-gradient-to-br from-pink-400 to-[#2A4D69]">
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
            Share your thoughts, testimonies, and teachings with the women's fellowship.
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
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Prayer, Identity, Family"
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
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
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
    category: 'Teaching',
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
      setFormData({ title: '', speaker: '', description: '', category: 'Teaching', audioFile: null, coverImage: '' });
      onOpenChange(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Audio Teaching</DialogTitle>
          <DialogDescription>
            Share teachings and messages with the women's fellowship.
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
                <SelectItem value="Teaching">Teaching</SelectItem>
                <SelectItem value="Testimony">Testimony</SelectItem>
                <SelectItem value="Prayer">Prayer</SelectItem>
                <SelectItem value="Podcast">Podcast</SelectItem>
                <SelectItem value="Worship">Worship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Audio File *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 transition-colors"
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
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isUploading || !formData.audioFile}>
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
            Share photos from women's fellowship events and gatherings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Photo *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 transition-colors"
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
              placeholder="e.g., Women's Retreat 2024"
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
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isUploading || !formData.imageFile}>
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
        <DialogTitle className="sr-only">{image.title}</DialogTitle>
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
          <div className="relative w-full h-[80vh] bg-gradient-to-br from-pink-900 to-purple-900">
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
export default function LadiesFellowshipPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Town Assembly');
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
      category: audio.category || 'Teaching',
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
    { icon: Users2, value: LADIES_FELLOWSHIP_INFO.members_count.toString(), label: "Women Connected" },
    { icon: Calendar, value: "15+", label: "Events Yearly" },
    { icon: HeartHandshake, value: "30+", label: "Mentors" },
    { icon: Flower, value: "5", label: "Core Values" },
  ];

  const isAdmin = isLoggedIn;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-rose-500/20" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4 gap-2">
                <div className="animate-pulse">
                  <Flower className="h-8 w-8 text-pink-400" />
                </div>
                <div className="animate-pulse delay-100">
                  <Crown className="h-8 w-8 text-amber-400" />
                </div>
                <div className="animate-pulse delay-200">
                  <Gem className="h-8 w-8 text-[#86BBD8]/80" />
                </div>
                <div className="animate-pulse delay-300">
                  <Bird className="h-8 w-8 text-rose-400" />
                </div>
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Women's Ministry • Est. {LADIES_FELLOWSHIP_INFO.founded}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {LADIES_FELLOWSHIP_INFO.name}
              </h1>
              <p className="text-xl text-white/90 mb-4 leading-relaxed">
                {LADIES_FELLOWSHIP_INFO.tagline}
              </p>
              <p className="text-lg text-white/70 mb-8 italic">
                "{LADIES_FELLOWSHIP_INFO.verse}"
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-[#2A4D69] hover:from-pink-700 hover:to-[#1e3a52] text-white shadow-lg" onClick={() => setRegisterDialogOpen(true)}>
                  <Heart className="h-5 w-5 mr-2" /> Join the Sisterhood
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
                        <div className="p-3 rounded-full bg-pink-100">
                          <Target className="h-8 w-8 text-pink-600" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                      <p className="text-gray-500 leading-relaxed">{LADIES_FELLOWSHIP_INFO.vision}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-[#86BBD8]/20">
                          <Sparkles className="h-8 w-8 text-[#2A4D69]" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                      <p className="text-gray-500 leading-relaxed">{LADIES_FELLOWSHIP_INFO.mission}</p>
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
                          <CardTitle className="text-lg font-bold text-center text-pink-700">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Clock className="h-3 w-3 text-pink-500 mt-0.5" />
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
                  <h2 className="text-2xl font-bold text-white">Women's Fellowship Blog</h2>
                  {isAdmin && (
                    <Button onClick={() => { setEditingPost(undefined); setCreateBlogOpen(true); }} className="bg-pink-600 hover:bg-pink-700">
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
                  <h2 className="text-2xl font-bold text-white">Audio Teachings</h2>
                  {isAdmin && (
                    <Button onClick={() => setUploadAudioOpen(true)} className="bg-pink-600 hover:bg-pink-700">
                      <Upload className="h-4 w-4 mr-2" /> Upload Audio
                    </Button>
                  )}
                </div>
                
                {currentAudio && (
                  <Card className="bg-gradient-to-r from-pink-600 to-[#2A4D69] text-white border-0">
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
                        className={galleryView === 'grid' ? 'bg-pink-600' : 'bg-white/20 backdrop-blur-sm'}
                      >
                        All Photos
                      </Button>
                      <Button 
                        variant={galleryView === 'albums' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setGalleryView('albums')}
                        className={galleryView === 'albums' ? 'bg-pink-600' : 'bg-white/20 backdrop-blur-sm'}
                      >
                        Albums
                      </Button>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button onClick={() => setUploadImageOpen(true)} className="bg-pink-600 hover:bg-pink-700">
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
                        <div className="relative h-48 bg-gradient-to-br from-pink-400 to-[#2A4D69]">
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
                      <BookOpen className="h-10 w-10 text-pink-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Recommended Books</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>Captivating - John & Stasi Eldredge</li>
                        <li>Becoming a Woman of Excellence</li>
                        <li>The Best Yes - Lysa TerKeurst</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Headphones className="h-10 w-10 text-pink-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Podcasts</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>She Reads Truth Podcast</li>
                        <li>The Next Right Thing</li>
                        <li>Proverbs 31 Podcast</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Video className="h-10 w-10 text-pink-600 mx-auto mb-3" />
                      <h3 className="font-bold mb-2">Video Series</h3>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>Women of the Word</li>
                        <li>Seamless Bible Study</li>
                        <li>Armor of God - Priscilla Shirer</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Hand className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Need Prayer or a Mentor?</h3>
                    <p className="text-gray-500 mb-4">
                      We'd love to connect with you. Reach out for prayer or to find a mentor.
                    </p>
                    <Button onClick={() => setContactDialogOpen(true)} className="bg-pink-600 hover:bg-pink-700">
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
            <Card className="bg-gradient-to-r from-pink-600 via-[#2A4D69] to-rose-600 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">You Belong Here, Sister!</h2>
                <p className="text-white/90 mb-6">
                  Join a community of women who will encourage you, pray for you, and help you grow in your faith.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100" onClick={() => setRegisterDialogOpen(true)}>
                    Join Women's Ministry
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
            <DialogTitle className="text-2xl font-bold text-pink-700">Join Women's Ministry</DialogTitle>
            <DialogDescription>
              We're so excited to connect with you! Fill out the form below.
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
              <Label htmlFor="message">Tell us a little about yourself!</Label>
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
              <Button type="submit" className="bg-gradient-to-r from-pink-600 to-[#2A4D69]">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Contact Women's Ministry</DialogTitle>
            <DialogDescription>
              Have questions or need prayer? We're here for you, sister.
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
              <Button type="submit" className="bg-gradient-to-r from-pink-600 to-[#2A4D69]">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}