import facebook from "../../assets/social/facebook.svg"
import github from "../../assets/social/github.svg"
import instagram from "../../assets/social/instagram.svg"
import linkedin from "../../assets/social/linkedin.svg"
import tiktok from "../../assets/social/tiktok.svg"

function Contact(){
    return(
        <div className="flex flex-col items-center justify-center w-full gap-5 text-center sm:gap-6">
            <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl">
                Let's Connect
            </h2>
            <p className="max-w-2xl text-sm leading-6 font-body text-body sm:text-base">
                Follow my journey or get in touch through my social channels.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.instagram.com/mirkofreschi.dev/">
                    <img src={instagram} alt="instagram" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.tiktok.com/@mirkofreschi.dev">
                    <img src={tiktok} alt="TikTok" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.facebook.com/mirkofreschi.dev">
                    <img src={facebook} alt="Facebook" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://github.com/Sc0rpii">
                    <img src={github} alt="Github" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.linkedin.com/in/mirko-freschi-1b292b286/">
                    <img src={linkedin} alt="LinkedIn" />
                </a>
            </div>
        </div>
    );
}

export default Contact;
