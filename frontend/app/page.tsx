import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomePageContent } from "@/components/home/HomePageContent";

export const metadata: Metadata = {
  title: "Taivillavungtau - Villa & Homestay Cao Cấp Vũng Tàu",
  description: "Hệ thống cho thuê villa và homestay cao cấp tại Vũng Tàu. Tìm kiếm và đặt villa cho kỳ nghỉ hoàn hảo của bạn với hơn 100+ villa view biển đẹp nhất.",
  keywords: "villa vũng tàu, cho thuê villa, homestay vũng tàu, nhà nghỉ vũng tàu, villa view biển",
  openGraph: {
    title: "Taivillavungtau - Villa & Homestay Cao Cấp Vũng Tàu",
    description: "Hệ thống cho thuê villa và homestay cao cấp tại Vũng Tàu",
    type: "website",
    locale: "vi_VN",
  },
};


// Mock data for demo/fallback
const MOCK_VILLAS = [
  {
    id: 1,
    code: "VT001",
    name: "Ocean View Villa",
    description: "Luxury beachfront villa with stunning ocean views, private pool, and direct beach access. Perfect for families and groups.",
    area: "Vũng Tàu",
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80"],
    priceWeekday: 5000000,
    priceWeekend: 7000000,
    bedroomCount: 4,
    bathroomCount: 3,
    standardGuests: 8,
    maxGuests: 10,
    location: 'BAI_TRUOC'
  },
  {
    id: 2,
    code: "VT002",
    name: "Mountain Paradise",
    description: "Peaceful mountain retreat with panoramic views, modern amenities, and infinity pool. Experience tranquility.",
    area: "Hồ Tràm",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"],
    priceWeekday: 4500000,
    priceWeekend: 6500000,
    bedroomCount: 3,
    bathroomCount: 2,
    standardGuests: 6,
    maxGuests: 8,
    location: 'LONG_CUNG'
  },
  {
    id: 3,
    code: "VT003",
    name: "Sunset Beach Villa",
    description: "Watch breathtaking sunsets from this exclusive beachfront property. Features jacuzzi and private chef service.",
    area: "Long Hải",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80"],
    priceWeekday: 6000000,
    priceWeekend: 8500000,
    bedroomCount: 5,
    bathroomCount: 4,
    standardGuests: 10,
    maxGuests: 12,
    location: 'BAI_SAU'
  },
  {
    id: 4,
    code: "VT004",
    name: "Garden Paradise",
    description: "Tropical garden villa with lush greenery, koi pond, and outdoor entertainment area. Ideal for nature lovers.",
    area: "Bình Châu",
    images: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&q=80"],
    priceWeekday: 7000000,
    priceWeekend: 10000000,
    bedroomCount: 6,
    bathroomCount: 5,
    standardGuests: 12,
    maxGuests: 15,
    location: 'TRUNG_TAM'
  },
];

export const dynamic = 'force-dynamic'; // Force fetch at request time, not build time

async function getAllProperties() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  console.log('Fetching properties from:', apiUrl);

  try {
    // Auto-scaling fetch: get first page with max size
    const maxSize = 500; // Backend limit updated to 500
    
    const firstRes = await fetch(
      `${apiUrl}/api/v1/properties?size=${maxSize}&page=0`,
      { cache: 'no-store' } // Ensure fresh data
    );
    
    if (!firstRes.ok) {
      console.error('Failed to fetch properties:', firstRes.status, firstRes.statusText);
      const text = await firstRes.text();
      console.error('Error body:', text);
      return MOCK_VILLAS;
    }
    
    const firstResponse = await firstRes.json();
    if (!firstResponse.data?.content) return MOCK_VILLAS;
    
    const allProperties = [...firstResponse.data.content];
    const totalPages = firstResponse.data.totalPages || 1;
    
    // Fetch remaining pages in parallel if needed
    if (totalPages > 1) {
      const remainingPromises = [];
      for (let page = 1; page < totalPages; page++) {
        remainingPromises.push(
          fetch(
            `${apiUrl}/api/v1/properties?size=${maxSize}&page=${page}`,
            { cache: 'no-store' }
          ).then(res => res.ok ? res.json() : null)
        );
      }
      
      try {
        const responses = await Promise.all(remainingPromises);
        responses.forEach(res => {
          if (res?.data?.content) {
            allProperties.push(...res.data.content);
          }
        });
      } catch (err) {
        console.error('Error fetching remaining pages:', err);
        // Continue with what we have
      }
    }
    
    return allProperties;
  } catch (error) {
    console.error('Error checking properties:', error);
    return MOCK_VILLAS;
  }
}

export default async function HomePage() {
  const properties = await getAllProperties();

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Navbar transparent />
      <main id="main-content">
        <HomePageContent initialData={properties || MOCK_VILLAS} />
      </main>
      <Footer />
    </div>
  );
}
