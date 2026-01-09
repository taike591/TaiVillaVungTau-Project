'use client';

import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentlyViewedItem {
  id: number;
  code: string;
  name: string;
  image: string;
  priceWeekday: number;
  bedroomCount: number;
  viewedAt: number;
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  addItem: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  getItems: () => RecentlyViewedItem[];
  clearAll: () => void;
}

const MAX_RECENT_ITEMS = 6;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.items.filter((i) => i.id !== item.id);
          
          // Add to beginning with timestamp
          const newItems = [
            { ...item, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_ITEMS); // Keep only max items
          
          return { items: newItems };
        });
      },

      getItems: () => get().items,

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);

/**
 * Hook to track recently viewed properties
 * Call this in PropertyDetailClient to record view
 */
export function useTrackRecentlyViewed(property: {
  id: number;
  code: string;
  name: string;
  images?: { imageUrl: string }[];
  priceWeekday: number;
  bedroomCount: number;
} | null) {
  const addItem = useRecentlyViewedStore((state) => state.addItem);

  useEffect(() => {
    if (property) {
      addItem({
        id: property.id,
        code: property.code,
        name: property.name,
        image: property.images?.[0]?.imageUrl || '',
        priceWeekday: property.priceWeekday,
        bedroomCount: property.bedroomCount,
      });
    }
  }, [property?.id]); // Only run when property id changes
}
