import { Link, useLocation } from 'react-router-dom';
import myPhoto from '../../assets/picture.webp';
import CodeIcon from '../../assets/icon/Code.svg';
import AppleIcon from '../../assets/icon/Apple.svg';
import WindowsIcon from '../../assets/icon/Window.svg';
import { useTranslation } from 'react-i18next';
import { getLocaleFromPathname, localizePath } from '../../utils/locale';

function Hero(){
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const homePath = localizePath('/', getLocaleFromPathname(pathname));

    return(
        <div className='relative w-full px-5 py-12 sm:px-8 sm:py-16 lg:py-20'>
            <div className="grid w-full max-w-6xl gap-10 mx-auto lg:grid-cols-[minmax(0,1fr)_minmax(320px,610px)] lg:items-center">
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold leading-tight font-display text-heading sm:text-5xl lg:text-6xl">
                        {t("hero.title")}
                    </h1>
                    <p className="text-2xl font-body text-heading sm:text-3xl">
                        {t("hero.subtitle")}
                    </p>
                    <p className="text-base leading-7 font-body">
                        {t("hero.description1")}
                    </p>
                    <p className="border-l-[3px] border-primary pl-5 text-sm leading-7 font-body sm:pl-7.5 sm:text-base">
                        {t("hero.description2")} <br className="hidden sm:block" />
                        {t("hero.description3")}
                    </p>
                    <div className="flex gap-5 sm:gap-6">
                        <img src={CodeIcon} alt="Web development" width="32" height="32" />
                        <img src={AppleIcon} alt="iOS development" width="32" height="32" />
                        <img src={WindowsIcon} alt="Windows development" width="32" height="32" />
                    </div>
                    <div className="flex flex-col gap-3 min-[420px]:flex-row">
                        <Link
                        to={`${homePath}#portfolio`}
                        className="px-6 py-4 text-sm text-center transition-transform duration-200 bg-primary rounded-button font-display text-heading hover:-translate-y-0.5 sm:px-7.5 sm:py-5">
                            {t("hero.ButtonView")}
                        </Link>
                        <Link
                        to={`${homePath}#contact`}
                        className="px-6 py-4 text-sm text-center transition-colors duration-200 border rounded-button border-border text-heading hover:border-primary hover:text-primary sm:px-7.5 sm:py-5">
                            {t("hero.ButtonContact")}
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
