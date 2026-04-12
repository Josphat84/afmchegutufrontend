// frontend/components/header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Church,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  DollarSign,
  Package,
  Users,
  CalendarDays,
  Video,
  HeartHandshake,
  Settings,
  BarChart3,
  Gift,
  PieChart,
  Calculator,
  FileText,
  CreditCard,
  Baby,
  UserCheck,
  HeartPulse,
  BookHeart,
  UsersRound,
  Trophy,
  BookOpen,
  Cross,
  Film,
  Newspaper,
  Podcast,
  Mail,
  Smartphone,
  Shield,
  Database,
  FileCheck,
  Layers,
  Server,
  LineChart,
  Eye,
  TrendingUp,
  Award,
  LucideIcon,
  Flower,
  Bird,
  Briefcase,
  Tractor,
  Store,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from './AuthForm';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  churchName?: string;
  avatar?: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user: UserData | null;
  churchName: string;
  onLogout: () => void;
}

// Module data for navigation dropdowns
const financialModules = [
  { icon: DollarSign, title: 'Tithe Records', link: '/tithes' },
  { icon: Gift, title: 'Offerings', link: '/offerings' },
  { icon: PieChart, title: 'Budget Planning', link: '/budget' },
  { icon: Calculator, title: 'Expense Tracking', link: '/expenses' },
  { icon: FileText, title: 'Financial Reports', link: '/reports' },
  { icon: CreditCard, title: 'Online Giving', link: '/online-giving' },
];

const membershipModules = [
  { icon: Users, title: 'Member Directory', link: '/members' },
  { icon: UserPlus, title: 'Visitor Tracking', link: '/visitors' },
  { icon: Baby, title: 'Baptism Records', link: '/baptisms' },
  { icon: UserCheck, title: 'Attendance', link: '/attendance' },
  { icon: HeartPulse, title: 'Membership Classes', link: '/membership-classes' },
  { icon: BookHeart, title: 'Small Groups', link: '/small-groups' },
];

// =============== NEW MINISTRY MODULES ===============
const ministryModules = [
  { icon: Baby, title: 'Children\'s Ministry', link: '/children', description: 'Kingdom Kids' },
  { icon: Users, title: 'Youth Ministry', link: '/youth', description: 'Next Generation' },
  { icon: Flower, title: 'Ladies Fellowship', link: '/ladies', description: 'Daughters of the King' },
  { icon: Shield, title: 'Men\'s Fellowship', link: '/men', description: 'Iron Sharpens Iron' },
  { icon: HeartHandshake, title: 'Couples Ministry', link: '/couples', description: 'Two Becoming One' },
  { icon: Tractor, title: 'Kingdom Projects', link: '/projects', description: 'Income Generation' },
  { icon: Video, title: 'Media & Production', link: '/media', description: 'Creative Arts' },
  { icon: CalendarDays, title: 'Events & Notices', link: '/events', description: 'Church Calendar' },
];

