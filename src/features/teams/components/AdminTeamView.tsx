"use client";

import { useState } from "react";
import { useTeamStore } from "../store/useTeamStore";
import { FiPlus, FiTrash2, FiAward, FiUserMinus, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@nextui-org/react";
import { toast } from "sonner";
import { useReward } from "react-rewards";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TeamCard = ({ team, students, unassignedStudents, removeTeam, assignStudent, awardPixels }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamMembers = students.filter((s: any) => s.teamId === team.id);
    const [amountStr, setAmountStr] = useState("");
    
    // initializes the confetti animation mapped to this specific team's button
    const { reward, isAnimating } = useReward(`reward-${team.id}`, 'confetti', {
        position: 'absolute',
        angle: 90,
        spread: 60,
        elementCount: 80,
        startVelocity: 25,
        lifetime: 200,
        zIndex: 50,
    });

    const handleAwardCustom = () => {
        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount === 0) return;

        const isAdding = amount > 0;
        const msg = isAdding 
            ? `Adicionar ${amount} pixels para a ${team.name}?`
            : `Remover ${Math.abs(amount)} pixels da ${team.name}?`;
        
        // replaces window.confirm with interactive sonner toast
        toast(msg, {
            description: "Essa ação afetará todos os alunos da equipe simultaneamente.",
            duration: Infinity, // longer duration to allow for reading
            action: {
                label: 'Confirmar',
                onClick: async () => {
                    await awardPixels(team.id, amount);
                    if (isAdding) reward(); // triggers confetti only when adding pixels
                    toast.success(`Pixels ${isAdding ? 'adicionados' : 'removidos'} com sucesso!`);
                    setAmountStr("");
                }
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss()
            }
        });
    };

    const handleRemoveTeam = () => {
        toast(`Excluir a equipe ${team.name}?`, {
            description: "A equipe será removida, mas os alunos não perderão seus pixels individuais.",
            action: {
                label: 'Excluir',
                onClick: () => {
                    removeTeam(team.id);
                    toast.success("Equipe excluída com sucesso!");
                }
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss()
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 transition-all hover:border-slate-300">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-black text-main-black">{team.name}</h2>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                        Histórico: <span className="text-orange-500">{team.totalPixelsEarned} Pixels Coletados</span>
                    </p>
                </div>
                <button onClick={handleRemoveTeam} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={20} />
                </button>
            </div>

            {/* custom award controls */}
            <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 w-full relative">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 shrink-0 hidden sm:block">
                    <FiAward className="inline mr-1 text-orange-500" /> Pixels
                </span>
                <div className="flex-1 flex gap-2 ml-auto justify-end">
                    <input 
                        type="number" 
                        placeholder="Qtd"
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        className="w-20 p-2 rounded-lg border border-slate-200 text-sm font-bold text-center focus:outline-none focus:border-main-black bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleAwardCustom()}
                    />
                    <button 
                        onClick={handleAwardCustom} 
                        disabled={!amountStr || isAnimating}
                        className="relative px-4 py-2 bg-main-black border border-slate-200 rounded-lg text-sm font-bold text-white hover:bg-main-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {/* anchor for the confetti explosion */}
                        <span id={`reward-${team.id}`} className="absolute top-1/2 left-1/2" />
                        Aplicar
                    </button>
                </div>
            </div>

            {/* team members list */}
            <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Membros da Equipe ({teamMembers.length})</h4>
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {teamMembers.map((member: any) => (
                        <div key={member.uid} className="flex justify-between items-center bg-white border border-slate-100 shadow-sm p-3 rounded-xl hover:border-slate-200 transition-colors">
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-main-black truncate">{member.name}</span>
                                <span className="text-xs font-semibold text-orange-500">{member.pixels} pixels</span>
                            </div>
                            <button onClick={() => assignStudent(member.uid, null)} className="text-slate-400 hover:text-red-500 p-2 transition-colors shrink-0" title="Remover da equipe">
                                <FiUserMinus />
                            </button>
                        </div>
                    ))}
                    {teamMembers.length === 0 && <p className="text-sm text-slate-400 italic py-2">Nenhum membro na equipe.</p>}
                </div>
            </div>

            {/* add member section */}
            <div className="mt-2 pt-4 border-t border-slate-100">
                <select 
                    onChange={(e) => {
                        if (e.target.value) {
                            assignStudent(e.target.value, team.id);
                            toast.success("Aluno adicionado à equipe!");
                            e.target.value = ""; 
                        }
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:border-main-black focus:ring-1 focus:ring-main-black transition-all bg-white"
                >
                    <option value="">+ Adicionar aluno sem equipe...</option>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {unassignedStudents.map((student: any) => (
                        <option key={student.uid} value={student.uid}>{student.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export const AdminTeamView = () => {
    const { teams, students, addTeam, removeTeam, assignStudent, awardPixels } = useTeamStore();
    const [newTeamName, setNewTeamName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        await addTeam(newTeamName);
        toast.success(`Equipe ${newTeamName} criada com sucesso!`);
        setNewTeamName("");
        setIsCreateModalOpen(false); 
    };

    // filters teams based on search input (team name or member name)
    const filteredTeams = teams.filter(team => {
        const matchTeamName = team.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchMemberName = students
            .filter(s => s.teamId === team.id)
            .some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchTeamName || matchMemberName;
    });

    const unassignedStudents = students.filter(s => !s.teamId);

    return (
        <div className="w-full flex flex-col gap-6">
            
            {/* top toolbar: search and create button */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <Input
                    type="text"
                    placeholder="Pesquisar equipe ou aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<FiSearch className="text-slate-400 m-2" />}
                    className="w-full md:max-w-md p-2 rounded-md outline-none"
                    classNames={{ inputWrapper: "bg-slate-50 shadow-none border-none" }}
                />
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full md:w-auto bg-main-black text-white hover:bg-main-black/80 font-bold rounded-xl py-6 flex items-center gap-2">
                            <FiPlus className="text-lg" /> Nova Equipe
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-main-black">Criar Equipe</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateTeam} className="flex flex-col gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Nome da equipe (ex: Equipe Alpha)"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-main-black bg-slate-50"
                                autoFocus
                            />
                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="rounded-xl font-bold">Cancelar</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-main-green hover:bg-main-green/90 text-white rounded-xl font-bold" disabled={!newTeamName.trim()}>
                                    Confirmar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* teams grid mapping to isolated TeamCards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTeams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        students={students}
                        unassignedStudents={unassignedStudents}
                        removeTeam={removeTeam}
                        assignStudent={assignStudent}
                        awardPixels={awardPixels}
                    />
                ))}
                
                {filteredTeams.length === 0 && (
                    <div className="col-span-1 lg:col-span-2 flex justify-center items-center py-10 text-slate-400 font-medium">
                        Nenhuma equipe encontrada.
                    </div>
                )}
            </div>
        </div>
    );
};