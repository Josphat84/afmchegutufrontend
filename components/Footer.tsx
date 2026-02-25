//Footer
//app/components/footer.tsx

import Link from 'next/link';
import { Church, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-purple-200/30 bg-purple-900/60 backdrop-blur-xl mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/90 to-blue-500/90 shadow-lg">
              <Church className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg">AFM Chegutu Town Assembly</span>
              
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-purple-100 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-purple-100 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/support" className="text-purple-100 hover:text-white transition-colors duration-300">
              Support
            </Link>
            <Link href="/contact" className="text-purple-100 hover:text-white transition-colors duration-300">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-purple-100 hover:text-white hover:bg-white/10">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-100 hover:text-white hover:bg-white/10">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-100 hover:text-white hover:bg-white/10">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-purple-200">
            © {new Date().getFullYear()} AFM in Zimbabwe. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}