import { create } from 'zustand';
import { Team, fetchTeams, fetchStudents, createTeam, deleteTeam, updateStudentTeam, awardPixelsToTeam } from '../api/firestore';
import { UserData } from '@/types/user';

interface TeamState {
    teams: Team[];
    students: UserData[];
    isLoading: boolean;
    
    loadData: () => Promise<void>;
    addTeam: (name: string) => Promise<void>;
    removeTeam: (teamId: string) => Promise<void>;
    assignStudent: (userId: string, teamId: string | null) => Promise<void>;
    awardPixels: (teamId: string, amount: number) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
    teams: [],
    students: [],
    isLoading: true,

    // loads both teams and students simultaneously
    loadData: async () => {
        set({ isLoading: true });
        try {
            const [teamsData, studentsData] = await Promise.all([fetchTeams(), fetchStudents()]);
            set({ teams: teamsData, students: studentsData, isLoading: false });
        } catch (error) {
            console.error('failed to load team data:', error);
            set({ isLoading: false });
        }
    },

    // creates a new team and refreshes the list
    addTeam: async (name: string) => {
        await createTeam(name);
        await get().loadData();
    },

    // deletes a team and refreshes to reflect unassigned students
    removeTeam: async (teamId: string) => {
        await deleteTeam(teamId);
        await get().loadData();
    },

    // updates a student's team affiliation
    assignStudent: async (userId: string, teamId: string | null) => {
        // optimistically updates the local state for instant UI feedback
        set((state) => ({
            students: state.students.map(s => s.uid === userId ? { ...s, teamId } : s)
        }));
        
        try {
            await updateStudentTeam(userId, teamId);
        } catch (error) {
            console.error('failed to assign student:', error);
            await get().loadData(); // rolls back on error
        }
    },

    // distributes points to team members
    awardPixels: async (teamId: string, amount: number) => {
        await awardPixelsToTeam(teamId, amount);
        await get().loadData(); // reloads to show updated scores
    }
}));