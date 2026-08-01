import SkillBar from '../ui/SkillBar';

function CardSkills({icon, title, description, skills}){
    return(
        <div className='interactive-card flex h-full w-full flex-col border border-border bg-surface p-5 rounded-card sm:p-7.5'>
            <div className='flex flex-col gap-4'>
                <img src={icon} alt="" aria-hidden="true"
                className='max-w-10'/>
                <h3 className='text-xl font-bold font-display text-heading sm:text-2xl'>{title}</h3>
                <p className="text-sm leading-6 sm:text-base">{description}</p>
            </div>
            <div className="mt-4 space-y-4">
            {skills.map(({label, value}) =>(
                <SkillBar
                    key={label}
                    label={label}
                    value={value} 
                />
            ))}
            </div>
        </div>
    );
}

export default CardSkills;
