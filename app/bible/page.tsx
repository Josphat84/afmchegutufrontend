'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BookOpen, Search, ChevronLeft, ChevronRight, Copy,
  Pen, BookMarked, X, Minus, Plus, Loader2, CheckCircle,
  ChevronDown, Bookmark,
} from 'lucide-react';
import { Header } from '@/components/Header';

interface UserData { id: number; email: string; name: string; role: string; }
interface Verse { book_id: string; book_name: string; chapter: number; verse: number; text: string; }
interface ChapterData { reference: string; verses: Verse[]; translation_name: string; }
interface SavedBookmark { ref: string; text: string; bookId: number; chapter: number; verse: number; }

const KJV_BOOKS = [
  { id:1,  name:'Genesis',         abbr:'Gen', chapters:50,  t:'OT' },
  { id:2,  name:'Exodus',          abbr:'Exo', chapters:40,  t:'OT' },
  { id:3,  name:'Leviticus',       abbr:'Lev', chapters:27,  t:'OT' },
  { id:4,  name:'Numbers',         abbr:'Num', chapters:36,  t:'OT' },
  { id:5,  name:'Deuteronomy',     abbr:'Deu', chapters:34,  t:'OT' },
  { id:6,  name:'Joshua',          abbr:'Jos', chapters:24,  t:'OT' },
  { id:7,  name:'Judges',          abbr:'Jdg', chapters:21,  t:'OT' },
  { id:8,  name:'Ruth',            abbr:'Rut', chapters:4,   t:'OT' },
  { id:9,  name:'1 Samuel',        abbr:'1Sa', chapters:31,  t:'OT' },
  { id:10, name:'2 Samuel',        abbr:'2Sa', chapters:24,  t:'OT' },
  { id:11, name:'1 Kings',         abbr:'1Ki', chapters:22,  t:'OT' },
  { id:12, name:'2 Kings',         abbr:'2Ki', chapters:25,  t:'OT' },
  { id:13, name:'1 Chronicles',    abbr:'1Ch', chapters:29,  t:'OT' },
  { id:14, name:'2 Chronicles',    abbr:'2Ch', chapters:36,  t:'OT' },
  { id:15, name:'Ezra',            abbr:'Ezr', chapters:10,  t:'OT' },
  { id:16, name:'Nehemiah',        abbr:'Neh', chapters:13,  t:'OT' },
  { id:17, name:'Esther',          abbr:'Est', chapters:10,  t:'OT' },
  { id:18, name:'Job',             abbr:'Job', chapters:42,  t:'OT' },
  { id:19, name:'Psalms',          abbr:'Psa', chapters:150, t:'OT' },
  { id:20, name:'Proverbs',        abbr:'Pro', chapters:31,  t:'OT' },
  { id:21, name:'Ecclesiastes',    abbr:'Ecc', chapters:12,  t:'OT' },
  { id:22, name:'Song of Solomon', abbr:'Son', chapters:8,   t:'OT' },
  { id:23, name:'Isaiah',          abbr:'Isa', chapters:66,  t:'OT' },
  { id:24, name:'Jeremiah',        abbr:'Jer', chapters:52,  t:'OT' },
  { id:25, name:'Lamentations',    abbr:'Lam', chapters:5,   t:'OT' },
  { id:26, name:'Ezekiel',         abbr:'Eze', chapters:48,  t:'OT' },
  { id:27, name:'Daniel',          abbr:'Dan', chapters:12,  t:'OT' },
  { id:28, name:'Hosea',           abbr:'Hos', chapters:14,  t:'OT' },
  { id:29, name:'Joel',            abbr:'Joe', chapters:3,   t:'OT' },
  { id:30, name:'Amos',            abbr:'Amo', chapters:9,   t:'OT' },
  { id:31, name:'Obadiah',         abbr:'Oba', chapters:1,   t:'OT' },
  { id:32, name:'Jonah',           abbr:'Jon', chapters:4,   t:'OT' },
  { id:33, name:'Micah',           abbr:'Mic', chapters:7,   t:'OT' },
  { id:34, name:'Nahum',           abbr:'Nah', chapters:3,   t:'OT' },
  { id:35, name:'Habakkuk',        abbr:'Hab', chapters:3,   t:'OT' },
  { id:36, name:'Zephaniah',       abbr:'Zep', chapters:3,   t:'OT' },
  { id:37, name:'Haggai',          abbr:'Hag', chapters:2,   t:'OT' },
  { id:38, name:'Zechariah',       abbr:'Zec', chapters:14,  t:'OT' },
  { id:39, name:'Malachi',         abbr:'Mal', chapters:4,   t:'OT' },
  { id:40, name:'Matthew',         abbr:'Mat', chapters:28,  t:'NT' },
  { id:41, name:'Mark',            abbr:'Mar', chapters:16,  t:'NT' },
  { id:42, name:'Luke',            abbr:'Luk', chapters:24,  t:'NT' },
  { id:43, name:'John',            abbr:'Joh', chapters:21,  t:'NT' },
  { id:44, name:'Acts',            abbr:'Act', chapters:28,  t:'NT' },
  { id:45, name:'Romans',          abbr:'Rom', chapters:16,  t:'NT' },
  { id:46, name:'1 Corinthians',   abbr:'1Co', chapters:16,  t:'NT' },
  { id:47, name:'2 Corinthians',   abbr:'2Co', chapters:13,  t:'NT' },
  { id:48, name:'Galatians',       abbr:'Gal', chapters:6,   t:'NT' },
  { id:49, name:'Ephesians',       abbr:'Eph', chapters:6,   t:'NT' },
  { id:50, name:'Philippians',     abbr:'Php', chapters:4,   t:'NT' },
  { id:51, name:'Colossians',      abbr:'Col', chapters:4,   t:'NT' },
  { id:52, name:'1 Thessalonians', abbr:'1Th', chapters:5,   t:'NT' },
  { id:53, name:'2 Thessalonians', abbr:'2Th', chapters:3,   t:'NT' },
  { id:54, name:'1 Timothy',       abbr:'1Ti', chapters:6,   t:'NT' },
  { id:55, name:'2 Timothy',       abbr:'2Ti', chapters:4,   t:'NT' },
  { id:56, name:'Titus',           abbr:'Tit', chapters:3,   t:'NT' },
  { id:57, name:'Philemon',        abbr:'Phm', chapters:1,   t:'NT' },
  { id:58, name:'Hebrews',         abbr:'Heb', chapters:13,  t:'NT' },
  { id:59, name:'James',           abbr:'Jam', chapters:5,   t:'NT' },
  { id:60, name:'1 Peter',         abbr:'1Pe', chapters:5,   t:'NT' },
  { id:61, name:'2 Peter',         abbr:'2Pe', chapters:3,   t:'NT' },
  { id:62, name:'1 John',          abbr:'1Jo', chapters:5,   t:'NT' },
  { id:63, name:'2 John',          abbr:'2Jo', chapters:1,   t:'NT' },
  { id:64, name:'3 John',          abbr:'3Jo', chapters:1,   t:'NT' },
  { id:65, name:'Jude',            abbr:'Jud', chapters:1,   t:'NT' },
  { id:66, name:'Revelation',      abbr:'Rev', chapters:22,  t:'NT' },
];

