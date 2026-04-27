'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, Users, CalendarDays, Clock,
  BookOpen, MapPin, Phone, Heart, Gift, Music,
  Package, ChevronLeft, ChevronRight, Pause, Play,
  ArrowRight, HeartHandshake, Wallet, Shield,
  Flower, BarChart3, Receipt, AlertTriangle, Mail,
  CheckCircle, Star, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============== STYLES ===============
const animationStyles = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ken-burns {
    0%   { transform: scale(1); }
    100% { transform: scale(1.08); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(6px); }
  }
  .anim-up   { animation: fade-in-up 1.2s ease-out forwards; }
  .anim-up-2 { animation: fade-in-up 1.2s ease-out 0.2s forwards; opacity:0; }
  .anim-up-3 { animation: fade-in-up 1.2s ease-out 0.4s forwards; opacity:0; }
  .ken-burns { animation: ken-burns 22s ease-in-out infinite alternate; }
  .bounce    { animation: bounce-slow 2s ease-in-out infinite; }
`;

// =============== IMAGES ===============
const BG_IMAGES = [
  { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=90&w=2070", caption: "A family of believers" },
  { url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=90&w=2073", caption: "Where faith comes alive" },
  { url: "https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=90&w=2070", caption: "Encounter God in worship" },
  { url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=90&w=2070", caption: "A house of prayer for all nations" },
  { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=90&w=2089", caption: "Growing together in faith and love" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=90&w=2070", caption: "His creation declares His glory" },
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=90&w=2070", caption: "Rooted in faith, growing in love" },
  { url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=90&w=2070", caption: "Peace that passes all understanding" },
];

// =============== TYPES ===============
type ColorType = 'purple'|'blue'|'green'|'amber'|'red'|'indigo'|'emerald'|'cyan'|'rose'|'pink'|'orange'|'teal';
interface UserData   { id:number; email:string; name:string; role:string; churchName?:string; }
interface ExpenseStats { total:number; pending_count:number; total_approved_amount:number; total_pending_amount:number; }
interface PaymentStats { total:number; total_amount:number; today_total:number; }
interface Event { id:string; title:string; event_start_date?:string; event_start_time?:string; location?:string; venue?:string; type:string; is_published:boolean; excerpt?:string; }

// =============== DATA ===============
const BELIEFS = [
  { icon: CheckCircle, title: 'Salvation',        verse: 'Romans 10:9',          text: 'We believe in salvation through faith in Jesus Christ alone — repentance, confession and new birth.' },
  { icon: CheckCircle, title: 'Water Baptism',    verse: 'Matthew 28:19',        text: 'Believers are baptised by full immersion in the name of the Father, Son and Holy Spirit.' },
  { icon: CheckCircle, title: 'Holy Spirit',      verse: 'Acts 2:4',             text: 'The baptism of the Holy Spirit with the evidence of speaking in other tongues is for every believer.' },
  { icon: CheckCircle, title: 'Divine Healing',   verse: 'Isaiah 53:5',          text: 'By His stripes we are healed. We believe in the power of God to heal the sick and restore the broken.' },
  { icon: CheckCircle, title: 'Second Coming',    verse: '1 Thess. 4:16',        text: 'We eagerly await the imminent, glorious return of our Lord and Saviour Jesus Christ.' },
];

const MINISTRIES = [
  { name: 'Ladies Fellowship',  icon: Flower,        color: 'rose'   as ColorType, href: '/ladies',       desc: 'Virtuous women building godly homes and families.' },
  { name: 'Youth Ministry',     icon: Users,         color: 'blue'   as ColorType, href: '/youth',        desc: 'Empowering the next generation to live boldly for Christ.' },
  { name: 'Sunday School',      icon: BookOpen,      color: 'green'  as ColorType, href: '/children',     desc: 'Nurturing children in the knowledge and love of the Lord.' },
  { name: 'Men\'s Fellowship',  icon: HeartHandshake,color: 'purple' as ColorType, href: '/men',          desc: 'Raising godly men for the family, church and community.' },
  { name: 'Choir & Worship',    icon: Music,         color: 'amber'  as ColorType, href: '/choir-worship',desc: 'Leading the congregation in spirit-filled praise and worship.' },
  { name: 'Prayer Team',        icon: Heart,         color: 'indigo' as ColorType, href: '/prayer-team',  desc: 'Interceding faithfully for the church, families and nation.' },
];

const MGMT_PAGES = [
  { title:'Believers Directory', desc:'Member profiles, departments and contact details.',        icon:Users,        href:'/directory', color:'blue'   as ColorType },
  { title:'Payments & Offerings',desc:'Issue formal receipts for tithes, offerings and gifts.',   icon:Wallet,       href:'/receipts',  color:'green'  as ColorType },
  { title:'Expense Management',  desc:'Track, approve and analyse church expenditure.',           icon:Receipt,      href:'/expenses',  color:'purple' as ColorType },
  { title:'Events & Notices',    desc:'Manage events, announcements and RSVPs.',                  icon:CalendarDays, href:'/events',    color:'amber'  as ColorType },
  { title:'Equipment Inventory', desc:'Track church assets, status and maintenance.',             icon:Package,      href:'/equipment', color:'teal'   as ColorType },
];

const PASTORS = {
  name:    'Rev. Lirani & Mrs Lirani',
  title:   'Senior Pastors, AFM Chegutu Town Assembly',
  message: 'For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future. (Jeremiah 29:11)\n\nDear friends, it is our joy to welcome you to AFM Chegutu. Whether you are searching for faith, looking for a church home, or simply curious — you are welcome here. We are a family rooted in the apostolic doctrine, committed to love, prayer and the Word of God.',
};

const PASTOR_IMAGES = [
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=90&w=900',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=90&w=900',
  'https://images.unsplash.com/photo-1504173010664-32509107de9e?auto=format&fit=crop&q=90&w=900',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=90&w=900',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=90&w=900',
];

const LIFE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=900', alt: 'Fellowship Together', tall: true },
  { url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600', alt: 'Sunday Worship', tall: false },
  { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600', alt: 'In God\'s Creation', tall: false },
  { url: 'https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=80&w=600', alt: 'Encounter the Living God', tall: false },
  { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600', alt: 'Zimbabwe — Our Beautiful Home', tall: false },
];

// =============== HELPERS ===============
function cc(color: ColorType) {
  const m: Record<ColorType,{light:string;icon:string}> = {
    purple: {light:'bg-[#86BBD8]/20',icon:'text-[#2A4D69]'},  blue:  {light:'bg-blue-100',  icon:'text-blue-700'},
    green:  {light:'bg-green-100', icon:'text-green-700'},   amber: {light:'bg-amber-100', icon:'text-amber-700'},
    red:    {light:'bg-red-100',   icon:'text-red-700'},     indigo:{light:'bg-indigo-100',icon:'text-indigo-700'},
    emerald:{light:'bg-emerald-100',icon:'text-emerald-700'},cyan:  {light:'bg-cyan-100',  icon:'text-cyan-700'},
    rose:   {light:'bg-rose-100',  icon:'text-rose-700'},    pink:  {light:'bg-pink-100',  icon:'text-pink-700'},
    orange: {light:'bg-orange-100',icon:'text-orange-700'},  teal:  {light:'bg-teal-100',  icon:'text-teal-700'},
  };
  return m[color];
}
function fmt(n:number){ return `$${n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`; }

// =============== BACKGROUND ===============
function BackgroundSlideshow() {
  const [idx,setIdx] = useState(0);
  const [playing,setPlaying] = useState(true);
  useEffect(()=>{ if(!playing)return; const t=setInterval(()=>setIdx(p=>(p+1)%BG_IMAGES.length),8000); return()=>clearInterval(t); },[playing]);
  return (
    <div className="fixed inset-0 z-0">
      {BG_IMAGES.map((img,i)=>(
        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{opacity:i===idx?1:0}}>
          <div className="absolute inset-0 ken-burns" style={{backgroundImage:`url('${img.url}')`,backgroundSize:'cover',backgroundPosition:'center'}}/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A4D69]/50 via-transparent to-[#6B7B8E]/50"/>
        </div>
      ))}
      <button onClick={()=>setIdx(p=>(p-1+BG_IMAGES.length)%BG_IMAGES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition"><ChevronLeft className="h-5 w-5"/></button>
      <button onClick={()=>setIdx(p=>(p+1)%BG_IMAGES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition"><ChevronRight className="h-5 w-5"/></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button onClick={()=>setPlaying(p=>!p)} className="p-1.5 rounded-full bg-black/30 text-white/70 hover:text-white transition">{playing?<Pause className="h-3 w-3"/>:<Play className="h-3 w-3"/>}</button>
        {BG_IMAGES.map((_,i)=><button key={i} onClick={()=>setIdx(i)} className={`h-1.5 rounded-full transition-all ${i===idx?'w-6 bg-white':'w-1.5 bg-white/40 hover:bg-white/60'}`}/>)}
      </div>
      <p className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 text-white/60 text-xs italic text-center whitespace-nowrap">{BG_IMAGES[idx].caption}</p>
    </div>
  );
}

// =============== PUBLIC COMPONENTS ===============
function EventCard({event}:{event:Event}) {
  const date = event.event_start_date
    ? new Date(event.event_start_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})
    : 'Recurring';
  const time = event.event_start_time ? event.event_start_time.slice(0,5) : '';
  const place = event.venue||event.location||'';
  return (
    <Link href="/events" className="block group">
      <div className="bg-white/85 backdrop-blur-sm rounded-xl p-5 border border-[#86BBD8]/30 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <div className="p-3 rounded-xl bg-[#86BBD8]/20 flex-shrink-0 group-hover:bg-[#86BBD8]/40 transition"><CalendarDays className="h-5 w-5 text-[#2A4D69]"/></div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-800 leading-tight group-hover:text-[#2A4D69] transition">{event.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{date}{time?` · ${time}`:''}</p>
          {place && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3"/>{place}</p>}
          {event.excerpt && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{event.excerpt}</p>}
        </div>
        <ArrowRight className="h-4 w-4 text-[#86BBD8]/80 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"/>
      </div>
    </Link>
  );
}

function MinistryCard({m}:{m:typeof MINISTRIES[0]}) {
  const c = cc(m.color);
  return (
    <Link href={m.href} className="block group">
      <Card className="h-full border-white/30 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
        <CardContent className="p-6">
          <div className={`p-3 rounded-xl ${c.light} w-fit mb-4 group-hover:scale-110 transition-transform`}><m.icon className={`h-6 w-6 ${c.icon}`}/></div>
          <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#2A4D69] transition">{m.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{m.desc}</p>
          <span className="text-xs text-[#2A4D69] font-medium flex items-center gap-1">Learn More <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform"/></span>
        </CardContent>
      </Card>
    </Link>
  );
}

function PastorSection() {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setImgIdx(p => (p + 1) % PASTOR_IMAGES.length), 8000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
      <div className="relative h-72 md:h-auto min-h-[320px]">
        {PASTOR_IMAGES.map((src, i) => (
          <img key={i} src={src} alt="Zimbabwe landscape"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === imgIdx ? 1 : 0, transition: 'opacity 1.2s ease' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent"/>
        <div className="absolute bottom-6 left-6 md:hidden">
          <p className="text-white font-bold text-lg">{PASTORS.name}</p>
          <p className="text-white/70 text-sm">{PASTORS.title}</p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {PASTOR_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
      <div className="bg-white/92 backdrop-blur-sm p-8 md:p-10 flex flex-col justify-center">
        <p className="text-xs font-bold text-[#2A4D69] uppercase tracking-widest mb-4">A Word From Our Pastors</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">Welcome to<br/>AFM Chegutu</h2>
        <div className="relative">
          <span className="absolute -top-2 -left-2 text-6xl text-[#86BBD8] font-serif leading-none select-none">"</span>
          <div className="pl-6 space-y-3">
            {PASTORS.message.split('\n\n').map((para, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'font-semibold text-gray-700 italic' : 'text-gray-600 text-sm'}`}>{para}</p>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 hidden md:block">
          <p className="font-bold text-[#1e3a52]">{PASTORS.name}</p>
          <p className="text-sm text-gray-500">{PASTORS.title}</p>
        </div>
      </div>
    </div>
  );
}

