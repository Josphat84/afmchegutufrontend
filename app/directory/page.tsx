'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Search,
  X,
  Users,
  Calendar,
  Briefcase,
  Heart,
  Home,
  Phone,
  Mail,
  User,
  BookOpen,
  Grid3x3,
  Table as TableIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users2,
  UserCircle,
  CalendarDays,
  CreditCard,
  Building,
  HeartHandshake,
  Church,
  Droplets,
  Clock,
  Download,
  PieChart,
  Gift,
  Cake,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// =============== IMPORTED COMPONENTS ===============
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// =============== CONSTANTS ===============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const DEPARTMENTS = [
  'Youth',
  'ECD',
  'Ladies Fellowship',
  "Men's Fellowship",
  'Boys Fellowship',
  'Girls Fellowship',
  'Choir',
  'Ushering',
  'Sunday School',
  'Prayer Team',
  'Evangelism',
  'Media',
] as const;

const POSITIONS = [
  'Elder',
  'Deacon',
  'Deaconess',
  'Secretary',
  'Treasurer',
  'Usher',
  'Sunday School Teacher',
  'Choir Member',
  'Choir Leader',
  'Youth Leader',
  "Children's Worker",
  'Prayer Coordinator',
  'Evangelist',
  'Pastor',
  'Bishop',
] as const;

// =============== TYPES ===============
type Department = typeof DEPARTMENTS[number];
type Position = typeof POSITIONS[number];

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: string;
  idNumber: string;
  profession: string;
  workplace: string;
  address: string;
  homeAddress: string;
  nextOfKin: string;
  spouseName: string;
  parents: string;
  departments: Department[];
  positions: Position[];
  baptismDate: string;
  joinedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MemberStats {
  total: number;
  male: number;
  female: number;
  other: number;
  baptised: number;
  with_family: number;
  upcoming_birthdays: number;
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

// Helper to convert camelCase to snake_case for backend
const toBackend = (member: Partial<Member>) => {
  return {
    full_name: member.fullName,
    email: member.email || null,
    phone: member.phone || null,
    gender: member.gender || null,
    date_of_birth: member.dateOfBirth || null,
    id_number: member.idNumber || null,
    profession: member.profession || null,
    workplace: member.workplace || null,
    address: member.address || null,
    home_address: member.homeAddress || null,
    next_of_kin: member.nextOfKin || null,
    spouse_name: member.spouseName || null,
    parents: member.parents || null,
    departments: member.departments || [],
    positions: member.positions || [],
    baptism_date: member.baptismDate || null,
    joined_date: member.joinedDate || null,
  };
};

// Helper to convert snake_case to camelCase from backend
const fromBackend = (data: any): Member => {
  return {
    id: data.id,
    fullName: data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    gender: data.gender || '',
    dateOfBirth: data.date_of_birth || '',
    idNumber: data.id_number || '',
    profession: data.profession || '',
    workplace: data.workplace || '',
    address: data.address || '',
    homeAddress: data.home_address || '',
    nextOfKin: data.next_of_kin || '',
    spouseName: data.spouse_name || '',
    parents: data.parents || '',
    departments: data.departments || [],
    positions: data.positions || [],
    baptismDate: data.baptism_date || '',
    joinedDate: data.joined_date || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

async function getMembers(params?: {
  search?: string;
  gender?: string;
  department?: string;
  position?: string;
  limit?: number;
  offset?: number;
}): Promise<Member[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.gender) queryParams.append('gender', params.gender);
  if (params?.department) queryParams.append('department', params.department);
  if (params?.position) queryParams.append('position', params.position);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const data = await fetchAPI<any[]>(`/directory/?${queryParams.toString()}`);
  return Array.isArray(data) ? data.map(fromBackend) : [];
}

async function getMemberCount(params?: {
  search?: string;
  gender?: string;
  department?: string;
  position?: string;
}): Promise<number> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.gender) queryParams.append('gender', params.gender);
  if (params?.department) queryParams.append('department', params.department);
  if (params?.position) queryParams.append('position', params.position);

  return fetchAPI<number>(`/directory/count?${queryParams.toString()}`);
}

