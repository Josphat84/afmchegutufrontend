import Link from 'next/link';
import {
  Church, MapPin, Phone, Mail, Facebook, Twitter, Youtube,
  Clock, BookOpen, Newspaper, CalendarDays, Users, Package,
  Music, Heart, Baby, Flower, Shield, Tractor, Video, HeartHandshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const ministryLinks = [
  { icon: Baby,          label: "Children's Ministry", href: '/children' },
  { icon: Users,         label: 'Youth Ministry',      href: '/youth' },
  { icon: Flower,        label: "Ladies' Fellowship",  href: '/ladies' },
  { icon: Shield,        label: "Men's Fellowship",    href: '/men' },
  { icon: HeartHandshake,label: 'Couples Ministry',    href: '/couples' },
  { icon: Music,         label: 'Choir & Worship',     href: '/choir-worship' },
  { icon: Heart,         label: 'Prayer Team',         href: '/prayer-team' },
  { icon: Tractor,       label: 'Kingdom Projects',    href: '/projects' },
];

const resourceLinks = [
  { icon: Newspaper,    label: 'Blog',             href: '/blog' },
  { icon: BookOpen,     label: 'Bible (KJV)',       href: '/bible' },
  { icon: CalendarDays, label: 'Events & Notices',  href: '/events' },
  { icon: Video,        label: 'Media',             href: '/media' },
  { icon: Users,        label: 'Member Directory',  href: '/directory' },
  { icon: Package,      label: 'Equipment',         href: '/equipment' },
];

const serviceTimes = [
  { day: 'Sunday',    time: '09:00 AM', type: 'Main Service' },
  { day: 'Wednesday', time: '06:00 PM', type: 'Midweek Prayer' },
  { day: 'Saturday',  time: '03:00 PM', type: 'Choir Rehearsal' },
];

const socials = [
  { icon: Facebook, label: 'Facebook',  href: '#' },
  { icon: Twitter,  label: 'Twitter',   href: '#' },
  { icon: Youtube,  label: 'YouTube',   href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-[#0a1929] border-t border-white/8 mt-auto">

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1: Brand ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#86BBD8] to-[#2A4D69] shadow-lg group-hover:shadow-[#86BBD8]/25 transition-shadow flex-shrink-0">
                <Church className="h-5 w-5 text-white"/>
              </div>
              <div className="leading-tight">
                <p className="text-white font-bold text-base">AFM Chegutu</p>
                <p className="text-[#86BBD8] text-xs tracking-widest uppercase font-medium">Town Assembly</p>
              </div>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Apostolic Faith Mission in Zimbabwe — a Spirit-filled community
              committed to worship, discipleship, and community impact.
            </p>

            {/* Service times */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Service Times</p>
              {serviceTimes.map(s => (
                <div key={s.day} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#86BBD8] flex-shrink-0 mt-px"/>
                  <div>
                    <span className="text-white/80 text-xs font-semibold">{s.day}</span>
                    <span className="text-white/40 text-xs mx-1.5">·</span>
                    <span className="text-[#86BBD8] text-xs font-medium">{s.time}</span>
                    <p className="text-white/35 text-[11px] leading-none mt-0.5">{s.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Col 2: Ministries ────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-4">Ministries</p>
            <ul className="space-y-1">
              {ministryLinks.map(m => (
                <li key={m.href}>
                  <Link href={m.href}
                    className="flex items-center gap-2 py-1 text-sm text-white/55 hover:text-white transition-colors duration-200 group">
                    <m.icon className="h-3.5 w-3.5 text-[#86BBD8]/60 group-hover:text-[#86BBD8] transition-colors flex-shrink-0"/>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Resources ─────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-4">Resources</p>
            <ul className="space-y-1">
              {resourceLinks.map(m => (
                <li key={m.href}>
                  <Link href={m.href}
                    className="flex items-center gap-2 py-1 text-sm text-white/55 hover:text-white transition-colors duration-200 group">
                    <m.icon className="h-3.5 w-3.5 text-[#86BBD8]/60 group-hover:text-[#86BBD8] transition-colors flex-shrink-0"/>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ───────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-4">Find Us</p>
            <ul className="space-y-4 mb-6">
              <li>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                  <MapPin className="h-4 w-4 text-[#86BBD8]/60 group-hover:text-[#86BBD8] flex-shrink-0 mt-0.5 transition-colors"/>
                  <span>Hintonville, Chegutu<br/><span className="text-white/35 text-xs">Zimbabwe</span></span>
                </a>
              </li>
              <li>
                <a href="tel:+263000000000"
                  className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                  <Phone className="h-4 w-4 text-[#86BBD8]/60 group-hover:text-[#86BBD8] flex-shrink-0 transition-colors"/>
                  +263 000 000 000
                </a>
              </li>
              <li>
                <a href="mailto:afmchegutu@example.com"
                  className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                  <Mail className="h-4 w-4 text-[#86BBD8]/60 group-hover:text-[#86BBD8] flex-shrink-0 transition-colors"/>
                  afmchegutu@example.com
                </a>
              </li>
            </ul>

            {/* Social */}
            <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Follow Us</p>
            <div className="flex items-center gap-1">
              {socials.map(s => (
                <Button key={s.label} variant="ghost" size="icon" asChild
                  className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <s.icon className="h-4 w-4"/>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <Separator className="bg-white/8"/>
      <div className="container mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Apostolic Faith Mission in Zimbabwe · All rights reserved
          </p>
          <nav className="flex items-center gap-1">
            {['Privacy Policy', 'Terms of Service', 'Support', 'Contact'].map((label, i) => (
              <span key={label} className="flex items-center">
                {i > 0 && <span className="text-white/15 mx-1 text-xs">·</span>}
                <Link href={`/${label.toLowerCase().replace(/ /g, '-')}`}
                  className="text-white/35 hover:text-white/70 text-xs transition-colors px-1">
                  {label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
