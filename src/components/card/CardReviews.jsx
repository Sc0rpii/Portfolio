import testimonialIcon from "../../assets/icon/TestimonialIcon.svg"

function CardReviews({description, clientType, project}){
    return(
    <div className="testimonial-card flex basis-[88%] max-w-sm shrink-0 snap-start flex-col items-start justify-start gap-5 border border-border p-5 rounded-card sm:basis-auto sm:gap-6 sm:p-8">
        <img src={testimonialIcon} alt="Icon for reviews" />
        <p className="text-base font-body text-body">
            {description}
        </p>
        <p className="text-base font-body text-body">
            {clientType}
        </p>
        <p className="text-base font-body text-body font-bold">
            Project: {project}
        </p>
    </div>
    );
}

export default CardReviews;
