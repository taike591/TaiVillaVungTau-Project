import type { Metadata } from "next";
import { Lora, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { FloatingContact } from "@/components/floating-contact";
import { WishlistFloatingButton } from "@/components/wishlist";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

// Premium Typography - Coastal Design System
const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taivillavungtau.vn'),
  title: {
    default: "Taivillavungtau - Cho thuê Villa & Homestay Vũng Tàu",
    template: "%s | Taivillavungtau.vn",
  },
  description: "Hệ thống cho thuê villa và homestay cao cấp tại Vũng Tàu. Hàng trăm mẫu villa, homestay, căn hộ với đầy đủ tiện nghi. Đảm bảo giống 100% ảnh. Karaoke, hồ bơi, BBQ.",
  keywords: [
    "villa vũng tàu",
    "cho thuê villa vũng tàu", 
    "homestay vũng tàu",
    "nhà nghỉ vũng tàu",
    "taivillavungtau",
    "thuê villa biển",
    "villa có hồ bơi vũng tàu",
    "villa karaoke vũng tàu",
    "căn hộ vũng tàu",
    "du lịch vũng tàu"
  ],
  authors: [{ name: "Taivillavungtau.vn" }],
  creator: "Taivillavungtau",
  publisher: "Taivillavungtau",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Taivillavungtau - Cho thuê Villa & Homestay Vũng Tàu",
    description: "Hàng trăm mẫu villa, homestay cao cấp tại Vũng Tàu. Đảm bảo giống 100% ảnh.",
    url: "https://taivillavungtau.vn",
    siteName: "Taivillavungtau.vn",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "Taivillavungtau Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taivillavungtau - Cho thuê Villa Vũng Tàu",
    description: "Hàng trăm mẫu villa, homestay cao cấp tại Vũng Tàu",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.jpg',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/logo.jpg',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${lora.variable} ${inter.variable} ${dmSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Toaster />
            <FloatingContact />
            <WishlistFloatingButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
