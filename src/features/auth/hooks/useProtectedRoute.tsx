'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAuth from './useAuth';

const useProtectedRoute = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useAuth(); // Assumindo que você tem o hook useAuth
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // Atualiza o estado quando o componente é montado no cliente
    }, []);

    useEffect(() => {
        if (isMounted && !user) {
            router.push('/login');
        }
    }, [user, isMounted, router]);
};

export default useProtectedRoute;
