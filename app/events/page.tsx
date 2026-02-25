'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';
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
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Filter,
  CalendarDays,
  ArrowRight,
  Bell,
  Megaphone,
  Newspaper,
  Users,
  Sparkles,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  BookOpen,
  Cross,
  Globe,
  Link2,
  Phone,
  Mail,
  Map,
  Building,
  Clock3,
  Repeat,
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
  LayoutGrid,
  LayoutList,
  Fullscreen,
  Minimize,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  Home,
  Info,
  Award,
  Star,
  Zap,
  TrendingUp,
  Users2,
  Clock4,
  MapPinned,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
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

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const EVENT_TYPES = [
  { value: 'event', label: 'Event', icon: '🎉', color: 'bg-green-100 text-green-800 border-green-200', description: 'Church events, conferences, gatherings' },
  { value: 'notice', label: 'Notice', icon: '📢', color: 'bg-blue-100 text-blue-800 border-blue-200', description: 'Announcements and important notices' },
  { value: 'sermon', label: 'Sermon', icon: '📖', color: 'bg-purple-100 text-purple-800 border-purple-200', description: 'Sermon series and messages' },
  { value: 'testimony', label: 'Testimony', icon: '🙏', color: 'bg-amber-100 text-amber-800 border-amber-200', description: 'Personal testimonies and stories' },
  { value: 'prayer', label: 'Prayer Request', icon: '🕯️', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', description: 'Prayer requests and updates' },
];

const CATEGORIES = [
  { value: 'announcement', label: 'Announcement', icon: '📢' },
  { value: 'sunday_service', label: 'Sunday Service', icon: '⛪' },
  { value: 'conference', label: 'Conference', icon: '🎤' },
  { value: 'youth', label: 'Youth', icon: '🧑' },
  { value: 'children', label: 'Children', icon: '🧸' },
  { value: 'missions', label: 'Missions', icon: '🌍' },
  { value: 'bible_study', label: 'Bible Study', icon: '📚' },
  { value: 'prayer_meeting', label: 'Prayer Meeting', icon: '🙏' },
  { value: 'fellowship', label: 'Fellowship', icon: '🤝' },
  { value: 'outreach', label: 'Outreach', icon: '🤲' },
  { value: 'fundraising', label: 'Fundraising', icon: '💰' },
  { value: 'training', label: 'Training', icon: '🎓' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'special', label: 'Special Event', icon: '✨' },
  { value: 'other', label: 'Other', icon: '📌' },
];

// =============== TYPES ===============
interface Event {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: string;
  category: string;
  
  // Event dates
  event_start_date?: string;
  event_end_date?: string;
  event_start_time?: string;
  event_end_time?: string;
  all_day?: boolean;
  
  // Location
  location?: string;
  venue?: string;
  address?: string;
  is_online?: boolean;
  online_url?: string;
  
  // Registration
  registration_required?: boolean;
  registration_deadline?: string;
  capacity?: number;
  
  // Media
  featured_image?: string;
  gallery_images?: string[];
  
  // Author
  author_name?: string;
  author_email?: string;
  
  // Status
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  
  // Stats
  views: number;
  rsvp_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface RSVP {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  notes: string;
  created_at: string;
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

async function getEvents(params?: {
  search?: string;
  type?: string;
  category?: string;
  featured?: boolean;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Event[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
  if (params?.upcoming !== undefined) queryParams.append('upcoming', String(params.upcoming));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.offset) queryParams.append('offset', String(params.offset));

  return fetchAPI<Event[]>(`/events/?${queryParams.toString()}`);
}

async function getEvent(id: string): Promise<Event> {
  return fetchAPI<Event>(`/events/${id}`);
}

async function createEvent(event: Record<string, any>): Promise<Event> {
  return fetchAPI<Event>('/events/', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

async function updateEvent(id: string, event: Record<string, any>): Promise<Event> {
  return fetchAPI<Event>(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(event),
  });
}

async function deleteEvent(id: string): Promise<void> {
  await fetchAPI(`/events/${id}`, {
    method: 'DELETE',
  });
}

async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/events/upload-image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to upload image');
  }
  
  return response.json();
}

async function getEventRSVPs(eventId: string): Promise<RSVP[]> {
  return fetchAPI<RSVP[]>(`/events/${eventId}/rsvps`);
}

async function createRSVP(rsvp: Partial<RSVP>): Promise<RSVP> {
  return fetchAPI<RSVP>('/events/rsvps', {
    method: 'POST',
    body: JSON.stringify(rsvp),
  });
}

// =============== HELPER FUNCTIONS ===============
const getTypeIcon = (type: string) => {
  const t = EVENT_TYPES.find(t => t.value === type);
  return t?.icon || '📄';
};

const getTypeColor = (type: string) => {
  const t = EVENT_TYPES.find(t => t.value === type);
  return t?.color || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getTypeDescription = (type: string) => {
  const t = EVENT_TYPES.find(t => t.value === type);
  return t?.description || '';
};

const getCategoryIcon = (category: string) => {
  const c = CATEGORIES.find(c => c.value === category);
  return c?.icon || '📌';
};

const getCategoryLabel = (category: string) => {
  const c = CATEGORIES.find(c => c.value === category);
  return c?.label || category;
};

const formatDate = (dateStr?: string) => {
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

const formatShortDate = (dateStr?: string) => {
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

const formatDateTime = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return `${dateStr} ${timeStr || ''}`;
  }
};

const formatTime = (timeStr?: string) => {
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

const getInitials = (name?: string) => {
  if (!name) return 'CH';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const validateEventForm = (data: Record<string, any>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  return errors;
};

// =============== EVENT DETAIL PAGE COMPONENT ===============
const EventDetailPage = ({ event, onBack, onEdit, onDelete, onRSVP, isAdmin }: { 
  event: Event; 
  onBack: () => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onRSVP: (event: Event) => void;
  isAdmin: boolean;
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.excerpt || event.content || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {event.featured_image ? (
          <>
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
        )}
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(event)}
                className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-red-600/90 transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${getTypeColor(event.type)} text-sm py-1 px-3`}>
                {getTypeIcon(event.type)} {EVENT_TYPES.find(t => t.value === event.type)?.label}
              </Badge>
              {event.category && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/40 text-sm py-1 px-3">
                  {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl">
              {event.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{event.author_name || 'Church Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(event.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{event.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Excerpt */}
            {event.excerpt && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{event.excerpt}"
                </p>
              </div>
            )}
            
            {/* Full Content */}
            {event.content && (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.content}
                </p>
              </div>
            )}
            
            {/* Gallery */}
            {event.gallery_images && event.gallery_images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(img, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            {event.type === 'event' && (
              <Card className="sticky top-24 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Event Details
                  </h3>
                  
                  <Separator />
                  
                  {/* Date & Time */}
                  {event.event_start_date && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(event.event_start_date)}
                          {event.event_end_date && event.event_end_date !== event.event_start_date && (
                            <> – {formatDate(event.event_end_date)}</>
                          )}
                        </p>
                        {event.event_start_time && !event.all_day && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {formatTime(event.event_start_time)}
                            {event.event_end_time && ` – ${formatTime(event.event_end_time)}`}
                          </p>
                        )}
                        {event.all_day && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">All Day</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Location */}
                  {event.location && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{event.location}</p>
                        {event.venue && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">{event.venue}</p>
                        )}
                        {event.address && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">{event.address}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Online */}
                  {event.is_online && event.online_url && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Online Meeting</p>
                        <a
                          href={event.online_url}
                          target="_blank"
                          rel="noopener"
                          className="text-purple-600 hover:underline break-all"
                        >
                          {event.online_url}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex gap-4 pt-4">
                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {event.rsvp_count || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Going</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {event.views || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                    </div>
                  </div>
                  
                  {/* RSVP Button */}
                  <Button
                    onClick={() => onRSVP(event)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    RSVP for this Event
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Author Info */}
            {(event.author_name || event.author_email) && (
              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    About the Author
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-purple-100 text-purple-800 text-xl">
                        {getInitials(event.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">
                        {event.author_name || 'Church Admin'}
                      </p>
                      {event.author_email && (
                        <a
                          href={`mailto:${event.author_email}`}
                          className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Mail className="h-3 w-3" />
                          {event.author_email}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== MAIN PAGE ===============
export default function EventsPage() {
  const router = useRouter();
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Data
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [fullPageEvent, setFullPageEvent] = useState<Event | null>(null);
  
  // Expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Form validation
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    content: '',
    excerpt: '',
    type: 'event',
    category: '',
    event_start_date: '',
    event_end_date: '',
    event_start_time: '',
    event_end_time: '',
    all_day: false,
    location: '',
    venue: '',
    address: '',
    is_online: false,
    online_url: '',
    featured_image: '',
    gallery_images: [],
    author_name: '',
    author_email: '',
    is_published: true,
    is_featured: false,
  });
  
  // RSVP form state
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    notes: '',
  });
  
  // Image upload
  const [uploading, setUploading] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
  }, []);
  
  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [searchTerm, selectedType, selectedCategory, showUpcoming, showFeatured, currentPage]);
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents({
        search: searchTerm || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        upcoming: showUpcoming || undefined,
        featured: showFeatured || undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
      });
      setEvents(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle expanded
  const toggleExpanded = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
  
  // Open full page view
  const openFullPage = (event: Event) => {
    setFullPageEvent(event);
    window.scrollTo(0, 0);
  };
  
  // Close full page view
  const closeFullPage = () => {
    setFullPageEvent(null);
  };
  
  // Expand all
  const expandAll = () => {
    setExpandedItems(new Set(events.map(e => e.id)));
  };
  
  // Collapse all
  const collapseAll = () => {
    setExpandedItems(new Set());
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setShowUpcoming(false);
    setShowFeatured(false);
    setCurrentPage(0);
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }
    
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setFormData(prev => ({ ...prev, featured_image: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateEventForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      toast.error(errors[0]);
      return;
    }
    
    setSaving(true);
    
    try {
      const cleanedData: Record<string, any> = { ...formData };
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '') {
          delete cleanedData[key];
        }
      });
      
      if (editingEvent) {
        await updateEvent(editingEvent.id, cleanedData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(cleanedData);
        toast.success('Event created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      setEditingEvent(null);
      await fetchEvents();
    } catch (error: any) {
      console.error('Failed to save event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle RSVP submit
  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    setSaving(true);
    try {
      await createRSVP({
        event_id: selectedEvent.id,
        ...rsvpForm,
      });
      toast.success('RSVP submitted successfully');
      setRsvpDialogOpen(false);
      setRsvpForm({ name: '', email: '', phone: '', guests: 1, notes: '' });
      if (fullPageEvent) {
        const updatedEvent = await getEvent(selectedEvent.id);
        setFullPageEvent(updatedEvent);
      }
      await fetchEvents();
    } catch (error: any) {
      console.error('RSVP failed:', error);
      toast.error(error.message || 'Failed to submit RSVP');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteEvent(id);
      toast.success('Item deleted successfully');
      if (fullPageEvent?.id === id) {
        setFullPageEvent(null);
      }
      await fetchEvents();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error.message || 'Failed to delete');
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      type: 'event',
      category: '',
      event_start_date: '',
      event_end_date: '',
      event_start_time: '',
      event_end_time: '',
      all_day: false,
      location: '',
      venue: '',
      address: '',
      is_online: false,
      online_url: '',
      featured_image: '',
      gallery_images: [],
      author_name: '',
      author_email: '',
      is_published: true,
      is_featured: false,
    });
    setFormErrors([]);
  };
  
  // Open edit dialog
  const handleEdit = (event: Event, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingEvent(event);
    setFormData({ ...event });
    setFormErrors([]);
    setDialogOpen(true);
  };
  
  // Open RSVP dialog
  const handleRSVPClick = (event: Event, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedEvent(event);
    setRsvpDialogOpen(true);
  };
  
  // Check if event is upcoming
  const isUpcoming = (event: Event) => {
    if (!event.event_start_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_start_date);
    return eventDate >= today;
  };
  
  // Separate featured and regular
  const featuredEvents = events.filter(e => e.is_featured);
  const regularEvents = events.filter(e => !e.is_featured);
  
  // If full page view is active, show the detail page
  if (fullPageEvent) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Header isLoggedIn={isAdmin} user={null} churchName="AFM Chegutu" onLogout={() => {}} />
        <EventDetailPage
          event={fullPageEvent}
          onBack={closeFullPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRSVP={handleRSVPClick}
          isAdmin={isAdmin}
        />
        <Footer />
      </>
    );
  }
  
  // Main listing page
  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-purple-800">Loading events...</p>
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                Events & Notices
              </h1>
              <p className="text-lg text-purple-100">
                Stay updated with everything happening at AFM Chegutu
              </p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingEvent(null);
                    resetForm();
                    setDialogOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              )}
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
          
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-200/40 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events, notices, sermons..."
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
              
              {/* Expand/Collapse */}
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
              
              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-[180px] bg-white/80 border-purple-200">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EVENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-[180px] bg-white/80 border-purple-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filter toggles */}
              <div className="flex gap-2">
                <Button
                  variant={showUpcoming ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUpcoming(!showUpcoming)}
                  className={showUpcoming ? "bg-purple-600 text-white" : "bg-white/80 border-purple-200"}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Upcoming
                </Button>
                <Button
                  variant={showFeatured ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFeatured(!showFeatured)}
                  className={showFeatured ? "bg-purple-600 text-white" : "bg-white/80 border-purple-200"}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Featured
                </Button>
              </div>
              
              {/* Clear Filters */}
              {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all' || showUpcoming || showFeatured) && (
                <Button variant="ghost" onClick={clearFilters} className="text-purple-700 hover:text-purple-800">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Featured Section */}
          {featuredEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map((item) => (
                  <Card key={item.id} className="group bg-white/90 backdrop-blur-sm border-purple-200/40 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer" onClick={() => openFullPage(item)}>
                    {item.featured_image ? (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.featured_image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="h-56 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-6xl opacity-30">{getTypeIcon(item.type)}</span>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeIcon(item.type)} {EVENT_TYPES.find(t => t.value === item.type)?.label}
                          </Badge>
                          {isUpcoming(item) && (
                            <Badge className="bg-green-500 text-white border-0">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleEdit(item, e); }}>
                              <Pencil className="h-4 w-4 text-purple-700" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.excerpt || item.content?.slice(0, 100) + '...' || 'No description'}
                      </p>
                      
                      {item.type === 'event' && item.event_start_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                          <span>{formatShortDate(item.event_start_date)}</span>
                          {item.location && (
                            <>
                              <span>•</span>
                              <MapPin className="h-4 w-4 text-purple-600" />
                              <span className="truncate">{item.location}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                              {getInitials(item.author_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.author_name || 'Church'}</span>
                          <span>•</span>
                          <span>{item.views || 0} views</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-600 hover:text-purple-700 group-hover:translate-x-1 transition-transform"
                          onClick={(e) => { e.stopPropagation(); openFullPage(item); }}
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Events Grid/List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Latest Updates
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : regularEvents.length === 0 ? (
              <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl">
                <p className="text-white">No events found matching your criteria.</p>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularEvents.map((item) => (
                  <Card key={item.id} className="group bg-white/90 backdrop-blur-sm border-purple-200/40 overflow-hidden hover:shadow-xl transition-all cursor-pointer" onClick={() => openFullPage(item)}>
                    {item.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.featured_image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)} {EVENT_TYPES.find(t => t.value === item.type)?.label}
                        </Badge>
                        {isUpcoming(item) && (
                          <Badge className="bg-green-500 text-white text-xs border-0">
                            Soon
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                        {item.title}
                      </h3>
                      
                      {item.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                      )}
                      
                      {item.type === 'event' && item.event_start_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <CalendarIcon className="h-3 w-3 text-purple-600" />
                          <span>{formatShortDate(item.event_start_date)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" /> {item.views || 0}
                          {item.type === 'event' && (
                            <>
                              <span>•</span>
                              <Users className="h-3 w-3" /> {item.rsvp_count || 0}
                            </>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-600 hover:text-purple-700"
                          onClick={(e) => { e.stopPropagation(); openFullPage(item); }}
                        >
                          View
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {regularEvents.map((item) => (
                  <Card key={item.id} className="group bg-white/90 backdrop-blur-sm border-purple-200/40 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => openFullPage(item)}>
                    <div className="flex flex-col md:flex-row">
                      {item.featured_image && (
                        <div className="md:w-48 h-32 md:h-auto relative overflow-hidden">
                          <img
                            src={item.featured_image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="flex-1 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeIcon(item.type)} {EVENT_TYPES.find(t => t.value === item.type)?.label}
                          </Badge>
                          {item.category && (
                            <Badge variant="outline" className="text-xs">
                              {getCategoryIcon(item.category)} {getCategoryLabel(item.category)}
                            </Badge>
                          )}
                          {isUpcoming(item) && (
                            <Badge className="bg-green-500 text-white text-xs border-0 ml-auto">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h3>
                        
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                        )}
                        
                        {item.type === 'event' && item.event_start_date && (
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 text-purple-600" /> {formatDate(item.event_start_date)}
                            </span>
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-purple-600" /> {item.location}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Eye className="h-3 w-3" /> {item.views || 0}
                            {item.type === 'event' && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {item.rsvp_count || 0} going
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className="text-purple-600 hover:text-purple-700"
                            onClick={(e) => { e.stopPropagation(); openFullPage(item); }}
                          >
                            Read More <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Load More */}
          {events.length >= pageSize && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Load More Events
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}
        </main>
      </div>
      
      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingEvent ? 'update' : 'create'} an event or notice. All fields except Title are optional.
            </DialogDescription>
          </DialogHeader>
          
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-red-600">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="media">Media & Author</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <div>
                                <div>{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-64">
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className="flex items-center gap-2">
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief summary of the event/notice"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="content">Full Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Detailed description"
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Event Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_start_date">Start Date</Label>
                    <Input
                      id="event_start_date"
                      type="date"
                      value={formData.event_start_date}
                      onChange={(e) => setFormData({ ...formData, event_start_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event_end_date">End Date</Label>
                    <Input
                      id="event_end_date"
                      type="date"
                      value={formData.event_end_date}
                      onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event_start_time">Start Time</Label>
                    <Input
                      id="event_start_time"
                      type="time"
                      value={formData.event_start_time}
                      onChange={(e) => setFormData({ ...formData, event_start_time: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event_end_time">End Time</Label>
                    <Input
                      id="event_end_time"
                      type="time"
                      value={formData.event_end_time}
                      onChange={(e) => setFormData({ ...formData, event_end_time: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all_day"
                      checked={formData.all_day || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked as boolean })}
                    />
                    <Label htmlFor="all_day">All Day Event</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location Name</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Main Sanctuary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g., Church Hall"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address, city, etc."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_online"
                      checked={formData.is_online || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_online: checked as boolean })}
                    />
                    <Label htmlFor="is_online">Online Event</Label>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="online_url">Online Meeting URL</Label>
                    <Input
                      id="online_url"
                      type="url"
                      value={formData.online_url}
                      onChange={(e) => setFormData({ ...formData, online_url: e.target.value })}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Media & Author Tab */}
              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Featured Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.featured_image ? (
                        <div className="relative w-32 h-32">
                          <img
                            src={formData.featured_image}
                            alt="Featured"
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => setFormData({ ...formData, featured_image: '' })}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="cursor-pointer"
                          />
                          {uploading && (
                            <div className="flex items-center gap-2 mt-2">
                              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                              <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Supports: JPG, PNG, GIF, WEBP (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="e.g., Pastor John"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="author_email">Author Email</Label>
                    <Input
                      id="author_email"
                      type="email"
                      value={formData.author_email}
                      onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                      placeholder="pastor@church.org"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                    />
                    <Label htmlFor="is_featured">Feature this post</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_published"
                      checked={formData.is_published !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked as boolean })}
                    />
                    <Label htmlFor="is_published">Published (visible to public)</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingEvent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* RSVP Dialog */}
      <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>RSVP for Event</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRSVP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rsvp_name">Your Name *</Label>
              <Input
                id="rsvp_name"
                value={rsvpForm.name}
                onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rsvp_email">Email</Label>
              <Input
                id="rsvp_email"
                type="email"
                value={rsvpForm.email}
                onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rsvp_phone">Phone</Label>
              <Input
                id="rsvp_phone"
                value={rsvpForm.phone}
                onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                placeholder="+263 77 123 4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rsvp_guests">Number of Guests (including yourself)</Label>
              <Input
                id="rsvp_guests"
                type="number"
                min="1"
                value={rsvpForm.guests}
                onChange={(e) => setRsvpForm({ ...rsvpForm, guests: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rsvp_notes">Notes (optional)</Label>
              <Textarea
                id="rsvp_notes"
                value={rsvpForm.notes}
                onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
                placeholder="Any special requirements or questions?"
                rows={2}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRsvpDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit RSVP
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
}