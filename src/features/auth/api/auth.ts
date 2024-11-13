// features/api/auth.ts
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase/config';

export const login = async (email: string, password: string): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Erro ao logar: ', (error as Error).message);
        throw new Error('Erro ao autenticar');
    }
};
