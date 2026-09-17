import { useTranslation } from "react-i18next";
import {experienceData} from "../../data/experienceData";
import TimelineItem from "../ui/TimelineItem";

function Experience(){
    const {t} = useTranslation();
    return(
        <div className="relative">
            <div data-reveal className="flex flex-col items-center justify-center gap-2.5 px-5 text-center sm:px-8">
                <p className="text-sm font-bold text-heading font-display">
                    {t("experience.section")}
                </p>
                <h2 className="text-3xl font-bold text-heading font-display sm:text-4xl">
                    {t("experience.title")}
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-body font-body sm:text-base">
                    {t("experience.subtitle")}
                </p>
            </div>

            <div className="w-full max-w-3xl px-4 mx-auto mt-10 sm:px-8 sm:mt-15">
                {experienceData.map((experience, index) => (
                    <TimelineItem
                        key={experience.id}
                        year={experience.year}
                        title={t(experience.title)}
                        description={t(experience.description)}
                        isLast={index === experienceData.length - 1}
                    />
                ))}
            </div>

            <div
                className="
                hidden
                sm:block
                absolute
                -z-1
                -right-100
                top-40
                w-187.5
                aspect-square
                rounded-full
                bg-radial
                from-shadow to-transparent
                blur-xl
                pointer-events-none"
            />
        </div>
    );
}

export default Experience;
