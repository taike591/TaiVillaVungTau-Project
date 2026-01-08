import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";

// Server-side data fetching for better LCP
async function getProperty(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/properties/${id}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Loading skeleton component
function PropertySkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          {/* Skeleton for breadcrumb */}
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mb-4" />
          {/* Skeleton for title */}
          <div className="h-10 w-96 bg-slate-200 rounded animate-pulse mb-6" />
          {/* Skeleton for gallery */}
          <div className="grid grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
            <div className="col-span-2 row-span-2 bg-slate-200 animate-pulse" />
            <div className="bg-slate-200 animate-pulse" />
            <div className="bg-slate-200 animate-pulse" />
            <div className="bg-slate-200 animate-pulse" />
            <div className="bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);
  
  if (!property) {
    return {
      title: 'Villa không tồn tại | Tài Villa Vũng Tàu',
    };
  }

  return {
    title: `${property.name} - ${property.code} | Tài Villa Vũng Tàu`,
    description: property.metaDescription || property.description?.substring(0, 160),
    openGraph: {
      title: `${property.name} - ${property.code}`,
      description: property.metaDescription || property.description?.substring(0, 160),
      images: property.images?.[0]?.imageUrl ? [property.images[0].imageUrl] : [],
    },
  };
}

// Server Component - fetches data at request time for better LCP
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <Suspense fallback={<PropertySkeleton />}>
      <PropertyDetailClient property={property} />
    </Suspense>
  );
}
