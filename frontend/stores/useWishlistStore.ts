import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  code: string;
  name: string;
  image: string;
  priceWeekday: number;
  bedroomCount: number;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
  isInWishlist: (id: number) => boolean;
  getFormattedMessage: () => string;
  getMessengerUrl: () => string;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if already in wishlist
          if (state.items.some((i) => i.id === item.id)) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                addedAt: Date.now(),
              },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearAll: () => {
        set({ items: [] });
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      getFormattedMessage: () => {
        const items = get().items;
        if (items.length === 0) return '';

        const header = 'Chào bạn! Mình quan tâm đến các căn villa sau:\n\n';
        const villaList = items
          .map((item, index) => {
            const price = new Intl.NumberFormat('vi-VN').format(item.priceWeekday);
            return `${index + 1}. ${item.code} - ${item.name} (${item.bedroomCount} phòng ngủ, ${price}đ/đêm)`;
          })
          .join('\n');
        const footer = '\n\nMình muốn được tư vấn thêm ạ. Cảm ơn!';

        return header + villaList + footer;
      },

      getMessengerUrl: () => {
        const message = get().getFormattedMessage();
        const pageId = '100091682560247'; // Facebook page ID
        const encodedMessage = encodeURIComponent(message);
        return `https://m.me/${pageId}?text=${encodedMessage}`;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
