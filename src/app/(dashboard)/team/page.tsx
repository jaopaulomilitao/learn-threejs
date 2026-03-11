"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useTeamStore } from "@/features/teams/store/useTeamStore";
import { AdminTeamView } from "@/features/teams/components/AdminTeamView";
import { StudentTeamView } from "@/features/teams/components/StudentTeamView";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
    const { userData } = useAuthStore();
    const { loadData, isLoading } = useTeamStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (isLoading || !userData) {
        return (
            <div className="container px-4 py-8 mx-auto lg:px-12 lg:py-10 max-w-6xl">
                <Skeleton className="w-48 h-10 mb-8 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="w-full h-64 rounded-2xl" />
                    <Skeleton className="w-full h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    const isAdmin = userData.role === 'admin';

    return (
        <div className="container flex flex-col items-center w-full max-w-6xl gap-6 px-4 py-8 mx-auto lg:px-12 lg:py-10">
            <div className="w-full text-left mb-2">
                <h1 className="text-3xl font-black text-main-black tracking-tight">
                    {isAdmin ? 'Gestão de Equipes' : 'Minha Equipe'}
                </h1>
                <p className="text-slate-500 mt-2 text-sm">
                    {isAdmin 
                        ? 'Crie guildas, gerencie os alunos e distribua pontos de experiência (Pixels).' 
                        : 'Acompanhe seus aliados e a pontuação global do seu clã.'}
                </p>
            </div>

            {isAdmin ? <AdminTeamView /> : <StudentTeamView />}
        </div>
    );
}