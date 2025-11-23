document.addEventListener('DOMContentLoaded', function () {
    let currentBaseScale = '77';

    const stylePresets = {
        default: {
            className: '',
            freq: '0.008',
            scale: '77'
        },
        liquid: {
            className: 'style-liquid',
            freq: '0.001',
            scale: '200'
        },
        glacier: {
            className: 'style-glacier',
            freq: '0.02',
            scale: '90'
        }
    };

    const glassElements = document.querySelectorAll('.glass-sidebar, .glass-nav');
    const allNavItems = document.querySelectorAll('.nav-item');
    const turbulence = document.querySelector('#glass-distortion feTurbulence');
    const displacement = document.querySelector('#glass-distortion feDisplacementMap');
    const nav = document.querySelector('.glass-nav');
    const sections = document.querySelectorAll('section, footer');

    // Glass Mouse Effects
    function handleMouseMove(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (displacement) {
            const scaleX = (x / rect.width) * 100;
            const scaleY = (y / rect.height) * 100;
            displacement.setAttribute('scale', Math.min(scaleX, scaleY));
        }

        const specular = this.querySelector('.glass-specular');
        if (specular) {
            const isDarkMode = this.classList.contains('nav-dark-mode');
            let colorStart = isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.25)';
            let colorEnd = isDarkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';

            specular.style.background = `radial-gradient(
                circle at ${x}px ${y}px,
                ${colorStart} 0%,
                ${colorEnd} 60%
            )`;
        }
    }

    function handleMouseLeave() {
        if (displacement) {
            displacement.setAttribute('scale', currentBaseScale);
        }
        const specular = this.querySelector('.glass-specular');
        if (specular) {
            specular.style.background = 'none';
        }
    }

    glassElements.forEach(element => {
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Style Switching and Click Handling
    allNavItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const styleName = this.getAttribute('data-style');

            if (styleName && stylePresets[styleName]) {
                e.preventDefault();

                allNavItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');

                const preset = stylePresets[styleName];
                currentBaseScale = preset.scale;

                glassElements.forEach(container => {
                    container.classList.remove('style-liquid', 'style-glacier');
                    if (preset.className) {
                        container.classList.add(preset.className);
                    }
                });

                if (turbulence) turbulence.setAttribute('baseFrequency', preset.freq);
                if (displacement) displacement.setAttribute('scale', preset.scale);
            }
            else if (this.getAttribute('href') !== '#') {
                allNavItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Dark Mode Scroll Detection
    function checkScroll() {
        if (!nav) return;
        const triggerPoint = 50;
        let currentSection = null;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;

            if (sectionTop <= triggerPoint && (sectionTop + sectionHeight) > triggerPoint) {
                currentSection = section;
            }
        });

        if (currentSection && currentSection.getAttribute('data-theme') === 'light') {
            nav.classList.add('nav-dark-mode');
        } else {
            nav.classList.remove('nav-dark-mode');
        }
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // Parallax Effect
    const heroSection = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg');

    if (heroSection && heroBg) {
        let scrollY = 0;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('scroll', function() {
            scrollY = window.scrollY;
            requestAnimationFrame(updateParallax);
        });

        heroSection.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX = (e.clientX - centerX) / centerX;
            mouseY = (e.clientY - centerY) / centerY;
            requestAnimationFrame(updateParallax);
        });

        function updateParallax() {
            if (scrollY > heroSection.offsetHeight) return;
            const scrollSpeed = 0.5;
            const mouseSpeed = 20;
            const yPos = (scrollY * scrollSpeed) + (mouseY * mouseSpeed);
            const xPos = mouseX * mouseSpeed;
            heroBg.style.transform = `translate3d(${xPos * -1}px, ${yPos}px, 0)`;
        }
    }
});
