import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={`flex items-center justify-center shrink-0 ${className}`}>
        <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center">
           <img
            src="/logo.png"
            alt="GovTrack360 Icon"
            className="object-cover object-top scale-[1.3] w-full h-full"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="GovTrack360"
        className={`object-contain ${variant === 'compact' ? 'h-8' : 'h-[50px]'} w-auto`}
      />
    </Link>
  );
}
