import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, writeBatch, increment } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config';
import { UserData } from '@/types/user';

export interface Team {
    id: string;
    name: string;
    totalPixelsEarned: number;
}

// fetches all teams from the database
export const fetchTeams = async (): Promise<Team[]> => {
    const querySnapshot = await getDocs(collection(firestore, 'teams'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

// fetches all students to populate the admin selection list
export const fetchStudents = async (): Promise<UserData[]> => {
    const q = query(collection(firestore, 'users'), where('role', '==', 'student'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserData);
};

// creates a new team document
export const createTeam = async (name: string): Promise<string> => {
    const newTeamRef = doc(collection(firestore, 'teams'));
    const newTeam: Team = {
        id: newTeamRef.id,
        name,
        totalPixelsEarned: 0,
    };
    await setDoc(newTeamRef, newTeam);
    return newTeamRef.id;
};

// assigns a student to a team (or removes them if teamId is null)
// this automatically removes the student from their previous team due to the 1:1 relation
export const updateStudentTeam = async (userId: string, teamId: string | null): Promise<void> => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { teamId });
};

// deletes a team and gracefully removes the teamId from all its current members
export const deleteTeam = async (teamId: string): Promise<void> => {
    const batch = writeBatch(firestore);
    
    // queues the team deletion
    const teamRef = doc(firestore, 'teams', teamId);
    batch.delete(teamRef);

    // queries all students currently in this team and queues their updates
    const q = query(collection(firestore, 'users'), where('teamId', '==', teamId));
    const snapshot = await getDocs(q);
    snapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, { teamId: null });
    });

    // executes all operations atomically
    await batch.commit();
};

// awards or deducts pixels from a team and all its members simultaneously
export const awardPixelsToTeam = async (teamId: string, amount: number): Promise<void> => {
    const batch = writeBatch(firestore);
    
    // increments historical team score
    const teamRef = doc(firestore, 'teams', teamId);
    batch.update(teamRef, { totalPixelsEarned: increment(amount) });

    // increments current pixel balance for all team members
    const q = query(collection(firestore, 'users'), where('teamId', '==', teamId));
    const snapshot = await getDocs(q);
    snapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, { pixels: increment(amount) });
    });

    await batch.commit();
};