'use client';

import clsx from 'clsx';

interface ButtonMenuAsideProps {
    title: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
}

const ButtonMenuAside: React.FC<ButtonMenuAsideProps> = ({ title, color, isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'w-full text-left p-2 rounded-md flex items-center transition-all duration-200 ease-in-out transform', // Classes para transição suave
                {
                    'bg-main-white border-main-black/10 border font-bold shadow-md scale-105': isSelected, // Estado selecionado com sombra e leve escala
                    'bg-white hover:bg-main-white border-main-black/10 border shadow-sm hover:scale-105': !isSelected, // Estado normal e hover
                }
            )}
        >
            <span
                className="inline-block w-4 h-4 rounded-sm"
                style={{ backgroundColor: color }}
            ></span>
            <p className="text-sm max-w-48 pl-2">{title}</p>
        </button>
    );
};

export default ButtonMenuAside;
