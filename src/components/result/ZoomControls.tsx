import { ZoomIn, RotateCcw, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
  return (
    <div className="absolute bottom-6 right-2 z-10 flex flex-col space-y-2">
      <button
        onClick={onZoomIn}
        className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl hover:bg-white text-slate-600 active:scale-95 transition-all rounded-xl"
        title="확대"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={onReset}
        className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl hover:bg-white text-slate-600 active:scale-95 transition-all rounded-xl"
        title="초기화"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl hover:bg-white text-slate-600 active:scale-95 transition-all rounded-xl"
        title="축소"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ZoomControls;
