import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function OptimizedImage({ src, alt, className, width, height }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageOff className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            "h-full w-full object-cover" // Default behavior, overridden by className
          )}
        />
      )}
    </div>
  );
}
