import { Link } from "react-router-dom";

function CardPortfolio({id, img, width, height, title, description}){ 
    return(
        <Link
        to={`/project/${id}`}
        className="interactive-card group block h-full w-full overflow-hidden rounded-card border border-border bg-surface"
        >
            <div className="overflow-hidden">
                <img
                    src={img}
                    alt={`Screenshot of ${title}`}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    className="block object-cover w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
            </div>
            <div className="flex flex-col gap-2 px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
                <h3 className="text-lg font-bold font-display text-heading transition-colors duration-200 group-hover:text-primary sm:text-xl">
                    {title}
                </h3>
                <p className="text-sm leading-6 font-body">
                    {description}
                </p>
            </div>
        </Link>
    );
}

export default CardPortfolio;
