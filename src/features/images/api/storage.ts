// src/features/images/api/storage.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { v4 as uuidv4 } from 'uuid';


export const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};
