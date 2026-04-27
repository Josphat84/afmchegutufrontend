'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Clock, User, Tag,
  Share2, CheckCircle, BookOpen, ArrowRight,
  Pencil, Trash2, Loader2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { POSTS, categoryStyle, type BlogPost } from '../data';
import { ScriptureLink } from '@/components/ScriptureLink';

interface UserData { id: number; email: string; name: string; role: string; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Detect scripture references inline and convert them to links
function renderParagraph(text: string) {
  const refPattern = /\(([1-3]?\s?[A-Z][a-zA-Z]+\.?\s+\d+:\d+(?:-\d+)?(?:,\s*\d+)?)\)/g;
  const parts: (string | { ref: string; label: string })[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = refPattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push({ ref: m[1], label: `(${m[1]})` });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string'
          ? <span key={i}>{p}</span>
          : <ScriptureLink key={i} reference={p.ref}>{p.label}</ScriptureLink>
      )}
    </>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-[#86BBD8]/15 hover:shadow-md transition-all hover:-translate-y-0.5">
        <div className="relative h-36 overflow-hidden">
          {post.image
            ? <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            : <div className="absolute inset-0 bg-gradient-to-br from-[#2A4D69]/70 to-[#86BBD8]/50"/>
          }
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full border ${categoryStyle(post.category)}`}>
            {post.category}
          </span>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-[#2A4D69] transition-colors mb-1">
            {post.title}
          </h4>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3"/>{post.readTime}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function PostPage() {
  const params    = useParams();
  const router    = useRouter();
  const slug      = params?.slug as string;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [copied,     setCopied]     = useState(false);
  const [post,       setPost]       = useState<(BlogPost & { id?: string }) | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ud    = localStorage.getItem('user');
    const ch    = localStorage.getItem('church');
    if (token && ud) {
      try { setIsLoggedIn(true); setUser(JSON.parse(ud)); if (ch) setChurchName(ch); }
      catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      try {
        const res = await fetch(`${API}/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost({
            ...data,
            readTime:   data.read_time   ?? data.readTime   ?? '4 min',
            authorRole: data.author_role ?? data.authorRole ?? '',
            date:       data.created_at  ?? new Date().toISOString(),
            content:    Array.isArray(data.content) ? data.content : [],
            tags:       Array.isArray(data.tags)    ? data.tags    : [],
          });
          setLoading(false);
          return;
        }
      } catch { /* fall through */ }

      const found = POSTS.find(p => p.slug === slug) ?? null;
      setPost(found);
      setLoading(false);
    }
    load();
  }, [slug]);

  function handleLogout() {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  }

  async function handleDelete() {
    if (!post) return;
    setDeleting(true);
    try {
      const id = (post as any).id;
      if (id) await fetch(`${API}/blog/${id}`, { method: 'DELETE' });
      router.push('/blog');
    } catch {
      setDeleting(false);
      setConfirmDel(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const isAdmin = isLoggedIn;

  if (loading) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
        <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#6B7B8E] text-sm animate-pulse">
          Loading…
        </div>
        <Footer/>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
        <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-[#86BBD8] mx-auto mb-4"/>
            <h2 className="text-2xl font-bold text-[#2A4D69] mb-2">Article not found</h2>
            <p className="text-gray-500 mb-6">This article may have been moved or removed.</p>
            <Link href="/blog" className="px-5 py-2.5 bg-[#2A4D69] text-white rounded-xl font-semibold text-sm hover:bg-[#1e3a52] transition-colors">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  const fmtDate = new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const allPosts  = POSTS;
  const idx       = allPosts.findIndex(p => p.slug === post.slug);
  const related   = allPosts.filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  const more      = related.length < 3 ? [...related, ...allPosts.filter(p => p.slug !== post.slug && !related.includes(p))].slice(0, 3) : related;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>

      <div className="min-h-screen bg-[#f8f5ef]">
        {/* Hero image */}
        <div className="relative h-[45vh] min-h-[340px] overflow-hidden">
          {post.image
            ? <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover"/>
            : <div className="absolute inset-0 bg-gradient-to-br from-[#2A4D69] to-[#0d1f2d]"/>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f2d]/85 via-[#0d1f2d]/40 to-transparent"/>
          {/* Back link */}
          <Link href="/blog"
            className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4"/> Blog
          </Link>
          {/* Admin controls */}
          {isAdmin && (
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <Link href={`/blog/edit/${post.slug}`}
                className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors border border-white/20">
                <Pencil className="w-3.5 h-3.5"/> Edit Post
              </Link>
              <button onClick={() => setConfirmDel(true)}
                className="flex items-center gap-1.5 text-white text-xs font-medium bg-red-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5"/> Delete
              </button>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute bottom-6 left-6">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryStyle(post.category)}`}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Article body */}
        <div className="container mx-auto px-4 max-w-3xl -mt-6 relative z-10 pb-16">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#86BBD8]/10">
            {/* Title block */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-50">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <div className="w-7 h-7 rounded-full bg-[#2A4D69] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {post.author?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 leading-none">{post.author}</p>
                    <p className="text-xs text-gray-400 leading-none mt-0.5">{post.authorRole}</p>
                  </div>
                </span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{fmtDate}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>{post.readTime} read</span>
                {post.scripture && (
                  <ScriptureLink reference={post.scripture}
                    className="flex items-center gap-1 text-[#2A4D69] font-medium">
                    <BookOpen className="w-3.5 h-3.5"/>{post.scripture}
                  </ScriptureLink>
                )}
              </div>
            </div>

            {/* Body text */}
            <div className="px-8 py-8" style={{ fontFamily: "'Georgia','Times New Roman',serif", lineHeight: 1.95, fontSize: '1.05rem' }}>
              <blockquote className="border-l-4 border-[#86BBD8] pl-5 mb-8 italic text-[#2A4D69] text-lg leading-relaxed">
                {post.excerpt}
              </blockquote>

              <div className="space-y-5 text-gray-700">
                {post.content.map((para, i) => (
                  <p key={i}>{renderParagraph(para)}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                <Tag className="w-3.5 h-3.5 text-[#6B7B8E] flex-shrink-0"/>
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#86BBD8]/15 text-[#2A4D69] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author card */}
            <div className="mx-8 mb-8 p-5 rounded-2xl bg-gradient-to-r from-[#2A4D69]/5 to-[#86BBD8]/10 border border-[#86BBD8]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2A4D69] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {post.author?.charAt(0) ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2A4D69]">{post.author}</p>
                <p className="text-xs text-[#6B7B8E]">{post.authorRole} · AFM Chegutu Town Assembly</p>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#86BBD8]/30 text-[#2A4D69] text-xs font-medium hover:bg-[#86BBD8]/10 transition-colors flex-shrink-0 shadow-sm">
                {copied ? <><CheckCircle className="w-3.5 h-3.5 text-[#78C0A6]"/> Copied!</> : <><Share2 className="w-3.5 h-3.5"/> Share</>}
              </button>
            </div>
          </div>

          {/* Navigation: prev/next (static posts only) */}
          {idx !== -1 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {idx > 0 && (
                <Link href={`/blog/${allPosts[idx - 1].slug}`}
                  className="flex items-center gap-2 p-4 bg-white rounded-xl border border-[#86BBD8]/15 hover:shadow-md transition-all group">
                  <ArrowLeft className="w-4 h-4 text-[#86BBD8] flex-shrink-0 group-hover:-translate-x-0.5 transition-transform"/>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Previous</p>
                    <p className="text-sm font-semibold text-gray-700 line-clamp-1">{allPosts[idx - 1].title}</p>
                  </div>
                </Link>
              )}
              {idx < allPosts.length - 1 && (
                <Link href={`/blog/${allPosts[idx + 1].slug}`}
                  className="flex items-center gap-2 p-4 bg-white rounded-xl border border-[#86BBD8]/15 hover:shadow-md transition-all group col-start-2 text-right justify-end">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Next</p>
                    <p className="text-sm font-semibold text-gray-700 line-clamp-1">{allPosts[idx + 1].title}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86BBD8] flex-shrink-0 group-hover:translate-x-0.5 transition-transform"/>
                </Link>
              )}
            </div>
          )}

          {/* Related posts */}
          {more.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#2A4D69] text-lg">More to Read</h3>
                <Link href="/blog" className="text-xs text-[#86BBD8] hover:text-[#2A4D69] transition-colors flex items-center gap-1">
                  All articles <ArrowRight className="w-3 h-3"/>
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {more.map(p => <RelatedCard key={p.id} post={p}/>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer/>

      {/* Delete confirmation modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !deleting && setConfirmDel(false)}>
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
              <button onClick={() => setConfirmDel(false)} disabled={deleting}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
