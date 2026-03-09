"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import MobileHeader from "@/components/layout/mobile-header/MobileHeader"; // <-- correct import // <-- NOVO IMPORT
import { useLesson } from "@/features/lessons/hooks/useLesson";
import Skeleton from "@/components/ui/skeleton/Skeleton";

const LessonView = dynamic(
  () => import("@/features/lessons/components/lesson-viewer/LessonViewer"),
  { ssr: false },
);

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import animationData from "@/../../public/looties/duck-talk.json";

const LearnPage: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { lessonData, loading } = useLesson(selectedLessonId || "");

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
  };

  const memoizedSidebar = useMemo(() => {
    return (
      <Sidebar
        onSelectLesson={handleLessonSelect}
        selectedLessonId={selectedLessonId}
        isEditable={false}
      />
    );
  }, [selectedLessonId]);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex w-full min-h-screen bg-main-white">
      
      {/* Header Mobile - Só aparece em telas pequenas */}
      <MobileHeader 
        selectedLessonId={selectedLessonId} 
        onSelectLesson={handleLessonSelect} 
      />

      {/* Sidebar Desktop - Renderizada pela memoização (só aparece lg para cima) */}
      {memoizedSidebar}

      {/* Main Content Area - A MÁGICA ESTÁ AQUI */}
      {/* lg:pl-[280px] empurra no desktop. pt-20 lg:pt-0 protege o conteúdo da barra mobile */}
      <main className="flex-1 w-full min-h-screen pt-20 lg:pt-0 lg:pl-[280px] transition-all duration-300">
        <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-4 py-8 mx-auto lg:px-12 lg:py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <Skeleton className="w-full h-12 rounded-md" />
              <Skeleton className="w-full h-8 rounded-md" />
              <Skeleton className="w-full h-[250px] rounded-xl" />
              <Skeleton className="w-full h-64 rounded-xl" />
            </div>
          ) : selectedLessonId === null ? (
            <div className="flex flex-col items-center justify-center w-full h-[60vh] mt-8 text-slate-400 px-4 text-center">
              <p className="mb-4 text-lg font-semibold">
                Escolha alguma prática para <br className="hidden md:block" />
                fazer no menu lateral.
              </p>
              <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] opacity-60">
                <Lottie options={lottieOptions} eventListeners={[]} />
              </div>
            </div>
          ) : (
            lessonData && (
              <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-8">
                {/* lesson header */}
                <div className="flex flex-col items-center w-full gap-3">
                  <div
                    className="w-12 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: lessonData.colorTag }}
                  />
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center text-main-black">
                    {lessonData.title}
                  </h1>
                  <h3 className="max-w-2xl text-sm md:text-base leading-relaxed text-center text-slate-500">
                    {lessonData.description}
                  </h3>
                </div>

                {/* lesson banner image */}
                <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden rounded-xl shadow-sm border border-slate-200">
                  <Image
                    src={lessonData.bannerImage || "/imgs/background.jpg"}
                    alt="Imagem da lição"
                    fill
                    className="object-cover transition-transform duration-500 rounded-xl hover:scale-[1.02]"
                    priority
                  />
                </div>

                {/* lesson interactive viewer (tiptap content) */}
                {selectedLessonId && (
                  <div className="w-full p-4 md:p-10 mt-2 bg-white border shadow-sm rounded-xl border-slate-200">
                    <LessonView lessonId={selectedLessonId} />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default LearnPage;