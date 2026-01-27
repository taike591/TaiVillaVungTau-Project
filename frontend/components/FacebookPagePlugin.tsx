'use client';

import { useEffect, useState, useRef } from 'react';

interface FacebookPagePluginProps {
  pageUrl: string;
  width?: number;
  height?: number;
  showCover?: boolean;
  showFacepile?: boolean;
  smallHeader?: boolean;
  adaptContainerWidth?: boolean;
  tabs?: string; // 'timeline' | 'events' | 'messages'
}

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export function FacebookPagePlugin({
  pageUrl,
  width = 340,
  height = 130,
  showCover = false,
  showFacepile = true,
  smallHeader = true,
  adaptContainerWidth = true,
  tabs = '',
}: FacebookPagePluginProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load when within 200px of viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    // Load Facebook SDK
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    } 
    
    // Re-parse whenever props change
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [shouldLoad, pageUrl, width, height, showCover, showFacepile, smallHeader, tabs]);

  return (
    <div 
      ref={containerRef}
      className="facebook-page-plugin overflow-hidden rounded-xl bg-white" 
      style={{ minHeight: height, minWidth: width }}
    >
      {shouldLoad ? (
        <>
          {/* Facebook SDK root element */}
          <div id="fb-root"></div>
          
          {/* Page Plugin */}
          <div
            className="fb-page"
            data-href={pageUrl}
            data-width={width}
            data-height={height}
            data-small-header={smallHeader}
            data-adapt-container-width={adaptContainerWidth}
            data-hide-cover={!showCover}
            data-show-facepile={showFacepile}
            data-tabs={tabs}
            style={{ minHeight: height, minWidth: width }}
          >
            <blockquote
              cite={pageUrl}
              className="fb-xfbml-parse-ignore"
            >
              <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                Taivillavungtau - Villa & Homestay Vũng Tàu
              </a>
            </blockquote>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
          Loading Facebook...
        </div>
      )}
    </div>
  );
}
