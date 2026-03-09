"use client";

import { useEffect, useState, useMemo } from "react";
const LessonView = dynamic(
  () => import("@/features/lessons/components/lesson-viewer/LessonViewer"),
  { ssr: false },
);
import Image from "next/image";
// certifique-se de que o caminho de importação bate com o local onde você salvou o novo componente
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { useLesson } from "@/features/lessons/hooks/useLesson";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import dynamic from "next/dynamic";

// dynamically imports lottie to completely disable server-side rendering for this component
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import animationData from "@/../../public/looties/duck-talk.json";

const LearnPage: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { lessonData, loading } = useLesson(selectedLessonId || "");

  // handles the lesson selection from the sidebar
  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
  };

  // memoizes the sidebar to prevent unnecessary re-renders during main content updates
  const memoizedSidebar = useMemo(() => {
    return (
      <Sidebar
        onSelectLesson={handleLessonSelect}
        selectedLessonId={selectedLessonId}
        isEditable={false} // em /learn, a edição é desativada
      />
    );
  }, [selectedLessonId]);

  // configures the lottie animation
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
      {/* renders the fixed sidebar component */}
      {memoizedSidebar}

      {/* main content area - uses padding-left (pl-[280px]) to respect the fixed sidebar width */}
      <main className="flex-1 w-full min-h-screen xl:pl-[280px] transition-all duration-300">
        <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-6 py-10 mx-auto lg:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <Skeleton className="w-full h-12 rounded-md" />
              <Skeleton className="w-full h-8 rounded-md" />
              <Skeleton className="w-full h-[250px] rounded-xl" />
              <Skeleton className="w-full h-64 rounded-xl" />
            </div>
          ) : selectedLessonId === null ? (
            // displays the empty state if no lesson is selected
            <div className="flex flex-col items-center justify-center w-full h-[60vh] mt-8 text-slate-400">
              <p className="mb-2 text-lg font-semibold text-center">
                Escolha alguma prática para <br />
                fazer no menu lateral.
              </p>
              <div className="w-[150px] h-[150px] opacity-60">
                <Lottie options={lottieOptions} eventListeners={[]} />
              </div>
            </div>
          ) : (
            // renders the selected lesson content
            lessonData && (
              <div className="flex flex-col items-center justify-center w-full gap-8">
                {/* lesson header */}
                <div className="flex flex-col items-center w-full gap-3">
                  <div
                    className="w-12 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: lessonData.colorTag }}
                  />
                  <h1 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl text-main-black">
                    {lessonData.title}
                  </h1>
                  <h3 className="max-w-2xl text-base leading-relaxed text-center text-slate-500">
                    {lessonData.description}
                  </h3>
                </div>

                {/* lesson banner image */}
                <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-xl shadow-sm border border-slate-200">
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
                  <div className="w-full p-6 mt-2 bg-white border shadow-sm md:p-10 rounded-xl border-slate-200">
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
