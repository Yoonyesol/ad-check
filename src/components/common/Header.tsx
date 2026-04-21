import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showHomeButton?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isHomeHeader?: boolean;
  className?: string;
}

const Header = ({
  title,
  showBackButton = false,
  onBack,
  showHomeButton = false,
  leftElement,
  rightElement,
  isHomeHeader = false,
  className,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.header
      className={cn(
        "bg-indigo-950/90 backdrop-blur-lg p-3 px-5 sticky top-0 z-50 border-b border-white/10 flex justify-between items-center safe-area-top flex-none min-h-[64px]",
        className,
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {isHomeHeader ? (
            <motion.div
              key="home-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="w-7 mr-2.5 brightness-110"
              />
              <h1 className="text-3xl font-black bg-gradient-to-br from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                바른계약
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="page-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Left Section */}
              <div className="absolute left-0 flex items-center">
                {showBackButton && (
                  <button
                    onClick={handleBack}
                    className="p-2 text-white/70 hover:bg-white/10 rounded-full transition-all -ml-2 active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {leftElement}
              </div>

              {/* Center Section */}
              <h1 className="text-xl font-extrabold text-white truncate px-10 tracking-tight">
                {title}
              </h1>

              {/* Right Section */}
              <div className="absolute right-0 flex items-center">
                {rightElement}
                {showHomeButton && (
                  <button
                    onClick={() => navigate("/")}
                    className="p-2 text-white/70 hover:bg-white/10 rounded-full transition-all -mr-2 active:scale-95"
                  >
                    <Home className="w-6 h-6" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
