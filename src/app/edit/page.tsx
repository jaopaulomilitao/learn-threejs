'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import Editor from "@/components/layout/editor/Editor";
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { addLesson } from '@/features/lessons/api/firestore';
import Image from 'next/image';
// imports the new sidebar instead of the old lesson list
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { uploadImage } from '@/features/lessons/api/storage';
import Skeleton from "@/components/ui/skeleton/Skeleton";
import dynamic from 'next/dynamic';

// dynamically imports lottie to completely disable server-side rendering for this component
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import animationData from '@/../../public/looties/duck-talk.json'; 

const EditPage = () => {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState<string | null>(null);
    const [title, setTitle] = useState('Título da prática');
    const [description, setDescription] = useState('Descrição e revisão da prática');
    const [bgColor, setBgColor] = useState('#F00');
    const [imageSrc, setImageSrc] = useState('/imgs/background.jpg');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    
    const router = useRouter(); 
    const { save, lessonData, loading } = useLesson(selectedLessonId || "");

    // verifies user authentication status
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.push('/login'); 
            }
        });

        return () => unsubscribe();
    }, [router]);

    // populates the form state when a new lesson is selected
    useEffect(() => {
        if (lessonData) {
            setTitle(lessonData.title);
            setDescription(lessonData.description);
            setEditorContent(lessonData.content);
            setBgColor(lessonData.colorTag);
            setImageSrc(lessonData.bannerImage);
        }
    }, [lessonData]);

    // handles the save action for the edited lesson
    const handleSave = async () => {
        // extracts headings directly from the editor html content
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
            topics: extractedTopics, // injects the extracted topics into the payload
        };

        if (imageFile) {
            setImageUploading(true);
            try {
                const uploadedImageUrl = await uploadImage(imageFile);
                lessonDataPayload.bannerImage = uploadedImageUrl;
            } catch (error) {
                console.error('failed to upload image:', error);
                alert('Erro ao fazer upload da imagem. Tente novamente.');
                setImageUploading(false);
                return;
            }
        }

        if (selectedLessonId) {
            await save(lessonDataPayload);
        } else {
            const newLessonId = await addLesson(lessonDataPayload, imageFile);
            setSelectedLessonId(newLessonId);
        }

        setImageUploading(false);
    };

    // handles the image file selection
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

    // triggers the hidden file input
    const handleImageClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    };

    // handles lesson selection from the sidebar
    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
    };

    // memoizes the sidebar to prevent unnecessary re-renders
    const memoizedSidebar = useMemo(() => {
        return (
            <Sidebar
                onSelectLesson={handleLessonSelect}
                selectedLessonId={selectedLessonId}
                isEditable={true} // enables drag and drop, delete, and add buttons inside the sidebar
            />
        );
    }, [selectedLessonId]);

    // configures the lottie animation
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, 
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    // displays a loading state while checking authentication
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen text-gray-500 opacity-40">
                <p className="font-bold text-center text-md">Direcionando para a página...</p>
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-screen bg-main-white">
            
            {/* renders the fixed sidebar component */}
            {memoizedSidebar}

            {/* main content area - uses padding-left (pl-[280px]) to respect the fixed sidebar width */}
            <main className="flex-1 w-full min-h-screen xl:pl-[280px] transition-all duration-300">
                
                <div className="container flex flex-col items-center w-full max-w-6xl gap-9 px-6 py-10 mx-auto lg:px-12">
                    {loading || imageLoading ? (
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
                                Escolha alguma prática para <br />editar no menu lateral.
                            </p>
                            <div className="w-[150px] h-[150px] opacity-60">
                                <Lottie options={lottieOptions} eventListeners={[]} />
                            </div>
                        </div>
                    ) : (
                        // renders the editor interface for the selected lesson
                        <div className="flex flex-col items-center justify-center w-full gap-8">
                            
                            {/* editable header section */}
                            <div className="flex flex-col items-center w-full gap-3">
                                <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: bgColor }} />
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-10 h-1 -mt-4 opacity-0 cursor-pointer"
                                    title="Mudar cor da tag"
                                />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full text-3xl font-extrabold tracking-tight text-center bg-transparent border-none md:text-4xl text-main-black focus:outline-none focus:ring-2 focus:ring-slate-200 rounded-md py-1"
                                    placeholder="Título da prática"
                                />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full max-w-2xl text-base leading-relaxed text-center bg-transparent border-none resize-none text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 rounded-md py-1"
                                    placeholder="Descrição e revisão da prática"
                                    rows={2}
                                />
                            </div>

                            {/* editable banner image */}
                            <div 
                                className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-xl shadow-sm border border-slate-200 cursor-pointer group" 
                                onClick={handleImageClick}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    id="image-upload"
                                />
                                <Image
                                    src={imageSrc}
                                    alt="Imagem da lição"
                                    fill
                                    className="object-cover transition-transform duration-500 rounded-xl group-hover:scale-[1.02]"
                                    priority
                                />
                                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/40 opacity-0 group-hover:opacity-100">
                                    <span className="px-4 py-2 font-semibold text-white bg-black/50 rounded-lg backdrop-blur-sm">
                                        Clique para trocar a imagem
                                    </span>
                                </div>
                            </div>

                            {/* rich text editor */}
                            <div className="w-full p-6 mt-2 bg-white border shadow-sm md:p-10 rounded-xl border-slate-200">
                                <Editor content={editorContent} onChange={setEditorContent} />
                            </div>

                            {/* save action */}
                            <button
                                className="w-full md:w-auto px-10 py-3 mt-4 font-semibold text-white transition-all bg-green-500 rounded-lg hover:bg-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSave}
                                disabled={imageUploading}
                            >
                                {imageUploading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EditPage;