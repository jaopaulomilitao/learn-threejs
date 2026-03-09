'use client';
import { useState } from 'react';
import { uploadImage } from '@/features/images/api/storage';

type ImageUploaderProps = {
    onUpload: (url: string) => void;
};

const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (file) {
            const url = await uploadImage(file);
            onUpload(url);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload}>Enviar Imagem</button>
        </div>
    );
};

export default ImageUploader;
