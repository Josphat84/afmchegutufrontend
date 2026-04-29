'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, CalendarDays, Clock,
  BookOpen, MapPin, Phone, Heart, Gift, Music,
  Package, ChevronLeft, ChevronRight, Pause, Play,
  ArrowRight, HeartHandshake, Wallet,
  Flower, BarChart3, Receipt, AlertTriangle, Mail,
  CheckCircle, Star, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── ANIMATIONS ────────────────────────────────────────────────────────────────
const animCSS = `
  @keyframes fade-in-up {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ken-burns {
    0%   { transform:scale(1); }
    100% { transform:scale(1.07); }
  }
  @keyframes bounce-slow {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(5px); }
  }
  @keyframes gal-fwd {
    from { opacity:0; transform:translateX(3%) scale(1.01); }
    to   { opacity:1; transform:translateX(0) scale(1); }
  }
  @keyframes gal-back {
    from { opacity:0; transform:translateX(-3%) scale(1.01); }
    to   { opacity:1; transform:translateX(0) scale(1); }
  }
  @keyframes float-up {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes emerge {
    from { opacity:0; transform:scale(0.97); }
    to   { opacity:1; transform:scale(1); }
  }
  .anim-up    { animation:fade-in-up 1.1s ease-out forwards; }
  .anim-up-2  { animation:fade-in-up 1.1s ease-out 0.18s forwards; opacity:0; }
  .anim-up-3  { animation:fade-in-up 1.1s ease-out 0.36s forwards; opacity:0; }
  .ken-burns  { animation:ken-burns 22s ease-in-out infinite alternate; }
  .bounce     { animation:bounce-slow 2s ease-in-out infinite; }
  .gal-fwd    { animation:gal-fwd  0.6s cubic-bezier(.25,.46,.45,.94) forwards; }
  .gal-back   { animation:gal-back 0.6s cubic-bezier(.25,.46,.45,.94) forwards; }
  .float-up   { animation:float-up 0.45s ease-out both; }
  .float-up2  { animation:float-up 0.45s 0.14s ease-out both; }
  .emerge     { animation:emerge   0.5s ease-out both; }
`;

