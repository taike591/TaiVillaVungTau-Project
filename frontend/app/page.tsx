import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomePageContent } from "@/components/home/HomePageContent";

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

async function getAllProperties() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/properties?size=100`,
      {
        next: { revalidate: 60 }, // Cache data for 60 seconds
      }
    );
    
    if (!res.ok) {
      return MOCK_VILLAS;
    }
    
    const response = await res.json();
    
    if (response.data && response.data.content) {
      return response.data.content;
    }
    
    return MOCK_VILLAS;
  } catch {
    return MOCK_VILLAS;
  }
}

export default async function HomePage() {
  const properties = await getAllProperties();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />
      <main id="main-content">
        <HomePageContent initialData={properties || MOCK_VILLAS} />
      </main>
      <Footer />
    </div>
  );
}
