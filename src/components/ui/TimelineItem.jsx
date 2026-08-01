function TimelineItem({year, title, description, isLast}){
    return(
        <article
            data-timeline-item
            className="grid grid-cols-[42px_18px_minmax(0,1fr)] gap-x-2 sm:grid-cols-[64px_24px_minmax(0,1fr)] sm:gap-x-4"
        >
            <div className="pt-1 text-xs text-right font-body text-body sm:text-base">
                {year}
            </div>

            <div className="relative flex justify-center">
                <span className="timeline-dot relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    {!isLast && (
                        <span 
                        aria-hidden="true"
                        className="timeline-line absolute w-px h-full left-1/2 top-4 bg-border"
                        />
                    )}
            </div>

            <div className="pb-8">
                    <h3 className="text-lg font-bold font-display text-heading sm:text-xl">
                        {title}
                    </h3>
                    <p className="max-w-xl mt-1 text-sm leading-relaxed text-body font-body sm:text-base">
                        {description}
                    </p>
            </div>
        </article>
    );
}

export default TimelineItem;