type Book = typeof KJV_BOOKS[0];

function parseReference(ref: string): { book: Book; chapter: number; verse?: number } | null {
  const cleaned = ref.trim();
  const lower = cleaned.toLowerCase();
  for (const book of KJV_BOOKS) {
    const nameLower = book.name.toLowerCase();
    const abbrLower = book.abbr.toLowerCase();
    let rest = '';
    if (lower.startsWith(nameLower + ' ') || lower === nameLower) {
      rest = cleaned.slice(book.name.length).trim();
    } else if (lower.startsWith(abbrLower + ' ') || lower.startsWith(abbrLower + '.')) {
      rest = cleaned.slice(book.abbr.length).replace(/^\./, '').trim();
    } else { continue; }
    const m = rest.match(/^(\d+)(?::(\d+)(?:-\d+)?)?/);
    if (!m) continue;
    const chapter = parseInt(m[1]);
    const verse   = m[2] ? parseInt(m[2]) : undefined;
    if (chapter >= 1 && chapter <= book.chapters) return { book, chapter, verse };
  }
  return null;
}

function buildUrl(bookName: string, chapter: number): string {
  return `https://bible-api.com/${bookName.toLowerCase().replace(/\s+/g, '+')}+${chapter}?translation=kjv`;
}

type HlMap = Record<string, boolean>;
function hlKey(bookId: number, ch: number, v: number) { return `${bookId}:${ch}:${v}`; }

