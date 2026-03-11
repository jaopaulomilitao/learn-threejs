"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface MobileHeaderProps {
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

const MobileHeader = ({ selectedLessonId, onSelectLesson }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // é extraído o usuário do store de autenticação
  const { user, userData } = useAuthStore();

  // é verificado se o usuário logado é apenas um visitante
  const isVisitor = 
    !user || 
    !userData || 
    userData.name?.toLowerCase() === "john doe";

  const handleSelectAndClose = (lessonId: string) => {
    onSelectLesson(lessonId);
    setIsOpen(false);
  };

  // é calculada a inicial do usuário dinamicamente para usuários reais
  const getInitials = (name?: string) => {
    if (!name || name === "John Doe") return "VI";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 lg:hidden shadow-sm">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 -ml-2 text-main-black hover:bg-slate-100 rounded-md transition-colors w-10 h-10 flex items-center justify-center">
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

      {/* é renderizado o avatar apenas para usuários autenticados, ou um espaço vazio para manter o layout centralizado */}
      {!isVisitor ? (
        <Avatar className="h-8 w-8 border border-slate-200 shadow-sm shrink-0">
          <AvatarFallback className="bg-main-black text-white font-bold text-xs">
            {getInitials(userData?.name)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}
    </header>
  );
};

export default MobileHeader;