import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MobileLayout from "./layout/MobileLayout";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Result from "./pages/Result";
import Preview from "./pages/Preview";
import AnalysisLoading from "./pages/AnalysisLoading";
import AnalysisComplete from "./pages/AnalysisComplete";
import NotFound from "./pages/NotFound";

import GlobalModal from "./components/common/GlobalModal";
import AnalysisObserver from "./components/AnalysisObserver";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
      gcTime: 1000 * 60 * 30, // 30분 후 가비지 컬렉션
      retry: 1, // 실패 시 1회만 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 끔
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnalysisObserver />
        <GlobalModal />
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<Landing />} />
            <Route path="upload" element={<Home />} />
            <Route path="result" element={<Result />} />
            <Route path="preview" element={<Preview />} />
            <Route path="analysis-loading" element={<AnalysisLoading />} />
            <Route path="complete" element={<AnalysisComplete />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
