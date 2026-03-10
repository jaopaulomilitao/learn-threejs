import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, orderBy, limit, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../../lib/firebase/config';

export type Lesson = {
    title: string;
    description: string;
    content: string; 
    colorTag: string;
    bannerImage: string; 
    orderIndex?: number;
    id?: string;
    topics?: string[]; 
    visible?: boolean; // <-- 1. Adicionado o campo visible
};

// adds a new lesson to firestore and firebase storage
export const addLesson = async (lesson: Lesson, imageFile: File | null) => {
    let bannerImage = '';

    if (imageFile) {
        const imageRef = ref(storage, `lessonImages/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        bannerImage = await getDownloadURL(snapshot.ref);
    } else {
        bannerImage = 'https://firebasestorage.googleapis.com/v0/b/learn-threejs.appspot.com/o/images%2F4ce17ed3-37b7-4f2e-aaf7-1168b2ddc2ab-imagem_2024-10-12_200512408.png?alt=media&token=7a7c7a5e-04bc-4962-b7b9-4a18482d6006';
    }

    const lessonsRef = collection(firestore, 'lessons');
    const orderQuery = query(lessonsRef, orderBy('orderIndex', 'desc'), limit(1));
    const snapshot = await getDocs(orderQuery);

    let nextOrderIndex = 0;

    if (!snapshot.empty) {
        const highestLesson = snapshot.docs[0].data();
        nextOrderIndex = (highestLesson.orderIndex || 0) + 1;
    }

    const docRef = await addDoc(lessonsRef, {
        ...lesson,
        bannerImage,
        orderIndex: nextOrderIndex,
        visible: lesson.visible ?? true, // <-- 2. Define padrão como visível
    });

    return docRef.id; 
};
// updates an existing lesson in firestore
// updates an existing lesson in firestore
export const updateLesson = async (lessonId: string, updatedLesson: Partial<Lesson>) => {
    const lessonRef = doc(firestore, 'lessons', lessonId);
    await updateDoc(lessonRef, updatedLesson);
};

// fetches all lessons ordered by order index
export const fetchLessons = async () => {
    const lessonsRef = collection(firestore, 'lessons');
    
    const sortedQuery = query(lessonsRef, orderBy('orderIndex', 'asc'));
    const querySnapshot = await getDocs(sortedQuery);
    
    const lessons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        colorTag: doc.data().colorTag,
        orderIndex: doc.data().orderIndex || 0,
        topics: doc.data().topics || [],
        visible: doc.data().visible ?? true, // <-- 3. Puxa do banco (padrão true p/ legados)
    }));
    
    return lessons;
};

// fetches a single lesson by id
export const fetchLessonById = async (lessonId: string) => {
    const docRef = doc(firestore, 'lessons', lessonId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // throws error if document is missing
        throw new Error('lesson not found');
    }
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
    const lessonRef = doc(firestore, 'lessons', lessonId);
    await deleteDoc(lessonRef);
};

export const updateLessonsBatch = async (lessonsToUpdate: { id: string; orderIndex: number }[]): Promise<void> => {
    const batch = writeBatch(firestore);

    lessonsToUpdate.forEach((lesson) => {
        const lessonRef = doc(firestore, 'lessons', lesson.id);
        batch.update(lessonRef, { orderIndex: lesson.orderIndex });
    });

    await batch.commit();
};

// fetches all lessons and triggers a json file download for backup purposes
export const downloadLessonsBackup = async (): Promise<void> => {
    try {
        const lessonsRef = collection(firestore, 'lessons');
        const querySnapshot = await getDocs(lessonsRef);
        
        // maps all raw document data including content, description and images
        const fullLessons = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // spreads all fields from the firestore document
        }));
        
        // converts the data array to a formatted json string
        const jsonString = JSON.stringify(fullLessons, null, 2);
        
        // creates a blob with the json data
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // creates a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        
        // formats the current date for the filename
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `backup_lessons_full_${dateStr}.json`;
        
        // appends, clicks, and removes the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // frees up memory
        URL.revokeObjectURL(url);
        
        console.log('full backup downloaded successfully');
    } catch (error) {
        console.error('failed to download full backup:', error);
    }
};