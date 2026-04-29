'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music, CalendarDays, Clock, Users, Heart, ArrowRight, Mic,
  Headphones, Radio, Star, UserPlus, Check, Loader2,
  Volume2, Guitar, Piano, Drum, ChevronRight, BookOpen,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface UserData { id: number; email: string; name: string; role: string; }

const STATS = [
  { value: '45+', label: 'Voices & Musicians' },
  { value: '12',  label: 'Years of Ministry' },
  { value: '52',  label: 'Sundays per Year' },
  { value: '8',   label: 'Instruments' },
];

const ACTIVITIES = [
  { icon: Music,      title: 'Weekly Choir Rehearsals',   desc: 'Every Saturday at 3:00 PM — learning new anthems, hymns and praise songs for Sunday worship.' },
  { icon: Mic,        title: 'Worship Team Training',     desc: 'Monthly intensive sessions equipping instrumentalists, vocalists and sound engineers.' },
  { icon: Headphones, title: 'Recorded Devotionals',      desc: 'Short worship and scripture audio recordings shared through our media channels.' },
  { icon: Radio,      title: 'Special Services',          desc: 'Leading praise and worship at conferences, crusades, youth nights and major church events.' },
  { icon: Heart,      title: 'Intercessory Worship',      desc: "Combining worship with prayer — creating an atmosphere of God's presence in every service." },
  { icon: Users,      title: 'New Member Orientation',    desc: 'Welcoming singers and musicians of all skill levels. No audition — just a willing heart.' },
];

const SCHEDULE = [
  { day: 'Saturday',  time: '03:00 PM', detail: 'Full Choir Rehearsal',          location: 'Main Sanctuary' },
  { day: 'Sunday',    time: '08:00 AM', detail: 'Sound Check & Worship Set-up',  location: 'Main Sanctuary' },
  { day: 'Sunday',    time: '09:00 AM', detail: 'Lead Congregational Worship',   location: 'Main Service' },
  { day: 'Monthly',   time: 'TBA',      detail: 'Worship & Music Training Day',  location: 'Conference Room' },
];

const REPERTOIRE = [
  'Congregational Hymns', 'Contemporary Praise', 'Apostolic Anthems',
  'Indigenous Gospel',    'Scripture Songs',      'Worship Medleys',
  'Special Presentations','Choir Compositions',
];

const TEAM = [
  { name: 'Mr Chivanga',    role: 'Choir Director',         initial: 'C' },
  { name: 'Sis. Mwangi',   role: 'Lead Vocalist',          initial: 'M' },
  { name: 'Bro. Tembo',    role: 'Keyboard & Arrangements',initial: 'T' },
  { name: 'Sis. Dube',     role: 'Soprano Section Lead',   initial: 'D' },
];

const TESTIMONIALS = [
  {
    name: 'Tatenda M.',
    text: 'Joining the choir changed my life. I came in shy, unsure of my voice — and God met me right there on that stage.',
    years: '3 years in choir',
  },
  {
    name: 'Grace N.',
    text: 'Every Saturday rehearsal feels like a mini-revival. The spirit of unity in this team is genuinely supernatural.',
    years: '5 years in choir',
  },
  {
    name: 'Blessing K.',
    text: "I play bass guitar and I had no church music experience. The team embraced me and helped me grow. It's family.",
    years: '2 years in choir',
  },
];

