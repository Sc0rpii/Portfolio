import { Link } from 'react-router-dom';
import myPhoto from '../../assets/picture.webp';
import CodeIcon from '../../assets/icon/Code.svg';
import AppleIcon from '../../assets/icon/Apple.svg';
import WindowsIcon from '../../assets/icon/Window.svg';

function Hero(){
    return(
        <div className='relative w-full px-5 py-12 sm:px-8 sm:py-16 lg:py-20'>
            <div className="grid w-full max-w-6xl gap-10 mx-auto lg:grid-cols-[minmax(0,1fr)_minmax(320px,610px)] lg:items-center">
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold leading-tight font-display text-heading sm:text-5xl lg:text-6xl">
                        Hi, I'm Mirko Freschi
                    </h1>
                    <p className="text-2xl font-body text-heading sm:text-3xl">
                        Web & iOS Developer
                    </p>
                    <p className="text-base leading-7 font-body">
                        I design and build clean, reliable digital products with a strong focus on usability, performance, and long-term maintainability.
                    </p>
                    <p className="border-l-[3px] border-primary pl-5 text-sm leading-7 font-body sm:pl-7.5 sm:text-base">
                        I'm a freelance developer with experience building web interfaces and iOS applications. <br className="hidden sm:block" />
                        I focus on clarity, structure, and scalable solutions — whether working with agencies or private clients. I value clean code, thoughtful design decisions, and clear communication throughout every project.
                    </p>
                    <div className="flex gap-5 sm:gap-6">
                        <img src={CodeIcon} alt="Web development" width="32" height="32" />
                        <img src={AppleIcon} alt="iOS development" width="32" height="32" />
                        <img src={WindowsIcon} alt="Windows development" width="32" height="32" />
                    </div>
                    <div className="flex flex-col gap-3 min-[420px]:flex-row">
                        <Link
                        to="/#portfolio"
                        className="px-6 py-4 text-sm text-center transition-transform duration-200 bg-primary rounded-button font-display text-heading hover:-translate-y-0.5 sm:px-7.5 sm:py-5">
                            View Portfolio
                        </Link>
                        <Link
                        to="/#contact"
                        className="px-6 py-4 text-sm text-center transition-colors duration-200 border rounded-button border-border text-heading hover:border-primary hover:text-primary sm:px-7.5 sm:py-5">
                            Contact Me
                        </Link>
                    </div>
                </div>
                <div className="w-full mx-auto max-w-152.5">
                    <img
                        src={myPhoto}
                        alt="Mirko Freschi"
                        width="610"
                        height="514"
                        fetchPriority="high"
                        className="aspect-610/514 w-full object-cover object-center rounded-card transition-transform duration-500 hover:scale-[1.01]"
                    />
                </div>
            </div>
            <div
                className="
                hidden
                sm:block
                -z-1
                absolute
                -right-80
                top-80
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

export default Hero;
