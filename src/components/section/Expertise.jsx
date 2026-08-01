import CardSkills from '../card/CardSkills';
import { skillsData } from '../../data/skillsData';

function Expertise(){
    return(
        <div className='relative'>
            <div className="flex flex-col items-center justify-center gap-2.5 px-5 text-center sm:px-8">
                <p className="text-sm font-bold text-heading font-display">Expertise</p>
                <h2 className="text-3xl font-bold text-heading font-display sm:text-4xl">Tools, Technologies, and Capabilities</h2>
                <p className="max-w-3xl text-sm leading-6 text-body font-body sm:text-base">A practical skill set built through hands-on projects, continuous learning, and real-world problem solving.</p>
            </div>
            <div className='grid w-full max-w-6xl grid-cols-1 gap-5 px-5 mx-auto mt-10 sm:px-8 sm:mt-15 md:grid-cols-2'>
               {skillsData.map((category) =>(
                <CardSkills 
                    key={category.id}
                    {...category}
                />
               ))}
            </div>
            <div
                className="
                hidden
                sm:block
                absolute
                -z-1
                -left-100
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

export default Expertise;
