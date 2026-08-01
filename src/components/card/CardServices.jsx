function CardServices({icon, title, description}){
    return(
        <div className="interactive-card flex h-full w-full flex-col gap-5 border border-border bg-surface p-5 text-left rounded-card sm:gap-6 sm:p-7">
            <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-shadow">
                <img
                src={icon}
                alt=""
                aria-hidden="true"
                className="object-contain w-8 h-8"
                />
            </div>
            <h2
            className="text-xl font-bold text-heading font-display sm:text-2xl"
            >
                {title}
            </h2>
            <p
            className="text-sm leading-6 text-body font-body sm:text-base"
            >
                {description}
            </p>
        </div>
    );
}

export default CardServices;