async function getMemberStats(): Promise<MemberStats> {
  try {
    const data = await fetchAPI<any>('/directory/stats/overview');
    return {
      total: data?.total || 0,
      male: data?.male || 0,
      female: data?.female || 0,
      other: data?.other || 0,
      baptised: data?.baptised || 0,
      with_family: data?.with_family || 0,
      upcoming_birthdays: data?.upcoming_birthdays || 0,
    };
  } catch {
    return {
      total: 0,
      male: 0,
      female: 0,
      other: 0,
      baptised: 0,
      with_family: 0,
      upcoming_birthdays: 0,
    };
  }
}

async function createMember(member: Partial<Member>): Promise<Member> {
  const backendData = toBackend(member);
  const data = await fetchAPI<any>('/directory/', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
  return fromBackend(data);
}

async function updateMember(id: string, member: Partial<Member>): Promise<Member> {
  const backendData = toBackend(member);
  const data = await fetchAPI<any>(`/directory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(backendData),
  });
  return fromBackend(data);
}

async function deleteMember(id: string): Promise<void> {
  await fetchAPI(`/directory/${id}`, {
    method: 'DELETE',
  });
}

// =============== HELPER FUNCTIONS ===============
const getInitials = (name?: string) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return '?';
  }
  
  return name
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

// =============== MAIN PAGE ===============
export default function DirectoryPage() {
  const router = useRouter();
  
  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Data
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    male: 0,
    female: 0,
    other: 0,
    baptised: 0,
    with_family: 0,
    upcoming_birthdays: 0,
  });

  // Expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [churchName, setChurchName] = useState('Grace Community Church');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    dateOfBirth: '',
    idNumber: '',
    profession: '',
    workplace: '',
    address: '',
    homeAddress: '',
    nextOfKin: '',
    spouseName: '',
    parents: '',
    departments: [] as Department[],
    positions: [] as Position[],
    baptismDate: '',
    joinedDate: '',
  });

  // Load auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const church = localStorage.getItem('church');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        if (church) setChurchName(church);
      } catch (error) {
        // ignore
      }
    }
  }, []);

  // Test API connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection to:', `${API_BASE_URL}/health`);
        const res = await fetch(`${API_BASE_URL}/health`);
        if (res.ok) {
          console.log('API connection successful');
        } else {
          console.error('API connection failed:', res.status);
          toast.error('Cannot connect to backend server');
        }
      } catch (error) {
        console.error('API connection error:', error);
        toast.error('Cannot connect to backend server');
      }
    };
    testConnection();
  }, []);

  // Fetch data
  useEffect(() => {
    fetchMembers();
    fetchStats();
  }, [searchTerm, selectedGender, selectedDepartments, selectedPositions, currentPage]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers({
        search: searchTerm || undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined,
        department: selectedDepartments.length > 0 ? selectedDepartments[0] : undefined,
        position: selectedPositions.length > 0 ? selectedPositions[0] : undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
      });
      setMembers(data);
      
      const count = await getMemberCount({
        search: searchTerm || undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined,
        department: selectedDepartments.length > 0 ? selectedDepartments[0] : undefined,
        position: selectedPositions.length > 0 ? selectedPositions[0] : undefined,
      });
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getMemberStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Toggle expanded
  const toggleExpanded = (id: string) => {
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

  // Expand all
  const expandAll = () => {
    setExpandedItems(new Set(members.map(m => m.id)));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGender('all');
    setSelectedDepartments([]);
    setSelectedPositions([]);
    setCurrentPage(0);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      idNumber: '',
      profession: '',
      workplace: '',
      address: '',
      homeAddress: '',
      nextOfKin: '',
      spouseName: '',
      parents: '',
      departments: [],
      positions: [],
      baptismDate: '',
      joinedDate: '',
    });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change (gender)
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      gender: value as 'male' | 'female' | 'other' | '' 
    }));
  };

  // Toggle department
  const toggleDepartment = (dept: Department) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  // Toggle position
  const togglePosition = (pos: Position) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(pos)
        ? prev.positions.filter(p => p !== pos)
        : [...prev.positions, pos],
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.fullName.trim()) {
      toast.error('Full Name is required');
      setSaving(false);
      return;
    }

    try {
      // Prepare data with proper types
      const memberData = {
        ...formData,
        fullName: formData.fullName || 'Unknown',
        gender: formData.gender,
        departments: formData.departments,
        positions: formData.positions,
      };

      if (editingMember) {
        await updateMember(editingMember.id, memberData);
        toast.success('Member updated successfully');
      } else {
        await createMember(memberData);
        toast.success('Member added successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      setEditingMember(null);
      await fetchMembers();
      await fetchStats();
    } catch (error: any) {
      console.error('Failed to save member:', error);
      toast.error(error.message || 'Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  // Edit member
  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName || '',
      email: member.email || '',
      phone: member.phone || '',
      gender: member.gender,
      dateOfBirth: member.dateOfBirth || '',
      idNumber: member.idNumber || '',
      profession: member.profession || '',
      workplace: member.workplace || '',
      address: member.address || '',
      homeAddress: member.homeAddress || '',
      nextOfKin: member.nextOfKin || '',
      spouseName: member.spouseName || '',
      parents: member.parents || '',
      departments: member.departments || [],
      positions: member.positions || [],
      baptismDate: member.baptismDate || '',
      joinedDate: member.joinedDate || '',
    });
    setDialogOpen(true);
  };

  // Delete member
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      await deleteMember(id);
      toast.success('Member deleted successfully');
      await fetchMembers();
      await fetchStats();
    } catch (error: any) {
      console.error('Failed to delete member:', error);
      toast.error(error.message || 'Failed to delete member');
    }
  };

  // Open new dialog
  const openNewDialog = () => {
    setEditingMember(null);
    resetForm();
    setDialogOpen(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('church');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-purple-800 text-sm font-medium">Loading directory...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        churchName={churchName}
        onLogout={handleLogout}
      />

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Believers Directory
              </h1>
              <p className="text-purple-100 mt-1">
                Showing {members.length} of {totalCount} members
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('table')}
                className={`bg-white/10 backdrop-blur-sm border-white/30 ${
                  viewMode === 'table' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`bg-white/10 backdrop-blur-sm border-white/30 ${
                  viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={openNewDialog}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Member
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/40">
              <CardContent className="p-3 text-center">
                <Users className="h-5 w-5 text-purple-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/40">
              <CardContent className="p-3 text-center">
                <User className="h-5 w-5 text-blue-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.male}</p>
                <p className="text-xs text-gray-500">Male</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200/40">
              <CardContent className="p-3 text-center">
                <User className="h-5 w-5 text-pink-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.female}</p>
                <p className="text-xs text-gray-500">Female</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-green-200/40">
              <CardContent className="p-3 text-center">
                <Droplets className="h-5 w-5 text-green-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.baptised}</p>
                <p className="text-xs text-gray-500">Baptised</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200/40">
              <CardContent className="p-3 text-center">
                <HeartHandshake className="h-5 w-5 text-amber-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.with_family}</p>
                <p className="text-xs text-gray-500">Have Family</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-red-200/40">
              <CardContent className="p-3 text-center">
                <Cake className="h-5 w-5 text-red-700 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-800">{stats.upcoming_birthdays}</p>
                <p className="text-xs text-gray-500">Birthdays soon</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-200/40 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone..."
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

              {/* Expand/Collapse All */}
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

              {/* Gender Filter */}
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-full lg:w-[150px] bg-white/80 border-purple-200">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Departments Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white/80 border-purple-200 justify-between">
                    <span>Departments {selectedDepartments.length > 0 && `(${selectedDepartments.length})`}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <h4 className="font-medium mb-2">Filter by Department</h4>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {DEPARTMENTS.map(dept => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-dept-${dept}`}
                            checked={selectedDepartments.includes(dept)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDepartments([...selectedDepartments, dept]);
                              } else {
                                setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                              }
                            }}
                          />
                          <Label htmlFor={`filter-dept-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              {/* Positions Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white/80 border-purple-200 justify-between">
                    <span>Positions {selectedPositions.length > 0 && `(${selectedPositions.length})`}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <h4 className="font-medium mb-2">Filter by Position</h4>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {POSITIONS.map(pos => (
                        <div key={pos} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-pos-${pos}`}
                            checked={selectedPositions.includes(pos)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPositions([...selectedPositions, pos]);
                              } else {
                                setSelectedPositions(selectedPositions.filter(p => p !== pos));
                              }
                            }}
                          />
                          <Label htmlFor={`filter-pos-${pos}`} className="text-sm">{pos}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {(searchTerm || selectedGender !== 'all' || selectedDepartments.length > 0 || selectedPositions.length > 0) && (
                <Button variant="ghost" onClick={clearFilters} className="text-purple-700 hover:text-purple-800">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Members Grid/Table */}
          {viewMode === 'table' ? (
            /* Table View */
            <div>
              <Card className="border-purple-200/40 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-purple-100/80 to-blue-100/80">
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Member</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Departments</TableHead>
                          <TableHead>Positions</TableHead>
                          <TableHead>Baptism</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
                            </TableCell>
                          </TableRow>
                        ) : members.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                                <p>No members found.</p>
                                <Button variant="link" onClick={clearFilters} className="text-purple-600">
                                  Clear filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          members.map((member) => (
                            <Fragment key={member.id}>
                              {/* Main row */}
                              <TableRow className="hover:bg-purple-50/50 transition">
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleExpanded(member.id)}
                                  >
                                    {expandedItems.has(member.id) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border-2 border-purple-200">
                                      <AvatarFallback className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white text-xs">
                                        {getInitials(member.fullName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-gray-800">{member.fullName || 'Unknown'}</p>
                                      <p className="text-xs text-gray-500">
                                        {member.gender && <Badge variant="outline" className="mr-1 text-[10px] capitalize">{member.gender}</Badge>}
                                        {member.dateOfBirth && formatDate(member.dateOfBirth)}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {member.phone && <p className="text-sm">{member.phone}</p>}
                                  {member.email && <p className="text-xs text-gray-500 truncate max-w-[150px]">{member.email}</p>}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {(member.departments || []).slice(0, 2).map(d => (
                                      <Badge key={d} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                        {d}
                                      </Badge>
                                    ))}
                                    {member.departments && member.departments.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">+{member.departments.length - 2}</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {(member.positions || []).slice(0, 2).map(p => (
                                      <Badge key={p} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                        {p}
                                      </Badge>
                                    ))}
                                    {member.positions && member.positions.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">+{member.positions.length - 2}</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {member.baptismDate ? formatDate(member.baptismDate) : '—'}
                                </TableCell>
                                <TableCell className="text-right space-x-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(member)} className="hover:bg-purple-100">
                                    <Pencil className="h-4 w-4 text-purple-700" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="hover:bg-red-100">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              
                              {/* Expanded details */}
                              {expandedItems.has(member.id) && (
                                <TableRow className="bg-purple-50/30 border-t-0">
                                  <TableCell colSpan={7} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {/* Personal */}
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-800 text-sm">Personal Details</h4>
                                        <div className="space-y-1 text-sm">
                                          <p><span className="text-gray-500">ID:</span> {member.idNumber || '—'}</p>
                                          <p><span className="text-gray-500">Profession:</span> {member.profession || '—'}</p>
                                          <p><span className="text-gray-500">Workplace:</span> {member.workplace || '—'}</p>
                                        </div>
                                      </div>

                                      {/* Address */}
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-800 text-sm">Address</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>{member.address || '—'}</p>
                                          <p>{member.homeAddress || '—'}</p>
                                        </div>
                                      </div>

                                      {/* Family */}
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-800 text-sm">Family</h4>
                                        <div className="space-y-1 text-sm">
                                          <p><span className="text-gray-500">Next of Kin:</span> {member.nextOfKin || '—'}</p>
                                          <p><span className="text-gray-500">Spouse:</span> {member.spouseName || '—'}</p>
                                          <p><span className="text-gray-500">Parents:</span> {member.parents || '—'}</p>
                                        </div>
                                      </div>

                                      {/* Church */}
                                      <div className="space-y-2 md:col-span-3">
                                        <h4 className="font-semibold text-purple-800 text-sm">Church Information</h4>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                          <div>
                                            <p className="text-gray-500 mb-1">All Departments:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {(member.departments || []).length > 0 ? (
                                                (member.departments || []).map(d => (
                                                  <Badge key={d} variant="secondary" className="bg-purple-100 text-purple-800">
                                                    {d}
                                                  </Badge>
                                                ))
                                              ) : (
                                                <span className="text-gray-400">None</span>
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-gray-500 mb-1">All Positions:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {(member.positions || []).length > 0 ? (
                                                (member.positions || []).map(p => (
                                                  <Badge key={p} variant="secondary" className="bg-blue-100 text-blue-800">
                                                    {p}
                                                  </Badge>
                                                ))
                                              ) : (
                                                <span className="text-gray-400">None</span>
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-gray-500 mb-1">Dates:</p>
                                            <p>Baptism: {formatDate(member.baptismDate)}</p>
                                            <p>Joined: {formatDate(member.joinedDate)}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Fragment>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    Showing {startItem}-{endItem} of {totalCount} members
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : members.length === 0 ? (
                <div className="col-span-full text-center py-12 text-white bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-white/60" />
                    <p className="text-white">No members found.</p>
                    <Button variant="link" onClick={clearFilters} className="text-white underline">
                      Clear filters
                    </Button>
                  </div>
                </div>
              ) : (
                members.map((member) => (
                  <Card key={member.id} className="bg-white/90 backdrop-blur-sm border-purple-200/40 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-purple-200">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white">
                              {getInitials(member.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-gray-800">{member.fullName || 'Unknown'}</h3>
                            <p className="text-xs text-gray-500">{member.profession || '—'}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleExpanded(member.id)}
                        >
                          {expandedItems.has(member.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Quick Info */}
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        {member.phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {member.phone}
                          </p>
                        )}
                        {member.email && (
                          <p className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" /> {member.email}
                          </p>
                        )}
                      </div>

                      {/* Departments & Positions */}
                      <div className="space-y-2">
                        {member.departments && member.departments.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(member.departments || []).slice(0, 2).map(d => (
                              <Badge key={d} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                {d}
                              </Badge>
                            ))}
                            {member.departments.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{member.departments.length - 2}</Badge>
                            )}
                          </div>
                        )}
                        {member.positions && member.positions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(member.positions || []).slice(0, 2).map(p => (
                              <Badge key={p} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                {p}
                              </Badge>
                            ))}
                            {member.positions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{member.positions.length - 2}</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {expandedItems.has(member.id) && (
                        <div className="mt-4 pt-4 border-t border-purple-100">
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div><span className="text-gray-500">ID:</span> {member.idNumber || '—'}</div>
                              <div><span className="text-gray-500">Work:</span> {member.workplace || '—'}</div>
                              <div><span className="text-gray-500">Baptism:</span> {formatDate(member.baptismDate)}</div>
                              <div><span className="text-gray-500">Joined:</span> {formatDate(member.joinedDate)}</div>
                            </div>
                            
                            <div>
                              <span className="text-gray-500">Address:</span> {member.address || member.homeAddress || '—'}
                            </div>
                            
                            {member.nextOfKin && (
                              <div><span className="text-gray-500">Next of Kin:</span> {member.nextOfKin}</div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(member)}>
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-red-600" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact & Address</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="church">Church</TabsTrigger>
              </TabsList>

              {/* Personal Tab */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={handleGenderChange} value={formData.gender || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" name="profession" value={formData.profession} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workplace">Place of Work</Label>
                    <Input id="workplace" name="workplace" value={formData.workplace} onChange={handleInputChange} />
                  </div>
                </div>
              </TabsContent>

              {/* Contact & Address Tab */}
              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeAddress">Home Address</Label>
                    <Input id="homeAddress" name="homeAddress" value={formData.homeAddress} onChange={handleInputChange} />
                  </div>
                </div>
              </TabsContent>

              {/* Family Tab */}
              <TabsContent value="family" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKin">Next of Kin</Label>
                    <Input id="nextOfKin" name="nextOfKin" value={formData.nextOfKin} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spouseName">Spouse Name</Label>
                    <Input id="spouseName" name="spouseName" value={formData.spouseName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parents">Parents</Label>
                    <Input id="parents" name="parents" value={formData.parents} onChange={handleInputChange} />
                  </div>
                </div>
              </TabsContent>

              {/* Church Tab */}
              <TabsContent value="church" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departments (select all that apply)</Label>
                    <ScrollArea className="h-48 border rounded-md p-2">
                      {DEPARTMENTS.map(dept => (
                        <div key={dept} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={formData.departments.includes(dept)}
                            onCheckedChange={() => toggleDepartment(dept)}
                          />
                          <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div className="space-y-2">
                    <Label>Positions (select all that apply)</Label>
                    <ScrollArea className="h-48 border rounded-md p-2">
                      {POSITIONS.map(pos => (
                        <div key={pos} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`pos-${pos}`}
                            checked={formData.positions.includes(pos)}
                            onCheckedChange={() => togglePosition(pos)}
                          />
                          <Label htmlFor={`pos-${pos}`} className="text-sm">{pos}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baptismDate">Date of Baptism</Label>
                    <Input id="baptismDate" name="baptismDate" type="date" value={formData.baptismDate} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinedDate">Date Joined Church</Label>
                    <Input id="joinedDate" name="joinedDate" type="date" value={formData.joinedDate} onChange={handleInputChange} />
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
                {editingMember ? 'Update Member' : 'Save Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}