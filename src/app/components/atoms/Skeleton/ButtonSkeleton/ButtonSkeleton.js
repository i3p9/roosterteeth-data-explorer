export const ButtonSkeleton = ({ width }) => {
    return (
        <div className={`w-${width.toString()} p-1 mb-2 h-8 bg-gray-300 rounded-md animate-pulse`}></div>
    );
};
