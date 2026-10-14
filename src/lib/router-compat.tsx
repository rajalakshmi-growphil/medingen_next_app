"use client";
import React from 'react';
import LinkNext from 'next/link';
import { useRouter, usePathname, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation';

interface NavStateEntry {
  pathname: string;
  state: any;
}

let navStateMemory: NavStateEntry | null = null;
let cachedStateString: string | null = null;
let cachedStateObject: NavStateEntry | null = null;

const cleanPath = (p: string) => {
  if (!p) return '/';
  const withoutQuery = p.split('?')[0].split('#')[0];
  try {
    return decodeURIComponent(withoutQuery).replace(/\/+$/, '') || '/';
  } catch (_) {
    return withoutQuery.replace(/\/+$/, '') || '/';
  }
};

const getStoredState = (currentPathname: string) => {
  const normCurrent = cleanPath(currentPathname);

  if (navStateMemory !== null && navStateMemory !== undefined) {
    if (navStateMemory.pathname) {
      const normStored = cleanPath(navStateMemory.pathname);
      if (normStored === normCurrent) {
        return navStateMemory.state;
      }
      return null;
    }
    return (navStateMemory as any).state ?? navStateMemory;
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('__router_compat_state');
      if (saved) {
        if (saved !== cachedStateString) {
          cachedStateString = saved;
          try {
            cachedStateObject = JSON.parse(saved);
          } catch (_) {
            cachedStateObject = null;
          }
        }
        if (cachedStateObject && cachedStateObject.pathname) {
          const normSaved = cleanPath(cachedStateObject.pathname);
          if (normSaved === normCurrent) {
            return cachedStateObject.state;
          } else {
            sessionStorage.removeItem('__router_compat_state');
            cachedStateString = null;
            cachedStateObject = null;
            return null;
          }
        }
      }
    } catch (e) {}
  }
  return null;
};

export const useNavigate = () => {
  const router = useRouter();
  return React.useCallback(
    (to: string | number, options?: { replace?: boolean; state?: any }) => {
      if (typeof to === 'number') {
        if (to === -1) router.back();
        return;
      }

      const targetPath = typeof to === 'string' ? to.split('?')[0].split('#')[0] : '';

      if (options && options.state !== undefined) {
        const entry: NavStateEntry = { pathname: targetPath, state: options.state };
        navStateMemory = entry;
        cachedStateString = null;
        cachedStateObject = null;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('__router_compat_state', JSON.stringify(entry));
          } catch (e) {}
        }
      } else {
        navStateMemory = null;
        cachedStateString = null;
        cachedStateObject = null;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('__router_compat_state');
          } catch (e) {}
        }
      }

      if (options && options.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );
};

export const useLocation = () => {
  const pathname = usePathname() || '/';
  let search = '';
  try {
    const params = useNextSearchParams();
    search = params?.toString() ? `?${params.toString()}` : '';
  } catch (e) {
    if (typeof window !== 'undefined') {
      search = window.location.search || '';
    }
  }
  const state = getStoredState(pathname);

  return React.useMemo(
    () => ({
      pathname,
      search,
      hash: '',
      state: state || null,
    }),
    [pathname, search, state]
  );
};

export const useSearchParams = (): [URLSearchParams, (params: unknown) => void] => {
  try {
    const params = useNextSearchParams();
    return [params as unknown as URLSearchParams, () => {}];
  } catch (e) {
    return [new URLSearchParams(), () => {}];
  }
};

export const useParams = <T extends Record<string, string | string[]> = Record<string, string>>(): T => {
  const params = useNextParams();
  return (params || {}) as T;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  state?: any;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, href, state, onClick, children, ...props }, ref) => {
  const target = to || href || '#';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof target === 'string' && !target.startsWith('#')) {
      const targetPath = target.split('?')[0].split('#')[0];
      if (state !== undefined) {
        const entry: NavStateEntry = { pathname: targetPath, state };
        navStateMemory = entry;
        cachedStateString = null;
        cachedStateObject = null;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('__router_compat_state', JSON.stringify(entry));
          } catch (_) {}
        }
      } else {
        navStateMemory = null;
        cachedStateString = null;
        cachedStateObject = null;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('__router_compat_state');
          } catch (_) {}
        }
      }
    }
    if (onClick) onClick(e);
  };

  return (
    <LinkNext ref={ref} href={target} onClick={handleClick} {...props}>
      {children}
    </LinkNext>
  );
});
Link.displayName = 'Link';

export const Routes: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Route: React.FC<Record<string, unknown>> = () => null;
export const BrowserRouter: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Router: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
