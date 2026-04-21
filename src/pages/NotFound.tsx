import { useNavigate } from "react-router-dom";
import {
  Home,
  AlertCircle,
  Search,
  FileQuestion,
  ChevronLeft,
} from "lucide-react";
import Header from "../components/common/Header";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full h-full max-w-md bg-slate-50 flex flex-col shadow-2xl relative overflow-hidden">
        <Header title="페이지를 찾을 수 없음" showHomeButton={true} />

        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
          {/* SVG-based Illustration */}
          <div className="relative mb-12 flex items-center justify-center">
            {/* Animated Background Circles */}
            <div className="absolute w-64 h-64 bg-primary-100/50 rounded-full animate-pulse"></div>
            <div className="absolute w-48 h-48 bg-primary-200/30 rounded-full animate-pulse [animation-delay:1000ms]"></div>

            <div className="relative flex flex-col items-center">
              <div className="relative">
                <FileQuestion className="w-32 h-32 text-primary-500 stroke-[1.5]" />
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 animate-bounce">
                  <Search className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {/* Decorative SVG Elements (404 Text) */}
              <div className="mt-4 flex space-x-2">
                <span className="text-6xl font-black text-slate-200 select-none">
                  4
                </span>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl rotate-12 shadow-md flex items-center justify-center border border-white/20">
                  <span className="text-white font-bold text-2xl">0</span>
                </div>
                <span className="text-6xl font-black text-slate-200 select-none">
                  4
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-xs z-10">
            <div className="flex items-center justify-center space-x-2 text-primary-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider font-heading">
                ERROR 404
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              원하시는 페이지를
              <br />
              찾을 수 없습니다.
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed">
              입력하신 주소가 잘못되었거나,
              <br />
              페이지가 삭제되어 접근할 수 없습니다.
            </p>
          </div>

          <div className="mt-12 w-full max-w-xs space-y-3 z-10">
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>홈으로 돌아가기</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-4 px-6 bg-slate-50 text-slate-600 rounded-xl font-medium hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>이전 페이지로</span>
            </button>
          </div>
        </main>

        {/* <footer className="p-6 text-center bg-white flex-none border-t border-slate-50">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Bareun Contract. All rights reserved.
          </p>
        </footer> */}
      </div>
    </div>
  );
};

export default NotFound;
