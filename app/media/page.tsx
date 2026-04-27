// app/media/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

// shadcn/ui imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import {
  Play,
  Pause,
  Download,
  Trash2,
  Plus,
  Loader2,
  Search,
  X,
  Calendar,
  Eye,
  Headphones,
  Video,
  Mic,
  Podcast,
  Radio,
  Music,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Grid3x3,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Star,
  Upload,
  CheckCircle,
  Pencil,
  AlertCircle,
  SkipBack,
  SkipForward,
  Heart,
  Share2,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  User,
  MessageCircle,
  Copy,
  Mail,
  Bookmark,
  Info,
  Tag,
  Clock,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';

// Import Header and Footer
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const MEDIA_TYPES = [
  { value: 'audio', label: 'Audio', icon: Headphones, color: 'bg-blue-100 text-blue-700' },
  { value: 'video', label: 'Video', icon: Video, color: 'bg-red-100 text-red-700' },
  { value: 'podcast', label: 'Podcast', icon: Podcast, color: 'bg-[#86BBD8]/20 text-[#2A4D69]' },
  { value: 'broadcast', label: 'Broadcast', icon: Radio, color: 'bg-green-100 text-green-700' },
  { value: 'sermon', label: 'Sermon', icon: Mic, color: 'bg-orange-100 text-orange-700' },
];

const CATEGORIES = [
  'Sunday Service', 'Youth Service', 'Prayer Meeting', 'Bible Study',
  'Worship', 'Teaching', 'Testimony', 'Announcement', 'Special Event',
  'Conference', 'Concert', 'Workshop', 'Seminar', 'Retreat', 'Camp',
];

// =============== TYPES ===============
interface MediaItem {
  id: string;
  title: string;
  description: string;
  media_type: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number;
  duration: number;
  thumbnail_url: string;
  speaker: string;
  series: string;
  episode_number: number;
  scripture_reference: string;
  publish_date: string;
  featured: boolean;
  tags: string[];
  view_count: number;
  download_count: number;
  likes: number;
  created_at: string;
}

// =============== API FUNCTIONS ===============
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(await response.text());
  if (response.status === 204) return {} as T;
  return response.json();
}

async function getMedia(params?: any): Promise<MediaItem[]> {
  const queryParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value && value !== 'all') queryParams.append(key, String(value));
  });
  return fetchAPI<MediaItem[]>(`/media/?${queryParams.toString()}`);
}

async function getFeaturedMedia(limit: number = 4): Promise<MediaItem[]> {
  return fetchAPI<MediaItem[]>(`/media/featured?limit=${limit}`);
}

async function createMedia(media: Partial<MediaItem>): Promise<MediaItem> {
  return fetchAPI<MediaItem>('/media/', { method: 'POST', body: JSON.stringify(media) });
}

async function updateMedia(id: string, media: Partial<MediaItem>): Promise<MediaItem> {
  return fetchAPI<MediaItem>(`/media/${id}`, { method: 'PATCH', body: JSON.stringify(media) });
}

async function deleteMedia(id: string): Promise<void> {
  await fetchAPI(`/media/${id}`, { method: 'DELETE' });
}

async function uploadMediaFile(file: File): Promise<{ file_url: string; file_name: string; file_size: number }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'media');
  const response = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function toggleLike(mediaId: string): Promise<{ likes: number }> {
  return fetchAPI<{ likes: number }>(`/media/${mediaId}/like`, { method: 'POST' });
}

async function incrementDownload(mediaId: string): Promise<void> {
  await fetchAPI(`/media/${mediaId}/increment-download`, { method: 'POST' });
}

