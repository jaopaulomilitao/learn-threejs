'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../features/auth/api/auth';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { MdLockOutline, MdOutlineMailOutline } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase/config';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // controls the password visibility toggle
    const [isVisible, setIsVisible] = useState<boolean>(true);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // executes firebase authentication
            await login(email, password);
            
            // guarantees user object is instantiated before database query
            if (!auth.currentUser) {
                throw new Error('usuário não instanciado após o login');
            }

            // fetches user document to validate existence
            const userDocSnap = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
            
            if (userDocSnap.exists()) {
                // redirects to unified learning environment
                router.push('/learn');
            } else {
                setError('Perfil de usuário não encontrado no banco de dados.');
                await auth.signOut();
            }
        } catch (err) {
            setError('Credenciais inválidas. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // toggles the password input type
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-md shadow-xl border border-slate-100 bg-white rounded-md">
                <CardHeader className="flex flex-col gap-4 items-center pt-10 pb-4">
                    {/* renders official platform logo */}
                    <img
                        src="/ui/logo-horizontal.svg"
                        alt="Graphics is Cool"
                        className="h-10 object-contain mb-2"
                    />
                    
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-2xl font-bold text-slate-800">Bem-vindo(a) de volta</h1>
                        <p className="text-sm text-slate-500 text-center px-4">
                            Faça login para acessar o roadmap e seu perfil na plataforma da disciplina.
                        </p>
                    </div>
                </CardHeader>
                
                <CardBody className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            startContent={<MdOutlineMailOutline className="w-5 h-5 text-slate-400 mr-1" />}
                            isRequired
                            isDisabled={isLoading}
                            variant="flat"
                            classNames={{
                                input: "placeholder:text-slate-400 text-base",
                                // forcefully overrides the default blue focus ring from nextui
                                inputWrapper: "p-4 rounded-xl data-[focus=true]:ring-0 data-[focus=true]:border-slate-300 border border-transparent transition-colors bg-slate-100 data-[hover=true]:bg-slate-200",
                            }}
                        />

                        <Input
                            type={isVisible ? "text" : "password"}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            startContent={<MdLockOutline className="w-5 h-5 text-slate-400 mr-1" />}
                            endContent={
                                <button className="focus:outline-none p-1" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                        <FiEyeOff className="text-lg text-slate-400 hover:text-slate-600 transition-colors pointer-events-none" />
                                    ) : (
                                        <FiEye className="text-lg text-slate-400 hover:text-slate-600 transition-colors pointer-events-none" />
                                    )}
                                </button>
                            }
                            isRequired
                            isDisabled={isLoading}
                            variant="flat"
                            classNames={{
                                input: "placeholder:text-slate-400 text-base",
                                // forcefully overrides the default blue focus ring from nextui
                                inputWrapper: "p-4 rounded-xl data-[focus=true]:ring-0 data-[focus=true]:border-slate-300 border border-transparent transition-colors bg-slate-100 data-[hover=true]:bg-slate-200",
                            }}
                        />

                        {error && (
                            <div className="p-3 mt-1 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100 text-center font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="mt-4 bg-main-black text-white hover:bg-main-black/80 p-6 rounded-xl font-bold text-md transition-all"
                            isLoading={isLoading}
                            fullWidth
                        >
                            {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
                        </Button>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">ou</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* renders guest access button */}
                        <Button
                            type="button"
                            variant="bordered"
                            onClick={() => router.push('/learn')}
                            disabled={isLoading}
                            className="border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 p-6 rounded-xl font-bold text-md transition-all"
                            fullWidth
                        >
                            Pular e continuar sem conta
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;