// ─── QUICK REFS ───────────────────────────────────────────────────────────────
const QUICK = [
  'John 3:16','Psalm 23','Romans 8:28','Philippians 4:13',
  'Jeremiah 29:11','Isaiah 40:31','Proverbs 3:5','2 Chronicles 7:14',
  'Matthew 28:19','Acts 2:4','Isaiah 53:5','Hebrews 11:1',
  'Romans 10:9','John 14:6','Psalm 46:1','Revelation 21:4',
];

// ─── MAIN APP (uses useSearchParams) ─────────────────────────────────────────
function BibleApp() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const refParam  = searchParams.get('ref')  || '';
  const bookParam = parseInt(searchParams.get('book') || '43');
  const chParam   = parseInt(searchParams.get('ch')   || '3');

  const [bookId,     setBookId]     = useState(bookParam);
  const [chapter,    setChapter]    = useState(chParam);
  const [data,       setData]       = useState<ChapterData | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [fontSize,   setFontSize]   = useState(18);
  const [hlMap,      setHlMap]      = useState<HlMap>({});
  const [bookmarks,  setBookmarks]  = useState<SavedBookmark[]>([]);
  const [showBooks,  setShowBooks]  = useState(false);
  const [showBM,     setShowBM]     = useState(false);
  const [searchQ,    setSearchQ]    = useState('');
  const [searchRes,  setSearchRes]  = useState<ChapterData | null>(null);
  const [searching,  setSearching]  = useState(false);
  const [mode,       setMode]       = useState<'read'|'search'>('read');
  const [copied,     setCopied]     = useState(false);
  const [focusVerse, setFocusVerse] = useState<number|undefined>();
  const focusRef = useRef<HTMLDivElement>(null);

  const book = KJV_BOOKS.find(b => b.id === bookId) || KJV_BOOKS[42];

  // Restore persisted prefs
  useEffect(() => {
    const hl = localStorage.getItem('afm_kjv_hl');
    const bm = localStorage.getItem('afm_kjv_bm');
    const fs = localStorage.getItem('afm_kjv_fs');
    if (hl) try { setHlMap(JSON.parse(hl)); } catch { /* ignore */ }
    if (bm) try { setBookmarks(JSON.parse(bm)); } catch { /* ignore */ }
    if (fs) setFontSize(parseInt(fs) || 18);
  }, []);

  // First load
  useEffect(() => {
    if (refParam) {
      const parsed = parseReference(refParam);
      if (parsed) {
        setBookId(parsed.book.id); setChapter(parsed.chapter); setFocusVerse(parsed.verse);
        loadChapter(parsed.book, parsed.chapter);
      } else {
        setSearchQ(refParam); runSearch(refParam); setMode('search');
      }
    } else {
      loadChapter(book, chapter);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to focused verse after data loads
  useEffect(() => {
    if (focusRef.current && focusVerse && data) {
      setTimeout(() => focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
  }, [data, focusVerse]);

  async function loadChapter(b: Book, ch: number) {
    setLoading(true); setError(''); setData(null); setMode('read');
    try {
      const res  = await fetch(buildUrl(b.name, ch));
      if (!res.ok) throw new Error('not found');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch { setError(`Could not load ${b.name} ${ch}. Please try again.`); }
    finally   { setLoading(false); }
  }

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setSearching(true); setSearchRes(null);
    try {
      const enc = q.trim().toLowerCase().replace(/\s+/g, '+');
      const res = await fetch(`https://bible-api.com/${enc}?translation=kjv`);
      if (!res.ok) throw new Error('not found');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSearchRes(json);
    } catch { setSearchRes(null); }
    finally   { setSearching(false); }
  }

  function navigate(b: Book, ch: number, focV?: number) {
    setBookId(b.id); setChapter(ch); setFocusVerse(focV);
    router.push(`/bible?book=${b.id}&ch=${ch}`, { scroll: false });
    loadChapter(b, ch);
  }

  function prevChapter() {
    if (chapter > 1) navigate(book, chapter - 1);
    else { const p = KJV_BOOKS.find(b => b.id === bookId - 1); if (p) navigate(p, p.chapters); }
  }
  function nextChapter() {
    if (chapter < book.chapters) navigate(book, chapter + 1);
    else { const n = KJV_BOOKS.find(b => b.id === bookId + 1); if (n) navigate(n, 1); }
  }

  function toggleHL(verse: number) {
    const k = hlKey(bookId, chapter, verse);
    const u = { ...hlMap, [k]: !hlMap[k] };
    if (!u[k]) delete u[k];
    setHlMap(u); localStorage.setItem('afm_kjv_hl', JSON.stringify(u));
  }
  function isHL(verse: number) { return !!hlMap[hlKey(bookId, chapter, verse)]; }

  function toggleBM(v: Verse) {
    const ref = `${book.name} ${chapter}:${v.verse}`;
    const idx = bookmarks.findIndex(b => b.ref === ref);
    const updated = idx >= 0
      ? bookmarks.filter((_, i) => i !== idx)
      : [{ ref, text: v.text.trim(), bookId, chapter, verse: v.verse }, ...bookmarks];
    setBookmarks(updated); localStorage.setItem('afm_kjv_bm', JSON.stringify(updated));
  }
  function isBM(verse: number) { return bookmarks.some(b => b.ref === `${book.name} ${chapter}:${verse}`); }

  async function copyChapter() {
    if (!data) return;
    const t = data.verses.map(v => `${v.verse} ${v.text.trim()}`).join('\n');
    await navigator.clipboard.writeText(`${data.reference} (KJV)\n\n${t}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function changeFontSize(d: number) {
    const n = Math.max(14, Math.min(28, fontSize + d));
    setFontSize(n); localStorage.setItem('afm_kjv_fs', String(n));
  }

  const otBooks = KJV_BOOKS.filter(b => b.t === 'OT');
  const ntBooks = KJV_BOOKS.filter(b => b.t === 'NT');

  return (
    <div className="flex flex-col bg-[#f8f5ef]" style={{ minHeight: 'calc(100vh - 72px)' }}>

      {/* ── TOP NAV ── */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-[#86BBD8]/30 shadow-sm">
        <div className="container mx-auto px-3 py-2 flex items-center gap-2 flex-wrap">
          {/* Book button */}
          <button onClick={() => setShowBooks(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A4D69] text-white text-sm font-semibold hover:bg-[#1e3a52] transition-colors flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5"/> {book.name} <ChevronDown className="w-3 h-3 opacity-70"/>
          </button>

          {/* Chapter */}
          <select value={chapter} onChange={e => navigate(book, parseInt(e.target.value))}
            className="px-2 py-1.5 rounded-lg border border-[#86BBD8]/40 text-sm font-medium text-[#2A4D69] bg-white focus:outline-none focus:border-[#2A4D69] cursor-pointer flex-shrink-0">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map(n =>
              <option key={n} value={n}>Ch {n}</option>
            )}
          </select>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); runSearch(searchQ); setMode('search'); }}
            className="flex gap-1.5 flex-1 min-w-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7B8E]"/>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder='Search… "Psalm 91:1", "Romans 8:28"'
                className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#86BBD8]/40 text-sm text-[#1e3a52] placeholder:text-gray-400 focus:outline-none focus:border-[#2A4D69] bg-white"/>
            </div>
            <button type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#86BBD8]/20 text-[#2A4D69] text-sm font-medium hover:bg-[#86BBD8]/40 transition-colors border border-[#86BBD8]/30 flex-shrink-0">
              Go
            </button>
          </form>

          {/* Bookmarks toggle */}
          <button onClick={() => setShowBM(p => !p)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${showBM ? 'bg-[#2A4D69] text-white' : 'text-[#2A4D69] hover:bg-[#86BBD8]/20'}`}>
            <BookMarked className="w-4 h-4"/>
          </button>

          {mode === 'search' && (
            <button onClick={() => { setMode('read'); setSearchRes(null); }}
              className="text-xs text-[#6B7B8E] hover:text-[#2A4D69] flex items-center gap-1 flex-shrink-0">
              <X className="w-3 h-3"/> Back
            </button>
          )}
        </div>

        {/* Quick refs strip */}
        {mode === 'read' && (
          <div className="border-t border-[#86BBD8]/15 px-3 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK.map(r => (
              <button key={r} onClick={() => { setSearchQ(r); runSearch(r); setMode('search'); }}
                className="text-xs px-2.5 py-1 rounded-full bg-[#86BBD8]/15 text-[#2A4D69] hover:bg-[#2A4D69] hover:text-white transition-all border border-[#86BBD8]/25 whitespace-nowrap font-medium flex-shrink-0">
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── BOOK PICKER ── */}
      {showBooks && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBooks(false)}/>
          <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-[#2A4D69] text-lg flex items-center gap-2"><BookOpen className="w-5 h-5"/> Books of the Bible</h2>
              <button onClick={() => setShowBooks(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500"/></button>
            </div>
            <div className="p-4 space-y-5">
              <div>
                <p className="text-xs font-bold text-[#6B7B8E] uppercase tracking-widest mb-2.5 px-1">Old Testament</p>
                <div className="grid grid-cols-3 gap-1">
                  {otBooks.map(b => (
                    <button key={b.id} onClick={() => { navigate(b, 1); setShowBooks(false); }}
                      className={`px-2 py-2 text-xs rounded-lg text-left font-medium transition-all leading-tight ${b.id === bookId ? 'bg-[#2A4D69] text-white' : 'bg-gray-50 text-[#2A4D69] hover:bg-[#86BBD8]/25'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B7B8E] uppercase tracking-widest mb-2.5 px-1">New Testament</p>
                <div className="grid grid-cols-3 gap-1">
                  {ntBooks.map(b => (
                    <button key={b.id} onClick={() => { navigate(b, 1); setShowBooks(false); }}
                      className={`px-2 py-2 text-xs rounded-lg text-left font-medium transition-all leading-tight ${b.id === bookId ? 'bg-[#2A4D69] text-white' : 'bg-gray-50 text-[#2A4D69] hover:bg-[#86BBD8]/25'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKMARKS PANEL ── */}
      {showBM && (
        <div className="container mx-auto px-4 pt-3 max-w-3xl">
          <div className="bg-white rounded-xl border border-[#86BBD8]/20 shadow-lg p-5 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#2A4D69] flex items-center gap-2 text-sm">
                <BookMarked className="w-4 h-4"/> Bookmarks ({bookmarks.length})
              </h3>
              {bookmarks.length > 0 && (
                <button onClick={() => { setBookmarks([]); localStorage.removeItem('afm_kjv_bm'); }}
                  className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
              )}
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">
                Hover a verse and click <Bookmark className="inline w-3 h-3"/> to bookmark it.
              </p>
            ) : (
              <div className="space-y-1.5">
                {bookmarks.map((bm, i) => {
                  const parsed = parseReference(bm.ref);
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#86BBD8]/10 hover:bg-[#86BBD8]/20 transition cursor-pointer"
                      onClick={() => { if (parsed) navigate(parsed.book, parsed.chapter, parsed.verse); setShowBM(false); }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#2A4D69]">{bm.ref}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 italic">{bm.text}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); const n = bookmarks.filter((_, j) => j !== i); setBookmarks(n); localStorage.setItem('afm_kjv_bm', JSON.stringify(n)); }}
                        className="text-gray-300 hover:text-red-500 transition flex-shrink-0 mt-0.5"><X className="w-3.5 h-3.5"/></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-3xl">

        {/* Search mode */}
        {mode === 'search' && (
          <div>
            {searching && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#2A4D69] animate-spin"/></div>}
            {!searching && !searchRes && (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-25"/>
                <p className="text-sm">No results found. Try "John 3:16" or "Psalm 23".</p>
              </div>
            )}
            {searchRes && !searching && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#86BBD8]/15 overflow-hidden">
                <div className="bg-[#2A4D69] px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-white font-bold text-lg">{searchRes.reference}</h2>
                    <p className="text-[#86BBD8] text-xs">{searchRes.translation_name}</p>
                  </div>
                  <button onClick={() => {
                    const p = parseReference(searchRes.reference);
                    if (p) navigate(p.book, p.chapter, p.verse);
                  }} className="text-xs text-[#86BBD8] hover:text-white transition underline whitespace-nowrap">
                    Open full chapter →
                  </button>
                </div>
                <div className="p-6 md:p-8 select-text" style={{ fontSize: `${fontSize}px`, lineHeight: 1.95, fontFamily: "'Georgia','Times New Roman',serif" }}>
                  {searchRes.verses.map(v => (
                    <p key={v.verse} className="mb-3">
                      <sup className="text-[#86BBD8] font-bold text-xs mr-1.5 select-none">{v.verse}</sup>
                      {v.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Read mode */}
        {mode === 'read' && (
          <div>
            {loading && <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#2A4D69] animate-spin"/></div>}
            {error && !loading && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}
            {data && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#86BBD8]/15 overflow-hidden">
                {/* Chapter header */}
                <div className="bg-gradient-to-r from-[#2A4D69] to-[#3d6b8a] px-6 py-5">
                  <p className="text-[#86BBD8] text-xs font-bold uppercase tracking-widest mb-0.5">
                    {book.t === 'OT' ? 'Old Testament' : 'New Testament'}
                  </p>
                  <h1 className="text-white text-2xl font-bold leading-tight">{book.name}</h1>
                  <p className="text-[#c8dff0] text-sm mt-0.5">Chapter {chapter} of {book.chapters} · King James Version</p>
                </div>

                {/* Verses */}
                <div className="p-6 md:p-8 select-text" style={{ fontSize: `${fontSize}px`, lineHeight: 1.95, fontFamily: "'Georgia','Times New Roman',serif" }}>
                  {data.verses.map(v => {
                    const hl      = isHL(v.verse);
                    const bm      = isBM(v.verse);
                    const isFocus = v.verse === focusVerse;
                    return (
                      <div key={v.verse}
                        ref={isFocus ? focusRef : undefined}
                        className={`group relative flex gap-2 rounded-lg px-2 py-0.5 -mx-2 transition-colors ${hl ? 'bg-yellow-100' : isFocus ? 'bg-[#86BBD8]/20 ring-1 ring-[#86BBD8]/40' : 'hover:bg-gray-50'}`}>
                        <sup className="text-[#86BBD8] font-bold select-none flex-shrink-0 w-6 text-right mt-[0.55em]" style={{ fontSize: '0.6em' }}>{v.verse}</sup>
                        <span className={`flex-1 ${hl ? 'text-[#1e3a52]' : 'text-gray-800'}`}>{v.text}</span>
                        {/* Per-verse actions */}
                        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 bg-white/90 rounded-md shadow-sm border border-gray-100 p-0.5">
                          <button onClick={() => toggleHL(v.verse)} title="Highlight"
                            className={`p-1 rounded transition ${hl ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'}`}>
                            <Pen className="w-3 h-3"/>
                          </button>
                          <button onClick={() => toggleBM(v)} title="Bookmark"
                            className={`p-1 rounded transition ${bm ? 'text-[#2A4D69]' : 'text-gray-400 hover:text-[#2A4D69]'}`}>
                            <Bookmark className="w-3 h-3"/>
                          </button>
                          <button onClick={() => navigator.clipboard.writeText(`${book.name} ${chapter}:${v.verse} — ${v.text.trim()} (KJV)`)}
                            title="Copy verse" className="p-1 rounded text-gray-400 hover:text-[#2A4D69] transition">
                            <Copy className="w-3 h-3"/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chapter nav inside card */}
                <div className="border-t border-[#86BBD8]/15 px-6 py-4 flex items-center justify-between text-sm">
                  <button onClick={prevChapter} disabled={bookId === 1 && chapter === 1}
                    className="flex items-center gap-1 text-[#2A4D69] hover:text-[#1e3a52] disabled:opacity-30 disabled:cursor-not-allowed font-medium">
                    <ChevronLeft className="w-4 h-4"/> Previous
                  </button>
                  <span className="text-xs text-gray-400">{book.abbr} {chapter}/{book.chapters}</span>
                  <button onClick={nextChapter} disabled={bookId === 66 && chapter === 22}
                    className="flex items-center gap-1 text-[#2A4D69] hover:text-[#1e3a52] disabled:opacity-30 disabled:cursor-not-allowed font-medium">
                    Next <ChevronRight className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM TOOLBAR ── */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-[#86BBD8]/20 shadow-lg">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4 max-w-3xl">
          {/* Font size */}
          <div className="flex items-center gap-1">
            <button onClick={() => changeFontSize(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-[#6B7B8E] transition"><Minus className="w-3.5 h-3.5"/></button>
            <span className="text-xs text-[#6B7B8E] w-8 text-center font-mono">{fontSize}px</span>
            <button onClick={() => changeFontSize(1)} className="p-2 rounded-lg hover:bg-gray-100 text-[#6B7B8E] transition"><Plus className="w-3.5 h-3.5"/></button>
          </div>

          {/* Chapter nav */}
          <div className="flex items-center gap-2">
            <button onClick={prevChapter} disabled={bookId === 1 && chapter === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#86BBD8]/15 text-[#2A4D69] text-sm font-medium hover:bg-[#86BBD8]/30 transition disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4"/> Prev
            </button>
            <button onClick={nextChapter} disabled={bookId === 66 && chapter === 22}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2A4D69] text-white text-sm font-medium hover:bg-[#1e3a52] transition disabled:opacity-30 disabled:cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4"/>
            </button>
          </div>

          {/* Copy chapter */}
          <button onClick={copyChapter} className="p-2 rounded-lg hover:bg-gray-100 text-[#6B7B8E] transition" title="Copy full chapter">
            {copied ? <CheckCircle className="w-4 h-4 text-[#78C0A6]"/> : <Copy className="w-4 h-4"/>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE SHELL ──────────────────────────────────────────────────────────────
export default function BiblePage() {
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
      <Suspense fallback={
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)', background: '#f8f5ef' }}>
          <Loader2 className="w-8 h-8 text-[#2A4D69] animate-spin"/>
        </div>
      }>
        <BibleApp/>
      </Suspense>
    </>
  );
}
