import CardPortfolio from "../card/CardPortfolio";
import { personalProjects } from "../../data/projects";

function Exploration(){
    return(
        <>
            <div className="flex flex-col items-center justify-center gap-2.5 px-5 text-center sm:px-8">
                <p className="text-sm font-bold text-heading font-display">
                    Exploration
                </p>
                <h2 className="text-3xl font-bold text-heading font-display sm:text-4xl">
                    Personal and Concept Projects
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-body font-body sm:text-base">
                    Independently created projects exploring layouts, interactions, and development approaches end-to-end.
                </p>
            </div>
            <div className="flex items-stretch w-full max-w-6xl gap-5 px-5 py-5 mx-auto mt-8 overflow-x-auto overscroll-x-contain touch-pan-x sm:px-8 sm:mt-10 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden">
                {personalProjects.map((project) => (
                    <div
                        key={project.id}
                        className="shrink-0 basis-[85%] snap-start md:basis-[calc((100%_-_1.25rem)/2)] xl:basis-[calc((100%_-_2.5rem)/3)]"
                    >
                        <CardPortfolio {...project} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Exploration;
