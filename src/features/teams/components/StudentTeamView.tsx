"use client";

import { useTeamStore } from "../store/useTeamStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { FiShield } from "react-icons/fi";

export const StudentTeamView = () => {
    const { teams, students } = useTeamStore();
    const { userData } = useAuthStore();

    // early return if user data is missing
    if (!userData) return null;

    const myTeam = teams.find(t => t.id === userData.teamId);
    const myTeammates = students.filter(s => s.teamId === userData.teamId);

    if (!myTeam) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[40vh] bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-10">
                <FiShield className="text-4xl text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-main-black">Você ainda não possui uma equipe.</h2>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">Aguarde o professor designar você a uma equipe para começar a pontuar coletivamente!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 mt-6">
            <div className="bg-main-black text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Sua Equipe</span>
                    <h1 className="text-3xl font-black">{myTeam.name}</h1>
                </div>
                <div className="relative z-10 flex flex-col items-center bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-3xl font-black text-orange-400">{myTeam.totalPixelsEarned}</span>
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Pixels Coletados</span>
                </div>
                {/* decorative background element */}
                <FiShield className="absolute -right-10 -bottom-10 text-[200px] text-white/5 pointer-events-none" />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-main-black mb-6 border-b border-slate-100 pb-4">Aliados ({myTeammates.length})</h3>
                <div className="flex flex-col gap-3">
                    {myTeammates.map(member => (
                        <div key={member.uid} className={`flex justify-between items-center p-4 rounded-2xl border ${member.uid === userData.uid ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-main-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-main-black">
                                        {member.name} {member.uid === userData.uid && <span className="text-orange-500 text-xs ml-2">(Você)</span>}
                                    </span>
                                </div>
                            </div>
                            <div className="font-black text-orange-500 text-lg">
                                {member.pixels} <span className="text-xs text-slate-400 font-semibold">px</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};