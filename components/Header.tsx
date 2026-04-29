'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Church, LogIn, UserPlus, Menu, X, ChevronDown, BookOpen,
  DollarSign, Package, Users, CalendarDays,
  Gift, PieChart, Calculator, FileText, CreditCard,
  Baby, UserCheck, HeartPulse, BookHeart,
  Flower, Shield, Tractor, Video, Newspaper, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from './AuthForm';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  churchName?: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user: UserData | null;
  churchName: string;
  onLogout: () => void;
}

const ministries = [
  { icon: Baby,          label: "Children's Ministry", sub: 'Kingdom Kids',        href: '/children' },
  { icon: Users,         label: 'Youth Ministry',       sub: 'Next Generation',     href: '/youth' },
  { icon: Flower,        label: "Ladies' Fellowship",   sub: 'Daughters of the King',href: '/ladies' },
  { icon: Shield,        label: "Men's Fellowship",     sub: 'Iron Sharpens Iron',  href: '/men' },
  { icon: Heart,         label: 'Couples Ministry',     sub: 'Two Becoming One',    href: '/couples' },
  { icon: Tractor,       label: 'Kingdom Projects',     sub: 'Income Generation',   href: '/projects' },
  { icon: Video,         label: 'Media & Production',   sub: 'Creative Arts',       href: '/media' },
  { icon: CalendarDays,  label: 'Events & Notices',     sub: 'Church Calendar',     href: '/events' },
];

const finances = [
  { icon: DollarSign,  label: 'Payments & Tithes',  href: '/receipts' },
  { icon: PieChart,    label: 'Budget Planning',     href: '/budget' },
  { icon: Calculator,  label: 'Expense Tracking',    href: '/expenses' },
  { icon: FileText,    label: 'Financial Reports',   href: '/reports' },
  { icon: CreditCard,  label: 'Online Giving',       href: '/online-giving' },
  { icon: Package,     label: 'Equipment',           href: '/equipment' },
];

const members = [
  { icon: Users,      label: 'Member Directory', href: '/directory' },
  { icon: UserPlus,   label: 'Visitor Tracking', href: '/visitors' },
  { icon: Baby,       label: 'Baptism Records',  href: '/baptisms' },
  { icon: UserCheck,  label: 'Attendance',       href: '/attendance' },
  { icon: BookHeart,  label: 'Small Groups',     href: '/small-groups' },
];

// ── Nav link helper ───────────────────────────────────────────────────────────
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'text-white bg-white/15'
          : 'text-white/75 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#86BBD8]"/>
      )}
    </Link>
  );
}

