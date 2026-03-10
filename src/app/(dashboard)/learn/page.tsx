"use client";

import { FiBox } from "react-icons/fi";
import { useEffect } from "react";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";

export default function LearnEmptyPage() {
  const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);

  // Garante que o menu lateral perca a seleção ("desmarque") se o usuário voltar para a raiz /learn
  useEffect(() => {
      setSelectedLessonId(null);
  }, [setSelectedLessonId]);

  return (
    <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-4 py-8 mx-auto lg:px-12 lg:py-10">
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] mt-4 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50 p-8 text-center transition-all hover:bg-slate-50">
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-white border shadow-sm border-slate-200 rounded-2xl">
          <FiBox className="text-4xl text-main-black opacity-80" />
        </div>
        <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-main-black">
          Pronto para explorar a Computação Gráfica?
        </h2>
        <p className="max-w-md text-base leading-relaxed text-slate-500">
          Selecione uma <strong className="font-semibold text-main-black">lição</strong> no menu lateral para ler os artigos, aprofundar-se na teoria e colocar a mão na massa.
        </p>
      </div>
    </div>
  );
}