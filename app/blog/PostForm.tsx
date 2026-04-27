'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Save, Eye, EyeOff, Star, Loader2,
  Image as ImageIcon, Tag, BookOpen, Clock, User, Upload,
} from 'lucide-react';
import { CATEGORIES, type BlogPost } from './data';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

interface Props {
  initial?: BlogPost & { id?: string };
  mode: 'new' | 'edit';
}

export function PostForm({ initial, mode }: Props) {
  const router = useRouter();

  const [title,      setTitle]      = useState(initial?.title      || '');
  const [slug,       setSlug]       = useState(initial?.slug       || '');
  const [slugLocked, setSlugLocked] = useState(mode === 'edit');
  const [excerpt,    setExcerpt]    = useState(initial?.excerpt     || '');
  const [content,    setContent]    = useState((initial?.content || []).join('\n\n'));
  const [category,   setCategory]   = useState(initial?.category   || 'Devotional');
  const [author,     setAuthor]     = useState(initial?.author     || '');
  const [authorRole, setAuthorRole] = useState(initial?.authorRole || '');
  const [image,      setImage]      = useState(initial?.image      || '');
  const [scripture,  setScripture]  = useState(initial?.scripture  || '');
  const [readTime,   setReadTime]   = useState(initial?.readTime   || '4 min');
  const [tags,       setTags]       = useState((initial?.tags || []).join(', '));
  const [featured,   setFeatured]   = useState(initial?.featured   || false);
  const [published,  setPublished]  = useState(initial?.is_published ?? true);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState('');
  const [preview,        setPreview]        = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API}/blog/upload-image`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setImage(url);
    } catch {
      setError('Image upload failed. Try pasting a URL instead.');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }

  // Auto-generate slug from title in new mode
  useEffect(() => {
    if (!slugLocked && mode === 'new') setSlug(toSlug(title));
  }, [title, slugLocked, mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) { setError('Title and slug are required.'); return; }
    setSaving(true); setError('');

    const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    const tagArr     = tags.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title, slug, excerpt, content: paragraphs,
      category, author, author_role: authorRole, image,
      scripture, read_time: readTime, tags: tagArr,
      featured, is_published: published,
    };

    try {
      const url    = mode === 'new' ? `${API}/blog/` : `${API}/blog/${initial?.id}`;
      const method = mode === 'new' ? 'POST' : 'PUT';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const saved = await res.json();
      router.push(`/blog/${saved.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  }

  const inputCls  = "w-full px-3 py-2 rounded-lg border border-[#86BBD8]/40 text-sm text-[#1e3a52] focus:outline-none focus:border-[#2A4D69] bg-white placeholder:text-gray-400";
  const labelCls  = "text-xs font-bold text-[#6B7B8E] uppercase tracking-widest mb-1.5 block";
  const sectionCls = "bg-white rounded-2xl border border-[#86BBD8]/15 p-6 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/blog" className="flex items-center gap-2 text-[#6B7B8E] hover:text-[#2A4D69] text-sm transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back to Blog
        </Link>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPreview(p => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#86BBD8]/40 text-sm text-[#2A4D69] hover:bg-[#86BBD8]/10 transition-colors">
            {preview ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#2A4D69] text-white text-sm font-semibold hover:bg-[#1e3a52] transition-colors disabled:opacity-60 shadow-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
            {saving ? 'Saving…' : mode === 'new' ? 'Publish Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#2A4D69]">
        {mode === 'new' ? 'New Blog Post' : 'Edit Post'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {preview ? (
        /* ── Preview panel ── */
        <div className="bg-white rounded-2xl border border-[#86BBD8]/15 overflow-hidden">
          {image && (
            <div className="relative h-56 overflow-hidden">
              <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            </div>
          )}
          <div className="p-8">
            <span className="text-xs font-bold text-[#86BBD8] uppercase tracking-widest">{category}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{title || '(No title)'}</h2>
            <p className="text-gray-500 mb-6 italic">{excerpt}</p>
            <div className="space-y-4 text-gray-700" style={{ fontFamily: "'Georgia',serif", lineHeight: 1.9 }}>
              {content.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit panels ── */
        <>
          {/* Core content */}
          <div className={sectionCls}>
            <div>
              <label className={labelCls}>Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required
                placeholder="e.g. Walking in Faith Through Uncertain Times"
                className={inputCls + ' text-base font-semibold'}/>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls + ' mb-0'}>Slug *</label>
                <button type="button" onClick={() => { setSlugLocked(p => !p); if (slugLocked) setSlug(toSlug(title)); }}
                  className="text-xs text-[#86BBD8] hover:text-[#2A4D69] transition-colors">
                  {slugLocked ? 'Edit slug' : 'Lock slug'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex-shrink-0">/blog/</span>
                <input value={slug} onChange={e => setSlug(e.target.value)} required readOnly={slugLocked}
                  className={inputCls + (slugLocked ? ' bg-gray-50 text-gray-400 cursor-not-allowed' : '')}
                  placeholder="post-slug-here"/>
              </div>
            </div>

            <div>
              <label className={labelCls}>Excerpt</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                placeholder="A short, compelling summary shown on the blog listing page…"
                className={inputCls + ' resize-none'}/>
            </div>
          </div>

          {/* Body content */}
          <div className={sectionCls}>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-[#6B7B8E]"/>
              <span className={labelCls + ' mb-0'}>Article Content</span>
            </div>
            <p className="text-xs text-gray-400 -mt-2">Separate paragraphs with a blank line.</p>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={18}
              placeholder={"Write your article here.\n\nStart a new paragraph by leaving a blank line between them.\n\nScripture references in parentheses like (John 3:16) become clickable Bible links automatically."}
              className={inputCls + ' resize-y font-mono text-sm leading-relaxed'}/>
            <p className="text-xs text-gray-400">
              {content.split(/\n\n+/).filter(Boolean).length} paragraph{content.split(/\n\n+/).filter(Boolean).length !== 1 ? 's' : ''}
              {' · '}{content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Meta */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Left column */}
            <div className={sectionCls}>
              <div>
                <label className={labelCls}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5"><User className="w-3.5 h-3.5 text-[#6B7B8E]"/><label className={labelCls + ' mb-0'}>Author</label></div>
                <input value={author} onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. Rev. Lirani" className={inputCls}/>
              </div>

              <div>
                <label className={labelCls}>Author Role</label>
                <input value={authorRole} onChange={e => setAuthorRole(e.target.value)}
                  placeholder="e.g. Senior Pastor" className={inputCls}/>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5"><BookOpen className="w-3.5 h-3.5 text-[#6B7B8E]"/><label className={labelCls + ' mb-0'}>Key Scripture</label></div>
                <input value={scripture} onChange={e => setScripture(e.target.value)}
                  placeholder="e.g. John 3:16" className={inputCls}/>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5"><Clock className="w-3.5 h-3.5 text-[#6B7B8E]"/><label className={labelCls + ' mb-0'}>Read Time</label></div>
                <input value={readTime} onChange={e => setReadTime(e.target.value)}
                  placeholder="e.g. 4 min" className={inputCls}/>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5"><Tag className="w-3.5 h-3.5 text-[#6B7B8E]"/><label className={labelCls + ' mb-0'}>Tags</label></div>
                <input value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="faith, prayer, healing  (comma-separated)" className={inputCls}/>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Cover image */}
              <div className={sectionCls}>
                <div className="flex items-center gap-1.5 mb-3">
                  <ImageIcon className="w-3.5 h-3.5 text-[#6B7B8E]"/>
                  <label className={labelCls + ' mb-0'}>Cover Image</label>
                </div>

                {/* Hidden file input — accepts images + camera on mobile */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  capture={undefined}
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Upload button */}
                <button type="button" disabled={uploadingImage}
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#86BBD8]/50 text-sm text-[#2A4D69] hover:bg-[#86BBD8]/10 hover:border-[#2A4D69]/40 transition-all disabled:opacity-60">
                  {uploadingImage
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading…</>
                    : <><Upload className="w-4 h-4"/> Upload photo / Take a picture</>
                  }
                </button>

                {/* Divider */}
                <div className="flex items-center gap-2 text-xs text-gray-400 my-1">
                  <div className="flex-1 h-px bg-gray-200"/>
                  or paste a URL
                  <div className="flex-1 h-px bg-gray-200"/>
                </div>

                <input value={image} onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/…" className={inputCls}/>

                {/* Preview */}
                <div className="mt-3 rounded-xl overflow-hidden h-40 relative border border-[#86BBD8]/20">
                  {image
                    ? <img src={image} alt="cover preview" className="absolute inset-0 w-full h-full object-cover"/>
                    : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                        <span className="flex flex-col items-center gap-1">
                          <ImageIcon className="w-6 h-6 opacity-30"/>
                          Image preview
                        </span>
                      </div>
                  }
                </div>
              </div>

              {/* Publish settings */}
              <div className={sectionCls}>
                <p className={labelCls}>Settings</p>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-colors ${published ? 'bg-[#2A4D69]' : 'bg-gray-300'} relative flex-shrink-0`}
                    onClick={() => setPublished(p => !p)}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${published ? 'left-5' : 'left-1'}`}/>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{published ? 'Published' : 'Draft'}</p>
                    <p className="text-xs text-gray-400">{published ? 'Visible to all visitors' : 'Only visible to admins'}</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${featured ? 'bg-amber-400' : 'bg-gray-300'} relative flex-shrink-0`}
                    onClick={() => setFeatured(p => !p)}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${featured ? 'left-5' : 'left-1'}`}/>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400"/> Featured Post
                    </p>
                    <p className="text-xs text-gray-400">Shown as the hero on the blog listing</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Submit (bottom) */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <Link href="/blog" className="text-sm text-[#6B7B8E] hover:text-[#2A4D69] transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2A4D69] text-white font-semibold text-sm hover:bg-[#1e3a52] transition-colors disabled:opacity-60 shadow">
          {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
          {saving ? 'Saving…' : mode === 'new' ? 'Publish Post' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
