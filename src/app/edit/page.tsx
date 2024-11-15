'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Importando useRouter de next/navigation
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importando Firebase Authentication
import Editor from "@/components/editor/Editor";
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { addLesson } from '@/features/lessons/api/firestore';
import Image from 'next/image';
import LessonList from '@/components/lesson-list/LessonList';
import { uploadImage } from '@/features/lessons/api/storage';
import Skeleton from "@/components/skeleton/Skeleton";
import Lottie from 'react-lottie'; // Importando Lottie
import animationData from '@/../../public/looties/duck-talk.json'; // Caminho para o arquivo Lottie

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
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar a autenticação
    const router = useRouter(); // Importando useRouter de next/navigation
    const { save, lessonData, loading } = useLesson(selectedLessonId || "");

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.push('/login'); // Redireciona para a página de login se não estiver autenticado
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (lessonData) {
            setTitle(lessonData.title);
            setDescription(lessonData.description);
            setEditorContent(lessonData.content);
            setBgColor(lessonData.colorTag);
            setImageSrc(lessonData.bannerImage);
        }
    }, [lessonData]);

    const handleSave = async () => {
        const lessonData = {
            title,
            description,
            content: editorContent || "",
            colorTag: bgColor,
            bannerImage: imageSrc,
        };

        if (imageFile) {
            setImageUploading(true);
            try {
                const uploadedImageUrl = await uploadImage(imageFile);
                lessonData.bannerImage = uploadedImageUrl;
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                alert('Erro ao fazer upload da imagem. Tente novamente.');
                setImageUploading(false);
                return;
            }
        }

        if (selectedLessonId) {
            await save(lessonData);
        } else {
            const newLessonId = await addLesson(lessonData, imageFile);
            setSelectedLessonId(newLessonId);
        }

        setImageUploading(false);
    };

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

    const handleImageClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    };

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
    };

    // Memorizar LessonList para evitar re-renderização desnecessária
    const memoizedLessonList = useMemo(() => {
        return (
            <LessonList
                onSelectLesson={handleLessonSelect}
                selectedLessonId={selectedLessonId}
                isEditable={true}
            />
        );
    }, [selectedLessonId]);

    // Configuração da animação Lottie
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // Caminho para o arquivo Lottie
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 opacity-40 mt-8">
                <p className="text-md font-bold text-center -mb-4">Direcionando para a página...</p>
            </div>);
    }

    return (
        <div className="container mx-auto p-8 flex flex-col lg:flex-row gap-10 w-full">
            {/* Lesson List - Sidebar responsivo */}
            <div className="flex-none w-full lg:w-[20%] min-w-[200px] max-w-[250px] hidden 2xl:block">
                {memoizedLessonList}
            </div>

            {/* Sidebar em telas pequenas */}
            <div className="flex-none w-full lg:w-[20%] min-w-[200px] max-w-[250px] block fixed -mx-4 md:-mx-7 z-20 2xl:hidden">
                {memoizedLessonList}
            </div>

            {/* Conteúdo Principal, responsivo */}
            <div className="flex-grow flex flex-col gap-9 w-full">
                {loading || imageLoading ? (
                    <>
                        {/* Skeleton para o título */}
                        <Skeleton className="w-full h-12 rounded-md" />

                        {/* Skeleton para a descrição */}
                        <Skeleton className="w-full h-8 rounded-md" />

                        {/* Skeleton para a imagem */}
                        <Skeleton className="w-full h-[250px] rounded-lg" />

                        {/* Skeleton para o editor */}
                        <Skeleton className="w-full h-64 rounded-md" />
                    </>
                ) : selectedLessonId === null ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 opacity-40 mt-8">
                        <p className="text-md font-bold text-center -mb-4">Escolha alguma prática para
                            <br />fazer no menu lateral.</p>
                        <div style={{ width: '150px', height: '150px' }}>
                            <Lottie options={lottieOptions} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 items-center w-full">
                            <div className="w-10 h-2 rounded-md" style={{ backgroundColor: bgColor }} />
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="cursor-pointer w-10 h-1 -mt-4 opacity-0"
                            />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-3xl font-bold border-none focus:outline-none cursor-text text-center bg-main-white"
                                placeholder="Título da prática"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="text-sm font-normal border-none focus:outline-none cursor-text text-center bg-main-white w-full resize-none"
                                placeholder="Descrição e revisão da prática"
                                rows={2}
                            />
                        </div>

                        {/* Imagem da lição com estilo similar */}
                        <div className="relative w-full h-[250px] overflow-hidden rounded-lg shadow-md cursor-pointer" onClick={handleImageClick}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                id="image-upload"
                            />
                            <Image
                                src={imageSrc}
                                alt="Imagem da lição"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg hover:scale-105 transition-transform duration-300"
                                priority
                            />
                            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300" />
                        </div>

                        {/* Editor */}
                        <Editor content={editorContent} onChange={setEditorContent} />

                        {/* Botão de salvar */}
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600 transition"
                            onClick={handleSave}
                            disabled={imageUploading}
                        >
                            {imageUploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditPage;