export function Header({ isLoggedIn, user, churchName, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/40 bg-purple-900/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/90 to-blue-500/90 shadow-lg">
              <Church className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg drop-shadow-lg">AFM Chegutu Town</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium ${
                pathname === '/'
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </Link>

            {/* Ministries Dropdown - NEW */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Ministries
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-64 bg-purple-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {ministryModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.link}
                      href={module.link}
                      className="flex items-start gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      <Icon className="h-4 w-4 text-white/70 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{module.title}</div>
                        <div className="text-xs text-white/50">{module.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Finances Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Finances
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-purple-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {financialModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.link}
                      href={module.link}
                      className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      <Icon className="h-4 w-4 text-white/70" />
                      {module.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Members Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Members
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-purple-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {membershipModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.link}
                      href={module.link}
                      className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      <Icon className="h-4 w-4 text-white/70" />
                      {module.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Direct Links */}
            <Link
              href="/directory"
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium ${
                pathname === '/directory'
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Directory
            </Link>
            <Link
              href="/receipts"
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium ${
                pathname === '/receipts'
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Payments
            </Link>
            <Link
              href="/equipment"
              className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium ${
                pathname === '/equipment'
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Equipment
            </Link>
          </nav>

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-white/30">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white text-sm">
                      {user?.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium drop-shadow-sm">
                      {user?.name || 'Pastor'}
                    </span>
                    <span className="text-xs text-purple-200">{churchName}</span>
                  </div>
                </div>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white hover:text-white transition-all duration-300 font-medium"
                    >
                      <LogIn className="h-4 w-4 mr-2" /> Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Login to AFM Chegutu</DialogTitle>
                    </DialogHeader>
                    <AuthForm />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500/90 to-blue-500/90 hover:from-purple-600 hover:to-blue-600 text-sm transition-all duration-300 shadow-lg hover:shadow-xl text-white font-medium"
                    >
                      <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Sign Up for AFM</DialogTitle>
                    </DialogHeader>
                    <AuthForm />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-200/20 bg-purple-900/95 backdrop-blur-xl mt-2 py-4 rounded-b-xl max-h-[80vh] overflow-y-auto">
            <div className="space-y-1 px-4">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {/* Ministries Section - Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setMinistriesOpen(!ministriesOpen)}
                  className="w-full flex items-center justify-between p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <span className="font-medium">Ministries</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${ministriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {ministriesOpen && (
                  <div className="ml-4 space-y-1 border-l border-white/20 pl-2">
                    {ministryModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <Link
                          key={module.link}
                          href={module.link}
                          className="flex items-start gap-3 p-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4 text-white/60 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">{module.title}</div>
                            <div className="text-xs text-white/40">{module.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Finances Section - Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setFinancesOpen(!financesOpen)}
                  className="w-full flex items-center justify-between p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <span className="font-medium">Finances</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${financesOpen ? 'rotate-180' : ''}`} />
                </button>
                {financesOpen && (
                  <div className="ml-4 space-y-1 border-l border-white/20 pl-2">
                    {financialModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <Link
                          key={module.link}
                          href={module.link}
                          className="flex items-center gap-3 p-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4 text-white/60" />
                          {module.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Members Section - Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setMembersOpen(!membersOpen)}
                  className="w-full flex items-center justify-between p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <span className="font-medium">Members</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${membersOpen ? 'rotate-180' : ''}`} />
                </button>
                {membersOpen && (
                  <div className="ml-4 space-y-1 border-l border-white/20 pl-2">
                    {membershipModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <Link
                          key={module.link}
                          href={module.link}
                          className="flex items-center gap-3 p-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4 text-white/60" />
                          {module.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Direct Links - Mobile */}
              <Link
                href="/directory"
                className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 text-white/60" />
                Believers Directory
              </Link>

              <Link
                href="/receipts"
                className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="h-4 w-4 text-white/60" />
                Payments & Offerings
              </Link>

              <Link
                href="/equipment"
                className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="h-4 w-4 text-white/60" />
                Equipment Directory
              </Link>

              <Link
                href="/events"
                className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarDays className="h-4 w-4 text-white/60" />
                Events & Notices
              </Link>
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-4 border-t border-purple-200/20 px-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white">
                        {user?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-medium">{user?.name || 'Pastor'}</span>
                      <span className="text-xs text-purple-200">{churchName}</span>
                    </div>
                  </div>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="w-full text-white border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                      <DialogHeader>
                        <DialogTitle className="sr-only">Login to AFM Chegutu Town</DialogTitle>
                      </DialogHeader>
                      <AuthForm />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 hover:from-purple-600 hover:to-blue-600 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                      <DialogHeader>
                        <DialogTitle className="sr-only">Sign Up for AFM Chegutu Town</DialogTitle>
                      </DialogHeader>
                      <AuthForm />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}