import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/useCartStore';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CartSync() {
  const { user, loading } = useAuth();
  const { items, clearCart } = useCartStore();
  const prevUserRef = useRef<string | null | undefined>(undefined);
  const skipNextUpSync = useRef(false);

  useEffect(() => {
    if (loading) return;

    async function handleUserChange() {
      // Logged in
      if (user && prevUserRef.current !== user.uid) {
        prevUserRef.current = user.uid;
        try {
          console.log("Syncing cart DOWN from server...");
          const cartRef = doc(db, 'users', user.uid);
          const cartSnap = await getDoc(cartRef);
          
          const localItems = useCartStore.getState().items;
          let newItems = [...localItems];
          
          if (cartSnap.exists()) {
            const data = cartSnap.data();
            const serverItems = data.cart || [];
            
            // Merge local and server items
            const merged = [...serverItems];
            localItems.forEach(li => {
              const existsIndex = merged.findIndex((mi: any) => 
                (mi.cartItemId && mi.cartItemId === (li as any).cartItemId) || 
                (!mi.cartItemId && mi._id === li._id && mi.color === li.color && mi.size === li.size)
              );
              if (existsIndex > -1) {
                // If exists locally but also server, we want to maybe update quantity if needed,
                // but for now let's just use the server's for simplicity.
              } else {
                merged.push(li);
              }
            });
            newItems = merged;
          }
          
          skipNextUpSync.current = true;
          useCartStore.setState({ items: newItems });
          // Save merged back
          const cleanNewItems = JSON.parse(JSON.stringify(newItems));
          await setDoc(doc(db, 'users', user.uid), { cart: cleanNewItems }, { merge: true });
          console.log("Cart synced DOWN and merged.");
        } catch (e) {
          console.error("Cart sync error inside handleUserChange", e);
        }
      } 
      // Logged out
      else if (!user && prevUserRef.current !== null && prevUserRef.current !== undefined) {
         prevUserRef.current = null;
         skipNextUpSync.current = true;
         clearCart();
         console.log("User logged out, cleared local cart.");
      } else if (!user && prevUserRef.current === undefined) {
         prevUserRef.current = null;
      }
    }

    handleUserChange();
  }, [user, loading, clearCart]);

  // Sync UP on cart changes
  useEffect(() => {
    if (skipNextUpSync.current) {
      skipNextUpSync.current = false;
      return;
    }
    
    async function syncUp() {
      if (user) {
        try {
          const cleanItems = JSON.parse(JSON.stringify(items));
          await setDoc(doc(db, 'users', user.uid), { cart: cleanItems }, { merge: true });
          console.log("Cart synced UP to server.", cleanItems.length, "items.");
        } catch (e) {
          console.error("Cart sync UP error", e);
        }
      }
    }
    syncUp();
  }, [items, user]);

  return null;
}