function MgmtCard({page,i}:{page:typeof MGMT_PAGES[0];i:number}) {
  const c = cc(page.color);
  return (
    <Link href={page.href} className="block group" style={{animationDelay:`${i*60}ms`}}>
      <Card className="h-full bg-white/90 backdrop-blur-sm border-[#86BBD8]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5">
        <CardContent className="p-5">
          <div className={`p-2.5 rounded-xl ${c.light} w-fit mb-3`}><page.icon className={`h-5 w-5 ${c.icon}`}/></div>
          <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-[#2A4D69] transition">{page.title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">{page.desc}</p>
          <span className="text-xs text-[#2A4D69] font-medium flex items-center gap-1">Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform"/></span>
        </CardContent>
      </Card>
    </Link>
  );
}

// =============== ADMIN DASHBOARD ===============
function AdminDashboard({user,churchName}:{user:UserData;churchName:string}) {
  const [expStats,setExpStats] = useState<ExpenseStats|null>(null);
  const [payStats,setPayStats] = useState<PaymentStats|null>(null);
  const [memberCount,setMemberCount] = useState<number|null>(null);
  const [events,setEvents] = useState<Event[]>([]);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/expenses/stats/overview`).then(r=>r.json()).then(setExpStats).catch(()=>{});
    fetch(`${API_BASE_URL}/payments/stats/overview`).then(r=>r.json()).then(setPayStats).catch(()=>{});
    fetch(`${API_BASE_URL}/directory/?limit=500`).then(r=>r.json()).then((d:unknown[])=>setMemberCount(d.length)).catch(()=>{});
    fetch(`${API_BASE_URL}/events/?limit=3`).then(r=>r.json()).then((d:Event[])=>setEvents(d.filter(e=>e.is_published).slice(0,3))).catch(()=>{});
  },[]);

  const net=(payStats?.total_amount??0)-(expStats?.total_approved_amount??0);
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name}!</h1>
        <p className="text-[#86BBD8] text-sm">{churchName} · Management Dashboard</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Total Members',    value:memberCount!==null?String(memberCount):'—', icon:Users,      bg:'bg-blue-600'},
          {label:'Total Income',     value:payStats?fmt(payStats.total_amount):'—',    icon:TrendingUp, bg:'bg-green-600'},
          {label:'Approved Expenses',value:expStats?fmt(expStats.total_approved_amount):'—',icon:Receipt,bg:'bg-[#2A4D69]'},
          {label:'Net Position',     value:expStats&&payStats?fmt(net):'—',            icon:BarChart3,  bg:net>=0?'bg-[#78C0A6]':'bg-orange-600'},
        ].map(m=>(
          <div key={m.label} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#86BBD8]/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{m.label}</p>
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}><m.icon className="w-3.5 h-3.5 text-white"/></div>
            </div>
            <p className="text-xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>
      {expStats&&expStats.pending_count>0&&(
        <Link href="/expenses">
          <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-xl p-4 flex items-center gap-3 hover:bg-amber-100/90 transition cursor-pointer">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0"/>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">{expStats.pending_count} expense{expStats.pending_count!==1?'s':''} awaiting approval — {fmt(expStats.total_pending_amount)}</p>
              <p className="text-xs text-amber-600">Click to review in Expense Manager</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600"/>
          </div>
        </Link>
      )}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-4 drop-shadow">Management Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MGMT_PAGES.map((p,i)=><MgmtCard key={p.href} page={p} i={i}/>)}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white drop-shadow">Upcoming Events</h2>
            <Link href="/events" className="text-xs text-[#86BBD8] hover:text-white underline">View all →</Link>
          </div>
          {events.length===0?(
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-center text-white/60 border border-white/20">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50"/><p className="text-sm">No upcoming events</p>
            </div>
          ):(
            <div className="space-y-3">{events.map(e=><EventCard key={e.id} event={e}/>)}</div>
          )}
          {payStats&&(
            <div className="mt-4 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0"><Receipt className="w-4 h-4 text-white"/></div>
              <div><p className="text-sm font-semibold text-green-800">Today's offerings</p><p className="text-xl font-bold text-green-700">{fmt(payStats.today_total)}</p></div>
              <Link href="/receipts" className="ml-auto text-xs text-green-700 underline hover:text-green-900">Open →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============== MAIN ===============
export default function ChurchPage() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [user,setUser]             = useState<UserData|null>(null);
  const [churchName,setChurchName] = useState('AFM Chegutu Assembly');
  const [loading,setLoading]       = useState(true);
  const [publicEvents,setPublicEvents] = useState<Event[]>([]);

  useEffect(()=>{
    const token=localStorage.getItem('token'), userData=localStorage.getItem('user'), church=localStorage.getItem('church');
    if(token&&userData){
      try{ setIsLoggedIn(true); setUser(JSON.parse(userData)); if(church) setChurchName(church); }
      catch{ ['token','user','church'].forEach(k=>localStorage.removeItem(k)); }
    }
    setLoading(false);
    fetch(`${API_BASE_URL}/events/?limit=4`).then(r=>r.ok?r.json():[])
      .then((d:Event[])=>setPublicEvents(d.filter(e=>e.is_published).slice(0,4))).catch(()=>{});
  },[]);

  const handleLogout=()=>{ ['token','user','church'].forEach(k=>localStorage.removeItem(k)); setIsLoggedIn(false); setUser(null); window.location.reload(); };

  if(loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#86BBD8]/10 to-[#78C0A6]/10">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86BBD8]/40 border-t-[#2A4D69]"/>
        <p className="text-[#1e3a52] text-sm font-medium">Loading…</p>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
      <BackgroundSlideshow/>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12">
          {isLoggedIn&&user ? <AdminDashboard user={user} churchName={churchName}/> : (
            <>
              {/* ── HERO ── */}
              <section className="text-center mb-8 pt-10 anim-up">
                <Badge className="mb-5 bg-white/15 text-white border-white/25 backdrop-blur-sm px-4 py-1.5 text-xs tracking-widest uppercase">
                  Apostolic Faith Mission · Chegutu Town Assembly · Zimbabwe
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 drop-shadow-xl leading-tight tracking-tight">
                  AFM Chegutu Town
                </h1>
                <p className="text-xl text-[#c8dff0] max-w-2xl mx-auto mb-4 leading-relaxed">
                  A family of believers dedicated to the apostolic doctrine —<br className="hidden sm:block"/> come as you are, leave transformed.
                </p>
                {/* Scripture teaser */}
                <p className="text-sm text-white/60 italic mb-10">"I can do all things through Christ who strengthens me." — <Link href="/bible?ref=Philippians+4:13" className="hover:text-white/90 underline underline-offset-2 transition-colors">Philippians 4:13</Link></p>
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                  <a href="#visit">
                    <Button size="lg" className="bg-gradient-to-r from-[#2A4D69] to-[#6B7B8E] hover:from-[#1e3a52] hover:to-[#556470] text-white shadow-2xl font-semibold px-8">
                      Plan Your Visit
                    </Button>
                  </a>
                  <Link href="/receipts">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8">
                      <Gift className="w-4 h-4 mr-2"/> Give Online
                    </Button>
                  </Link>
                </div>
                {/* Scroll indicator */}
                <div className="flex flex-col items-center gap-1 text-white/40 bounce">
                  <ChevronDown className="h-5 w-5"/>
                  <span className="text-xs">Scroll to explore</span>
                </div>
              </section>

              {/* ── SERVICE TIMES ── */}
              <section className="mb-20 anim-up-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {icon:CalendarDays, label:'Sunday Worship',   detail:'09:00 AM · Main Sanctuary',  sub:'Every Sunday'},
                    {icon:BookOpen,     label:'Midweek Prayer',   detail:'06:00 PM · Prayer Room',     sub:'Every Wednesday'},
                    {icon:Music,        label:'Choir Rehearsal',  detail:'03:00 PM · Sanctuary',       sub:'Every Saturday'},
                  ].map(s=>(
                    <div key={s.label} className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-6 flex items-center gap-4 text-white hover:bg-white/20 transition">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"><s.icon className="w-6 h-6"/></div>
                      <div>
                        <p className="text-xs text-white/60 mb-0.5">{s.sub}</p>
                        <p className="font-bold text-lg leading-tight">{s.label}</p>
                        <p className="text-sm text-white/70">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── STATS STRIP ── */}
              <section className="mb-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {value:'350+', label:'Members & Friends'},
                    {value:'8',    label:'Active Ministries'},
                    {value:'35+',  label:'Years of Ministry'},
                    {value:'∞',    label:'God\'s Faithfulness'},
                  ].map(s=>(
                    <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition">
                      <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
                      <p className="text-sm text-white/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── PASTOR'S WELCOME ── */}
              <section className="mb-20">
                <PastorSection/>
              </section>

              {/* ── WHAT WE BELIEVE ── */}
              <section className="mb-20">
                <div className="text-center mb-12">
                  <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Our Faith</p>
                  <h2 className="text-4xl font-bold text-white drop-shadow mb-3">What We Believe</h2>
                  <p className="text-[#86BBD8] max-w-xl mx-auto text-sm">The core apostolic doctrines that anchor AFM Chegutu Town Assembly</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {BELIEFS.map((b,i)=>(
                    <div key={b.title} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                      style={{animationDelay:`${i*80}ms`}}>
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-[#2A4D69] flex-shrink-0"/>
                        <div>
                          <h3 className="font-bold text-gray-800">{b.title}</h3>
                          <Link href={`/bible?ref=${encodeURIComponent(b.verse)}`} className="text-xs text-[#78C0A6] font-medium hover:text-[#2A4D69] underline decoration-dotted underline-offset-2 transition-colors">{b.verse}</Link>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{b.text}</p>
                    </div>
                  ))}
                  {/* Last card — CTA */}
                  <div className="bg-gradient-to-br from-[#1e3a52] to-[#556470] rounded-2xl p-6 border border-[#86BBD8]/30 shadow-lg flex flex-col justify-between">
                    <div>
                      <Star className="w-6 h-6 text-yellow-300 mb-3"/>
                      <h3 className="font-bold text-white text-lg mb-2">New to the Faith?</h3>
                      <p className="text-[#c8dff0] text-sm leading-relaxed">We would love to walk with you. Come speak to us on Sunday or reach out — no question is too small.</p>
                    </div>
                    <a href="#visit" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition">
                      Find us <ArrowRight className="h-4 w-4"/>
                    </a>
                  </div>
                </div>
              </section>

              {/* ── MINISTRIES ── */}
              <section className="mb-20">
                <div className="text-center mb-12">
                  <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Our Assembly</p>
                  <h2 className="text-4xl font-bold text-white drop-shadow mb-3">Ministries & Departments</h2>
                  <p className="text-[#86BBD8] text-sm max-w-xl mx-auto">Every member has a place and a purpose. Find your home in one of our vibrant ministries.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MINISTRIES.map(m=><MinistryCard key={m.name} m={m}/>)}
                </div>
                <p className="text-center mt-6 text-white/50 text-xs">Click any ministry to learn more about it</p>
              </section>

              {/* ── LIFE AT AFM ── */}
              <section className="mb-20">
                <div className="text-center mb-8">
                  <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Our Community</p>
                  <h2 className="text-4xl font-bold text-white drop-shadow">Life at AFM Chegutu</h2>
                  <p className="text-[#86BBD8] text-sm mt-3">A glimpse into our family of believers</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{gridAutoRows:'200px'}}>
                  {LIFE_IMAGES.map((img, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2' : ''}`}>
                      <img src={img.url} alt={img.alt}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/>
                      <p className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow">{img.alt}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── EVENTS ── */}
              <section className="mb-20">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-2">What's On</p>
                    <h2 className="text-4xl font-bold text-white drop-shadow">Upcoming Events</h2>
                  </div>
                  <Link href="/events" className="text-sm text-[#86BBD8] hover:text-white underline underline-offset-4 transition">View all →</Link>
                </div>
                {publicEvents.length===0?(
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center text-white/50 border border-white/15">
                    <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30"/>
                    <p className="font-medium">No events scheduled yet</p>
                    <p className="text-xs mt-1">Check back soon or contact us for service times</p>
                  </div>
                ):(
                  <div className="grid sm:grid-cols-2 gap-4">
                    {publicEvents.map(e=><EventCard key={e.id} event={e}/>)}
                  </div>
                )}
              </section>

              {/* ── NEW HERE CTA ── */}
              <section className="mb-20">
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="absolute inset-0" style={{backgroundImage:"url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1920')",backgroundSize:'cover',backgroundPosition:'center'}}/>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#162d3f]/90 to-[#2A4D69]/80"/>
                  <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <Badge className="mb-4 bg-white/20 text-white border-white/30 text-xs">First Time Visitor?</Badge>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">You Are Welcome Here</h2>
                      <p className="text-[#c8dff0] max-w-md leading-relaxed">No dress code, no membership required. Just come as you are. We meet every Sunday at 09:00 AM in Hintonville, Chegutu.</p>
                    </div>
                    <div className="flex flex-col gap-3 flex-shrink-0">
                      <a href="#visit">
                        <Button size="lg" className="bg-white text-[#1e3a52] hover:bg-gray-100 font-bold w-full shadow-xl">Plan My Visit</Button>
                      </a>
                      <a href="tel:+263771234567">
                        <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 w-full">
                          <Phone className="w-4 h-4 mr-2"/> Call Us
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── GIVING ── */}
              <section className="mb-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white"/>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-white text-base">Support Our Assembly</h3>
                    <p className="text-white/55 text-xs mt-0.5">
                      <Link href="/bible?ref=Malachi+3:10" className="hover:text-white/80 underline decoration-dotted transition-colors">"Bring the whole tithe into the storehouse." — Malachi 3:10</Link>
                      {' '}· Your giving enables us to reach our community and fulfil the Great Commission.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href="/receipts">
                      <Button size="sm" className="bg-white text-[#1e3a52] hover:bg-gray-100 font-bold shadow-lg">
                        <Gift className="w-4 h-4 mr-1.5"/> Give Now
                      </Button>
                    </Link>
                    <a href="tel:+263771234567">
                      <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                        <Phone className="w-4 h-4 mr-1.5"/> Call
                      </Button>
                    </a>
                  </div>
                </div>
              </section>

              {/* ── CONNECT ── */}
              <section className="mb-20">
                <div className="text-center mb-10">
                  <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-3">Stay Connected</p>
                  <h2 className="text-3xl font-bold text-white drop-shadow">Connect With Us</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {icon:Phone,        label:'Call / WhatsApp', value:'+263 77 123 4567',    href:'tel:+263771234567'},
                    {icon:Mail,         label:'Email Us',        value:'info@afmchegutu.org', href:'mailto:info@afmchegutu.org'},
                    {icon:CalendarDays, label:'View Events',     value:'See what\'s on',      href:'/events'},
                  ].map(c=>(
                    <a key={c.label} href={c.href} className="group bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[#86BBD8]/20 shadow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full border border-[#86BBD8]/50 bg-[#86BBD8]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2A4D69] group-hover:border-[#2A4D69] transition-all">
                        <c.icon className="w-4 h-4 text-[#2A4D69] group-hover:text-white transition-colors"/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                        <p className="font-semibold text-gray-800 group-hover:text-[#2A4D69] transition text-sm truncate">{c.value}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#86BBD8]/50 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform"/>
                    </a>
                  ))}
                </div>
              </section>

              {/* ── VISIT ── */}
              <section id="visit" className="mb-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/30">
                  <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <p className="text-xs font-bold text-[#2A4D69] uppercase tracking-widest mb-2">Find Us</p>
                      <h2 className="text-2xl font-bold text-gray-800">Come Visit Us</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      {[
                        {icon:MapPin, title:'Address',       lines:['Hintonville, Chegutu','Mashonaland West, Zimbabwe']},
                        {icon:Clock,  title:'Service Times', lines:['Sunday · 09:00 AM','Wednesday · 06:00 PM','Saturday · 03:00 PM (Choir)']},
                        {icon:Phone,  title:'Contact',       lines:['+263 77 123 4567','info@afmchegutu.org']},
                      ].map(item=>(
                        <div key={item.title}>
                          <div className="w-10 h-10 rounded-xl bg-[#86BBD8]/15 flex items-center justify-center mx-auto mb-3"><item.icon className="h-5 w-5 text-[#2A4D69]"/></div>
                          <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                          {item.lines.map(l=><p key={l} className="text-sm text-gray-600">{l}</p>)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-1.5 bg-gradient-to-r from-[#2A4D69] via-[#86BBD8] to-[#78C0A6]"/>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      <Footer/>
    </>
  );
}
