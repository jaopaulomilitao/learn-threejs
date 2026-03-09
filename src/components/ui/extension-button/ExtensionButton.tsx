import React from 'react';
import { IconType } from 'react-icons';

interface ExtensionButtonProps {
    icon: IconType; // O ícone será um componente React
    isActive: boolean; // Estado ativo da extensão do Tiptap
    size?: number; // Tamanho da extensão, opcional (padrão será 20)
    onClick: () => void; // Função para manipular o clique no botão
}

const ExtensionButton: React.FC<ExtensionButtonProps> = ({
    icon: Icon,
    isActive,
    size = 15, // Define 20 como valor padrão se a `prop` não for passada
    onClick,
}) => {
    // Estilos de botão com animações de hover e clique
    const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer';
    const normalClasses = 'text-gray-600 transition-all duration-300 transform hover:-translate-y-1'; // Translação no hover
    const selectedClasses = 'bg-main-white text-main-black';

    return (
        <button
            className={`${baseClasses} ${isActive ? selectedClasses : normalClasses}`}
            onClick={onClick}
        >
            <Icon size={size} /> {/* Define o ícone com o tamanho repassado pela prop */}
        </button>
    );
};

export default ExtensionButton;
