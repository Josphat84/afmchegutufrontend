'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PostForm } from '../PostForm';

interface UserData { id: number; email: string; name: string; role: string; }

export default function NewPostPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<UserData | null>(null);
  const [churchName, setChurchName] = useState('AFM Chegutu Assembly');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ud    = localStorage.getItem('user');
    const ch    = localStorage.getItem('church');
    if (token && ud) {
      try { setIsLoggedIn(true); setUser(JSON.parse(ud)); if (ch) setChurchName(ch); }
      catch { /* ignore */ }
    }
  }, []);

  function handleLogout() {
    ['token','user','church'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUser(null); window.location.reload();
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} churchName={churchName} onLogout={handleLogout}/>
      <div className="min-h-screen bg-[#f8f5ef] pt-4">
        <PostForm mode="new"/>
      </div>
      <Footer/>
    </>
  );
}
