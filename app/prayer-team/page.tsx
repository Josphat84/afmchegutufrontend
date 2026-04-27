'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, CalendarDays, Clock, Users, BookOpen, ArrowRight, Flame,
  HandHeart, MessageCircle, Check, Loader2, UserPlus, Shield,
  Star, Send,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserData { id: number; email: string; name: string; role: string; }

const STATS = [
  { value: '30+', label: 'Prayer Warriors' },
  { value: '5×',  label: 'Weekly Sessions' },
  { value: '200+',label: 'Requests Prayed' },
  { value: '15',  label: 'Years Interceding' },
];

const ACTIVITIES = [
  { icon: Flame,         title: 'Dawn Prayer',              desc: 'Monday to Friday at 5:30 AM — starting each day in God\'s presence before the world wakes.' },
  { icon: Heart,         title: 'Intercessory Prayer',      desc: 'Weekly intercession for the congregation, the nation of Zimbabwe and the global Church.' },
  { icon: BookOpen,      title: 'Prayer & the Word',        desc: 'Monthly deep dives into scripture-based prayer — learning to pray according to God\'s promises.' },
  { icon: HandHeart,     title: 'Personal Prayer Support',  desc: 'Available after every Sunday service to pray with individuals who need encouragement.' },
  { icon: MessageCircle, title: 'Prayer Requests',          desc: 'Collecting and faithfully praying over requests submitted by the congregation each week.' },
  { icon: Users,         title: 'Corporate Fasting',        desc: 'Quarterly church-wide fasting and prayer seasons seeking breakthrough and revival.' },
];

const SCHEDULE = [
  { day: 'Mon – Fri', time: '05:30 AM', detail: 'Dawn Prayer',          location: 'Main Sanctuary' },
  { day: 'Wednesday', time: '06:00 PM', detail: 'Midweek Prayer',       location: 'Prayer Room' },
  { day: 'Sunday',    time: '08:30 AM', detail: 'Pre-service Prayer',   location: 'Prayer Room' },
  { day: 'Quarterly', time: 'TBA',      detail: 'Corporate Fast & Prayer', location: 'Whole Church' },
];

const SCRIPTURES = [
  { text: 'If my people, who are called by my name, shall humble themselves, and pray, and seek my face… I will hear from heaven.',  ref: '2 Chronicles 7:14' },
  { text: 'The effectual fervent prayer of a righteous man availeth much.',                                                            ref: 'James 5:16' },
  { text: 'Watch and pray, that ye enter not into temptation.',                                                                        ref: 'Matthew 26:41' },
];

const TEAM = [
  { name: 'Sis. Chamu',   role: 'Prayer Team Leader',    initial: 'C' },
  { name: 'Bro. Ndlovu',  role: 'Intercession Coord.',   initial: 'N' },
  { name: 'Sis. Mutasa',  role: 'Dawn Prayer Lead',      initial: 'M' },
  { name: 'Bro. Kairiza', role: 'Youth Prayer Liaison',  initial: 'K' },
];

const TESTIMONIALS = [
  { name: 'Tendai R.', text: 'I submitted a prayer request for my mother\'s health. Within a week God had turned everything around. The prayer team is a genuine spiritual lifeline.', role: '2 years member' },
  { name: 'Farai M.',  text: 'Dawn prayer changed my mornings completely. There is something about starting the day in God\'s presence — everything else falls into place.', role: '4 years member' },
  { name: 'Grace T.',  text: 'I was going through the hardest season of my life. This team prayed with me faithfully every week. I am standing today because of those prayers.', role: '3 years member' },
];

