"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton'; // ou um spinner seu

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
    const { user, userData, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // unauthenticated user redirect
            if (!user) {
                router.push('/login');
                return;
            }
            
            // unauthorized user redirect based on role
            if (userData && !allowedRoles.includes(userData.role)) {
                // directs students to learn, and admins to edit
                const fallbackRoute = userData.role === 'admin' ? '/edit' : '/learn';
                router.push(fallbackRoute);
            }
        }
    }, [isLoading, user, userData, allowedRoles, router]);

    // shows a loading state while fetching auth and firestore data
    if (isLoading) {
        return (
            <div className="flex w-full min-h-screen items-center justify-center bg-main-white">
                <Skeleton className="w-64 h-8 rounded-md" />
            </div>
        );
    }

    // only renders children if authenticated and authorized
    if (user && userData && allowedRoles.includes(userData.role)) {
        return <>{children}</>;
    }

    return null;
};