"use client";

import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import MobileHeader from "@/components/layout/mobile-header/MobileHeader";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const selectedLessonId = useLessonStore((state) => state.selectedLessonId);
    const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);

    // handles lesson selection and syncs URL
    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId); // mantém a fluidez instantânea
        router.push(`/learn/${lessonId}`); // navega para a URL com o ID
    };

    return (
        <div className="flex w-full min-h-screen bg-main-white">
            <MobileHeader 
                selectedLessonId={selectedLessonId} 
                onSelectLesson={handleLessonSelect} 
            />
            <Sidebar
                selectedLessonId={selectedLessonId}
                onSelectLesson={handleLessonSelect}
                isEditable={false} 
            />
            <main className="flex-1 w-full min-h-screen pt-16 lg:pt-0 lg:pl-[280px] transition-all duration-300">
                {children}
                <Toaster position="bottom-right" richColors />
            </main>
        </div>
    );
}