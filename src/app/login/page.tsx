'use client';

import { useState } from 'react';
import { login } from '../../features/auth/api/auth';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { MdLockOutline, MdOutlineMailOutline } from 'react-icons/md';


const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            window.location.href = '/edit';
        } catch (err) {
            setError('Credenciais inválidas. Por favor, tente novamente.' + (err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col gap-2 items-center pt-8 pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Bem-vindo(a) de volta</h1>
                    <p className="text-sm text-gray-500">
                        Faça login para poder acessar o controle das práticas
                    </p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            startContent={<MdOutlineMailOutline className="w-4 h-4 text-gray-400" />}
                            isRequired
                            classNames={{
                                input: "placeholder:text-gray-400 p-3 rounded-lg",

                            }}
                        />

                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            startContent={<MdLockOutline className="w-4 h-4 text-gray-400" />}
                            isRequired
                            classNames={{
                                input: "placeholder:text-gray-400 p-3 rounded-lg",

                            }}
                        />

                        {error && (
                            <div className="p-3 rounded bg-red-50 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="mt-2 bg-main-black text-main-white hover:bg-main-black/80 p-4 rounded-lg"
                            isLoading={isLoading}
                            fullWidth
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>

                        {/* <div className="text-center mt-4">
                            <a href="/forgot-password" className="text-sm text-main-black hover:underline">
                                Esqueceu sua senha?
                            </a>
                        </div> */}
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;