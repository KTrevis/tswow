import type { ImgHTMLAttributes } from 'react';
import { iconUrl } from '../lib/model';
import { cn } from '../lib/utils';

export function SpellIcon({ icon, className, alt = '', ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { icon: string }) {
  return (
    <img
      {...props}
      src={iconUrl(icon)}
      alt={alt}
      className={cn('spell-icon', className)}
      loading="lazy"
      decoding="async"
      onError={event => {
        if (!event.currentTarget.src.endsWith('/spell-icons/fallback.svg')) {
          event.currentTarget.src = '/spell-icons/fallback.svg';
        }
      }}
    />
  );
}
