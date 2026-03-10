"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";

import { useLesson } from "@/features/lessons/hooks/useLesson";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import Skeleton from "@/components/ui/skeleton/Skeleton";

// imports the viewer statically to avoid hydration errors
const LessonView = dynamic(
  () => import("@/features/lessons/components/lesson-viewer/LessonViewer"),
  { ssr: false },
);

export default function LessonViewerPage() {
  // Pega o ID diretamente da URL do navegador (ex: /learn/id_da_licao)
  const params = useParams();
  const lessonId = params.lessonId as string;
  
  const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);
  const { lessonData, loading } = useLesson(lessonId);

  // MÁGICA: Ao abrir a URL compartilhada, avisa ao Zustand qual é a lição.
  // Isso faz o seu Menu Lateral pintar a lição correta de pretinho automaticamente!
  useEffect(() => {
    if (lessonId) {
      setSelectedLessonId(lessonId);
    }
  }, [lessonId, setSelectedLessonId]);

  return (
    <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-4 py-8 mx-auto lg:px-12 lg:py-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <Skeleton className="w-full h-12 rounded-md" />
          <Skeleton className="w-full h-8 rounded-md" />
          <Skeleton className="w-full h-[250px] rounded-xl" />
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      ) : lessonData ? (
        <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-8">
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

          <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden rounded-xl shadow-sm border border-slate-200">
            <Image
              src={lessonData.bannerImage || "/imgs/background.jpg"}
              alt="Imagem da lição"
              fill
              className="object-cover transition-transform duration-500 rounded-xl hover:scale-[1.02]"
              priority
            />
          </div>

          <div className="w-full p-4 md:p-10 mt-2 bg-white border shadow-sm rounded-xl border-slate-200">
            <LessonView lessonId={lessonId} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Lição não encontrada.</h2>
            <p className="text-slate-500 mt-2">O link pode estar quebrado ou a lição foi removida.</p>
        </div>
      )}
    </div>
  );
}