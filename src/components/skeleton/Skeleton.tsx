// components/Skeleton.tsx
import clsx from "clsx";

interface SkeletonProps {
    className?: string; // Recebe apenas o className
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
}) => {
    return (
        <div
            className={clsx(
                className,
                "bg-gray-300/40 animate-pulse border-[1.5px] border-gray-300/70 rounded-lg"
            )}
        />
    );
};

export default Skeleton;
