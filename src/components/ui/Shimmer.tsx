interface ShimmerProps {
  height?: number | string;
  width?: number | string;
  className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({
  height = 16,
  className = "",
  width,
}) => {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gray-200  rounded-lg ${className}`}
      style={{ height: h, width: w }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Shimmer;
