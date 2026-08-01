import linkIcon from '../../assets/icon/lets-icons_out.svg';

function CardCertification({badge, title, year, link}){
    return(
            <div className="interactive-card flex h-full flex-col items-start gap-5 border border-border bg-surface p-5 text-left rounded-card sm:flex-row sm:items-center sm:p-6">
                <div className="w-24 shrink-0 sm:w-full sm:max-w-29">
                    <img src={badge} alt={`${title} badge`}
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className='object-cover object-center'/>
                </div>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-lg font-bold text-heading font-display sm:text-xl'>
                        {title}
                    </h3>
                    <p className='text-body font-body'>
                        Issued {year}
                    </p>

                    <a href={link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 text-sm font-bold text-primary font-display transition-opacity duration-200 hover:opacity-75 sm:gap-4 sm:text-base">
                        Verify Credential
                        <img src={linkIcon} alt="link Icon" />
                    </a>
                </div>
            </div>
    );
}

export default CardCertification;
