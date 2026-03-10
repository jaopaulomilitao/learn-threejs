"use client";

import { useEffect, useState, HTMLAttributes, useMemo } from "react";
import {
  fetchLessons,
  addLesson,
  deleteLesson,
  updateLesson,
  updateLessonsBatch,
} from "@/features/lessons/api/firestore";
import { FiBookOpen, FiMap, FiShoppingBag, FiTrash2, FiMoreVertical, FiEyeOff, FiEye } from "react-icons/fi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { LuFilePlus } from "react-icons/lu";
import clsx from "clsx";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import Link from "next/link";
// shadcn ui imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Lesson {
  id: string;
  title: string;
  colorTag: string;
  orderIndex?: number;
  content?: string; 
  topics?: string[]; 
  visible?: boolean;
}

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  onSelectLesson: (lessonId: string) => void;
  selectedLessonId: string | null;
  isEditable?: boolean;
  isMobile?: boolean; // <-- RECEBENDO A PROPRIEDADE
}
const SortableAccordionItem = ({
  lesson,
  isSelected,
  isEditable,
  onDelete,
  onToggleVisibility,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  const style = {
    // CRITICAL FIX: Use Translate instead of Transform to avoid Accordion conflicts
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    ...(isDragging ? { position: 'relative' as const } : {}),
  };

  const setActiveTopic = useLessonStore((state) => state.setActiveTopic);
  
  const extractedTopics = useMemo(() => {
    if (lesson.topics && lesson.topics.length > 0) {
      return lesson.topics;
    }
    if (!lesson.content || typeof window === "undefined") return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(lesson.content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));
    
    return headings
      .map((h) => h.textContent?.trim() || "")
      .filter((text) => text.length > 0);
  }, [lesson.content, lesson.topics]);

  return (
    <AccordionItem
      value={lesson.id}
      ref={setNodeRef}
      style={style}
      className={clsx(
        "px-2.5 rounded-lg mb-2 transition-colors border-none w-full max-w-full overflow-hidden data-[state=open]:pb-2",
        isSelected ? "bg-[#2A3649] shadow-sm" : "bg-transparent hover:bg-white/5",
        lesson.visible === false && isEditable ? "opacity-60" : "opacity-100",
        isDragging && "shadow-lg bg-[#2A3649] opacity-90 scale-[1.02]"
      )}
    >
      <div className="flex items-center w-full min-w-0 gap-1.5">
        {isEditable && (
          <div
            {...listeners}
            {...attributes}
            // CRITICAL FIX: Add cursor-grab and touch-none
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-200 shrink-0 p-1 touch-none"
            style={{ touchAction: 'none' }} // Force touch action none inline
          >
            <MdOutlineDragIndicator size={18} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <AccordionTrigger className="py-3 hover:no-underline w-full [&>svg]:shrink-0 [&>svg]:text-white pr-1">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className="w-3.5 h-3.5 rounded-[4px] shrink-0"
                style={{ backgroundColor: lesson.colorTag }}
              />
              <span className={clsx(
                "text-sm font-semibold truncate block text-left",
                lesson.visible === false ? "text-slate-400" : "text-white"
              )}>
                {lesson.title}
              </span>
              {lesson.visible === false && (
                <FiEyeOff className="text-slate-400 shrink-0 ml-1" size={14} />
              )}
            </div>
          </AccordionTrigger>
        </div>

        {isEditable && (
          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-all outline-none">
                  <FiMoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-lg text-main-black rounded-xl">
                <DropdownMenuItem 
                  onClick={() => onToggleVisibility(lesson.id, lesson.visible)}
                  className="cursor-pointer py-2 font-medium"
                >
                  {lesson.visible === false ? (
                    <><FiEye className="mr-2 h-4 w-4" /> Tornar visível</>
                  ) : (
                    <><FiEyeOff className="mr-2 h-4 w-4" /> Ocultar prática</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(lesson.id)} 
                  className="cursor-pointer py-2 font-medium text-red-500 focus:text-red-600 focus:bg-red-50"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  <span>Excluir prática</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <AccordionContent>
        <div className="flex flex-col gap-2.5 pl-[26px] border-l-2 border-slate-600/50 ml-[6px] mt-1">
          {extractedTopics.length > 0 ? (
            extractedTopics.map((topic: string, index: number) => (
              <p
                key={index}
                onClick={() => setActiveTopic(topic)}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer truncate"
                title={topic}
              >
                <span className="text-red-400 font-bold mr-1">{index + 1}.</span> {topic}
              </p>
            ))
          ) : (
            <p className="text-xs font-medium text-slate-500 italic truncate">
              Nenhum tópico...
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectLesson,
  selectedLessonId,
  isEditable = false,
  isMobile = false, // <-- RECEBENDO A PROPRIEDADE
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // CORREÇÃO CRÍTICA: Constraint de 5 pixels força o dnd-kit a ignorar cliques simples ou toques no scroll
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      const lessonsData = await fetchLessons();
      setLessons(lessonsData as Lesson[]);
      setLoading(false);
    };
    loadLessons();
  }, []);

  const handleAddLesson = async () => {
    const newLesson = {
      title: "Nova Lição",
      description: "Descrição da nova lição",
      content: "<h2>Introdução</h2><p>Conteúdo inicial...</p>",
      colorTag: "#f43f5e",
      bannerImage: "",
      visible: true,
    };
    await addLesson(newLesson, null);
    const lessonsData = await fetchLessons();
    setLessons(lessonsData as Lesson[]);
  };

  const handleDeleteLesson = async (id: string) => {
    const isConfirmed = window.confirm(
      "Tem certeza que deseja apagar esta lição?",
    );
    if (!isConfirmed) return;

    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    try {
      await deleteLesson(id);
      if (selectedLessonId === id) onSelectLesson("");
    } catch (error) {
      console.error("failed to delete lesson:", error);
      const lessonsData = await fetchLessons();
      setLessons(lessonsData as Lesson[]);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility?: boolean) => {
    const newVisibility = currentVisibility === false ? true : false;
    
    setLessons((prev) => prev.map((l) => l.id === id ? { ...l, visible: newVisibility } : l));
    
    try {
      await updateLesson(id, { visible: newVisibility });
    } catch (error) {
      console.error("failed to toggle visibility:", error);
      setLessons((prev) => prev.map((l) => l.id === id ? { ...l, visible: currentVisibility } : l));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);
        const updatedArray = newArray.map((lesson, index) => ({
          ...lesson,
          orderIndex: index,
        }));

        const payload = updatedArray.map((l) => ({
          id: l.id,
          orderIndex: l.orderIndex as number,
        }));

        updateLessonsBatch(payload).catch((err) =>
          console.error("failed to batch update:", err),
        );

        return updatedArray;
      });
    }
  };

  const displayedLessons = isEditable ? lessons : lessons.filter(l => l.visible !== false);

  return (
    <aside 
      className={clsx(
        "bg-white flex flex-col overflow-hidden p-4 pb-6 z-50",
        isMobile 
          ? "w-full h-full" // Se for mobile (dentro do Sheet), ocupa 100% do espaço da gaveta
          : "fixed left-0 top-0 h-screen w-[280px] border-r border-slate-200 hidden lg:flex" // Se for desktop, fixa na esquerda e some no mobile
      )}
    >  
      <div className="mb-6 mt-2 flex flex-col justify-start w-full px-2 shrink-0">
        <div className="pb-6">
          <img
            src="/ui/logo-horizontal.svg"
            alt="Graphics is Cool"
            className="h-9 object-contain"
          />
        </div>
        <div className="w-full h-[1.5px] bg-[linear-gradient(to_right,#cbd5e1_50%,transparent_50%)] bg-[length:12px_1px]"></div>
      </div>

      <div className="flex flex-col gap-2 mb-4 shrink-0">
        <TooltipProvider delayDuration={100}>
          <Link 
          href="/roadmap"
          className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-main-black font-semibold transition-colors shadow-sm text-sm outline-none"
        >
          <FiMap className="text-lg shrink-0" />
          <span>Roadmap</span>
        </Link>

          {/* <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-main-black font-semibold transition-colors shadow-sm text-sm">
                <FiShoppingBag className="text-lg shrink-0" />
                <span>Loja</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Em breve</p>
            </TooltipContent>
          </Tooltip> */}
        </TooltipProvider>
      </div>

      <div className="w-full shrink-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="lessons-global"
            className="bg-main-black rounded-xl p-3 border-none shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="py-0 hover:no-underline [&>svg]:text-white">
              <div className="flex items-center gap-3 text-white">
                <FiBookOpen className="text-lg shrink-0" />
                <span className="font-semibold text-sm tracking-wide">Lições</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-0">
              <div className="overflow-y-auto custom-scrollbar overflow-x-hidden max-h-[calc(100vh-380px)] pr-2 -mr-2">
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-12 rounded-lg bg-slate-700/50" />
                    <Skeleton className="w-full h-12 rounded-lg bg-slate-700/50" />
                    <Skeleton className="w-full h-12 rounded-lg bg-slate-700/50" />
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={displayedLessons.map((l) => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <Accordion
                        type="single"
                        collapsible
                        value={selectedLessonId || ""}
                        onValueChange={onSelectLesson}
                        className="w-full"
                      >
                        {displayedLessons.map((lesson) => (
                          <SortableAccordionItem
                            key={lesson.id}
                            lesson={lesson}
                            isSelected={selectedLessonId === lesson.id}
                            isEditable={isEditable}
                            onDelete={handleDeleteLesson}
                            onToggleVisibility={handleToggleVisibility}
                          />
                        ))}
                      </Accordion>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {isEditable && (
                <button
                  onClick={handleAddLesson}
                  className="mt-4 w-full bg-white text-main-black py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <LuFilePlus className="text-base" />
                  Adicionar prática
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex-1 min-h-0 pointer-events-none"></div>

      <div className="mt-4 flex items-center gap-3 pt-3 shrink-0">
        <Avatar className="h-10 w-10 border border-slate-200">
          <AvatarFallback className="bg-main-black text-white font-bold text-xs">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-main-black leading-tight truncate">
            John Doe
          </p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            Equipe 1
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;