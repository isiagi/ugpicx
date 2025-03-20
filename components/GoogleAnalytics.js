"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_TRACKING_ID = "G-1192MWBT89"; // Replace with your GA4 ID

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", GA_TRACKING_ID, { page_path: pathname });
    }
  }, [pathname]);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
          `,
        }}
      />
    </>
  );
}