// ── IMAGES ────────────────────────────────────────────────────────────────────
const BG_IMAGES = [
  { url:'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=90&w=2070', caption:'A family of believers' },
  { url:'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=90&w=2073', caption:'Where faith comes alive' },
  { url:'https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=90&w=2070', caption:'Encounter God in worship' },
  { url:'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=90&w=2070', caption:'A house of prayer for all nations' },
  { url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=90&w=2089', caption:'Growing together in faith and love' },
  { url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=90&w=2070', caption:'His creation declares His glory' },
  { url:'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=90&w=2070', caption:'Rooted in faith, growing in love' },
  { url:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=90&w=2070', caption:'Peace that passes all understanding' },
];

const GALLERY = [
  { url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=85&w=1200', alt:'Fellowship Together',     caption:'Walking in community and love' },
  { url:'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=85&w=1200', alt:'Sunday Worship',           caption:'Encounter the living God every Sunday' },
  { url:'https://images.unsplash.com/photo-1490730141103-6ac217a94b88?auto=format&fit=crop&q=85&w=1200', alt:'Lifted in Praise',         caption:'Hands raised, hearts open' },
  { url:'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=85&w=1200', alt:'Prayer & Intercession',    caption:'A house of prayer for all nations' },
  { url:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1200', alt:"God's Creation",           caption:"Zimbabwe — God's magnificent homeland" },
  { url:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=85&w=1200', alt:'Our Zimbabwe',               caption:'Reaching every corner of the land' },
  { url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=85&w=1200', alt:'Mountains & Majesty',      caption:'His creation declares His glory' },
  { url:'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=85&w=1200', alt:'Evening Light',            caption:'Rooted in faith, growing in love' },
  { url:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=85&w=1200', alt:'Morning Mist',             caption:'Peace that surpasses understanding' },
  { url:'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=85&w=1200', alt:'Family of Believers',      caption:'One body, one Spirit, one Lord' },
];

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface UserData     { id:number; email:string; name:string; role:string; churchName?:string; }
interface ExpenseStats { total:number; pending_count:number; total_approved_amount:number; total_pending_amount:number; }
interface PaymentStats { total:number; total_amount:number; today_total:number; }
interface Event        { id:string; title:string; event_start_date?:string; event_start_time?:string; location?:string; venue?:string; type:string; is_published:boolean; excerpt?:string; }

// ── DATA ──────────────────────────────────────────────────────────────────────
const BELIEFS = [
  { title:'Salvation',      verse:'Romans 10:9',   text:'We believe in salvation through faith in Jesus Christ alone — repentance, confession and new birth.' },
  { title:'Water Baptism',  verse:'Matthew 28:19', text:'Believers are baptised by full immersion in the name of the Father, Son and Holy Spirit.' },
  { title:'Holy Spirit',    verse:'Acts 2:4',      text:'The baptism of the Holy Spirit with the evidence of speaking in other tongues is for every believer.' },
  { title:'Divine Healing', verse:'Isaiah 53:5',   text:'By His stripes we are healed. We believe in the power of God to heal the sick and restore the broken.' },
  { title:'Second Coming',  verse:'1 Thess. 4:16', text:'We eagerly await the imminent, glorious return of our Lord and Saviour Jesus Christ.' },
];

const MINISTRIES = [
  { name:"Ladies' Fellowship", icon:Flower,         accent:'#B5475F', href:'/ladies',        desc:'Virtuous women building godly homes and families.' },
  { name:'Youth Ministry',      icon:Users,          accent:'#2A4D69', href:'/youth',         desc:'Empowering the next generation to live boldly for Christ.' },
  { name:'Sunday School',       icon:BookOpen,       accent:'#2E7D6A', href:'/children',      desc:'Nurturing children in the knowledge and love of the Lord.' },
  { name:"Men's Fellowship",    icon:HeartHandshake, accent:'#4A5568', href:'/men',           desc:'Raising godly men for the family, church and community.' },
  { name:'Choir & Worship',     icon:Music,          accent:'#92580A', href:'/choir-worship', desc:'Leading the congregation in spirit-filled praise and worship.' },
  { name:'Prayer Team',         icon:Heart,          accent:'#1A5276', href:'/prayer-team',   desc:'Interceding faithfully for the church, families and nation.' },
];

const MGMT_PAGES = [
  { title:'Believers Directory', icon:Users,        href:'/directory', accent:'#2A4D69' },
  { title:'Payments & Receipts', icon:Wallet,       href:'/receipts',  accent:'#2E7D6A' },
  { title:'Expense Management',  icon:Receipt,      href:'/expenses',  accent:'#4A5568' },
  { title:'Events & Notices',    icon:CalendarDays, href:'/events',    accent:'#92580A' },
  { title:'Equipment Inventory', icon:Package,      href:'/equipment', accent:'#1A5276' },
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

function fmt(n:number){ return `$${n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`; }

// ── BACKGROUND SLIDESHOW ──────────────────────────────────────────────────────
function BackgroundSlideshow() {
  const [idx,setIdx]       = useState(0);
  const [playing,setPlaying] = useState(true);
  useEffect(()=>{
    if(!playing) return;
    const t = setInterval(()=>setIdx(p=>(p+1)%BG_IMAGES.length), 8000);
    return ()=>clearInterval(t);
  },[playing]);
  return (
    <div className="fixed inset-0 z-0">
      {BG_IMAGES.map((img,i)=>(
        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{opacity:i===idx?1:0}}>
          <div className="absolute inset-0 ken-burns" style={{backgroundImage:`url('${img.url}')`,backgroundSize:'cover',backgroundPosition:'center'}}/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/80"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A4D69]/40 via-transparent to-transparent"/>
        </div>
      ))}
      <button onClick={()=>setIdx(p=>(p-1+BG_IMAGES.length)%BG_IMAGES.length)} aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition">
        <ChevronLeft className="h-4 w-4"/>
      </button>
      <button onClick={()=>setIdx(p=>(p+1)%BG_IMAGES.length)} aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition">
        <ChevronRight className="h-4 w-4"/>
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        <button onClick={()=>setPlaying(p=>!p)} className="p-1.5 rounded-full bg-black/30 text-white/70 hover:text-white transition">
          {playing?<Pause className="h-3 w-3"/>:<Play className="h-3 w-3"/>}
        </button>
        {BG_IMAGES.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i===idx?'w-5 bg-white':'w-1.5 bg-white/35 hover:bg-white/60'}`}/>
        ))}
      </div>
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/45 text-xs italic text-center">{BG_IMAGES[idx].caption}</p>
    </div>
  );
}

// ── LIFE GALLERY ──────────────────────────────────────────────────────────────
function LifeGallery() {
  const n = GALLERY.length;
  const [state, setState] = useState({ curr:0, key:0, dir:'fwd' as 'fwd'|'back' });
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setState(p => ({ curr:(p.curr+1)%n, key:p.key+1, dir:'fwd' }));
    }, 5500);
  }, [n]);

  useEffect(() => { startTimer(); return ()=>{ if(timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const go = (next:number, d:'fwd'|'back') => {
    setState(p => ({ curr:next, key:p.key+1, dir:d }));
    startTimer();
  };

  const { curr, key, dir } = state;
  const img = GALLERY[curr];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900"
      style={{height:'clamp(220px,45vw,400px)'}}>
      {/* Crossfade base layers */}
      {GALLERY.map((g,i)=>(
        <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{opacity:i===curr?1:0}}>
          <img src={g.url} alt={g.alt} className="w-full h-full object-cover"/>
        </div>
      ))}
      {/* Animated entry layer — key remount restarts the CSS animation */}
      <div key={key} className={`absolute inset-0 ${dir==='fwd'?'gal-fwd':'gal-back'}`}>
        <img src={img.url} alt={img.alt} className="w-full h-full object-cover"/>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none"/>
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-12 sm:px-7 sm:pb-5">
        <p key={`t-${key}`} className="text-white text-sm sm:text-base font-semibold drop-shadow float-up">{img.alt}</p>
        <p key={`c-${key}`} className="text-white/55 text-xs mt-0.5 float-up2 hidden sm:block">{img.caption}</p>
      </div>
      {/* Prev / Next */}
      <button onClick={()=>go((curr-1+n)%n,'back')} aria-label="Previous"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all">
        <ChevronLeft className="h-4 w-4"/>
      </button>
      <button onClick={()=>go((curr+1)%n,'fwd')} aria-label="Next"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all">
        <ChevronRight className="h-4 w-4"/>
      </button>
      {/* Dots + counter */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        {GALLERY.map((_,i)=>(
          <button key={i} onClick={()=>go(i, i>curr?'fwd':'back')}
            className={`h-1 rounded-full transition-all duration-300 ${i===curr?'w-5 bg-white':'w-1.5 bg-white/35 hover:bg-white/60'}`}/>
        ))}
      </div>
    </div>
  );
}

// ── EVENT CARD ────────────────────────────────────────────────────────────────
function EventCard({event}:{event:Event}) {
  const date  = event.event_start_date
    ? new Date(event.event_start_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})
    : 'Recurring';
  const time  = event.event_start_time ? event.event_start_time.slice(0,5) : '';
  const place = event.venue||event.location||'';
  return (
    <Link href="/events" className="block group">
      <Card className="border border-white/25 bg-white/88 backdrop-blur-sm hover:bg-white/95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="p-4 sm:p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-[#2A4D69]/8 flex-shrink-0 group-hover:bg-[#2A4D69]/14 transition">
            <CalendarDays className="h-4 w-4 text-[#2A4D69]"/>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-[#2A4D69] transition">{event.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{date}{time?` · ${time}`:''}</p>
            {place && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3 flex-shrink-0"/>{place}</p>}
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:text-[#86BBD8] transition-all"/>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── MINISTRY CARD ─────────────────────────────────────────────────────────────
function MinistryCard({m}:{m:typeof MINISTRIES[0]}) {
  return (
    <Link href={m.href} className="block group">
      <Card className="h-full border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{background:`${m.accent}14`}}>
            <m.icon className="h-5 w-5" style={{color:m.accent}}/>
          </div>
          <h3 className="font-semibold text-gray-800 text-base mb-2 group-hover:text-gray-900 transition">{m.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{m.desc}</p>
          <span className="text-xs font-medium flex items-center gap-1.5 transition-colors" style={{color:m.accent}}>
            Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform"/>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── PASTOR SECTION ────────────────────────────────────────────────────────────
function PastorSection() {
  const [imgIdx,setImgIdx] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setImgIdx(p=>(p+1)%PASTOR_IMAGES.length),7000); return()=>clearInterval(t); },[]);
  return (
    <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-white/20">
      <div className="relative" style={{minHeight:'260px'}}>
        {PASTOR_IMAGES.map((src,i)=>(
          <img key={i} src={src} alt="AFM Chegutu"
            className="absolute inset-0 w-full h-full object-cover"
            style={{opacity:i===imgIdx?1:0,transition:'opacity 1.2s ease'}}/>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent"/>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {PASTOR_IMAGES.map((_,i)=>(
            <button key={i} onClick={()=>setImgIdx(i)}
              className={`h-1 rounded-full transition-all ${i===imgIdx?'w-4 bg-white':'w-1.5 bg-white/40'}`}/>
          ))}
        </div>
      </div>
      <div className="bg-white p-7 md:p-9 flex flex-col justify-center">
        <p className="text-[10px] font-bold text-[#2A4D69] uppercase tracking-widest mb-3">A Word From Our Pastors</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5 leading-tight">Welcome to AFM Chegutu</h2>
        <div className="relative pl-5 border-l-2 border-[#86BBD8]/50 space-y-3">
          {PASTORS.message.split('\n\n').map((para,i)=>(
            <p key={i} className={`leading-relaxed text-sm ${i===0?'font-medium text-gray-700 italic':'text-gray-500'}`}>{para}</p>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="font-semibold text-[#1e3a52] text-sm">{PASTORS.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{PASTORS.title}</p>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN BANNER ──────────────────────────────────────────────────────────────
function AdminBanner({user,churchName}:{user:UserData;churchName:string}) {
  const [open,setOpen]           = useState(true);
  const [expStats,setExpStats]   = useState<ExpenseStats|null>(null);
  const [payStats,setPayStats]   = useState<PaymentStats|null>(null);
  const [memberCount,setMemberCount] = useState<number|null>(null);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/expenses/stats/overview`).then(r=>r.json()).then(setExpStats).catch(()=>{});
    fetch(`${API_BASE_URL}/payments/stats/overview`).then(r=>r.json()).then(setPayStats).catch(()=>{});
    fetch(`${API_BASE_URL}/directory/?limit=500`).then(r=>r.json()).then((d:unknown[])=>setMemberCount(d.length)).catch(()=>{});
  },[]);

  const net       = (payStats?.total_amount??0)-(expStats?.total_approved_amount??0);
  const pending   = expStats?.pending_count??0;

  /* Collapsed strip */
  if (!open) return (
    <div className="relative z-30 bg-[#162d3f] border-b border-[#86BBD8]/15">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-[#86BBD8]/20 text-[#86BBD8] border-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">Admin</Badge>
          <span className="text-white/55 text-xs">{user.name}</span>
          {pending>0 && (
            <Link href="/expenses" className="flex items-center gap-1 text-amber-400/90 text-xs hover:text-amber-300">
              <AlertTriangle className="h-3 w-3"/>{pending} pending
            </Link>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {MGMT_PAGES.map(p=>(
            <Link key={p.href} href={p.href} title={p.title}>
              <button className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/8 transition">
                <p.icon className="h-3.5 w-3.5"/>
              </button>
            </Link>
          ))}
          <button className="p-1.5 rounded-md text-white/35 hover:text-white hover:bg-white/8 transition ml-0.5" onClick={()=>setOpen(true)}>
            <ChevronDown className="h-3.5 w-3.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  /* Expanded banner */
  return (
    <div className="relative z-30 bg-[#162d3f] border-b border-[#86BBD8]/15 emerge">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-[#86BBD8]/20 text-[#86BBD8] border-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">Admin Mode</Badge>
              <span className="text-white/35 text-xs capitalize">{user.role}</span>
            </div>
            <p className="text-white text-sm font-semibold">Welcome back, {user.name}!</p>
            <p className="text-[#86BBD8]/60 text-xs mt-0.5">{churchName}</p>
          </div>
          <button className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition flex-shrink-0" onClick={()=>setOpen(false)}>
            <ChevronUp className="h-4 w-4"/>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            {label:'Members',  value:memberCount!==null?String(memberCount):'—',  icon:Users,     color:'#86BBD8'},
            {label:'Income',   value:payStats?fmt(payStats.total_amount):'—',     icon:TrendingUp,color:'#78C0A6'},
            {label:'Expenses', value:expStats?fmt(expStats.total_approved_amount):'—', icon:Receipt,color:'#86BBD8'},
            {label:'Net',      value:payStats&&expStats?fmt(net):'—',             icon:BarChart3, color:net>=0?'#78C0A6':'#E8647A'},
          ].map(s=>(
            <div key={s.label} className="bg-white/5 rounded-xl p-2.5 border border-white/7">
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="h-3 w-3 opacity-70" style={{color:s.color}}/>
                <p className="text-white/40 text-[11px]">{s.label}</p>
              </div>
              <p className="text-sm font-bold" style={{color:s.color}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {MGMT_PAGES.map(p=>(
            <Link key={p.href} href={p.href}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/6 hover:bg-white/12 text-white/65 hover:text-white border border-white/8 text-xs transition">
                <p.icon className="h-3.5 w-3.5"/>
                <span className="hidden sm:inline">{p.title}</span>
              </button>
            </Link>
          ))}
          {pending>0 && (
            <Link href="/expenses">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/12 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs transition">
                <AlertTriangle className="h-3.5 w-3.5"/>
                {pending} pending
              </button>
            </Link>
          )}
          {payStats && (
            <span className="ml-auto text-white/30 text-xs hidden md:block">
              Today: <span className="text-[#78C0A6] font-medium">{fmt(payStats.today_total)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#86BBD8]/30 border-t-[#2A4D69]"/>
    </div>
  );

  return (
    <>
      <style jsx global>{animCSS}</style>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
      <BackgroundSlideshow/>

      <div className="relative z-10 flex flex-col min-h-screen">
        {isLoggedIn && user && <AdminBanner user={user} churchName={churchName}/>}

        <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">

          {/* ── HERO ── */}
          <section className="text-center mb-8 pt-8 sm:pt-12 anim-up">
            <Badge className="mb-4 bg-white/12 text-white/80 border-white/20 backdrop-blur-sm px-3 py-1 text-[10px] tracking-widest uppercase">
              Apostolic Faith Mission · Chegutu Town Assembly · Zimbabwe
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl leading-tight tracking-tight">
              AFM Chegutu Town
            </h1>
            <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-3 leading-relaxed">
              A family of believers dedicated to the apostolic doctrine — come as you are, leave transformed.
            </p>
            <p className="text-xs text-white/45 italic mb-8">
              "I can do all things through Christ who strengthens me." —{' '}
              <Link href="/bible?ref=Philippians+4:13" className="hover:text-white/65 underline underline-offset-2 transition-colors">Philippians 4:13</Link>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <a href="#visit">
                <Button size="lg" className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-xl font-semibold px-7">
                  Plan Your Visit
                </Button>
              </a>
              <Link href="/receipts">
                <Button size="lg" variant="outline" className="bg-white/8 backdrop-blur-sm border-white/25 text-white hover:bg-white/15 font-medium px-7">
                  <Gift className="w-4 h-4 mr-2"/> Give Online
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-1 text-white/30 bounce">
              <ChevronDown className="h-4 w-4"/>
              <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            </div>
          </section>

          {/* ── SERVICE TIMES ── */}
          <section className="mb-16 anim-up-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {icon:CalendarDays, label:'Sunday Worship',  detail:'09:00 AM · Main Sanctuary', sub:'Every Sunday'},
                {icon:BookOpen,     label:'Midweek Prayer',  detail:'06:00 PM · Prayer Room',    sub:'Every Wednesday'},
                {icon:Music,        label:'Choir Rehearsal', detail:'03:00 PM · Sanctuary',      sub:'Every Saturday'},
              ].map(s=>(
                <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/18 rounded-2xl p-5 flex items-center gap-3.5 text-white hover:bg-white/15 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">{s.sub}</p>
                    <p className="font-semibold text-sm leading-tight">{s.label}</p>
                    <p className="text-xs text-white/60 mt-0.5">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── STATS ── */}
          <section className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {value:'350+', label:'Members & Friends'},
                {value:'8',    label:'Active Ministries'},
                {value:'35+',  label:'Years of Ministry'},
                {value:'∞',    label:"God's Faithfulness"},
              ].map(s=>(
                <div key={s.label} className="text-center bg-white/7 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── PASTOR ── */}
          <section className="mb-16">
            <PastorSection/>
          </section>

          {/* ── BELIEFS ── */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-2">Our Faith</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow mb-2">What We Believe</h2>
              <p className="text-white/50 max-w-md mx-auto text-sm">The core apostolic doctrines that anchor our assembly</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BELIEFS.map(b=>(
                <Card key={b.title} className="border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle className="w-4 h-4 text-[#2A4D69] flex-shrink-0 mt-0.5"/>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{b.title}</h3>
                        <Link href={`/bible?ref=${encodeURIComponent(b.verse)}`}
                          className="text-[11px] text-[#78C0A6] hover:text-[#2A4D69] underline decoration-dotted underline-offset-2 transition-colors">
                          {b.verse}
                        </Link>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed pl-7">{b.text}</p>
                  </CardContent>
                </Card>
              ))}
              {/* CTA */}
              <div className="bg-[#1e3a52] rounded-xl p-5 border border-[#86BBD8]/20 flex flex-col justify-between">
                <div>
                  <Star className="w-5 h-5 text-amber-400 mb-2"/>
                  <h3 className="font-semibold text-white text-sm mb-2">New to the Faith?</h3>
                  <p className="text-white/55 text-xs leading-relaxed">Come speak to us on Sunday or reach out — no question is too small.</p>
                </div>
                <a href="#visit" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/65 hover:text-white transition">
                  Find us <ArrowRight className="h-3 w-3"/>
                </a>
              </div>
            </div>
          </section>

          {/* ── MINISTRIES ── */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-2">Our Assembly</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow mb-2">Ministries & Departments</h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">Every member has a place and a purpose</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MINISTRIES.map(m=><MinistryCard key={m.name} m={m}/>)}
            </div>
          </section>

          {/* ── LIFE AT AFM ── */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-2">Our Community</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow">Life at AFM Chegutu</h2>
              <p className="text-white/45 text-sm mt-2">A glimpse into our family of believers</p>
            </div>
            <LifeGallery/>
          </section>

          {/* ── EVENTS ── */}
          <section className="mb-16">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-1">What's On</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">Upcoming Events</h2>
              </div>
              <Link href="/events" className="text-xs text-[#86BBD8]/80 hover:text-white underline underline-offset-4 transition">View all →</Link>
            </div>
            {publicEvents.length===0?(
              <div className="bg-white/7 backdrop-blur-sm rounded-2xl p-10 text-center text-white/40 border border-white/10">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-25"/>
                <p className="text-sm font-medium">No events scheduled yet</p>
                <p className="text-xs mt-1 text-white/30">Check back soon or contact us for service times</p>
              </div>
            ):(
              <div className="grid sm:grid-cols-2 gap-3">
                {publicEvents.map(e=><EventCard key={e.id} event={e}/>)}
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section className="mb-16">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0" style={{backgroundImage:"url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1400')",backgroundSize:'cover',backgroundPosition:'center'}}/>
              <div className="absolute inset-0 bg-[#162d3f]/90"/>
              <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <Badge className="mb-3 bg-white/15 text-white/80 border-white/25 text-[10px]">First Time Visitor?</Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">You Are Welcome Here</h2>
                  <p className="text-white/55 max-w-sm text-sm leading-relaxed">No dress code, no membership required. Come as you are. We meet every Sunday at 09:00 AM in Hintonville, Chegutu.</p>
                </div>
                <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
                  <a href="#visit">
                    <Button className="bg-white text-[#1e3a52] hover:bg-gray-100 font-semibold w-full shadow-lg">Plan My Visit</Button>
                  </a>
                  <a href="tel:+263771234567">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/8 w-full text-sm">
                      <Phone className="w-4 h-4 mr-2"/> Call Us
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── GIVING ── */}
          <section className="mb-12">
            <div className="bg-white/7 backdrop-blur-sm rounded-2xl p-5 border border-white/12 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/12 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-white"/>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-white text-sm">Support Our Assembly</h3>
                <p className="text-white/40 text-xs mt-0.5">
                  <Link href="/bible?ref=Malachi+3:10" className="hover:text-white/60 underline decoration-dotted transition-colors">"Bring the whole tithe into the storehouse." — Malachi 3:10</Link>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/receipts">
                  <Button size="sm" className="bg-white text-[#1e3a52] hover:bg-gray-100 font-semibold shadow">
                    <Gift className="w-3.5 h-3.5 mr-1.5"/> Give Now
                  </Button>
                </Link>
                <a href="tel:+263771234567">
                  <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/8">
                    <Phone className="w-3.5 h-3.5 mr-1.5"/> Call
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* ── CONNECT ── */}
          <section className="mb-14">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-[#86BBD8] uppercase tracking-widest mb-2">Stay Connected</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">Connect With Us</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {icon:Phone,        label:'Call / WhatsApp', value:'+263 77 123 4567',    href:'tel:+263771234567'},
                {icon:Mail,         label:'Email Us',        value:'info@afmchegutu.org', href:'mailto:info@afmchegutu.org'},
                {icon:CalendarDays, label:'View Events',     value:"See what's on",       href:'/events'},
              ].map(c=>(
                <a key={c.label} href={c.href}
                  className="group bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#2A4D69]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2A4D69] transition-all">
                    <c.icon className="w-4 h-4 text-[#2A4D69] group-hover:text-white transition-colors"/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
                    <p className="font-semibold text-gray-800 text-sm truncate">{c.value}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto flex-shrink-0 group-hover:translate-x-0.5 group-hover:text-[#86BBD8] transition-all"/>
                </a>
              ))}
            </div>
          </section>

          {/* ── FIND US ── */}
          <section id="visit" className="mb-10">
            <Card className="border border-gray-100 shadow-lg overflow-hidden">
              <CardContent className="p-7 sm:p-9">
                <div className="text-center mb-7">
                  <p className="text-[10px] font-bold text-[#2A4D69] uppercase tracking-widest mb-1.5">Find Us</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Come Visit Us</h2>
                  <p className="text-gray-400 text-sm mt-1">We would love to have you join us</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
                  {[
                    {icon:MapPin, title:'Address',       lines:['Hintonville, Chegutu','Mashonaland West, Zimbabwe']},
                    {icon:Clock,  title:'Service Times', lines:['Sunday · 09:00 AM','Wednesday · 06:00 PM','Saturday · 03:00 PM (Choir)']},
                    {icon:Phone,  title:'Contact',       lines:['+263 77 123 4567','info@afmchegutu.org']},
                  ].map(item=>(
                    <div key={item.title} className="group">
                      <div className="w-10 h-10 rounded-xl bg-[#2A4D69]/7 group-hover:bg-[#2A4D69]/12 flex items-center justify-center mx-auto mb-3 transition-colors">
                        <item.icon className="h-4.5 w-4.5 text-[#2A4D69] h-[18px] w-[18px]"/>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm mb-1.5">{item.title}</p>
                      {item.lines.map(l=><p key={l} className="text-xs text-gray-500 leading-relaxed">{l}</p>)}
                    </div>
                  ))}
                </div>
                <div className="mt-7 pt-6 border-t border-gray-100 flex justify-center">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#2A4D69] hover:bg-[#1e3a52] text-white font-medium px-7 shadow">
                      <MapPin className="w-4 h-4 mr-2"/> Get Directions
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

        </main>

        <Footer/>
      </div>
    </>
  );
}