export default function PrayerTeamPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [reqOpen,    setReqOpen]    = useState(false);
  const [joinOpen,   setJoinOpen]   = useState(false);
  const [reqSent,    setReqSent]    = useState(false);
  const [joinSent,   setJoinSent]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [reqForm,    setReqForm]    = useState({ name: '', email: '', category: '', request: '', anonymous: false });
  const [joinForm,   setJoinForm]   = useState({ name: '', email: '', phone: '', testimony: '' });

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

  function handleReq(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setReqSent(true); }, 1000);
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setJoinSent(true); }, 1000);
  }

  const accent = {
    text:   'text-indigo-600',
    textLt: 'text-indigo-500',
    bg:     'bg-indigo-50',
    bgMd:   'bg-indigo-100',
    border: 'border-indigo-200',
    badge:  'bg-indigo-500/15 text-indigo-700 border-indigo-300/50',
    icon:   'text-indigo-600',
    grad:   'from-indigo-700 to-purple-700',
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[62vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[center_30%]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=85&w=1920')" }}/>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/92 via-black/50 to-black/15"/>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent"/>

        <div className="relative z-10 container mx-auto px-6 pb-14 pt-28 max-w-4xl">
          <Badge className={`mb-5 ${accent.badge} text-[10px] uppercase tracking-widest font-bold`}>
            Intercessory Ministry
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
            Prayer Team
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-xl leading-relaxed mb-8 font-light">
            "The effectual fervent prayer of a righteous man availeth much."
            <span className="block text-indigo-300/80 text-sm mt-1 font-normal">— James 5:16</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setReqOpen(true)}
              className={`bg-gradient-to-r ${accent.grad} text-white border-0 shadow-xl hover:shadow-indigo-500/30 font-semibold`}>
              <Send className="w-4 h-4 mr-2"/> Submit Prayer Request
            </Button>
            <Button size="lg" variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
              onClick={() => setJoinOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2"/> Join the Team
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
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <Tabs defaultValue="about">
            <TabsList className="bg-white border border-gray-200 shadow-sm mb-10 h-11 rounded-xl p-1">
              {[
                { value: 'about',      label: 'About' },
                { value: 'activities', label: 'What We Do' },
                { value: 'schedule',   label: 'Schedule' },
                { value: 'team',       label: 'Our Team' },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value}
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── About ── */}
            <TabsContent value="about" className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className={`text-[10px] font-bold ${accent.text} uppercase tracking-widest mb-3`}>Who We Are</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">Watchmen<br/>on the Wall</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The AFM Chegutu Prayer Team is the spiritual engine room of the church. We believe that nothing of eternal significance happens without prayer — and so we commit to faithful, persistent intercession for our congregation, community and nation.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We are a devoted group of men and women who have answered the call to stand in the gap — holding up our leaders, families and city before the throne of God every single day.
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-72 shadow-xl">
                  <img src="https://images.unsplash.com/photo-1474314170901-f351b68f544f?auto=format&fit=crop&q=80&w=800"
                    alt="Prayer" className="absolute inset-0 w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"/>
                </div>
              </div>

              {/* Scripture cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                {SCRIPTURES.map(s => (
                  <div key={s.ref} className={`${accent.bg} border ${accent.border} rounded-2xl p-6 text-center`}>
                    <Flame className={`w-6 h-6 ${accent.icon} mx-auto mb-3`}/>
                    <p className="text-gray-700 text-sm italic leading-relaxed mb-3">"{s.text}"</p>
                    <p className={`text-xs font-bold ${accent.text}`}>{s.ref}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div>
                <p className={`text-[10px] font-bold ${accent.text} uppercase tracking-widest mb-6 text-center`}>Stories of Answered Prayer</p>
                <div className="grid sm:grid-cols-3 gap-5">
                  {TESTIMONIALS.map(t => (
                    <Card key={t.name} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400"/>)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{t.text}"</p>
                        <Separator className="mb-3"/>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className={`${accent.bgMd} ${accent.text} text-xs font-bold`}>{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                            <p className="text-[10px] text-gray-400">{t.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Activities ── */}
            <TabsContent value="activities">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ACTIVITIES.map(a => (
                  <Card key={a.title} className="border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
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

            {/* ── Schedule ── */}
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
                    <p className="text-gray-400 text-xs mt-0.5">{s.location}</p>
                  </div>
                </div>
              ))}
              <div className={`mt-6 p-5 rounded-xl ${accent.bg} border ${accent.border}`}>
                <p className={`text-sm ${accent.text} font-medium text-center`}>
                  Dawn prayer runs Mon–Fri. All are welcome — even occasionally.
                </p>
              </div>
            </TabsContent>

            {/* ── Team ── */}
            <TabsContent value="team">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {TEAM.map(t => (
                  <Card key={t.name} className="border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
                    <CardContent className="p-6">
                      <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-indigo-200 ring-offset-2">
                        <AvatarFallback className={`${accent.bgMd} ${accent.text} text-lg font-bold`}>{t.initial}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{t.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className={`rounded-2xl ${accent.bg} border ${accent.border} p-8 text-center`}>
                <Shield className={`w-8 h-8 ${accent.icon} mx-auto mb-3`}/>
                <h3 className="font-bold text-gray-900 mb-2">Ready to Stand in the Gap?</h3>
                <p className="text-gray-500 text-sm mb-4">Join a team of faithful intercessors who pray daily for our church, nation, and world.</p>
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
            <h2 className="text-3xl font-bold text-white mb-3">Need Prayer?</h2>
            <p className="text-indigo-100/90 mb-8 leading-relaxed">
              Submit a prayer request and our team will pray faithfully over it.
              All requests are kept in the strictest confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => setReqOpen(true)}
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-xl">
                <Send className="w-4 h-4 mr-2"/> Send a Prayer Request
              </Button>
              <Button size="lg" variant="outline" asChild
                className="border-white/40 text-white hover:bg-white/10">
                <Link href="/events"><CalendarDays className="w-4 h-4 mr-2"/> See Events</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Prayer Request Dialog ─────────────────────────────────────────────── */}
      <Dialog open={reqOpen} onOpenChange={v => { setReqOpen(v); if (!v) setTimeout(() => setReqSent(false), 300); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-600"/> Submit a Prayer Request
            </DialogTitle>
          </DialogHeader>
          {reqSent ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600"/>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Request Received</h3>
              <p className="text-gray-500 text-sm">Our prayer team will be covering you in prayer. God hears.</p>
              <Button className="mt-6" onClick={() => { setReqOpen(false); setTimeout(() => setReqSent(false), 300); }}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleReq} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Your Name (or leave blank for anonymous)</Label>
                <Input placeholder="Optional" value={reqForm.name} onChange={e => setReqForm(f => ({...f, name: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select required value={reqForm.category} onValueChange={v => setReqForm(f => ({...f, category: v}))}>
                  <SelectTrigger><SelectValue placeholder="Select category…"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health & Healing</SelectItem>
                    <SelectItem value="family">Family & Relationships</SelectItem>
                    <SelectItem value="financial">Financial Breakthrough</SelectItem>
                    <SelectItem value="salvation">Salvation of Loved One</SelectItem>
                    <SelectItem value="guidance">Direction & Guidance</SelectItem>
                    <SelectItem value="general">General Prayer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Prayer Request *</Label>
                <Textarea required rows={4} placeholder="Share what you'd like the team to pray about…"
                  value={reqForm.request} onChange={e => setReqForm(f => ({...f, request: e.target.value}))}/>
              </div>
              <p className="text-xs text-gray-400">All requests are kept strictly confidential within the prayer team.</p>
              <Button type="submit" disabled={loading} className={`w-full bg-gradient-to-r ${accent.grad} text-white border-0`}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Sending…</> : <><Send className="w-4 h-4 mr-2"/> Submit Request</>}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Join Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={joinOpen} onOpenChange={v => { setJoinOpen(v); if (!v) setTimeout(() => setJoinSent(false), 300); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600"/> Join the Prayer Team
            </DialogTitle>
          </DialogHeader>
          {joinSent ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600"/>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Welcome, Prayer Warrior!</h3>
              <p className="text-gray-500 text-sm">Our team leader will be in touch. See you at the next prayer session.</p>
              <Button className="mt-6" onClick={() => { setJoinOpen(false); setTimeout(() => setJoinSent(false), 300); }}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input required placeholder="Your name" value={joinForm.name} onChange={e => setJoinForm(f => ({...f, name: e.target.value}))}/>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone / WhatsApp</Label>
                  <Input placeholder="+263 …" value={joinForm.phone} onChange={e => setJoinForm(f => ({...f, phone: e.target.value}))}/>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="your@email.com" value={joinForm.email} onChange={e => setJoinForm(f => ({...f, email: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <Label>Why do you want to join the prayer team?</Label>
                <Textarea rows={3} placeholder="Share your heart…" value={joinForm.testimony} onChange={e => setJoinForm(f => ({...f, testimony: e.target.value}))}/>
              </div>
              <Button type="submit" disabled={loading} className={`w-full bg-gradient-to-r ${accent.grad} text-white border-0`}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Submitting…</> : <UserPlus className="w-4 h-4 mr-2"/>}
                {loading ? '' : 'Join the Team'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer/>
    </>
  );
}
