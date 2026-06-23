document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════════════
       1. Custom Cursor Logic
       ══════════════════════════════════════════════════════ */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    // Check if device supports hover
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (isDesktop && cursorDot && cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const interactives = document.querySelectorAll('a, button, input, textarea, .glass-panel');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    /* ══════════════════════════════════════════════════════
       2. Fluid Parallax Effect
       ══════════════════════════════════════════════════════ */
    const parallaxElements = document.querySelectorAll('.bg-parallax');

    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });
    updateParallax();

    /* ══════════════════════════════════════════════════════
       3. Cinematic Element Reveal
       ══════════════════════════════════════════════════════ */
    const revealElements = document.querySelectorAll('.fade-up-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -150px 0px',
        threshold: 0
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ══════════════════════════════════════════════════════
       4. Web3Forms Submission
       ══════════════════════════════════════════════════════ */
    const form = document.getElementById('pledgeForm');
    const result = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            const submitBtn = form.querySelector('.magnetic-btn .btn-text');
            const originalBtnText = submitBtn.innerText;
            
            result.style.color = '#C49A45';
            result.style.marginTop = '15px';
            result.innerText = "جاري إرسال العهد...";
            submitBtn.innerText = "يتم الإرسال...";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerText = "وصلت رسالتك بصمت. شكراً لك.";
                    result.style.color = '#25D366';
                    form.reset();
                } else {
                    result.innerText = json.message || "حدث خطأ غير متوقع.";
                    result.style.color = '#ff4d4d';
                }
            })
            .catch(error => {
                result.innerText = "حدث خطأ في الاتصال بالخادم.";
                result.style.color = '#ff4d4d';
            })
            .then(function() {
                submitBtn.innerText = originalBtnText;
                setTimeout(() => {
                    result.innerText = "";
                }, 5000);
            });
        });
    }
});
