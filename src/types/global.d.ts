declare module 'react-router-dom' {
  export const useNavigate: () => (to: string | number, options?: { replace?: boolean; state?: any }) => void;
  export const useLocation: () => { pathname: string; search: string; hash: string; state: any };
  export const useParams: <T extends Record<string, string | string[]> = Record<string, string>>() => T;
  export const useSearchParams: () => [URLSearchParams, (params: any) => void];
  export const Link: any;
  export const Routes: any;
  export const Route: any;
  export const BrowserRouter: any;
  export const Router: any;
}

declare module 'react-helmet' {
  export const Helmet: any;
  export const HelmetProvider: any;
}

declare module 'react-helmet-async' {
  export const Helmet: any;
  export const HelmetProvider: any;
}

interface Window {
  dataLayer?: any[];
  fbq?: any;
  heap?: any;
  heapReadyCb?: any[];
  __PRERENDER__?: boolean;
  __thirdPartyLoaded?: boolean;
  __INITIAL_PRODUCT__?: any;
  __CURRENT_PRODUCT_CATEGORY__?: any;
  __CURRENT_PRODUCT_MAIN_CATEGORY__?: any;
  __CURRENT_PRODUCT_SUB_CATEGORY__?: any;
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}
