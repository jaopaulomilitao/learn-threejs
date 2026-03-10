import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../lib/firebase/config';
import { Node, Edge } from '@xyflow/react';

export type QuestStatus = 'completed' | 'active' | 'locked';
export type QuestType = 'main' | 'side'; 

// 1. Tipagem dos dados da Quest
export interface QuestNodeData extends Record<string, unknown> {
    label: string;
    description: string;
    lessonId?: string; 
    externalLink?: string; 
    status: QuestStatus;
    questType: QuestType; 
}

// 2. Tipagem dos dados do Divisor
export interface DividerNodeData extends Record<string, unknown> {
    label: string;
}

// 3. Tipagem específica de cada nó mapeada com a string do 'type'
export type QuestNodeType = Node<QuestNodeData, 'quest'>;
export type DividerNodeType = Node<DividerNodeData, 'divider'>;

// 4. A União: Um CustomNode pode ser ou uma Quest ou um Divisor!
export type CustomNode = QuestNodeType | DividerNodeType;
// fetches the main roadmap from firestore
export const fetchRoadmap = async () => {
    const docRef = doc(firestore, 'roadmaps', 'main-roadmap');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data() as { nodes: CustomNode[]; edges: Edge[] };
    }
    
    // returns empty arrays if roadmap doesn't exist yet
    return { nodes: [], edges: [] };
};

// saves the updated roadmap (nodes positions and edges) to firestore
export const saveRoadmap = async (nodes: CustomNode[], edges: Edge[]) => {
    const docRef = doc(firestore, 'roadmaps', 'main-roadmap');
    await setDoc(docRef, { nodes, edges }, { merge: true });
};