import { useEffect } from "react";

function useScrollReveal() {
    useEffect(() => {
        const elements = document.querySelectorAll(
            "[data-reveal], [data-timeline-item]"
        );

        if (navigator.userAgent === "ReactSnap") {
            window.snapSaveState = () => {
                document.documentElement.dataset.prerendered = "true";
            };

            return undefined;
        }

        delete document.documentElement.dataset.prerendered;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return undefined;
        }

        let previousScrollY = window.scrollY;
        let animationFrameId = null;

        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;

            if (Math.abs(currentScrollY - previousScrollY) > 2) {
                document.documentElement.dataset.scrollDirection =
                    currentScrollY < previousScrollY ? "up" : "down";
                previousScrollY = currentScrollY;
            }

            animationFrameId = null;
        };

        const handleScroll = () => {
            if (animationFrameId === null) {
                animationFrameId = window.requestAnimationFrame(
                    updateScrollDirection
                );
            }
        };

        document.documentElement.dataset.scrollDirection = "down";
        window.addEventListener("scroll", handleScroll, { passive: true });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle(
                        "is-visible",
                        entry.isIntersecting
                    );
                });
            },
            {
                rootMargin: "-6% 0px -8% 0px",
                threshold: 0.08,
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);
}

export default useScrollReveal;
