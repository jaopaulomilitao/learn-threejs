"use client";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config"; // sua config principal do firestore

// inserts your exact firebase config here for the secondary app
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// initializes a secondary app to prevent logging out the current admin
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

// mock JSON with the class data (name, email, matricula)
const studentsData = [
    { name: "João Silva", email: "joao.silva@ufc.br", matricula: "555111" },
    { name: "Maria Oliveira", email: "maria.o@ufc.br", matricula: "555222" },
    
    // cole o json inteiro da sua turma aqui...
];

export default function SetupPage() {
    const [log, setLog] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const handleBulkImport = async () => {
        setIsImporting(true);
        setLog((prev) => [...prev, "Iniciando importação de alunos..."]);

        for (const student of studentsData) {
            try {
                // creates the user in firebase auth using the secondary instance
                // uses matricula as the default initial password
                const userCredential = await createUserWithEmailAndPassword(
                    secondaryAuth, 
                    student.email, 
                    student.matricula 
                );
                
                const uid = userCredential.user.uid;

                // creates the user profile document in firestore
                await setDoc(doc(firestore, "users", uid), {
                    uid: uid,
                    name: student.name,
                    email: student.email,
                    role: "student",
                    teamId: null,
                    pixels: 0,
                });

                setLog((prev) => [...prev, `✅ Sucesso: ${student.name} criado.`]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setLog((prev) => [...prev, `❌ Erro em ${student.name}: ${error.message}`]);
            }
        }

        setLog((prev) => [...prev, "🎉 Importação finalizada!"]);
        setIsImporting(false);
    };

    return (
        <div className="p-10 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Setup: Importação de Alunos</h1>
            <p className="mb-6 text-slate-500">
                Este script criará as contas no Authentication e os documentos na coleção "users". 
                A senha padrão será a matrícula do aluno.
            </p>

            <button
                onClick={handleBulkImport}
                disabled={isImporting}
                className="bg-main-black text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
            >
                {isImporting ? "Importando..." : "Iniciar Importação em Lote"}
            </button>

            <div className="mt-8 bg-slate-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                {log.length === 0 && <span className="text-slate-500">Aguardando execução...</span>}
                {log.map((message, idx) => (
                    <div key={idx}>{message}</div>
                ))}
            </div>
        </div>
    );
}