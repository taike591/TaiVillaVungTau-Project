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
  title: "Taivillavungtau",
  description: "Hệ thống cho thuê villa và homestay cao cấp tại Vũng Tàu. Tìm kiếm và đặt villa cho kỳ nghỉ của bạn.",
  keywords: "villa vũng tàu, cho thuê villa, homestay vũng tàu, nhà nghỉ vũng tàu",
  authors: [{ name: "Taivillavungtau" }],
  openGraph: {
    title: "Taivillavungtau",
    description: "Hệ thống cho thuê villa và homestay cao cấp tại Vũng Tàu",
    type: "website",
    locale: "vi_VN",
  },
  icons: {
    icon: '/favicon.ico',
  },
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
