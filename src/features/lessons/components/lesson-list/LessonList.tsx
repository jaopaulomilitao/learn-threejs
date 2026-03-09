"use client";

import { useEffect, useState, HTMLAttributes } from "react";
import {
  fetchLessons,
  addLesson,
  deleteLesson,
  downloadLessonsBackup,
  updateLessonsBatch,
} from "@/features/lessons/api/firestore";
import ButtonMenuAside from "../../../../components/ui/button-menu-aside/ButtonMenuAside";
import { FiBookOpen, FiBook } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import { LuFilePlus } from "react-icons/lu";

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
}

interface LessonListProps extends HTMLAttributes<HTMLDivElement> {
  onSelectLesson: (lessonId: string) => void;
  selectedLessonId: string | null;
  isEditable?: boolean;
}

// creates a wrapper component to handle the sortable logic for each item
const SortableLessonItem = ({
  lesson,
  isSelected,
  onSelect,
  isEditable,
  onDelete,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  // applies the dnd transformation styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ButtonMenuAside
        title={lesson.title}
        color={lesson.colorTag}
        isSelected={isSelected}
        onClick={() => onSelect(lesson.id)}
        isEditable={isEditable}
        onDelete={() => onDelete(lesson.id)}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
};

const LessonList: React.FC<LessonListProps> = ({
  onSelectLesson,
  selectedLessonId,
  isEditable = false,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // configures dnd sensors (pointer for mouse/touch, keyboard for accessibility)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      const lessonsData = await fetchLessons();
      // maps data to ensure it fits the local interface
      setLessons(lessonsData as Lesson[]);
      setLoading(false);
    };
    loadLessons();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setIsOpen(true);
        setIsButtonDisabled(true);
      } else {
        setIsOpen(false);
        setIsButtonDisabled(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // handles the backup process
  const handleBackupClick = async () => {
    await downloadLessonsBackup();
    alert("Backup concluído! Verifique seus downloads.");
  };

  // handles the creation of a new lesson
  const handleAddLesson = async () => {
    const newLesson = {
      title: "Nova Lição",
      description: "Descrição da nova lição",
      content: "<p>Conteúdo inicial da nova lição.</p>",
      colorTag: "#00FF00",
      bannerImage: "",
    };

    await addLesson(newLesson, null);
    const lessonsData = await fetchLessons();
    setLessons(lessonsData as Lesson[]);
  };

  // handles the deletion of a lesson with optimistic update
  const handleDeleteLesson = async (id: string) => {
    const isConfirmed = window.confirm(
      "Tem certeza que deseja apagar esta lição?",
    );
    if (!isConfirmed) return;

    // updates state optimistically for immediate visual feedback
    setLessons((prevLessons) =>
      prevLessons.filter((lesson) => lesson.id !== id),
    );

    try {
      // executes database deletion
      await deleteLesson(id);

      // clears selection if the deleted lesson was the active one
      if (selectedLessonId === id) {
        onSelectLesson("");
      }
    } catch (error) {
      console.error("failed to delete lesson:", error);
      // refetches data to restore ui state if the deletion fails
      const lessonsData = await fetchLessons();
      setLessons(lessonsData as Lesson[]);
    }
  };

  // handles the drag end event to reorder items and update database
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // checks if the item was dropped in a different position
    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // reorders the array locally for immediate ui update
        const newArray = arrayMove(items, oldIndex, newIndex);

        // maps the new array to assign the correct index to each item
        const updatedArray = newArray.map((lesson, index) => ({
          ...lesson,
          orderIndex: index,
        }));

        // maps payload and sends the batch update to firestore in the background
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

  return (
        <aside
            // uses top-4 and bottom-4 to anchor the sidebar and force a strict height limit
            className={`flex flex-col gap-3 p-3 rounded-lg shadow-lg fixed top-4 bottom-4 z-50 transition-all duration-500 ${
                isOpen 
                    ? "bg-white opacity-100 w-[80%] 2xl:w-[20%] max-w-[250px] h-[500px]" 
                    : "bg-gray-200 opacity-70 w-10 min-w-10"
            }`}
        >
            {/* top fixed header */}
            <div
                className={`flex items-center gap-2 shrink-0 cursor-pointer ${isButtonDisabled ? "pointer-events-none" : ""}`}
                onClick={() => !isButtonDisabled && setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <FiBookOpen className="text-xl shrink-0" />
                ) : (
                    <FiBook className="text-xl shrink-0 transition-all duration-300 hover:text-2xl" />
                )}
                <p
                    className={`text-base font-bold transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 hidden 2xl:block"}`}
                >
                    Práticas
                </p>
            </div>
            
            <hr className={`border-dashed border-main-black/30 shrink-0 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 hidden 2xl:block"}`} />

            {/* scrollable central content area */}
            {/* flex-1 makes it fill available space, min-h-0 is the secret to allow flex-items to shrink and scroll */}
            <div
                className={`flex-1 min-h-0 overflow-y-auto no-scrollbar transition-all duration-500 ${isOpen ? "block" : "hidden 2xl:block"}`}
            >
                {/* inner container to stack the items without breaking the scroll parent */}
                <div className="flex flex-col gap-2 pb-2">
                    {loading ? (
                        <>
                            <Skeleton className="w-full h-12 rounded-md shrink-0" />
                            <Skeleton className="w-full h-12 rounded-md shrink-0" />
                            <Skeleton className="w-full h-12 rounded-md shrink-0" />
                        </>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={lessons.map((l) => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {lessons.map((lesson) => (
                                    <SortableLessonItem
                                        key={lesson.id}
                                        lesson={lesson}
                                        isSelected={selectedLessonId === lesson.id}
                                        onSelect={onSelectLesson}
                                        isEditable={isEditable}
                                        onDelete={handleDeleteLesson}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                    
                </div>
            </div>

            {/* bottom fixed actions */}
            {isEditable && isOpen && (
                <div className="flex flex-col gap-2 shrink-0 mt-auto pt-2 bg-white">
                    <Button
                        onClick={handleAddLesson}
                        color="success"
                        className="w-full flex items-center justify-center gap-2 bg-main-black text-main-white rounded-lg p-4 hover:bg-[#1D2735] transition-all duration-300 ease-in-out"
                        size="lg"
                    >
                        <LuFilePlus className="text-lg shrink-0" />
                        Adicionar Nova Lição
                    </Button>
                </div>
            )}
        </aside>
    );
};

export default LessonList;