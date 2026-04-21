export const DUMMY_PDF_BASE64 =
  "JVBERi0xLjcKMSAwIG9iaiA8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iaiAyIDAgb2JqIDw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kb2JqIDMgMCBvYmogPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqIDQgMCBvYmogPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj5lbmRvYmogNSAwIG9iaiA8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVC9GMSAyNCBUZiAxMDAgNzAwIFRkIChBSSBBbmFseXNpcyBSZXBvcnQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMDkgMDAwMDAgbgowMDAwMDAwMDU2IDAwMDAwIG4KMDAwMDAwMDExMSAwMDAwMCBuCjAwMDAwMDAyMTIgMDAwMDAgbgowMDAwMDAwMjg0IDAwMDAwIG4KdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozNzgKJSVFT0YK";

export const MOCK_ANALYSIS_REPORT = {
  status: "COMPLETED",
  fileName: "2026_가맹계약서_원본.pdf",
  reportInfo: {
    brandName: "(주)OOO 가맹본부",
    analysisDate: "2026-01-27",
  },
  results: [
    {
      cid: "uuid-chunk-012",
      pageNumber: 1,
      tag: "interior",
      tagName: "점포환경개선",
      text: "제 5조 가맹본부는 점포의 인테리어 시공 시 특정 업체를 지정할 수 있다.",
      aiAnalysis:
        "해당 조항은 가맹본부가 특정 시공업체 이용을 강제하고 있어 가맹사업법 제12조제1항 위반 소지가 있습니다. 특히 '비공개 내부지표'로만 판단하여 시공을 강제하는 행위는 부당한 구입강제에 해당할 위험이 큽니다.",
      negotiationScript:
        "가맹사업법 제12조 및 동법 시행령 제13조에 명시된 가맹점주의 선택권을 존중해 주시기 바랍니다. 특정 업체 지정이 아닌 기준 충족 시 점주가 직접 선정할 수 있도록 수정을 요청합니다.",
      checkItem: "인테리어: 특정 업체 강요 여부 확인 및 점주 시공권 보장",
    },
    {
      cid: "uuid-chunk-017",
      pageNumber: 2,
      tag: "transfer",
      tagName: "양도양수 제한",
      text: "제 10조 가맹점주는 본사의 사전 서면 동의 없이 가맹점을 제3자에게 양도할 수 없으며, 본사는 자의적 기준으로 이를 거절할 수 있다.",
      aiAnalysis:
        "양수인 자격을 '비공개 내부지표'로만 판단·거절사유도 비공개면, 양도 관련 사항을 계약서에 포함해야 하는 가맹사업법 제11조제2항제7호 취지에 반해 자의적 거절 위험이 큼.",
      negotiationScript:
        "가맹사업법 제11조에 따라 양수인의 자격 요건과 거절 사유를 구체적으로 명시해 주시기 바랍니다.",
      checkItem: "양도양수: 거절 사유의 구체성 및 정당성 확인",
    },
    {
      cid: "uuid-chunk-013",
      pageNumber: 3,
      tag: "supply",
      tagName: "필수품목",
      text: "제 12조 가맹점주는 주방 세제 및 소모품 일체를 본사가 지정한 공급업체로부터만 구매해야 한다.",
      aiAnalysis:
        "브랜드 통일성과 무관한 공산품까지 필수품목으로 지정하는 것은 가맹사업법 제12조의 '구입강제'에 해당할 수 있습니다.",
      negotiationScript:
        "범용적으로 사용되는 소모품은 점주가 직접 저렴하게 구매할 수 있도록 품목 제외를 요청합니다.",
      checkItem: "필수품목: 부당한 구입강제 품목 포함 여부 확인",
    },
    {
      cid: "uuid-chunk-014",
      pageNumber: 3,
      tag: "termination",
      tagName: "계약해지",
      text: "제 25조 가맹점주가 본사의 운영 방침에 1회 위반 시 본사는 즉시 계약을 해지할 수 있다.",
      aiAnalysis:
        "가맹사업법상 계약해지는 2개월 이상의 유예기간과 2회 이상의 서면 통보가 필요합니다. 즉시 해지 조항은 부당합니다.",
      negotiationScript:
        "가맹사업법 제14조의 절차를 준수하도록 수정하고, 단순 과실로 인한 즉시 해지 범위를 축소해 주세요.",
      checkItem: "계약해지: 법적 해지 절차 준수 여부 및 사유의 정당성",
    },
    {
      cid: "uuid-chunk-015",
      pageNumber: 5,
      tag: "fee",
      tagName: "광고비",
      text: "제 18조 본사가 진행하는 모든 광고 및 판촉 행사의 비용은 가맹점주가 100% 부담한다.",
      aiAnalysis:
        "광고/판촉 비용은 본사와 점주 간의 합의나 분담이 원칙입니다. 일방적 전가는 불공정 거래 행위에 해당할 수 있습니다.",
      negotiationScript:
        "본사도 브랜드 가치 상승의 수혜자이므로 광고비 분담 비율(예: 5:5) 조정을 제안합니다.",
      checkItem: "광고/판촉비: 비용 전가 및 사전 동의 여부 확인",
    },
    {
      cid: "uuid-chunk-016",
      pageNumber: 6,
      tag: "delivery",
      tagName: "영업지역",
      text: "제 30조 본사는 가맹점의 영업지역 내에서도 직영점을 개설하거나 다른 가맹점의 배달 영업을 허용할 수 있다.",
      aiAnalysis:
        "영업지역 내 유사 업종 배달 허용은 영업지역 보호 의무 위반이며 점주의 수익권을 심각하게 침해합니다.",
      negotiationScript:
        "영업지역 내 독점적 영업권 보장을 명문화하고, 배달 구역 중첩 방지 대책을 요구하세요.",
      checkItem: "영업지역: 보호 의무 위반 및 침해 조항 확인",
    },
  ],
  finalChecklist: [
    {
      title: "인테리어 시공권 확보",
      content: "본사 지정 업체 강요 여부 확인 및 점주 시공권 보장 요청",
    },
  ],
};
