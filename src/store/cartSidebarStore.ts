import { create } from 'zustand'

type CartSidebarStore = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useCartSidebar = create<CartSidebarStore>((set) => ({
  isOpen: false,
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
}))