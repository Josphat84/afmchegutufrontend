// app/projects/page.tsx
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
  Share2,
  HeartHandshake,
  Sparkles,
  Crown,
  Trophy,
  Gift,
  Rocket,
  Target,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Briefcase,
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
  Baby,
  BookOpen,
  Users2,
  Video,
  Upload,
  ImageIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  ThumbsUp,
  Send,
  MoreVertical,
  Wrench,
  Hammer,
  HardHat,
  Truck,
  School,
  Apple,
  Leaf,
  Flag,
  CheckCircle,
  Clock4,
  BarChart3,
  Package,
  Boxes,
  Shirt,
  Soup,
  Tractor,
  Sprout,
  Egg,
  Fish,
  Beef,
  Milk,
  Store,
  ShoppingCart,
  Banknote,
  Coins,
  PiggyBank,
  Wallet,
  HandCoins,
  Receipt,
  Landmark,
  Building,
  Factory,
  Warehouse,
  Drill,
  Ruler,
  PaintBucket,
  Brush,
  Droplets,
  Wind,
  Zap,
  Globe,
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
interface Project {
  id: string;
  name: string;
  description: string;
  category: 'agriculture' | 'livestock' | 'manufacturing' | 'services' | 'education' | 'retail';
  targetGroup: 'youth' | 'women' | 'men' | 'all' | 'community';
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  targetDate?: Date;
  leader: string;
  team: string[];
  location: string;
  investment: number;
  currentIncome: number;
  targetIncome: number;
  expenses: number;
  profit: number;
  coverImage?: string;
  gallery?: string[];
  updates: ProjectUpdate[];
  needs: string[];
  volunteers: number;
  volunteerNeeded: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectUpdate {
  id: string;
  content: string;
  date: Date;
  author: string;
  images?: string[];
}

interface ProjectDonation {
  id: string;
  projectId: string;
  projectName: string;
  donorName: string;
  amount: number;
  date: Date;
  message?: string;
  type: 'one-time' | 'monthly' | 'materials';
}

interface Volunteer {
  id: string;
  projectId: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'pending' | 'approved' | 'active' | 'completed';
  appliedDate: Date;
}

// =============== EDITABLE CONTENT ===============

const PROJECTS_INFO = {
  name: 'Kingdom Builders Projects',
  tagline: 'Building sustainable income streams to fund the Great Commission!',
  founded: 2018,
  activeProjects: 12,
  totalRaised: 45000,
  volunteers: 85,
  vision: 'To create sustainable, income-generating projects that support the church\'s mission, empower our members, and bless our community.',
  mission: 'To equip and empower every member to use their God-given talents in productive ventures that generate resources for Kingdom work.',
  email: 'projects@afmchegutu.org',
  phone: '+263 242 123 460',
  verse: 'Whatever you do, work at it with all your heart, as working for the Lord. - Colossians 3:23',
};

// Project Categories
const PROJECT_CATEGORIES = [
  { id: 'agriculture', name: 'Agriculture & Farming', icon: Tractor, color: 'bg-green-100 text-green-700' },
  { id: 'livestock', name: 'Livestock & Poultry', icon: Egg, color: 'bg-amber-100 text-amber-700' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, color: 'bg-blue-100 text-blue-700' },
  { id: 'services', name: 'Services', icon: Briefcase, color: 'bg-[#86BBD8]/20 text-[#2A4D69]' },
  { id: 'education', name: 'Education & Training', icon: School, color: 'bg-indigo-100 text-indigo-700' },
  { id: 'retail', name: 'Retail & Sales', icon: Store, color: 'bg-pink-100 text-pink-700' },
];

// Target Groups
const TARGET_GROUPS = [
  { id: 'youth', name: 'Youth Projects', icon: Users, color: 'bg-blue-100 text-blue-700' },
  { id: 'women', name: 'Women\'s Projects', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  { id: 'men', name: 'Men\'s Projects', icon: Briefcase, color: 'bg-slate-100 text-slate-700' },
  { id: 'all', name: 'All Church', icon: Users2, color: 'bg-[#86BBD8]/20 text-[#2A4D69]' },
  { id: 'community', name: 'Community Outreach', icon: Globe, color: 'bg-emerald-100 text-emerald-700' },
];

// =============== MOCK DATA ===============
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'AFM Kingdom Garden',
    description: 'A 5-hectare vegetable farm producing tomatoes, onions, cabbages, and leafy greens for sale at local markets and to church members. Profits support the feeding program and building fund.',
    category: 'agriculture',
    targetGroup: 'all',
    status: 'active',
    startDate: new Date('2024-01-15'),
    targetDate: new Date('2024-12-31'),
    leader: 'Mr. Tendai Ncube',
    team: ['Mary Banda', 'John Moyo', 'Peter Chen', 'Grace Makoni'],
    location: 'Church Farm, Plot 45, Goromonzi',
    investment: 3500,
    currentIncome: 2800,
    targetIncome: 10000,
    expenses: 1200,
    profit: 1600,
    coverImage: '/images/project-garden.jpg',
    gallery: ['/images/garden-1.jpg', '/images/garden-2.jpg'],
    updates: [
      { id: '1', content: 'First harvest of tomatoes - 500kg sold at Mbare Market!', date: new Date('2024-03-10'), author: 'Tendai Ncube' },
      { id: '2', content: 'New irrigation system installed. Thanks to all who donated!', date: new Date('2024-02-20'), author: 'Tendai Ncube' },
    ],
    needs: ['Irrigation pipes', 'Seeds', 'Fertilizer', 'Volunteers for harvesting'],
    volunteers: 12,
    volunteerNeeded: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    name: 'Ladies Baking & Catering',
    description: 'Women\'s group baking bread, cakes, and catering for events. Products sold after church services and at community events. Provides income for widows and single mothers.',
    category: 'manufacturing',
    targetGroup: 'women',
    status: 'active',
    startDate: new Date('2023-09-01'),
    leader: 'Mrs. Grace Makoni',
    team: ['Mercy Banda', 'Rutendo Moyo', 'Chipo Ncube', 'Sarah Chen'],
    location: 'Church Kitchen, AFM Chegutu',
    investment: 2500,
    currentIncome: 5200,
    targetIncome: 8000,
    expenses: 1800,
    profit: 3400,
    coverImage: '/images/project-baking.jpg',
    updates: [
      { id: '1', content: 'Catered the Women\'s Conference - great feedback!', date: new Date('2024-03-05'), author: 'Grace Makoni' },
    ],
    needs: ['Industrial mixer', 'Baking trays', 'Packaging materials'],
    volunteers: 8,
    volunteerNeeded: 15,
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '3',
    name: 'Youth Poultry Project',
    description: 'Youth-run broiler chicken production. 500 chickens per cycle, sold to local restaurants and church members. Teaches youth business and agricultural skills.',
    category: 'livestock',
    targetGroup: 'youth',
    status: 'active',
    startDate: new Date('2024-02-01'),
    targetDate: new Date('2024-08-01'),
    leader: 'Mr. Michael Banda',
    team: ['Tinashe Moyo', 'Ruvimbo Chen', 'Takunda Ncube', 'Kudzai Makoni'],
    location: 'Church Poultry House, Goromonzi',
    investment: 1800,
    currentIncome: 1200,
    targetIncome: 6000,
    expenses: 600,
    profit: 600,
    coverImage: '/images/project-poultry.jpg',
    updates: [
      { id: '1', content: 'First batch of 250 chickens sold out in 3 days!', date: new Date('2024-03-01'), author: 'Michael Banda' },
    ],
    needs: ['Chicken feed', 'Vaccines', 'Additional heating lamps'],
    volunteers: 15,
    volunteerNeeded: 25,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: '4',
    name: 'Men\'s Furniture Workshop',
    description: 'Men\'s ministry carpentry workshop producing school desks, church pews, and household furniture. Provides skills training and employment for men in the community.',
    category: 'manufacturing',
    targetGroup: 'men',
    status: 'planning',
    startDate: new Date('2024-05-01'),
    targetDate: new Date('2024-12-31'),
    leader: 'Elder Tendai Ncube',
    team: ['Samuel Moyo', 'David Chen', 'Thomas Banda'],
    location: 'Workshop Space, Church Compound',
    investment: 5000,
    currentIncome: 0,
    targetIncome: 15000,
    expenses: 0,
    profit: 0,
    coverImage: '/images/project-furniture.jpg',
    updates: [],
    needs: ['Woodworking tools', 'Timber', 'Varnish and paints', 'Safety equipment'],
    volunteers: 5,
    volunteerNeeded: 15,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '5',
    name: 'Fish Farming Project',
    description: 'Tilapia fish farming in 4 ponds. Fish sold to local markets, restaurants, and church members. Sustainable protein source for community feeding programs.',
    category: 'agriculture',
    targetGroup: 'community',
    status: 'active',
    startDate: new Date('2023-06-01'),
    leader: 'Mr. Peter Chen',
    team: ['John Moyo', 'Tendai Ncube', 'Michael Banda'],
    location: 'Church Farm, Goromonzi',
    investment: 4200,
    currentIncome: 3800,
    targetIncome: 12000,
    expenses: 1500,
    profit: 2300,
    coverImage: '/images/project-fish.jpg',
    updates: [
      { id: '1', content: 'First harvest - 200kg of tilapia sold!', date: new Date('2023-12-15'), author: 'Peter Chen' },
    ],
    needs: ['Fish feed', 'Pond liners', 'Fingerlings'],
    volunteers: 6,
    volunteerNeeded: 12,
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '6',
    name: 'Computer Training Center',
    description: 'Youth and community computer literacy program. Offers basic computer skills, Microsoft Office, and internet training. Certificates provided upon completion.',
    category: 'education',
    targetGroup: 'youth',
    status: 'planning',
    startDate: new Date('2024-06-01'),
    leader: 'Dr. Samuel Moyo',
    team: ['Tinashe Moyo', 'Ruvimbo Chen'],
    location: 'Church Hall, Computer Room',
    investment: 3000,
    currentIncome: 0,
    targetIncome: 5000,
    expenses: 0,
    profit: 0,
    coverImage: '/images/project-computer.jpg',
    updates: [],
    needs: ['Laptops (10 needed)', 'Projector', 'Internet subscription', 'Furniture'],
    volunteers: 3,
    volunteerNeeded: 8,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

const mockDonations: ProjectDonation[] = [
  { id: '1', projectId: '1', projectName: 'AFM Kingdom Garden', donorName: 'John & Mary Banda', amount: 500, date: new Date('2024-02-15'), type: 'one-time', message: 'Keep up the great work!' },
  { id: '2', projectId: '2', projectName: 'Ladies Baking & Catering', donorName: 'Anonymous', amount: 200, date: new Date('2024-03-01'), type: 'materials', message: 'For baking supplies' },
  { id: '3', projectId: '3', projectName: 'Youth Poultry Project', donorName: 'Mr. Thomas Chen', amount: 50, date: new Date('2024-02-20'), type: 'monthly' },
];

const mockVolunteers: Volunteer[] = [
  { id: '1', projectId: '1', name: 'Tinashe Moyo', email: 'tinashe@email.com', phone: '0771234567', skills: ['Farming', 'Irrigation'], availability: 'Weekends', status: 'active', appliedDate: new Date('2024-01-20') },
  { id: '2', projectId: '2', name: 'Ruvimbo Chen', email: 'ruvimbo@email.com', phone: '0777654321', skills: ['Baking', 'Catering'], availability: 'Weekdays', status: 'active', appliedDate: new Date('2023-10-15') },
  { id: '3', projectId: '4', name: 'Kudzai Makoni', email: 'kudzai@email.com', phone: '0779876543', skills: ['Carpentry', 'Design'], availability: 'Weekends', status: 'pending', appliedDate: new Date('2024-03-10') },
];

// =============== COMPONENTS ===============

const SafeImage = ({ src, alt, className, fill, ...props }: { src: string; alt: string; className?: string; fill?: boolean; [key: string]: any }) => {
  const [error, setError] = useState(false);
  
  if (error || !src || src.startsWith('/images/')) {
    return (
      <div 
        className={`bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center ${className}`}
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

const StatCard = ({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) => (
  <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-3">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500">{label}</p>
    </CardContent>
  </Card>
);

const ProjectCard = ({ project, onEdit, onDelete, onDonate, onVolunteer }: { 
  project: Project; 
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onDonate?: (project: Project) => void;
  onVolunteer?: (project: Project) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const category = PROJECT_CATEGORIES.find(c => c.id === project.category);
  const targetGroup = TARGET_GROUPS.find(g => g.id === project.targetGroup);
  
  const statusColors = {
    'planning': 'bg-yellow-100 text-yellow-700',
    'active': 'bg-green-100 text-green-700',
    'completed': 'bg-blue-100 text-blue-700',
    'on-hold': 'bg-red-100 text-red-700',
  };

  const progress = project.targetIncome > 0 
    ? Math.round((project.currentIncome / project.targetIncome) * 100)
    : 0;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden hover:shadow-xl transition-all">
      {project.coverImage && (
        <div className="relative h-48 w-full bg-gradient-to-br from-emerald-400 to-teal-600">
          <SafeImage
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={statusColors[project.status]}>{project.status}</Badge>
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white/70">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(project)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Project
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {category && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <category.icon className="h-3 w-3" />
                  {category.name}
                </Badge>
              )}
              {targetGroup && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <targetGroup.icon className="h-3 w-3" />
                  {targetGroup.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress to Target:</span>
            <span className="font-medium">${project.currentIncome.toLocaleString()} / ${project.targetIncome.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Investment</p>
              <p className="font-medium">${project.investment.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Profit</p>
              <p className="font-medium text-green-600">${project.profit.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Volunteers</p>
              <p className="font-medium">{project.volunteers}/{project.volunteerNeeded}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium truncate">{project.location.split(',')[0]}</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mb-3"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </Button>
        
        {showDetails && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium mb-2">Team</h4>
              <p className="text-sm text-gray-500"><strong>Leader:</strong> {project.leader}</p>
              <p className="text-sm text-gray-500"><strong>Team Members:</strong> {project.team.join(', ')}</p>
            </div>
            
            {project.needs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Current Needs</h4>
                <div className="flex flex-wrap gap-1">
                  {project.needs.map((need, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{need}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {project.updates.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Updates</h4>
                <div className="space-y-2">
                  {project.updates.slice(0, 2).map((update) => (
                    <div key={update.id} className="text-sm">
                      <p className="text-gray-500">{update.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {update.author} - {update.date.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span><strong>Start Date:</strong> {project.startDate.toLocaleDateString()}</span>
              {project.targetDate && (
                <span><strong>Target:</strong> {project.targetDate.toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {onDonate && (
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onDonate(project)}
            >
              <HandCoins className="h-4 w-4 mr-2" /> Donate
            </Button>
          )}
          {onVolunteer && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onVolunteer(project)}
            >
              <Users className="h-4 w-4 mr-2" /> Volunteer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectDialog = ({ open, onOpenChange, onSave, initialData }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Partial<Project>) => void;
  initialData?: Project;
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'agriculture',
    targetGroup: initialData?.targetGroup || 'all',
    status: initialData?.status || 'planning',
    leader: initialData?.leader || '',
    team: initialData?.team?.join(', ') || '',
    location: initialData?.location || '',
    investment: initialData?.investment?.toString() || '0',
    targetIncome: initialData?.targetIncome?.toString() || '0',
    coverImage: initialData?.coverImage || '',
    needs: initialData?.needs?.join(', ') || '',
    volunteerNeeded: initialData?.volunteerNeeded?.toString() || '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      investment: parseFloat(formData.investment),
      targetIncome: parseFloat(formData.targetIncome),
      volunteerNeeded: parseInt(formData.volunteerNeeded),
      team: formData.team.split(',').map(t => t.trim()).filter(Boolean),
      needs: formData.needs.split(',').map(n => n.trim()).filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            Add details about your income-generating project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetGroup">Target Group *</Label>
              <Select value={formData.targetGroup} onValueChange={(v) => setFormData({ ...formData, targetGroup: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_GROUPS.map(group => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="leader">Project Leader *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="team">Team Members (comma separated)</Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="e.g., John Doe, Jane Smith"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="investment">Investment ($) *</Label>
              <Input
                id="investment"
                type="number"
                min="0"
                step="100"
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="targetIncome">Target Income ($) *</Label>
              <Input
                id="targetIncome"
                type="number"
                min="0"
                step="100"
                value={formData.targetIncome}
                onChange={(e) => setFormData({ ...formData, targetIncome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="volunteerNeeded">Volunteers Needed</Label>
              <Input
                id="volunteerNeeded"
                type="number"
                min="0"
                value={formData.volunteerNeeded}
                onChange={(e) => setFormData({ ...formData, volunteerNeeded: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/images/project.jpg"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="needs">Project Needs (comma separated)</Label>
              <Input
                id="needs"
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                placeholder="e.g., Seeds, Tools, Equipment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {initialData ? 'Update' : 'Create'} Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DonateDialog = ({ open, onOpenChange, project, onDonate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onDonate: (donation: Partial<ProjectDonation>) => void;
}) => {
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    type: 'one-time' as 'one-time' | 'monthly' | 'materials',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDonate({
      projectId: project?.id,
      projectName: project?.name,
      donorName: formData.donorName,
      amount: parseFloat(formData.amount),
      type: formData.type,
      message: formData.message,
    });
    toast.success('Thank you for your donation!');
    onOpenChange(false);
    setFormData({ donorName: '', amount: '', type: 'one-time', message: '' });
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support {project.name}</DialogTitle>
          <DialogDescription>
            Your donation helps this project grow and bless others.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donorName">Your Name *</Label>
            <Input
              id="donorName"
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Donation Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Donation Type *</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time Donation</SelectItem>
                <SelectItem value="monthly">Monthly Support</SelectItem>
                <SelectItem value="materials">Materials/Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={2}
              placeholder="Encouragement or specific designation..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Complete Donation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const VolunteerDialog = ({ open, onOpenChange, project, onVolunteer }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onVolunteer: (volunteer: Partial<Volunteer>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVolunteer({
      projectId: project?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      availability: formData.availability,
    });
    toast.success('Thank you for volunteering! We\'ll contact you soon.');
    onOpenChange(false);
    setFormData({ name: '', email: '', phone: '', skills: '', availability: '' });
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Volunteer for {project.name}</DialogTitle>
          <DialogDescription>
            Join the team and make a difference!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="volName">Full Name *</Label>
            <Input
              id="volName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="volEmail">Email *</Label>
            <Input
              id="volEmail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="volPhone">Phone *</Label>
            <Input
              id="volPhone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., Farming, Carpentry, Teaching"
            />
          </div>
          <div>
            <Label htmlFor="availability">Availability *</Label>
            <Select value={formData.availability} onValueChange={(v) => setFormData({ ...formData, availability: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Weekends">Weekends</SelectItem>
                <SelectItem value="Evenings">Evenings</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ open, onOpenChange, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// =============== MAIN PAGE ===============
export default function ProjectsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Town Assembly');
  const [activeTab, setActiveTab] = useState('all');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [donations, setDonations] = useState<ProjectDonation[]>(mockDonations);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTargetGroup, setFilterTargetGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const handleCreateProject = (project: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: project.name || '',
      description: project.description || '',
      category: project.category || 'agriculture',
      targetGroup: project.targetGroup || 'all',
      status: project.status || 'planning',
      startDate: new Date(),
      leader: project.leader || '',
      team: project.team || [],
      location: project.location || '',
      investment: project.investment || 0,
      currentIncome: 0,
      targetIncome: project.targetIncome || 0,
      expenses: 0,
      profit: 0,
      coverImage: project.coverImage,
      updates: [],
      needs: project.needs || [],
      volunteers: 0,
      volunteerNeeded: project.volunteerNeeded || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([newProject, ...projects]);
    toast.success('Project created successfully!');
  };

  const handleUpdateProject = (project: Partial<Project>) => {
    if (!editingProject) return;
    setProjects(projects.map(p => 
      p.id === editingProject.id 
        ? { ...p, ...project, updatedAt: new Date() }
        : p
    ));
    setEditingProject(undefined);
    toast.success('Project updated successfully!');
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete));
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      toast.success('Project deleted successfully!');
    }
  };

  const handleDonate = (donation: Partial<ProjectDonation>) => {
    const newDonation: ProjectDonation = {
      id: Date.now().toString(),
      projectId: donation.projectId || '',
      projectName: donation.projectName || '',
      donorName: donation.donorName || 'Anonymous',
      amount: donation.amount || 0,
      date: new Date(),
      message: donation.message,
      type: donation.type || 'one-time',
    };
    setDonations([newDonation, ...donations]);
    
    if (donation.projectId) {
      setProjects(projects.map(p => 
        p.id === donation.projectId 
          ? { ...p, currentIncome: p.currentIncome + (donation.amount || 0), profit: p.profit + (donation.amount || 0) }
          : p
      ));
    }
  };

  const handleVolunteer = (volunteer: Partial<Volunteer>) => {
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      projectId: volunteer.projectId || '',
      name: volunteer.name || '',
      email: volunteer.email || '',
      phone: volunteer.phone || '',
      skills: volunteer.skills || [],
      availability: volunteer.availability || 'Flexible',
      status: 'pending',
      appliedDate: new Date(),
    };
    setVolunteers([newVolunteer, ...volunteers]);
  };

  const filteredProjects = projects.filter(project => {
    if (filterCategory !== 'all' && project.category !== filterCategory) return false;
    if (filterTargetGroup !== 'all' && project.targetGroup !== filterTargetGroup) return false;
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    return true;
  });

  const totalRaised = projects.reduce((sum, p) => sum + p.currentIncome, 0);
  const totalTarget = projects.reduce((sum, p) => sum + p.targetIncome, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalVolunteers = projects.reduce((sum, p) => sum + p.volunteers, 0);

  const isAdmin = isLoggedIn;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20" />
      </div>

      <div className="relative z-10">
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout} />

        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4 gap-2">
                <div className="animate-pulse">
                  <Tractor className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="animate-pulse delay-100">
                  <Store className="h-8 w-8 text-amber-400" />
                </div>
                <div className="animate-pulse delay-200">
                  <Factory className="h-8 w-8 text-teal-400" />
                </div>
                <div className="animate-pulse delay-300">
                  <HandCoins className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                Income Generating Projects • Est. {PROJECTS_INFO.founded}
              </Badge>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                {PROJECTS_INFO.name}
              </h1>
              <p className="text-base sm:text-xl text-white/90 mb-4 leading-relaxed">
                {PROJECTS_INFO.tagline}
              </p>
              <p className="text-lg text-white/70 mb-8 italic">
                "{PROJECTS_INFO.verse}"
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {isAdmin && (
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg" onClick={() => { setEditingProject(undefined); setProjectDialogOpen(true); }}>
                    <Plus className="h-5 w-5 mr-2" /> Create Project
                  </Button>
                )}
                <Button size="lg" variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" onClick={() => setContactDialogOpen(true)}>
                  Partner With Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Rocket} value={activeProjects.toString()} label="Active Projects" color="bg-emerald-100 text-emerald-700" />
              <StatCard icon={DollarSign} value={`$${totalRaised.toLocaleString()}`} label="Total Raised" color="bg-teal-100 text-teal-700" />
              <StatCard icon={Target} value={`$${totalTarget.toLocaleString()}`} label="Total Target" color="bg-green-100 text-green-700" />
              <StatCard icon={Users2} value={totalVolunteers.toString()} label="Volunteers" color="bg-amber-100 text-amber-700" />
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <ProjectGrid 
                  projects={filteredProjects}
                  onEdit={isAdmin ? (p) => { setEditingProject(p); setProjectDialogOpen(true); } : undefined}
                  onDelete={isAdmin ? (id) => { setProjectToDelete(id); setDeleteConfirmOpen(true); } : undefined}
                  onDonate={(p) => { setSelectedProject(p); setDonateDialogOpen(true); }}
                  onVolunteer={(p) => { setSelectedProject(p); setVolunteerDialogOpen(true); }}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterTargetGroup={filterTargetGroup}
                  setFilterTargetGroup={setFilterTargetGroup}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                />
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                <ProjectGrid 
                  projects={filteredProjects.filter(p => p.status === 'active')}
                  onEdit={isAdmin ? (p) => { setEditingProject(p); setProjectDialogOpen(true); } : undefined}
                  onDelete={isAdmin ? (id) => { setProjectToDelete(id); setDeleteConfirmOpen(true); } : undefined}
                  onDonate={(p) => { setSelectedProject(p); setDonateDialogOpen(true); }}
                  onVolunteer={(p) => { setSelectedProject(p); setVolunteerDialogOpen(true); }}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterTargetGroup={filterTargetGroup}
                  setFilterTargetGroup={setFilterTargetGroup}
                  hideStatusFilter
                />
              </TabsContent>

              <TabsContent value="planning" className="space-y-6">
                <ProjectGrid 
                  projects={filteredProjects.filter(p => p.status === 'planning')}
                  onEdit={isAdmin ? (p) => { setEditingProject(p); setProjectDialogOpen(true); } : undefined}
                  onDelete={isAdmin ? (id) => { setProjectToDelete(id); setDeleteConfirmOpen(true); } : undefined}
                  onDonate={(p) => { setSelectedProject(p); setDonateDialogOpen(true); }}
                  onVolunteer={(p) => { setSelectedProject(p); setVolunteerDialogOpen(true); }}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterTargetGroup={filterTargetGroup}
                  setFilterTargetGroup={setFilterTargetGroup}
                  hideStatusFilter
                />
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <ProjectGrid 
                  projects={filteredProjects.filter(p => p.status === 'completed')}
                  onEdit={isAdmin ? (p) => { setEditingProject(p); setProjectDialogOpen(true); } : undefined}
                  onDelete={isAdmin ? (id) => { setProjectToDelete(id); setDeleteConfirmOpen(true); } : undefined}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterTargetGroup={filterTargetGroup}
                  setFilterTargetGroup={setFilterTargetGroup}
                  hideStatusFilter
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <Card className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white border-0 shadow-2xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Partner With Us!</h2>
                <p className="text-white/90 mb-6">
                  Your support helps us create sustainable income streams that fund the Great Commission and bless our community.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100" onClick={() => setContactDialogOpen(true)}>
                    Become a Partner
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => setContactDialogOpen(true)}>
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>

      <ProjectDialog 
        open={projectDialogOpen} 
        onOpenChange={setProjectDialogOpen}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject}
      />

      <DonateDialog 
        open={donateDialogOpen} 
        onOpenChange={setDonateDialogOpen}
        project={selectedProject}
        onDonate={handleDonate}
      />

      <VolunteerDialog 
        open={volunteerDialogOpen} 
        onOpenChange={setVolunteerDialogOpen}
        project={selectedProject}
        onVolunteer={handleVolunteer}
      />

      <DeleteConfirmDialog 
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteProject}
      />

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Partner With Us</DialogTitle>
            <DialogDescription>
              Interested in supporting our projects? Fill out the form and we'll get back to you.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Thank you for your interest! We\'ll contact you soon.'); setContactDialogOpen(false); }}>
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" />
            </div>
            <div>
              <Label htmlFor="interest">I'm interested in...</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donate">Donating to a project</SelectItem>
                  <SelectItem value="volunteer">Volunteering</SelectItem>
                  <SelectItem value="partner">Business partnership</SelectItem>
                  <SelectItem value="learn">Learning more</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// Project Grid Component
const ProjectGrid = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onDonate, 
  onVolunteer,
  filterCategory,
  setFilterCategory,
  filterTargetGroup,
  setFilterTargetGroup,
  filterStatus,
  setFilterStatus,
  hideStatusFilter 
}: { 
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onDonate?: (project: Project) => void;
  onVolunteer?: (project: Project) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterTargetGroup: string;
  setFilterTargetGroup: (value: string) => void;
  filterStatus?: string;
  setFilterStatus?: (value: string) => void;
  hideStatusFilter?: boolean;
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {PROJECT_CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterTargetGroup} onValueChange={setFilterTargetGroup}>
          <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Target Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {TARGET_GROUPS.map(group => (
              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!hideStatusFilter && setFilterStatus && (
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={onEdit}
              onDelete={onDelete}
              onDonate={onDonate}
              onVolunteer={onVolunteer}
            />
          ))}
        </div>
      )}
    </>
  );
};