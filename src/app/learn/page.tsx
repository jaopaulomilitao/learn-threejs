import LessonView from "@/components/lesson-viewer/LessonViewer";
import Image from "next/image";

const LearnPage = () => {
    return (
        <div className="container mx-auto p-8 flex flex-col gap-9">
            <div className='flex flex-col gap-3 items-center w-full'>
                <div className='w-10 h-2 rounded-md bg-red-500'></div>
                <h1 className="text-3xl font-bold">Título da prática</h1>
                <h3 className="text-sm font-normal">Descrição e revisão da prática</h3>
            </div>

            <div className='relative w-full h-[250px] overflow-hidden rounded-lg shadow-md'>
                <Image
                    src="/imgs/background.jpg" // Remova o "public" do caminho
                    alt="Imagem aleatória"
                    layout="fill" // Para preencher o contêiner
                    objectFit="cover" // Para cobrir e centralizar
                    className="rounded-lg"
                />
            </div>

            <LessonView lessonId="lesson1" />
        </div>
    );
};

export default LearnPage;
