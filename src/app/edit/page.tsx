'use client';
import { useEffect, useState } from 'react';
import Editor from "@/components/editor/Editor";
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { addLesson } from '@/features/lessons/api/firestore';
import Image from 'next/image';
import LessonList from '@/components/lesson-list/LessonList';
import { uploadImage } from '@/features/lessons/api/storage';

const EditPage = () => {

    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState<string | null>(null);
    const [title, setTitle] = useState('Título da prática');
    const [description, setDescription] = useState('Descrição e revisão da prática');
    const [bgColor, setBgColor] = useState('#F00');
    const [imageSrc, setImageSrc] = useState('/imgs/background.jpg');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false); // Novo estado para o carregamento da imagem
    const { save, lessonData, loading } = useLesson(selectedLessonId || "");

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
                // Faz o upload da imagem e obtém a URL
                const uploadedImageUrl = await uploadImage(imageFile);
                lessonData.bannerImage = uploadedImageUrl; // Atualiza a URL da imagem no objeto lessonData
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                alert('Erro ao fazer upload da imagem. Tente novamente.');
                setImageUploading(false);
                return; // Para a execução se houver erro
            }
        }

        if (selectedLessonId) {
            await save(lessonData);
        } else {
            // Passa `lessonData` e `imageFile` para `addLesson`
            const newLessonId = await addLesson(lessonData, imageFile);
            setSelectedLessonId(newLessonId);
        }

        setImageUploading(false); // Finaliza o estado de carregamento
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);

            // Criar uma URL de pré-visualização da imagem
            const reader = new FileReader();
            reader.onloadstart = () => setImageLoading(true); // Inicia o carregamento da imagem
            reader.onloadend = () => {
                setImageSrc(reader.result as string); // Atualiza a imagem para a pré-visualização
                setImageLoading(false); // Finaliza o carregamento da imagem
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

    // Verifica se está carregando os dados da lição ou a imagem
    if (loading || imageLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container mx-auto p-8 flex gap-9">
            <div className="w-1/4">
                <LessonList onSelectLesson={handleLessonSelect} />
            </div>

            <div className="flex flex-col gap-9 w-3/4">
                <div className='flex flex-col gap-3 items-center w-full'>
                    <div className='w-10 h-2 rounded-md' style={{ backgroundColor: bgColor }}>
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="cursor-pointer w-full h-full mt-4"
                        />
                    </div>
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

                <div className='relative w-full h-[250px] overflow-hidden rounded-lg shadow-md cursor-pointer' onClick={handleImageClick}>
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
                    />
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300" />
                </div>

                <Editor content={editorContent} onChange={setEditorContent} />
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600 transition"
                    onClick={handleSave}
                    disabled={imageUploading}
                >
                    {imageUploading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </div>
    );
};

export default EditPage;
