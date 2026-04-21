import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RiskDetailDrawer from "../components/RiskDetailDrawer";

const MobileLayout = () => {
  const location = useLocation();

  // No global steps

  return (
    // Outer Container: Lock scroll
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex items-center justify-center">
      {/* Mobile Frame: Fixed size or full height, overflow handled inside */}
      <div className="w-full h-full max-w-md bg-white flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header - Shown on all pages except Landing and Complete */}

        {/* Main Content: Layout Shell */}
        <main className="flex-1 overflow-hidden relative bg-white">
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={{ opacity: location.pathname === "/result" ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: location.pathname === "/result" ? 0 : 0.25,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex flex-col min-h-0 overflow-hidden"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global UI Elements within Mobile Frame */}
        <RiskDetailDrawer />
      </div>
    </div>
  );
};

export default MobileLayout;
