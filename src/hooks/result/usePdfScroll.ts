import { useRef, useEffect, useCallback } from "react";

interface UsePdfScrollProps {
    pdfNumPages: number;
    pdfScale: number;
    onPageChange: (pageNum: number) => void;
    onPageClickExtra?: (pageNum: number) => void;
}

export const usePdfScroll = ({
    pdfNumPages,
    pdfScale,
    onPageChange,
    onPageClickExtra,
}: UsePdfScrollProps) => {
    const pdfContainerRef = useRef<HTMLDivElement | null>(null);
    const isAutoScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const visibilityRatiosRef = useRef<Map<number, number>>(new Map());
    const currentPageRef = useRef(1);

    useEffect(() => {
        const container = pdfContainerRef.current;
        if (!container || pdfNumPages === 0) return;

        const observerOptions = {
            root: container,
            rootMargin: "0px",
            threshold: [0, 0.25, 0.5, 0.75, 1.0],
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (isAutoScrollingRef.current) return;

            entries.forEach((entry) => {
                const pageNum = Number(entry.target.getAttribute("data-page-number"));
                if (pageNum) {
                    visibilityRatiosRef.current.set(pageNum, entry.intersectionRatio);
                }
            });

            let maxRatio = -1;
            let bestPage = currentPageRef.current;

            visibilityRatiosRef.current.forEach((ratio: number, pageNum: number) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    bestPage = pageNum;
                }
            });

            if (maxRatio > 0.15 && bestPage !== currentPageRef.current) {
                currentPageRef.current = bestPage;
                onPageChange(bestPage);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const pageElements = container.querySelectorAll("[data-page-number]");
        pageElements.forEach((el) => observer.observe(el));

        const releaseLock = () => {
            if (isAutoScrollingRef.current) {
                isAutoScrollingRef.current = false;
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = null;
                }
            }
        };

        container.addEventListener("wheel", releaseLock, { passive: true });
        container.addEventListener("touchstart", releaseLock, { passive: true });

        return () => {
            observer.disconnect();
            container.removeEventListener("wheel", releaseLock);
            container.removeEventListener("touchstart", releaseLock);
        };
    }, [pdfNumPages, pdfScale, onPageChange]);

    const handlePageClick = useCallback((pageNum: number) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        isAutoScrollingRef.current = true;
        currentPageRef.current = pageNum;
        onPageChange(pageNum);

        visibilityRatiosRef.current.clear();

        const pageElement = document.querySelector(`[data-page-number="${pageNum}"]`);
        if (pageElement) {
            pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        onPageClickExtra?.(pageNum);

        scrollTimeoutRef.current = setTimeout(() => {
            isAutoScrollingRef.current = false;
            scrollTimeoutRef.current = null;
        }, 1500);
    }, [onPageChange, onPageClickExtra]);

    return {
        pdfContainerRef,
        handlePageClick,
    };
};
