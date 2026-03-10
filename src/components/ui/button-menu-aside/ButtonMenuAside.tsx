'use client';

import clsx from 'clsx';
import { FiTrash2 } from 'react-icons/fi';
import { MdBookmark, MdBookmarkBorder, MdOutlineDragIndicator } from 'react-icons/md';

interface ButtonMenuAsideProps {
    title: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
    onDelete?: () => void;
    isEditable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dragListeners?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dragAttributes?: any;
}

const ButtonMenuAside: React.FC<ButtonMenuAsideProps> = ({ 
    title, 
    color, 
    isSelected, 
    onClick,
    onDelete,
    isEditable = false,
    dragListeners,
    dragAttributes
}) => {
    return (
        <div className="flex items-center w-full group gap-1">
            {/* renders the drag handle only in editable mode */}
            {isEditable && (
                <div 
                    {...dragListeners} 
                    {...dragAttributes} 
                    className="p-1 cursor-grab active:cursor-grabbing text-main-black/30 hover:text-main-black/60 shrink-0"
                >
                    <MdOutlineDragIndicator size={20} />
                </div>
            )}

            {/* main button with flex-1 and min-w-0 to prevent flexbox overflow */}
            <button
                onClick={onClick}
                className={clsx(
                    'flex-1 flex items-center p-2 rounded-md transition-all duration-200 ease-in-out transform min-w-0', 
                    {
                        'bg-main-white border-main-black/10 border font-bold shadow-md scale-105': isSelected, 
                        'bg-white hover:bg-main-white border-main-black/10 border shadow-sm hover:scale-105': !isSelected, 
                    }
                )}
            >
                {/* renders the bookmark icon based on selection state */}
                {isSelected ? (
                    <MdBookmark className="w-5 h-5 shrink-0" style={{ color }} />
                ) : (
                    <MdBookmarkBorder className="w-5 h-5 shrink-0" style={{ color }} />
                )}
                {/* truncate cuts the text with ellipsis if it's too long */}
                <p className="pl-2 text-sm text-left truncate w-full">{title}</p>
            </button>

            {/* renders the delete button using flex layout instead of absolute */}
            {isEditable && onDelete && (
                <button
                    onClick={(e) => {
                        // prevents the click from bubbling up and selecting the lesson
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1.5 shrink-0 text-red-500 transition-opacity opacity-50 bg-white border border-red-200 rounded-md shadow-sm group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
                    title="Delete lesson"
                >
                    <FiTrash2 size={14} />
                </button>
            )}
        </div>
    );
};

export default ButtonMenuAside;