// ── Dropdown trigger ──────────────────────────────────────────────────────────
function NavDropdownTrigger({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <DropdownMenuTrigger asChild>
      <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
        active
          ? 'text-white bg-white/15'
          : 'text-white/75 hover:text-white hover:bg-white/10'
      }`}>
        {children}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 mt-px"/>
      </button>
    </DropdownMenuTrigger>
  );
}

// ── Dark dropdown content ─────────────────────────────────────────────────────
const darkContent = "bg-[#0d1f2d] border border-white/10 text-white shadow-2xl shadow-black/40 rounded-xl p-1.5 min-w-[220px]";
const darkItem    = "text-white/70 hover:text-white focus:text-white focus:bg-white/10 rounded-lg cursor-pointer gap-2.5 py-2.5 px-3";
const darkLabel   = "text-[#86BBD8] text-[10px] font-bold uppercase tracking-widest px-3 py-2";

// ─────────────────────────────────────────────────────────────────────────────

export function Header({ isLoggedIn, user, churchName, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const inMinistries = ministries.some(m => pathname.startsWith(m.href));
  const inFinances   = finances.some(m => pathname.startsWith(m.href));
  const inMembers    = members.some(m => pathname.startsWith(m.href));

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0d1f2d]/85 backdrop-blur-xl border-b border-white/8"/>

      <div className="relative container mx-auto max-w-5xl px-4">
        <div className="flex h-[4.25rem] items-center gap-4">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#86BBD8] to-[#2A4D69] shadow-lg group-hover:shadow-[#86BBD8]/30 transition-shadow">
              <Church className="h-4.5 w-4.5 text-white" style={{ height: '1.125rem', width: '1.125rem' }}/>
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-white font-bold text-[0.9rem] tracking-tight">AFM Chegutu</p>
              <p className="text-[#86BBD8] text-[0.65rem] tracking-widest uppercase font-medium">Town Assembly</p>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-2">
            <NavLink href="/" active={pathname === '/'}>Home</NavLink>

            {/* Ministries */}
            <DropdownMenu>
              <NavDropdownTrigger active={inMinistries}>Ministries</NavDropdownTrigger>
              <DropdownMenuContent className={darkContent} align="start" sideOffset={8}>
                <p className={darkLabel}>Ministries</p>
                <div className="h-px bg-white/8 mb-1"/>
                <div className="grid grid-cols-2 gap-px">
                  {ministries.map(m => (
                    <Link key={m.href} href={m.href} className={darkItem + ' flex items-start gap-2.5'}>
                      <m.icon className="h-4 w-4 text-[#86BBD8] mt-0.5 flex-shrink-0"/>
                      <div>
                        <p className="font-medium text-sm leading-snug">{m.label}</p>
                        <p className="text-[11px] text-white/40 leading-none mt-0.5">{m.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Finances */}
            <DropdownMenu>
              <NavDropdownTrigger active={inFinances}>Finances</NavDropdownTrigger>
              <DropdownMenuContent className={darkContent} align="start" sideOffset={8}>
                <p className={darkLabel}>Financial Management</p>
                <div className="h-px bg-white/8 mb-1"/>
                {finances.map(m => (
                  <Link key={m.href} href={m.href} className={darkItem + ' flex items-center gap-2.5'}>
                    <m.icon className="h-4 w-4 text-[#86BBD8]"/>
                    <span className="text-sm">{m.label}</span>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Members */}
            <DropdownMenu>
              <NavDropdownTrigger active={inMembers || pathname === '/directory'}>Members</NavDropdownTrigger>
              <DropdownMenuContent className={darkContent} align="start" sideOffset={8}>
                <p className={darkLabel}>Membership</p>
                <div className="h-px bg-white/8 mb-1"/>
                {members.map(m => (
                  <Link key={m.href} href={m.href} className={darkItem + ' flex items-center gap-2.5'}>
                    <m.icon className="h-4 w-4 text-[#86BBD8]"/>
                    <span className="text-sm">{m.label}</span>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink href="/blog"  active={pathname === '/blog' || pathname.startsWith('/blog/')}>Blog</NavLink>

            {/* Bible — accent coloured */}
            <Link
              href="/bible"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/bible'
                  ? 'text-[#86BBD8] bg-[#86BBD8]/15'
                  : 'text-[#86BBD8]/80 hover:text-[#86BBD8] hover:bg-[#86BBD8]/10'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5"/>
              Bible
            </Link>
          </nav>

          {/* ── Right: Auth ───────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 ring-2 ring-[#86BBD8]/40 ring-offset-2 ring-offset-transparent">
                    <AvatarFallback className="bg-gradient-to-br from-[#2A4D69] to-[#86BBD8] text-white text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-white text-sm font-semibold leading-none">{user?.name}</p>
                    <p className="text-[#86BBD8] text-[0.65rem] leading-none mt-0.5 capitalize">{churchName}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6 bg-white/15"/>
                <Button onClick={onLogout} variant="ghost" size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10 text-xs px-3">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10 font-medium">
                      <LogIn className="h-3.5 w-3.5 mr-1.5"/> Sign in
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/10 bg-transparent p-0">
                    <DialogHeader><DialogTitle className="sr-only">Sign in</DialogTitle></DialogHeader>
                    <AuthForm/>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"
                      className="bg-gradient-to-r from-[#2A4D69] to-[#1e3a52] hover:from-[#86BBD8] hover:to-[#2A4D69] text-white border border-white/10 shadow-sm font-medium transition-all duration-300">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5"/> Join
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/10 bg-transparent p-0">
                    <DialogHeader><DialogTitle className="sr-only">Create account</DialogTitle></DialogHeader>
                    <AuthForm/>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────────── */}
          <div className="lg:hidden ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(v => !v)}
              className="text-white/80 hover:text-white hover:bg-white/10 h-9 w-9">
              {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/8 bg-[#0a1929]/97 backdrop-blur-xl">
          <div className="container mx-auto max-w-5xl px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

            <Link href="/" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors">
              Home
            </Link>

            {/* Ministries section */}
            <div className="pt-2">
              <p className="px-3 pb-1.5 text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest">Ministries</p>
              <div className="grid grid-cols-2 gap-px">
                {ministries.map(m => (
                  <Link key={m.href} href={m.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 text-sm transition-colors">
                    <m.icon className="h-3.5 w-3.5 text-[#86BBD8] flex-shrink-0"/>
                    {m.label.split(' ')[0]} {m.label.split(' ')[1] ?? ''}
                  </Link>
                ))}
              </div>
            </div>

            <Separator className="bg-white/8 my-2"/>

            {/* Finances section */}
            <div>
              <p className="px-3 pb-1.5 text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest">Finances</p>
              {finances.map(m => (
                <Link key={m.href} href={m.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 text-sm transition-colors">
                  <m.icon className="h-3.5 w-3.5 text-[#86BBD8] flex-shrink-0"/>
                  {m.label}
                </Link>
              ))}
            </div>

            <Separator className="bg-white/8 my-2"/>

            {/* Members section */}
            <div>
              <p className="px-3 pb-1.5 text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest">Members</p>
              {members.map(m => (
                <Link key={m.href} href={m.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 text-sm transition-colors">
                  <m.icon className="h-3.5 w-3.5 text-[#86BBD8] flex-shrink-0"/>
                  {m.label}
                </Link>
              ))}
            </div>

            <Separator className="bg-white/8 my-2"/>

            <Link href="/blog" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/75 hover:text-white hover:bg-white/8 text-sm transition-colors">
              <Newspaper className="h-3.5 w-3.5 text-[#86BBD8]"/> Blog
            </Link>
            <Link href="/bible" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#86BBD8]/80 hover:text-[#86BBD8] hover:bg-[#86BBD8]/10 text-sm font-medium transition-colors">
              <BookOpen className="h-3.5 w-3.5"/> Bible (KJV)
            </Link>

            <Separator className="bg-white/8 my-3"/>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 ring-2 ring-[#86BBD8]/30">
                    <AvatarFallback className="bg-gradient-to-br from-[#2A4D69] to-[#86BBD8] text-white text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white text-sm font-medium">{user?.name}</p>
                    <p className="text-[#86BBD8] text-xs">{churchName}</p>
                  </div>
                </div>
                <Button onClick={() => { onLogout(); setMobileOpen(false); }} variant="outline" size="sm"
                  className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-1 pb-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white/80 hover:text-white hover:bg-white/10 bg-transparent">
                      <LogIn className="h-3.5 w-3.5 mr-1.5"/> Sign in
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/10 bg-transparent p-0">
                    <DialogHeader><DialogTitle className="sr-only">Sign in</DialogTitle></DialogHeader>
                    <AuthForm/>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#2A4D69] to-[#86BBD8] text-white">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5"/> Join
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm border-white/10 bg-transparent p-0">
                    <DialogHeader><DialogTitle className="sr-only">Create account</DialogTitle></DialogHeader>
                    <AuthForm/>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
