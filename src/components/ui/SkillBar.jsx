function SkillBar({label, value}){
    return(
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-body text-body">
                    {label}
                </span>
                <span className="text-sm font-body text-body">
                    {value}%
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
                <div 
                className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                style={{width: `${value}%`}}
                />
            </div>
        </div>
    );
}

export default SkillBar;
