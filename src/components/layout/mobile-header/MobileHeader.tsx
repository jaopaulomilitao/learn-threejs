"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/layout/sidebar/Sidebar";

interface MobileHeaderProps {
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

// REMOVIDO O "export" DAQUI DE CIMA
const MobileHeader = ({ selectedLessonId, onSelectLesson }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAndClose = (lessonId: string) => {
    onSelectLesson(lessonId);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 lg:hidden shadow-sm">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 -ml-2 text-main-black hover:bg-slate-100 rounded-md transition-colors">
            <FiMenu size={24} />
          </button>
        </SheetTrigger>
        
        <SheetContent side="left" className="p-0 w-[280px] border-none">
          <Sidebar 
            isMobile 
            selectedLessonId={selectedLessonId} 
            onSelectLesson={handleSelectAndClose} 
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex justify-center">
        <img src="/ui/logo-horizontal.svg" alt="Graphics is Cool" className="h-6 object-contain" />
      </div>

      <Avatar className="h-8 w-8 border border-slate-200 shadow-sm shrink-0">
        <AvatarFallback className="bg-main-black text-white font-bold text-xs">
          JD
        </AvatarFallback>
      </Avatar>
    </header>
  );
};

// MANTIDO APENAS O EXPORT DEFAULT AQUI NO FINAL
export default MobileHeader;