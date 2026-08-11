import { useEffect, useRef, useState } from "react"
import testimonialIcon from "../../assets/icon/TestimonialIcon.svg"
import star from "../../assets/icon/star.svg"

function CardReviews({description, vote, clientType, project}){
    const rating = Math.min(5, Math.max(0, Math.round((Number(vote) || 0) * 2) / 2));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const descriptionRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        const element = descriptionRef.current;

        if (!element || isExpanded) return;

        const checkOverflow = () => {
            setHasOverflow(element.scrollHeight > element.clientHeight + 1);
        };

        checkOverflow();
        const observer = new ResizeObserver(checkOverflow);
        observer.observe(element);

        return () => observer.disconnect();
    }, [description, isExpanded]);

    return(
    <article className={`testimonial-card flex basis-[88%] max-w-sm shrink-0 snap-start flex-col items-start gap-5 overflow-hidden border border-border p-5 rounded-card transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:basis-auto sm:gap-6 sm:p-8 ${isExpanded ? "max-h-250" : "min-h-107.5 max-h-107.5"}`}>
        <img src={testimonialIcon} alt="Icon for reviews" />
        <div className="flex flex-row gap-3 items-center" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: fullStars }, (_, index) => (
                <img key={index} src={star} alt="" aria-hidden="true" />
            ))}
            {hasHalfStar && (
                <span className="block h-7.25 w-3.75 overflow-hidden" aria-hidden="true">
                    <img className="max-w-none" src={star} alt="" />
                </span>
            )}
        </div>
        <div className="relative w-full">
            <p
                ref={descriptionRef}
                className={`overflow-hidden text-base font-body text-body transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? "max-h-160" : "line-clamp-6 max-h-36"}`}
            >
                {description}
            </p>
        </div>
        {hasOverflow && (
            <button
                type="button"
                className="font-body text-base font-bold text-accent transition-opacity hover:opacity-75"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((expanded) => !expanded)}
            >
                {isExpanded ? "View less" : "View more"}
            </button>
        )}
        <div className="mt-auto">
            {clientType && <p className="text-base font-body text-body">{clientType}</p>}
            <p className="text-base font-body text-body font-bold">Project: {project}</p>
        </div>
    </article>
    );
}

export default CardReviews;
