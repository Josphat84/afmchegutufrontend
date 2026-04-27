import Link from 'next/link';

interface Props {
  reference: string;
  className?: string;
  children?: React.ReactNode;
}

export function ScriptureLink({ reference, className, children }: Props) {
  return (
    <Link
      href={`/bible?ref=${encodeURIComponent(reference)}`}
      className={`inline font-medium underline decoration-dotted underline-offset-2 transition-colors text-[#2A4D69] decoration-[#86BBD8] hover:text-[#78C0A6] hover:decoration-[#78C0A6] ${className ?? ''}`}
    >
      {children ?? reference}
    </Link>
  );
}
