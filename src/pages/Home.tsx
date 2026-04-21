import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../components/common/StepIndicator";
import { useContract } from "../hooks/useContract";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { ANALYSIS_STEPS } from "../constants/analysis";
import CommonButton from "../components/common/CommonButton";

const Home = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { file, handleFileSelect } = useContract();
  const { resetAnalysisData } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  // 컴포넌트 마운트 시 이전 분석 데이터 초기화
  useEffect(() => {
    resetAnalysisData();
  }, [resetAnalysisData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden relative select-none">
      {/* 1. Step Indicator - Integral to the page flow */}
      <div className="flex-none">
        <StepIndicator
          currentStep={1}
          totalSteps={ANALYSIS_STEPS.length}
          labels={ANALYSIS_STEPS}
        />
      </div>

      {/* 2. Main Content Container - Mathematically Centered */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-12 space-y-8 animate-in fade-in duration-700">
        {/* Title Section */}
        <section className="text-center space-y-3 px-4">
          <h2 className="text-3xl font-black text-[#203b6d] tracking-tight leading-tight break-keep">
            검토가 필요한 <br />
            <span className="text-blue-600">계약서를 등록하세요</span>
          </h2>
          <p className="text-[17px] text-slate-600 font-semibold leading-relaxed break-keep">
            전문가 수준의 AI가 독소조항을 <br />
            정밀하게 감지해 드립니다.
          </p>
        </section>

        {/* Upload Area */}
        <section className="w-full max-w-sm mx-auto">
          {file ? (
            <div className="bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-in zoom-in duration-300">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                파일이 준비되었습니다
              </h3>
              <p className="text-[13px] text-blue-600 font-bold bg-blue-50/50 px-4 py-1.5 rounded-full inline-block max-w-[200px] truncate mb-8">
                {file.name}
              </p>

              <div className="space-y-3">
                <CommonButton
                  label="파일 미리보기"
                  onClick={() => navigate("/preview")}
                />
                <CommonButton
                  label="다른 문서 선택하기"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "relative group cursor-pointer aspect-[1.1] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center px-10 text-center",
                isDragging
                  ? "border-blue-500 bg-blue-50 scale-[1.02]"
                  : "border-slate-300 bg-white hover:border-blue-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-slate-200/50",
              )}
            >
              <div className="w-[68px] h-[68px] bg-slate-100 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-7 h-7 text-[#203b6d]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-[#203b6d]">
                  문서 업로드
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  PDF 파일을 여기에 끌어오거나
                  <br />
                  클릭해서 업로드하세요
                </p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf, application/pdf"
            onChange={handleFileChange}
          />
        </section>

        {/* Security Notice - Information Masking Focus */}
        <section className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm flex items-start space-x-4">
          <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#203b6d] text-sm">
              보안 및 개인정보 보호
            </h4>
            <p className="text-[12px] text-slate-500 font-medium leading-relaxed break-keep">
              사용자 정보를{" "}
              <span className="text-blue-600 font-bold">마스킹(가림) 처리</span>{" "}
              후 분석하여 <br />
              개인정보를 철저하게 보호하고 안전하게 처리합니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
