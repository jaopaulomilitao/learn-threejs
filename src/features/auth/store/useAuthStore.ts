import { create } from 'zustand';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase/config';
import { UserData } from '@/types/user'; // ajuste o caminho

interface AuthState {
    user: User | null;
    userData: UserData | null;
    isLoading: boolean;
    // initializes the firebase auth listener
    initAuthListener: () => void;
    // logs out the user and clears state
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    userData: null,
    isLoading: true,

    initAuthListener: () => {
        onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
                try {
                    // fetches the user document from firestore to get roles and pixels
                    const userDocRef = doc(firestore, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        set({
                            user: currentUser,
                            userData: userDocSnap.data() as UserData,
                            isLoading: false,
                        });
                    } else {
                        // handles edge case where auth exists but no firestore doc
                        console.warn('user document not found in firestore');
                        set({ user: currentUser, userData: null, isLoading: false });
                    }
                } catch (error) {
                    console.error('failed to fetch user data:', error);
                    set({ user: null, userData: null, isLoading: false });
                }
            } else {
                set({ user: null, userData: null, isLoading: false });
            }
        });

        // note: we don't return unsubscribe here directly, 
        // as this is a store action. It should be called once at the app root.
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, userData: null });
            window.location.href = '/login';
        } catch (error) {
            console.error('failed to logout:', error);
        }
    },
}));