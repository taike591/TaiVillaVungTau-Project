import { MetadataRoute } from 'next';

const BASE_URL = 'https://taivillavungtau.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Fetch dynamic property pages from API
  let propertyPages: MetadataRoute.Sitemap = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.taivillavungtau.vn'}/api/v1/properties?page=0&size=500`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (response.ok) {
      const data = await response.json();
      const properties = data.data?.content || [];
      
      propertyPages = properties.map((property: { id: number; updatedAt?: string }) => ({
        url: `${BASE_URL}/properties/${property.id}`,
        lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  return [...staticPages, ...propertyPages];
}