export default function ChoirWorshipPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [joinOpen,   setJoinOpen]   = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', part: '', instrument: '', experience: '', motivation: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ud    = localStorage.getItem('user');
    const ch    = localStorage.getItem('church');
    if (token && ud) {
      try { setIsLoggedIn(true); setUser(JSON.parse(ud)); if (ch) setChurchName(ch); } catch {}
    }
  }, []);

  function handleLogout() {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  }

  const accent = {
    text:    'text-amber-600',
    textLt:  'text-amber-500',
    bg:      'bg-amber-50',
    bgMd:    'bg-amber-100',
    border:  'border-amber-200',
    badge:   'bg-amber-500/15 text-amber-700 border-amber-300/50',
    icon:    'text-amber-600',
    grad:    'from-amber-600 to-orange-500',
    gradBg:  'from-amber-50 to-orange-50',
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[62vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=85&w=1920')" }}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/15"/>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent"/>

        <div className="relative z-10 container mx-auto px-6 pb-14 pt-28 max-w-4xl">
          <Badge className={`mb-5 ${accent.badge} text-[10px] uppercase tracking-widest font-bold`}>
            Worship Ministry
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
            Choir &amp; Worship
          </h1>
          <p className="text-base md:text-xl text-white/75 max-w-xl leading-relaxed mb-8 font-light">
            "Sing to the LORD a new song; sing to the LORD, all the earth."
            <span className="block text-amber-300/80 text-sm mt-1 font-normal">— Psalm 96:1</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setJoinOpen(true)}
              className={`bg-gradient-to-r ${accent.grad} text-white border-0 shadow-xl hover:shadow-amber-500/30 font-semibold`}>
              <UserPlus className="w-4 h-4 mr-2"/> Join the Team
            </Button>
            <Button size="lg" variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm">
              <CalendarDays className="w-4 h-4 mr-2"/> View Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(s => (
              <div key={s.label} className="py-6 px-4 text-center">
                <p className={`text-3xl font-bold ${accent.text} mb-0.5`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="bg-[#fafaf8]">

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <Tabs defaultValue="about">
            <TabsList className="bg-white border border-gray-200 shadow-sm mb-10 h-11 rounded-xl p-1">
              {['about','activities','schedule','team'].map(t => (
                <TabsTrigger key={t} value={t}
                  className="rounded-lg text-sm capitalize font-medium data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                  {t === 'team' ? 'Our Team' : t === 'schedule' ? 'Schedule' : t === 'activities' ? 'What We Do' : 'About'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* About */}
            <TabsContent value="about" className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className={`text-[10px] font-bold ${accent.text} uppercase tracking-widest mb-3`}>Who We Are</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">Lifting His Name<br/>in Song</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The AFM Chegutu Choir & Worship team exists to usher the congregation into God's presence every Sunday through authentic, spirit-filled praise. We are a diverse family of singers, musicians, sound technicians and worship leaders united by one purpose — glorifying the Lord.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Whether you are a seasoned vocalist, a beginner guitar player or simply someone who loves to worship, there is a place for you on this team.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REPERTOIRE.map(r => (
                      <Badge key={r} variant="secondary" className={`${accent.bg} ${accent.text} border-0 text-xs font-medium`}>{r}</Badge>
                    ))}
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-72 shadow-xl">
                  <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800"
                    alt="Choir singing" className="absolute inset-0 w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                  <div className="absolute bottom-4 left-4">
                    <Badge className={`${accent.badge} text-xs`}>Sunday Morning Worship</Badge>
                  </div>
                </div>
              </div>

              {/* Scripture */}
              <div className={`bg-gradient-to-r ${accent.grad} rounded-2xl p-8 text-white text-center shadow-lg`}>
                <Music className="w-8 h-8 mx-auto mb-4 opacity-80"/>
                <blockquote className="text-xl md:text-2xl font-semibold italic leading-relaxed mb-3">
                  "Speaking to yourselves in psalms and hymns and spiritual songs, singing and making melody in your heart to the Lord."
                </blockquote>
                <p className="text-white/70 text-sm">Ephesians 5:19</p>
              </div>

              {/* Testimonials */}
              <div>
                <p className={`text-[10px] font-bold ${accent.text} uppercase tracking-widest mb-6 text-center`}>Voices of the Team</p>
                <div className="grid sm:grid-cols-3 gap-5">
                  {TESTIMONIALS.map(t => (
                    <Card key={t.name} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 fill-amber-400 ${accent.textLt}`}/>)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{t.text}"</p>
                        <Separator className="mb-3"/>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className={`${accent.bgMd} ${accent.text} text-xs font-bold`}>{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                            <p className="text-[10px] text-gray-400">{t.years}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Activities */}
            <TabsContent value="activities">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ACTIVITIES.map(a => (
                  <Card key={a.title} className={`border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
                    <CardContent className="p-6">
                      <div className={`w-11 h-11 rounded-xl ${accent.bgMd} flex items-center justify-center mb-4`}>
                        <a.icon className={`h-5 w-5 ${accent.icon}`}/>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{a.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schedule */}
            <TabsContent value="schedule" className="max-w-2xl mx-auto space-y-3">
              {SCHEDULE.map((s, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${accent.bgMd} flex items-center justify-center flex-shrink-0`}>
                    <Clock className={`h-5 w-5 ${accent.icon}`}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{s.day}</p>
                      <Badge className={`${accent.badge} text-xs`}>{s.time}</Badge>
                    </div>
                    <p className="text-gray-700 text-sm font-medium mt-0.5">{s.detail}</p>
                    <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-300"/>
                      {s.location}
                    </p>
                  </div>
                </div>
              ))}
              <div className={`mt-6 p-5 rounded-xl ${accent.bg} border ${accent.border} text-center`}>
                <p className={`text-sm ${accent.text} font-medium`}>Want to join? Come any Saturday at 3:00 PM — no experience needed.</p>
              </div>
            </TabsContent>

            {/* Team */}
            <TabsContent value="team">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {TEAM.map(t => (
                  <Card key={t.name} className="border-gray-100 shadow-sm hover:shadow-md transition-all text-center group">
                    <CardContent className="p-6">
                      <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-amber-200 ring-offset-2">
                        <AvatarFallback className={`${accent.bgMd} ${accent.text} text-lg font-bold`}>{t.initial}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{t.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className={`rounded-2xl ${accent.bg} border ${accent.border} p-8 text-center`}>
                <Volume2 className={`w-8 h-8 ${accent.icon} mx-auto mb-3`}/>
                <h3 className="font-bold text-gray-900 mb-2">Instruments We Play</h3>
                <p className="text-gray-500 text-sm mb-4">Guitar · Piano/Keyboard · Bass Guitar · Drums · Violin · Trumpet · Tambourine · Traditional Instruments</p>
                <Button onClick={() => setJoinOpen(true)}
                  className={`bg-gradient-to-r ${accent.grad} text-white border-0`}>
                  <UserPlus className="w-4 h-4 mr-2"/> Join the Team
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── CTA strip ────────────────────────────────────────────────────── */}
        <section className={`bg-gradient-to-r ${accent.grad} py-16`}>
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Join the Worship Team</h2>
            <p className="text-amber-100/90 mb-8 leading-relaxed">
              Do you love to sing or play an instrument? Come join us any Saturday at 3:00 PM.
              No audition required — just a heart surrendered to God.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => setJoinOpen(true)}
                className="bg-white text-amber-700 hover:bg-amber-50 font-bold shadow-xl">
                <UserPlus className="w-4 h-4 mr-2"/> Apply to Join
              </Button>
              <Button size="lg" variant="outline" asChild
                className="border-white/40 text-white hover:bg-white/10">
                <Link href="/events"><CalendarDays className="w-4 h-4 mr-2"/> See Events</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Join Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-600"/> Join Choir & Worship
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600"/>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Application Received!</h3>
              <p className="text-gray-500 text-sm">Our choir director will be in touch shortly. See you on Saturday!</p>
              <Button className="mt-6" onClick={() => { setJoinOpen(false); setTimeout(() => setSubmitted(false), 300); }}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input placeholder="Your name" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone / WhatsApp</Label>
                  <Input placeholder="+263 …" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Voice Part / Role *</Label>
                  <Select required value={form.part} onValueChange={v => setForm(f => ({...f, part: v}))}>
                    <SelectTrigger><SelectValue placeholder="Select…"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soprano">Soprano</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="tenor">Tenor</SelectItem>
                      <SelectItem value="bass">Bass</SelectItem>
                      <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                      <SelectItem value="sound">Sound Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Instrument (if any)</Label>
                  <Input placeholder="Guitar, Piano…" value={form.instrument} onChange={e => setForm(f => ({...f, instrument: e.target.value}))}/>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Brief testimony / motivation</Label>
                <Textarea rows={3} placeholder="Why do you want to join the worship team?" value={form.motivation} onChange={e => setForm(f => ({...f, motivation: e.target.value}))}/>
              </div>
              <Button type="submit" disabled={loading} className={`w-full bg-gradient-to-r ${accent.grad} text-white border-0`}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Submitting…</> : 'Submit Application'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer/>
    </>
  );
}
