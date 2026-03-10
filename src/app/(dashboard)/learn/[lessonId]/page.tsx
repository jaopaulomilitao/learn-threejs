"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";

import { useLesson } from "@/features/lessons/hooks/useLesson";
import { useLessonStore } from "@/features/lessons/store/useLessonStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { uploadImage } from "@/features/lessons/api/storage";
import Skeleton from "@/components/ui/skeleton/Skeleton";

// conditionally imports the editor (for admins) and viewer (for students/guests)
const Editor = dynamic(() => import("@/components/layout/editor/Editor"), { ssr: false });
const LessonView = dynamic(() => import("@/features/lessons/components/lesson-viewer/LessonViewer"), { ssr: false });

export default function LessonViewerPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  
  const setSelectedLessonId = useLessonStore((state) => state.setSelectedLessonId);
  const { userData } = useAuthStore();
  const { lessonData, loading, save } = useLesson(lessonId);

  // determines if the current user has editing privileges
  const isEditable = userData?.role === 'admin';

  // editor state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#000');
  const [imageSrc, setImageSrc] = useState('/imgs/background.jpg');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // syncs url with global store
  useEffect(() => {
    if (lessonId) setSelectedLessonId(lessonId);
  }, [lessonId, setSelectedLessonId]);

  // populates editor state when lesson data loads
  useEffect(() => {
    if (lessonData && isEditable) {
        setTitle(lessonData.title);
        setDescription(lessonData.description);
        setEditorContent(lessonData.content || "");
        setBgColor(lessonData.colorTag);
        setImageSrc(lessonData.bannerImage || "/imgs/background.jpg");
    }
  }, [lessonData, isEditable]);

  // handles image selection for preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          setImageFile(file);
          const reader = new FileReader();
          reader.onloadstart = () => setImageLoading(true);
          reader.onloadend = () => {
              setImageSrc(reader.result as string);
              setImageLoading(false);
          };
          reader.readAsDataURL(file);
      }
  };

  // handles the save action
  const handleSave = async () => {
      let extractedTopics: string[] = [];
      if (editorContent) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(editorContent, "text/html");
          const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));
          extractedTopics = headings
              .map((h) => h.textContent?.trim() || "")
              .filter((text) => text.length > 0);
      }

      const lessonDataPayload = {
          title,
          description,
          content: editorContent || "",
          colorTag: bgColor,
          bannerImage: imageSrc,
          topics: extractedTopics,
      };

      if (imageFile) {
          setImageUploading(true);
          try {
              const uploadedImageUrl = await uploadImage(imageFile);
              lessonDataPayload.bannerImage = uploadedImageUrl;
          } catch (error) {
              console.error('failed to upload image:', error);
              alert('Erro ao fazer upload da imagem.');
              setImageUploading(false);
              return;
          }
      }

      await save(lessonDataPayload);
      setImageUploading(false);
      alert('Prática salva com sucesso!');
  };

  if (loading || imageLoading) {
      return (
        <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-4 py-8 mx-auto lg:px-12 lg:py-10">
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <Skeleton className="w-full h-12 rounded-md" />
            <Skeleton className="w-full h-8 rounded-md" />
            <Skeleton className="w-full h-[250px] rounded-xl" />
            <Skeleton className="w-full h-64 rounded-xl" />
          </div>
        </div>
      );
  }

  if (!lessonData) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-slate-800">Lição não encontrada.</h2>
            <p className="text-slate-500 mt-2">O link pode estar quebrado ou a prática foi removida.</p>
        </div>
      );
  }

  return (
    <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-4 py-8 mx-auto lg:px-12 lg:py-10">
      <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-8">
        
        {/* header block (editable vs read-only) */}
        <div className="flex flex-col items-center w-full gap-3">
          {isEditable ? (
            <>
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: bgColor }} />
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-1 -mt-4 opacity-0 cursor-pointer" title="Mudar cor da tag" />
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl md:text-4xl font-extrabold tracking-tight text-center bg-transparent border-none text-main-black focus:outline-none focus:ring-2 focus:ring-slate-200 rounded-md py-1"
                  placeholder="Título da prática"
              />
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full max-w-2xl text-sm md:text-base leading-relaxed text-center bg-transparent border-none resize-none text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 rounded-md py-1"
                  placeholder="Descrição e revisão da prática"
                  rows={2}
              />
            </>
          ) : (
            <>
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: lessonData.colorTag }} />
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center text-main-black">
                {lessonData.title}
              </h1>
              <h3 className="max-w-2xl text-sm md:text-base leading-relaxed text-center text-slate-500">
                {lessonData.description}
              </h3>
            </>
          )}
        </div>

        {/* banner image block (editable vs read-only) */}
        <div 
          className={`relative w-full h-[200px] md:h-[350px] overflow-hidden rounded-xl shadow-sm border border-slate-200 ${isEditable ? 'cursor-pointer group' : ''}`}
          onClick={() => isEditable && document.getElementById('image-upload')?.click()}
        >
          {isEditable && (
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          )}
          <Image
            src={isEditable ? imageSrc : (lessonData.bannerImage || "/imgs/background.jpg")}
            alt="Imagem da lição"
            fill
            className={`object-cover transition-transform duration-500 rounded-xl ${isEditable ? 'group-hover:scale-[1.02]' : 'hover:scale-[1.02]'}`}
            priority
          />
          {isEditable && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/40 opacity-0 group-hover:opacity-100">
                <span className="px-4 py-2 font-semibold text-white bg-black/50 rounded-lg backdrop-blur-sm">
                    Clique para trocar a imagem
                </span>
            </div>
          )}
        </div>

        {/* content body (editor vs viewer) */}
        <div className="w-full p-4 md:p-10 mt-2 bg-white border shadow-sm rounded-xl border-slate-200">
          {isEditable ? (
            <Editor content={editorContent} onChange={setEditorContent} />
          ) : (
            <LessonView lessonId={lessonId} />
          )}
        </div>

        {/* save button (admin only) */}
        {isEditable && (
            <button
                className="w-full md:w-auto px-10 py-3 font-semibold text-white transition-all bg-main-green rounded-lg hover:bg-main-green/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={imageUploading}
            >
                {imageUploading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        )}
      </div>
    </div>
  );
}