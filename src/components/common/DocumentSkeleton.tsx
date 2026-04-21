import { motion } from "framer-motion";

interface DocumentSkeletonProps {
  width: number;
  fullArea?: boolean;
}

// Toss-style shimmer component
const ShimmerOverlay = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1], // More natural shimmer ease
    }}
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      width: "100%",
      zIndex: 10,
    }}
  />
);

const DocumentSkeleton = ({
  width,
  fullArea = true,
}: DocumentSkeletonProps) => {
  // A4 ratio is approx 1:1.4142
  const height = width * 1.4142;

  // Use fixed pseudo-random widths for text mode
  const getLineWidth = (index: number) => {
    const sequence = [
      85, 92, 78, 88, 95, 82, 90, 84, 89, 93, 80, 87, 85, 92, 78,
    ];
    return sequence[index % sequence.length];
  };

  return (
    <div
      style={{ width, height }}
      className="bg-white rounded-sm shadow-xl overflow-hidden flex flex-col relative shrink-0"
    >
      {fullArea ? (
        // Full Area Shimmer (Toss Style)
        <>
          <div className="absolute inset-0 bg-slate-50/30" />
          <ShimmerOverlay />
          {/* Subtle line hints for texture without distraction */}
          <div className="p-[10%] space-y-[6%] w-full flex flex-col items-center">
            <div className="h-[2%] w-[40%] bg-slate-100/50 rounded-sm mb-[10%]" />
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="h-[0.8%] bg-slate-100/30 rounded-full"
                style={{ width: `${60 + Math.random() * 20}%` }}
              />
            ))}
          </div>
        </>
      ) : (
        // Legacy detailed mode (if needed)
        <div className="p-[10%] space-y-[6%] w-full relative pr-[8%]">
          <div className="h-[2.5%] w-[40%] bg-slate-100 rounded-sm mb-[10%] relative overflow-hidden">
            <ShimmerOverlay />
          </div>
          {[...Array(12)].map((_, i) => (
            <div
              key={`line-1-${i}`}
              className="h-[1%] bg-slate-100 rounded-sm relative overflow-hidden"
              style={{ width: `${Math.min(getLineWidth(i), 85)}%` }}
            >
              <ShimmerOverlay />
            </div>
          ))}
        </div>
      )}

      {/* Border for better definition */}
      <div className="absolute inset-0 border border-slate-200/50 pointer-events-none" />
    </div>
  );
};

export default DocumentSkeleton;