// =============== VIDEO PLAYER MODAL ===============
const VideoPlayerModal = ({ fileUrl, title, speaker, onClose }: { 
  fileUrl: string; title: string; speaker?: string; onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    setIsMuted(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black" onMouseMove={handleMouseMove}>
        <DialogTitle className="sr-only">Video Player: {title}</DialogTitle>
        <div className="relative aspect-video">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <video
            ref={videoRef}
            src={fileUrl}
            className="w-full h-full"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
          
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-600 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs text-white">{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 rounded-full h-8 w-8">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-900">
          <h3 className="font-medium text-white text-sm">{title}</h3>
          {speaker && <p className="text-xs text-gray-400">{speaker}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============== AUDIO PLAYER ===============
const AudioPlayer = ({ fileUrl, title, speaker, thumbnail, onClose }: { 
  fileUrl: string; title: string; speaker?: string; thumbnail?: string; onClose: () => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setIsMuted(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <audio
        ref={audioRef}
        src={fileUrl}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {thumbnail && (
            <img src={thumbnail} alt={title} className="w-10 h-10 rounded object-cover hidden sm:block" />
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            {speaker && <p className="text-xs text-muted-foreground">{speaker}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="rounded-full h-10 w-10">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
          </div>

          <div className="flex-1 min-w-[200px] flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 rounded-lg cursor-pointer"
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== MEDIA CARD (GRID VIEW) ===============
const MediaCard = ({ 
  item, onPlay, onEdit, onDelete, onDownload, onLike,
  isExpanded, onToggleExpand, isLiked, likeCount
}: { 
  item: MediaItem; onPlay: () => void; onEdit: () => void; onDelete: () => void;
  onDownload: () => Promise<void>; onLike: () => Promise<void>;
  isExpanded: boolean; onToggleExpand: () => void; isLiked: boolean; likeCount: number;
}) => {
  const mediaType = MEDIA_TYPES.find(t => t.value === item.media_type) || MEDIA_TYPES[0];
  const Icon = mediaType.icon;

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white/95 backdrop-blur-sm">
      <div className="relative">
        <div className="aspect-video relative bg-muted">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Icon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <button
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="bg-white rounded-full p-3">
              <Play className="h-6 w-6 text-primary ml-0.5" />
            </div>
          </button>
          
          {item.duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {formatDuration(item.duration)}
            </div>
          )}
          
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className={mediaType.color}>
              <Icon className="h-3 w-3 mr-1" />
              {mediaType.label}
            </Badge>
          </div>
          
          {item.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{item.title}</h3>
          <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-8 w-8 shrink-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {item.speaker && (
          <p className="text-sm text-muted-foreground mb-2">{item.speaker}</p>
        )}
        
        {!isExpanded && item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.publish_date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.view_count}</span>
          <button onClick={onLike} className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} /> {likeCount}
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" onClick={onPlay} className="flex-1 gap-1"><Play className="h-3 w-3" /> Play</Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={onDownload} className="gap-1"><Download className="h-3 w-3" /></Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {item.description && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              {item.series && <div><span className="text-muted-foreground">Series:</span> <span className="font-medium">{item.series}</span></div>}
              {item.episode_number > 0 && <div><span className="text-muted-foreground">Episode:</span> <span className="font-medium">{item.episode_number}</span></div>}
              {item.scripture_reference && <div className="col-span-2"><span className="text-muted-foreground">Scripture:</span> <span className="font-medium">{item.scripture_reference}</span></div>}
              {item.category && <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{item.category}</span></div>}
            </div>
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============== MEDIA LIST ITEM ===============
const MediaListItem = ({ 
  item, index, onPlay, onEdit, onDelete, onDownload, onLike, isLiked, likeCount
}: { 
  item: MediaItem; index: number; onPlay: () => void; onEdit: () => void; onDelete: () => void;
  onDownload: () => Promise<void>; onLike: () => Promise<void>; isLiked: boolean; likeCount: number;
}) => {
  const mediaType = MEDIA_TYPES.find(t => t.value === item.media_type) || MEDIA_TYPES[0];
  const Icon = mediaType.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <Badge variant="secondary" className={mediaType.color}>{mediaType.label}</Badge>
                {item.featured && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{item.speaker || 'Unknown'}</span>
                <span>{new Date(item.publish_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.view_count}</span>
                <button onClick={onLike} className="flex items-center gap-1 hover:text-red-500">
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} /> {likeCount}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPlay}><Play className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDownload}><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {expanded && item.description && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// =============== FILTER BAR ===============
const FilterBar = ({ 
  searchTerm, onSearchChange, selectedType, onTypeChange, selectedCategory, onCategoryChange,
  sortBy, onSortChange, sortOrder, onSortOrderChange, onClearFilters, activeFilterCount
}: any) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="mb-6 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, speaker, description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-white/80"
            />
          </div>

          <div className="flex gap-2">
            <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" /> Filters
              {activeFilterCount > 0 && <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>}
            </Button>
            <Button variant="outline" onClick={onSortOrderChange} className="gap-2">
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
            </Button>
            {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all') && (
              <Button variant="ghost" onClick={onClearFilters}>Clear</Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-1 block">Media Type</Label>
                <Select value={selectedType} onValueChange={onTypeChange}>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {MEDIA_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1 block">Category</Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1 block">Sort By</Label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============== BACKGROUND IMAGES ===============
const natureWallpapers = [
  {
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2070",
    location: "Iceland - Crystal Ice Cave"
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2070",
    location: "Pacific Northwest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=90&w=2070",
    location: "Great Smoky Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2070",
    location: "Olympic National Park"
  },
];

// =============== MAIN PAGE ===============
export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  
  // Player state
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState<MediaItem | null>(null);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<MediaItem | null>(null);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Town Assembly');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '', description: '', media_type: 'sermon', category: '', file_url: '', file_name: '',
    file_size: 0, duration: 0, thumbnail_url: '', speaker: '', series: '',
    episode_number: 0, scripture_reference: '', publish_date: new Date().toISOString().split('T')[0],
    featured: false, tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  // Rotating wallpaper
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % natureWallpapers.length);
    }, 30000);
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

  useEffect(() => {
    fetchMedia();
    fetchFeaturedMedia();
  }, [selectedType, selectedCategory, searchTerm, sortBy, sortOrder]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia({
        media_type: selectedType !== 'all' ? selectedType : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort: sortBy,
        order: sortOrder,
        limit: 50,
      });
      setMedia(data);
      const counts: Record<string, number> = {};
      data.forEach(item => { counts[item.id] = item.likes || 0; });
      setLikeCounts(counts);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedMedia = async () => {
    try {
      const data = await getFeaturedMedia(4);
      setFeaturedMedia(data);
    } catch (error) {
      console.error('Failed to fetch featured media:', error);
    }
  };

  const handlePlayAudio = (item: MediaItem) => setCurrentPlayingAudio(item);
  const handlePlayVideo = (item: MediaItem) => setCurrentPlayingVideo(item);

  const handleDownload = async (item: MediaItem) => {
    try {
      await incrementDownload(item.id);
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded: ${item.title}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleLike = async (item: MediaItem) => {
    try {
      const result = await toggleLike(item.id);
      setLikedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) newSet.delete(item.id);
        else newSet.add(item.id);
        return newSet;
      });
      setLikeCounts(prev => ({ ...prev, [item.id]: result.likes }));
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title, description: item.description || '', media_type: item.media_type,
      category: item.category || '', file_url: item.file_url, file_name: item.file_name || '',
      file_size: item.file_size || 0, duration: item.duration || 0,
      thumbnail_url: item.thumbnail_url || '', speaker: item.speaker || '', series: item.series || '',
      episode_number: item.episode_number || 0, scripture_reference: item.scripture_reference || '',
      publish_date: item.publish_date || new Date().toISOString().split('T')[0],
      featured: item.featured, tags: item.tags || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media?')) return;
    try {
      await deleteMedia(id);
      toast.success('Media deleted');
      await fetchMedia();
      await fetchFeaturedMedia();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const result = await uploadMediaFile(file);
      clearInterval(interval);
      setUploadProgress(100);
      setFormData(prev => ({ 
        ...prev, 
        file_url: result.file_url, 
        file_name: result.file_name, 
        file_size: result.file_size 
      }));
      toast.success('File uploaded');
    } catch (error) {
      clearInterval(interval);
      toast.error('Upload failed');
    } finally {
      setUploadingFile(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Title required'); return; }
    if (!formData.file_url) { toast.error('Upload a file'); return; }
    setSaving(true);
    try {
      if (editingItem) await updateMedia(editingItem.id, formData);
      else await createMedia(formData);
      toast.success(editingItem ? 'Updated' : 'Added');
      setDialogOpen(false);
      resetForm();
      setEditingItem(null);
      await fetchMedia();
      await fetchFeaturedMedia();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', media_type: 'sermon', category: '', file_url: '', file_name: '',
      file_size: 0, duration: 0, thumbnail_url: '', speaker: '', series: '',
      episode_number: 0, scripture_reference: '', publish_date: new Date().toISOString().split('T')[0],
      featured: false, tags: [],
    });
    setTagInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: value }));
  const handleNumberChange = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const openNewDialog = () => {
    setEditingItem(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('church');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedType !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0);

  if (loading && media.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {natureWallpapers.map((wallpaper, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${wallpaper.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentWallpaperIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Media Library</h1>
              <p className="text-white/80 mt-1">Sermons, podcasts, and worship content</p>
            </div>
            <Button onClick={openNewDialog} className="gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4" /> Add Media
            </Button>
          </div>

          {/* Featured Section */}
          {featuredMedia.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2 drop-shadow-lg">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onPlay={() => item.media_type === 'audio' ? handlePlayAudio(item) : handlePlayVideo(item)}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    onDownload={() => handleDownload(item)}
                    onLike={() => handleLike(item)}
                    isExpanded={expandedItems.has(item.id)}
                    onToggleExpand={() => toggleExpand(item.id)}
                    isLiked={likedItems.has(item.id)}
                    likeCount={likeCounts[item.id] || 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm} onSearchChange={setSearchTerm}
            selectedType={selectedType} onTypeChange={setSelectedType}
            selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
            sortBy={sortBy} onSortChange={setSortBy}
            sortOrder={sortOrder} onSortOrderChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            onClearFilters={clearFilters} activeFilterCount={activeFilterCount}
          />

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-white/80">Showing {media.length} results</p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Content */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
          ) : media.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No media found.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">Clear filters</Button>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={() => item.media_type === 'audio' ? handlePlayAudio(item) : handlePlayVideo(item)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                  onDownload={() => handleDownload(item)}
                  onLike={() => handleLike(item)}
                  isExpanded={expandedItems.has(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  isLiked={likedItems.has(item.id)}
                  likeCount={likeCounts[item.id] || 0}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {media.map((item, idx) => (
                <MediaListItem
                  key={item.id}
                  item={item}
                  index={idx}
                  onPlay={() => item.media_type === 'audio' ? handlePlayAudio(item) : handlePlayVideo(item)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                  onDownload={() => handleDownload(item)}
                  onLike={() => handleLike(item)}
                  isLiked={likedItems.has(item.id)}
                  likeCount={likeCounts[item.id] || 0}
                />
              ))}
            </div>
          )}
        </main>

        {/* Audio Player */}
        {currentPlayingAudio && (
          <AudioPlayer
            fileUrl={currentPlayingAudio.file_url}
            title={currentPlayingAudio.title}
            speaker={currentPlayingAudio.speaker}
            thumbnail={currentPlayingAudio.thumbnail_url}
            onClose={() => setCurrentPlayingAudio(null)}
          />
        )}

        {/* Video Player */}
        {currentPlayingVideo && (
          <VideoPlayerModal
            fileUrl={currentPlayingVideo.file_url}
            title={currentPlayingVideo.title}
            speaker={currentPlayingVideo.speaker}
            onClose={() => setCurrentPlayingVideo(null)}
          />
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Media' : 'Add Media'}</DialogTitle>
              <DialogDescription>Fill in the details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title *</Label><Input name="title" value={formData.title} onChange={handleInputChange} required /></div>
                    <div><Label>Type</Label><Select value={formData.media_type} onValueChange={(v) => handleSelectChange('media_type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{MEDIA_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select></div>
                    <div><Label>Category</Label><Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">None</SelectItem>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select></div>
                    <div><Label>Speaker</Label><Input name="speaker" value={formData.speaker} onChange={handleInputChange} /></div>
                    <div className="col-span-2"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input type="file" accept="audio/*,video/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span>{uploadingFile ? 'Uploading...' : 'Click to upload'}</span>
                      <span className="text-xs text-muted-foreground">MP3, MP4 up to 500MB</span>
                    </label>
                    {uploadingFile && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                      </div>
                    )}
                    {formData.file_url && (
                      <div className="mt-3 p-2 bg-green-50 rounded flex items-center justify-between">
                        <span className="text-sm truncate">{formData.file_name}</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Thumbnail URL</Label><Input name="thumbnail_url" value={formData.thumbnail_url} onChange={handleInputChange} placeholder="https://..." /></div>
                    <div><Label>Duration (seconds)</Label><Input name="duration" type="number" value={formData.duration} onChange={(e) => handleNumberChange('duration', e.target.value)} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Series</Label><Input name="series" value={formData.series} onChange={handleInputChange} /></div>
                    <div><Label>Episode</Label><Input name="episode_number" type="number" value={formData.episode_number} onChange={(e) => handleNumberChange('episode_number', e.target.value)} /></div>
                    <div><Label>Scripture</Label><Input name="scripture_reference" value={formData.scripture_reference} onChange={handleInputChange} placeholder="John 3:16" /></div>
                    <div><Label>Publish Date</Label><Input name="publish_date" type="date" value={formData.publish_date} onChange={handleInputChange} /></div>
                    <div className="col-span-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2"><Input placeholder="Add tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} /><Button type="button" onClick={addTag} variant="outline">Add</Button></div>
                      <div className="flex flex-wrap gap-1 mt-2">{formData.tags.map(tag => <Badge key={tag} variant="secondary" className="gap-1">{tag}<button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">×</button></Badge>)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} /> Featured</label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingItem ? 'Update' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </TooltipProvider>
  );
}