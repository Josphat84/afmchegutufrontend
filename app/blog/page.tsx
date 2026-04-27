'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen, Calendar, Clock, User, Search,
  ArrowRight, ChevronRight, Plus, Pencil, Trash2, Loader2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { POSTS, CATEGORIES, categoryStyle, type BlogPost } from './data';

interface UserData { id: number; email: string; name: string; role: string; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── POST CARD ─────────────────────────────────────────────────────────────────
function PostCard({
  post, isAdmin, onDelete,
}: {
  post: BlogPost & { id?: string };
  isAdmin: boolean;
  onDelete: (post: BlogPost & { id?: string }) => void;
}) {
  const fmtDate = new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="relative group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#86BBD8]/15 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden flex-shrink-0">
            {post.image
              ? <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              : <div className="absolute inset-0 bg-gradient-to-br from-[#2A4D69]/80 to-[#86BBD8]/60"/>
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"/>
            <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${categoryStyle(post.category)}`}>
              {post.category}
            </span>
            {'is_published' in post && !(post as any).is_published && (
              <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                Draft
              </span>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-[#2A4D69] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-gray-500">
                <User className="w-3 h-3 flex-shrink-0"/>{post.author}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{fmtDate}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Admin controls — overlay on top-right corner */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Link href={`/blog/edit/${post.slug}`} onClick={e => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-white shadow border border-[#86BBD8]/30 flex items-center justify-center text-[#2A4D69] hover:bg-[#2A4D69] hover:text-white transition-colors">
            <Pencil className="w-3.5 h-3.5"/>
          </Link>
          <button onClick={e => { e.preventDefault(); onDelete(post); }}
            className="w-7 h-7 rounded-full bg-white shadow border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            <Trash2 className="w-3.5 h-3.5"/>
          </button>
        </div>
      )}
    </div>
  );
}

// ── FEATURED HERO ─────────────────────────────────────────────────────────────
function FeaturedHero({
  post, isAdmin, onDelete,
}: {
  post: BlogPost & { id?: string };
  isAdmin: boolean;
  onDelete: (post: BlogPost & { id?: string }) => void;
}) {
  return (
    <div className="relative h-[56vh] min-h-[420px] overflow-hidden">
      {post.image
        ? <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover"/>
        : <div className="absolute inset-0 bg-gradient-to-br from-[#2A4D69] to-[#0d1f2d]"/>
      }
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f2d]/92 via-[#2A4D69]/75 to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
      <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 md:px-14 md:pb-14 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#86BBD8]">Featured</span>
          <ChevronRight className="w-3 h-3 text-[#86BBD8]"/>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${categoryStyle(post.category)}`}>
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl md:text-[2.6rem] font-bold text-white leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-[#c8dff0] text-sm leading-relaxed mb-6 line-clamp-2 max-w-xl">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-5">
          <Link href={`/blog/${post.slug}`}>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1e3a52] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg">
              Read Article <ArrowRight className="w-4 h-4"/>
            </button>
          </Link>
          <span className="text-white/55 text-xs hidden sm:block">
            {post.author} · {post.readTime} read
          </span>
          {isAdmin && (
            <div className="flex items-center gap-2 ml-2">
              <Link href={`/blog/edit/${post.slug}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-medium hover:bg-white/25 transition-colors border border-white/20">
                <Pencil className="w-3 h-3"/> Edit
              </Link>
              <button onClick={() => onDelete(post)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs font-medium hover:bg-red-600 transition-colors">
                <Trash2 className="w-3 h-3"/> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DELETE CONFIRMATION MODAL ──────────────────────────────────────────────────
function DeleteModal({
  post, onConfirm, onCancel, deleting,
}: {
  post: BlogPost & { id?: string };
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500"/>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Post?</h3>
        <p className="text-sm text-gray-500 text-center mb-6 line-clamp-2">
          "{post.title}" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4"/>}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [category,   setCategory]   = useState('All');
  const [search,     setSearch]     = useState('');
  const [posts,      setPosts]      = useState<(BlogPost & { id?: string })[]>(POSTS);
  const [toDelete,   setToDelete]   = useState<(BlogPost & { id?: string }) | null>(null);
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ud    = localStorage.getItem('user');
    const ch    = localStorage.getItem('church');
    if (token && ud) {
      try { setIsLoggedIn(true); setUser(JSON.parse(ud)); if (ch) setChurchName(ch); }
      catch { /* ignore */ }
    }
  }, []);

  // Fetch posts from API; fall back to static data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/blog/?published_only=false&limit=100`);
        if (res.ok) {
          const data: any[] = await res.json();
          if (data.length > 0) {
            setPosts(data.map(p => ({
              ...p,
              readTime:   p.read_time   ?? p.readTime   ?? '4 min',
              authorRole: p.author_role ?? p.authorRole ?? '',
              date:       p.created_at  ?? new Date().toISOString(),
              content:    Array.isArray(p.content) ? p.content : [],
              tags:       Array.isArray(p.tags)    ? p.tags    : [],
            })));
          }
          // empty array → keep static POSTS as fallback
        }
      } catch { /* keep static */ }
    }
    load();
  }, []);

  function handleLogout() {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const id = (toDelete as any).id;
      if (id) {
        await fetch(`${API}/blog/${id}`, { method: 'DELETE' });
      }
      setPosts(prev => prev.filter(p => p.slug !== toDelete.slug));
    } catch { /* ignore */ } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  const featured  = posts.find(p => p.featured) ?? posts[0];
  const allOthers = posts.filter(p => p.slug !== featured?.slug);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allOthers.filter(p =>
      (category === 'All' || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
    );
  }, [category, search, allOthers]);

  const isAdmin = isLoggedIn;

  if (!featured) return null;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>

      <div className="min-h-screen bg-[#f8f5ef]">
        {/* Featured */}
        <FeaturedHero post={featured} isAdmin={isAdmin} onDelete={setToDelete}/>

        {/* Filter bar */}
        <div className="bg-white border-b border-[#86BBD8]/20 shadow-sm sticky top-[72px] z-30">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-1.5 flex-wrap flex-1">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    category === c
                      ? 'bg-[#2A4D69] text-white shadow-sm'
                      : 'bg-[#86BBD8]/15 text-[#2A4D69] hover:bg-[#86BBD8]/30'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7B8E]"/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles…"
                  className="w-full pl-9 pr-4 py-1.5 rounded-full border border-[#86BBD8]/40 text-sm text-[#1e3a52] placeholder:text-gray-400 focus:outline-none focus:border-[#2A4D69] bg-white"/>
              </div>
              {isAdmin && (
                <Link href="/blog/new"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2A4D69] text-white text-xs font-semibold hover:bg-[#1e3a52] transition-colors shadow-sm flex-shrink-0">
                  <Plus className="w-3.5 h-3.5"/> New Post
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-1">
                {category === 'All' ? 'All Articles' : category}
              </p>
              <h2 className="text-2xl font-bold text-[#2A4D69]">
                {filtered.length} {filtered.length === 1 ? 'Article' : 'Articles'}
                {search && <span className="text-gray-400 font-normal text-lg"> for "{search}"</span>}
              </h2>
            </div>
            {isAdmin && (
              <Link href="/blog/new"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A4D69] text-white text-sm font-semibold hover:bg-[#1e3a52] transition-colors shadow-sm">
                <Plus className="w-4 h-4"/> New Post
              </Link>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-25"/>
              <p className="font-medium text-lg">No articles found</p>
              <p className="text-sm mt-1">Try a different category or clear the search</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <PostCard key={post.id || post.slug} post={post} isAdmin={isAdmin} onDelete={setToDelete}/>
              ))}
            </div>
          )}

          {/* Also show featured in the grid if filtering */}
          {(category !== 'All' || search) &&
            (category === 'All' || featured.category === category) &&
            (!search || featured.title.toLowerCase().includes(search.toLowerCase())) && (
            <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-[#86BBD8]/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#86BBD8] font-bold uppercase tracking-wide">Featured</span>
                <p className="font-semibold text-gray-800 line-clamp-1 text-sm">{featured.title}</p>
                <p className="text-xs text-gray-500">{featured.author} · {featured.readTime}</p>
              </div>
              <Link href={`/blog/${featured.slug}`}>
                <button className="px-3 py-1.5 rounded-lg bg-[#2A4D69] text-white text-xs font-medium flex items-center gap-1 flex-shrink-0">
                  Read <ArrowRight className="w-3 h-3"/>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter strip */}
        <div className="border-t border-[#86BBD8]/20 bg-white">
          <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
            <p className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest mb-2">Stay Encouraged</p>
            <h3 className="text-2xl font-bold text-[#2A4D69] mb-2">New articles every week</h3>
            <p className="text-gray-500 text-sm mb-1">
              Devotionals, Bible studies, testimonies and church news — straight from AFM Chegutu.
            </p>
            <p className="text-xs text-gray-400">Visit us every Sunday at 09:00 AM · Hintonville, Chegutu</p>
          </div>
        </div>
      </div>

      <Footer/>

      {toDelete && (
        <DeleteModal
          post={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
