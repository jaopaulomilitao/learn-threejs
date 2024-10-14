import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Gera um ID único para a imagem

export const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${uuidv4()}-${file.name}`);

    try {
        // Faz o upload do arquivo para o Firebase Storage
        await uploadBytes(storageRef, file);
        // Obtém o link da imagem
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw new Error('Failed to upload image');
    }
};
