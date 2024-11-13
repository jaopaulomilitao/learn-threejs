// features/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);  // Atualiza o estado conforme o status de autenticação
        });

        return () => unsubscribe();
    }, []);

    return { user };
};

export default useAuth;
