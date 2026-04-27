'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PostForm } from '../../PostForm';
import { POSTS, type BlogPost } from '../../data';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface UserData { id: number; email: string; name: string; role: string; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function EditPostPage() {
  const params = useParams();
  const slug   = params?.slug as string;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');
  const [post,       setPost]       = useState<(BlogPost & { id?: string }) | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);

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
          return;
        }
      } catch { /* fall through */ }

      // Fallback to static data
      const found = POSTS.find(p => p.slug === slug);
      if (found) { setPost(found); }
      else        { setNotFound(true); }
      setLoading(false);
    }
    load().then(() => setLoading(false));
  }, [slug]);

  function handleLogout() {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
      <div className="min-h-screen bg-[#f8f5ef] pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-[#6B7B8E] text-sm animate-pulse">
            Loading post…
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <BookOpen className="w-12 h-12 text-[#86BBD8] mx-auto mb-4"/>
            <h2 className="text-2xl font-bold text-[#2A4D69] mb-2">Post not found</h2>
            <Link href="/blog" className="mt-4 px-5 py-2 bg-[#2A4D69] text-white rounded-xl text-sm font-semibold hover:bg-[#1e3a52] transition-colors">
              Back to Blog
            </Link>
          </div>
        ) : (
          <PostForm mode="edit" initial={post!}/>
        )}
      </div>
      <Footer/>
    </>
  );
}
