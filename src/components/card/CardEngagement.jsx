function CardEngagement({title, description}){

    return(
        <div className="interactive-card flex h-full w-full flex-col gap-5 border border-border bg-surface p-5 text-left rounded-card sm:gap-6 sm:p-7.5">
            <h3
            className="text-xl font-bold text-heading font-display sm:text-2xl"
            >
                {title}
            </h3>
            <p
            className="text-sm leading-6 text-body font-body sm:text-base"
            >
                {description}
            </p>
        </div>
    );
}

export default CardEngagement;
