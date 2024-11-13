import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../../lib/firebase/config';

export type Lesson = {
    title: string;
    description: string;
    content: string; // HTML do Tiptap
    colorTag: string;
    bannerImage: string; // URL da imagem
};

// Adiciona uma nova lesson ao Firestore e Firebase Storage
export const addLesson = async (lesson: Lesson, imageFile: File | null) => {
    let bannerImage = '';

    // Verifica se há uma imagem a ser enviada
    if (imageFile) {
        const imageRef = ref(storage, `lessonImages/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        bannerImage = await getDownloadURL(snapshot.ref);
    } else {
        // Define a imagem padrão se não houver imagem fornecida
        bannerImage = 'https://firebasestorage.googleapis.com/v0/b/learn-threejs.appspot.com/o/images%2F4ce17ed3-37b7-4f2e-aaf7-1168b2ddc2ab-imagem_2024-10-12_200512408.png?alt=media&token=7a7c7a5e-04bc-4962-b7b9-4a18482d6006';
    }

    // Criar nova lesson no Firestore
    const docRef = await addDoc(collection(firestore, 'lessons'), {
        ...lesson,
        bannerImage,
    });

    return docRef.id; // Retorna o ID da nova lesson
};

// Atualiza uma lesson existente no Firestore
export const updateLesson = async (lessonId: string, updatedLesson: Lesson) => {
    const lessonRef = doc(firestore, 'lessons', lessonId);
    await updateDoc(lessonRef, updatedLesson);
};

// Busca todas as lessons
export const fetchLessons = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'lessons'));
    const lessons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        colorTag: doc.data().colorTag,
    }));
    return lessons;
};

// Busca uma lesson pelo ID
export const fetchLessonById = async (lessonId: string) => {
    const docRef = doc(firestore, 'lessons', lessonId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error('Lesson not found');
    }


};

