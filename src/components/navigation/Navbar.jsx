import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(){
    const { pathname, hash, search } = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(
        pathname === '/' ? hash.slice(1) || 'hero' : null
    );
    const linkClass = 'inline-block transition-colors duration-200 hover:text-primary';
    const navigationItems = [
        { label: 'About', to: '/#hero', sectionHash: '#hero' },
        { label: 'Portfolio', to: '/#portfolio', sectionHash: '#portfolio' },
        { label: 'Services', to: '/services', pathname: '/services' },
        { label: 'Reviews', to: '/#reviews', sectionHash: '#reviews' },
    ];

    const isHomeSectionActive = (sectionHash) => {
        if (pathname !== '/') {
            return false;
        }

        return activeSection === sectionHash.slice(1);
    };

    useEffect(() => {
        if (pathname !== '/') {
            return undefined;
        }

        const trackedSections = ['hero', 'portfolio', 'reviews', 'contact'];
        const sectionHashes = {
            hero: '',
            portfolio: '#portfolio',
            reviews: '#reviews',
            contact: '#contact',
        };
        let animationFrameId = null;
        let urlSyncTimeoutId = null;

        const syncUrlWithSection = (sectionId) => {
            const nextHash = sectionHashes[sectionId] ?? '';

            if (window.location.hash === nextHash) {
                return;
            }

            navigate(
                {
                    pathname,
                    search,
                    hash: nextHash,
                },
                {
                    replace: true,
                    preventScrollReset: true,
                    state: { scrollSync: true },
                },
            );
        };

        const updateActiveSection = () => {
            const viewportMarker = Math.min(window.innerHeight * 0.35, 180);
            let nextActiveSection = window.scrollY < 80 ? 'hero' : null;

            trackedSections.forEach((sectionId) => {
                const section = document.getElementById(sectionId);

                if (!section) {
                    return;
                }

                const sectionBounds = section.getBoundingClientRect();

                if (
                    sectionBounds.top <= viewportMarker &&
                    sectionBounds.bottom > viewportMarker
                ) {
                    nextActiveSection = sectionId;
                }
            });

            setActiveSection((currentSection) =>
                currentSection === nextActiveSection
                    ? currentSection
                    : nextActiveSection
            );

            if (urlSyncTimeoutId !== null) {
                window.clearTimeout(urlSyncTimeoutId);
            }

            urlSyncTimeoutId = window.setTimeout(
                () => syncUrlWithSection(nextActiveSection),
                160,
            );
            animationFrameId = null;
        };

        const handleScroll = () => {
            if (animationFrameId === null) {
                animationFrameId = window.requestAnimationFrame(
                    updateActiveSection
                );
            }
        };

        animationFrameId = window.requestAnimationFrame(updateActiveSection);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
            }

            if (urlSyncTimeoutId !== null) {
                window.clearTimeout(urlSyncTimeoutId);
            }
        };
    }, [navigate, pathname, search]);

    const isNavigationItemActive = (item) => {
        if (item.pathname) {
            return pathname === item.pathname;
        }

        return isHomeSectionActive(item.sectionHash);
    };

    const renderNavigationItems = () => navigationItems.map((item) => {
        const isActive = isNavigationItemActive(item);

        return (
            <li key={item.to}>
                <Link
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${linkClass} ${isActive ? 'current' : ''}`}
                >
                    {item.label}
                </Link>
            </li>
        );
    });

    return(
        <nav
            aria-label="Navigazione principale"
            className="relative z-50 flex w-full max-w-7xl items-center justify-between gap-5 px-5 py-5 mx-auto text-heading sm:px-8 lg:py-6.5"
        >
            <div id="brand">
                <Link
                    to="/#hero"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block text-xl font-bold transition-colors duration-200 font-display hover:text-primary sm:text-2xl"
                >
                    Mirko Freschi
                </Link>
            </div>
            <div id="navigation" className="hidden lg:block">
                <ul className="flex items-center justify-center text-base gap-10 xl:gap-15 font-body">
                    {renderNavigationItems()}
                </ul>
            </div>
            <div id="button" className="hidden lg:block">
                <Link
                    to="/#contact"
                    className="inline-block px-6 py-3.5 font-bold transition-transform duration-200 bg-primary rounded-button hover:-translate-y-0.5 xl:px-7.5 xl:py-4"
                >
                    Let's Connect
                </Link>
            </div>

            <button
                type="button"
                aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-button border border-border bg-surface lg:hidden"
            >
                <span
                    className={`h-0.5 w-5 bg-heading transition-transform duration-200 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
                />
                <span
                    className={`h-0.5 w-5 bg-heading transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                    className={`h-0.5 w-5 bg-heading transition-transform duration-200 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
                />
            </button>

            <div
                id="mobile-navigation"
                className={`absolute left-5 right-5 top-full overflow-hidden rounded-card border border-border bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-[opacity,transform,visibility] duration-200 lg:hidden ${
                    isMenuOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0'
                }`}
            >
                <ul className="flex flex-col gap-5 p-6 text-base font-body">
                    {renderNavigationItems()}
                    <li>
                        <Link
                            to="/#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="inline-flex w-full items-center justify-center rounded-button bg-primary px-6 py-3.5 font-bold text-heading"
                        >
                            Let's Connect
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
