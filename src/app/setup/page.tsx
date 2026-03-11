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
    // são extraídos e estruturados os dados dos alunos a partir do documento
// são lidos e processados os dados textuais brutos para estruturação em json
const studentsData = [
    { name: "Alex de Sousa Alves", email: "alexsousa50@alu.ufc.br", matricula: "558446" }, // [cite: 84, 85, 86]
    { name: "Antonio Bryan de Almeida Abreu", email: "eng.antoniobryan@gmail.com", matricula: "507829" }, // [cite: 87, 88]
    { name: "Antonio Martins Neto", email: "martins.antonio@alu.ufc.br", matricula: "567638" }, // [cite: 88, 89, 90]
    { name: "Antonio Samuel de Lima Sousa", email: "samuelima162@gmail.com", matricula: "573060" }, // [cite: 91, 92]
    { name: "Caua Victor de Oliveira Ponte", email: "cv.ponte.cv@outlook.com", matricula: "540353" }, // [cite: 93, 94]
    { name: "Davi Gomes Rocha", email: "davigomesrocha@alu.ufc.br", matricula: "564686" }, // [cite: 95, 96]
    { name: "Debora Monte Loiola", email: "deboraloiola@alu.ufc.br", matricula: "566813" }, // [cite: 97, 98, 99]
    { name: "Emanoel Igor de Paulo Cosmo", email: "igoremanuel@alu.ufc.br", matricula: "483212" }, // [cite: 100, 101]
    { name: "Fernando Anderson Borges", email: "andersonborges59@alu.ufc.br", matricula: "511344" }, // [cite: 102, 103]
    { name: "Francisco Lucas Xavier Mapurunga Vieira", email: "lucas.vieira@alu.ufc.br", matricula: "563655" }, // [cite: 104, 105, 106, 107]
    { name: "Guilherme Agapito Lima", email: "guilherme.hpl@alu.ufc.br", matricula: "557609" }, // [cite: 108, 109, 110]
    { name: "Ana Vitoria Pinheiro Gomes", email: "anavitoriapinheirogomes@alu.ufc.br", matricula: "571392" }, // [cite: 111, 112]
    { name: "Antonio Kildere Sousa Menezes", email: "kilderesousa@alu.ufc.br", matricula: "567258" }, // [cite: 112, 113]
    { name: "Antonio Matheus da Costa Queiroz", email: "matheus2017jf@outlook.com", matricula: "565556" }, // [cite: 114, 115, 116]
    { name: "Augusto Rodrigues Paz Gregorio", email: "augustorod@alu.ufc.br", matricula: "565690" }, // [cite: 116, 117]
    { name: "Christian Ximenes Paiva", email: "christianximenes@alu.ufc.br", matricula: "552198" }, // [cite: 117, 118, 119]
    { name: "Davi Moura Guedes", email: "daviguedes@alu.ufc.br", matricula: "568251" }, // [cite: 120, 121, 122]
    { name: "Diana Maria Melo Matos", email: "dianamariamelomatos@alu.ufc.br", matricula: "569948" }, // [cite: 123, 124, 125]
    { name: "Eros Ryan Simette", email: "erosryansimette@hotmail.com", matricula: "552900" }, // [cite: 125, 126, 127]
    { name: "Francisco Felipe Rodrigues de Sousa", email: "felypesousa5444@alu.ufc.br", matricula: "499193" }, // [cite: 127, 128, 129]
    { name: "Geraldo Ariel de Oliveira Calland Leite", email: "geraldo.leite.calland@gmail.com", matricula: "580410" }, // [cite: 129, 130, 131, 132]
    { name: "Gustavo Fontenele Barros", email: "gustavofontenele@alu.ufc.br", matricula: "511439" }, // [cite: 132, 133, 134]
    { name: "Gustavo Paiva Aragao", email: "gustavopaiva@alu.ufc.br", matricula: "556871" }, // [cite: 135, 136, 137]
    { name: "Ianque Pereira da Silva", email: "ianquepereira@alu.ufc.br", matricula: "471014" }, // [cite: 138, 139, 140]
    { name: "Igor da Silva Pierre", email: "igor.pierre45@gmail.com", matricula: "470562" }, // [cite: 141, 142, 143]
    { name: "Ismael Johnny Marques Ferreira", email: "Johnny12mf@gmail.com", matricula: "398901" }, // [cite: 144, 145, 146]
    { name: "Joel Anderson Rodrigues", email: "joelrodrigues@alu.ufc.br", matricula: "571518" }, // [cite: 147, 148]
    { name: "Lara Vitoria Lima Braga", email: "lara.lbraga@alu.ufc.br", matricula: "540863" }, // [cite: 149, 150, 151]
    { name: "Luiz Felipe Siqueira Pereira", email: "luiz.siqueira695@gmail.com", matricula: "565732" }, // [cite: 152, 153]
    { name: "Marcilio Azevedo de Brito", email: "marcilioazevedo@alu.ufc.br", matricula: "568282" }, // [cite: 154, 155]
    { name: "Micaias Martins de Aquino", email: "micaiasmartins@alu.ufc.br", matricula: "535732" }, // [cite: 156, 157, 158]
    { name: "Pedro Rian Martins Fialho", email: "pedromartinsfialho@alu.ufc.br", matricula: "554275" }, // [cite: 159, 160]
    { name: "Ricardo Coimbra Bacelar Filho", email: "rcoimbra@alu.ufc.br", matricula: "567402" }, // [cite: 161, 162]
    { name: "Taynara de Araujo Alves", email: "tayalves@alu.ufc.br", matricula: "565040" }, // [cite: 163, 164, 165]
    { name: "Valcler Manoel Vieira Camelo Maia", email: "valcler.manoel@gmail.com", matricula: "576040" }, // [cite: 166, 167, 168]
    { name: "Ian Lopes Costa", email: "ianlopescosta@alu.ufc.br", matricula: "566497" }, // [cite: 169, 170, 171]
    { name: "Iarley Cavalcante Tavares Balreira", email: "iarleybalreira@gmail.com", matricula: "535946" }, // [cite: 172, 173, 174]
    { name: "Ines Lima Dantas", email: "ineslimadantas@alu.ufc.br", matricula: "500798" }, // [cite: 175, 176, 177]
    { name: "Joao Pedro de Alcantara Barbosa", email: "jpdralc.dev@gmail.com", matricula: "571390" }, // [cite: 178, 179]
    { name: "Jose Arthur Gomes Azevedo", email: "arthur.azevedo@alu.ufc.br", matricula: "567419" }, // [cite: 180, 181]
    { name: "Luis Felipe Pessoa Lacerda", email: "felipelacerda@alu.ufc.br", matricula: "508576" }, // [cite: 182, 183]
    { name: "Marcelo Henrique Teixeira de Souza Alves", email: "marcelohenriq@alu.ufc.br", matricula: "571393" }, // [cite: 183, 184, 185, 186]
    { name: "Maria Beatriz Vitorino Almeida", email: "beaalmeida@alu.ufc.br", matricula: "554155" }, // [cite: 187, 188]
    { name: "Pedro Levi Moura Ximenes", email: "plevimx@alu.ufc.br", matricula: "592812" }, // [cite: 189, 190, 191]
    { name: "Pedro Rickson Fernandes Aragao", email: "pedrorickson95.fa@gmail.com", matricula: "542619" }, // [cite: 192, 193]
    { name: "Ruan Pereira do Nascimento", email: "ruanpereira@alu.ufc.br", matricula: "508467" }, // [cite: 193, 194]
    { name: "Thamyres de Sousa Guilherme", email: "thamyresguilherme@alu.ufc.br", matricula: "542634" }, // [cite: 195, 196]
    { name: "William do Vale Mesquita", email: "william.vale123@gmail.com", matricula: "390185" } // [cite: 197, 198, 199]
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