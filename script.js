document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    menuToggle.setAttribute('aria-label', 'Menu de navegación');
    
    const navContent = document.querySelector('.nav-content');
    const navLinks = document.querySelector('.nav-links');
    
    if (navContent && navLinks) {
        navContent.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    const waNumber = "573228708724";

    // --- Modal Logic ---
    const modal = document.getElementById('form-modal');
    const openButtons = document.querySelectorAll('.open-form');
    const closeBtn = document.querySelector('.close-modal');
    const formServiceInput = document.getElementById('form-service');
    const formBaseMsgInput = document.getElementById('form-base-msg');
    const modalTitle = document.getElementById('modal-title');

    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const service = btn.getAttribute('data-service');
            const msg = btn.getAttribute('data-msg');
            const link = btn.getAttribute('data-link');
            
            if(formServiceInput) formServiceInput.value = service;
            if(formBaseMsgInput) formBaseMsgInput.value = msg;
            
            // Handle redirect link if present
            const existingRedirectInput = modal.querySelector('#form-redirect');
            if(link && modal) {
                if(!existingRedirectInput) {
                    const redirectInput = document.createElement('input');
                    redirectInput.type = 'hidden';
                    redirectInput.id = 'form-redirect';
                    modal.querySelector('form').appendChild(redirectInput);
                    redirectInput.value = link;
                } else {
                    existingRedirectInput.value = link;
                }
            } else if(existingRedirectInput) {
                existingRedirectInput.value = '';
            }

            if(modalTitle) modalTitle.innerText = `REQUERIMIENTO: ${service.toUpperCase()}`;
            
            if(modal) {
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            if(modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    // --- Accordion Logic ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            }
        });
    });

    // --- Carousel Logic (Testimonials) ---
    const track = document.getElementById('testimonial-track');
    if (track) {
        let index = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const slideCount = slides.length;

        setInterval(() => {
            index = (index + 1) % slideCount;
            track.style.transform = `translateX(-${index * 100}%)`;
        }, 5000); // 5 seconds for slower, premium transition
    }

    // --- Form Submission ---
    const forms = document.querySelectorAll('#strategic-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const phone = form.querySelector('#phone').value;
            const industry = form.querySelector('#industry').value;
            const service = form.querySelector('#form-service').value;
            const baseMsg = form.querySelector('#form-base-msg').value;

            const finalMsg = `${baseMsg}\n\n*MIS DATOS TÉCNICOS:*\n- Nombre: ${name}\n- Email: ${email}\n- WhatsApp: ${phone}\n- Industria: ${industry}\n- Plan/Servicio: ${service}`;
            const encodedMessage = encodeURIComponent(finalMsg);
            
            const redirectInput = form.querySelector('#form-redirect');
            const redirectUrl = redirectInput ? redirectInput.value : null;

            // 1. Silent Lead Capture (LocalStorage for Admin)
            let currentLeads = JSON.parse(localStorage.getItem('str_leads') || "[]");
            currentLeads.unshift({
                name, email, phone, industry, service,
                date: new Date().toLocaleString(),
                resource: redirectUrl ? true : false
            });
            localStorage.setItem('str_leads', JSON.stringify(currentLeads));

            // 2. Decision logic: Resource vs Services
            if(redirectUrl) {
                // If it's a resource (Download), redirect directly
                // We still trigger a background window.open for WhatsApp if the user wants it,
                // but per user request "sin que se den cuenta", we might skip it or do it differently.
                // The user said: "no ir a un botón a WhatsApp sino descargar directamente"
                // and "sin que la persona se dé cuenta enviarlos a mi whatsapp".
                // Since true silent WhatsApp isn't possible, we prioritize the download.
                window.location.href = redirectUrl;
            } else {
                // If its a service request, open WhatsApp as usual
                window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
            }
            
            if(modal) modal.style.display = 'none';
            form.reset();
        });
    });

    // --- Advanced Reveal Observer (SEO & UX) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // TRACKING SYSTEM & INJECTION
    // ==========================================
    
    // 1. Visit Tracking & Performance
    if (!sessionStorage.getItem('counted_visit')) {
        let visits = parseInt(localStorage.getItem('str_visits') || "0");
        localStorage.setItem('str_visits', visits + 1);
        sessionStorage.setItem('counted_visit', 'true');

        // Record Load Time
        window.addEventListener('load', () => {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            const isMobile = window.innerWidth <= 768;
            const key = isMobile ? 'str_load_mobile' : 'str_load_desktop';
            
            let loadHistory = JSON.parse(localStorage.getItem(key) || "[]");
            loadHistory.push(loadTime);
            if(loadHistory.length > 20) loadHistory.shift(); 
            localStorage.setItem(key, JSON.stringify(loadHistory));

            // Detailed Log
            let logs = JSON.parse(localStorage.getItem('str_load_logs') || "[]");
            logs.unshift({
                t: loadTime,
                d: isMobile ? 'Móvil' : 'Desktop',
                date: new Date().toLocaleTimeString(),
                p: window.location.pathname.split('/').pop() || 'inicio'
            });
            if(logs.length > 30) logs.pop();
            localStorage.setItem('str_load_logs', JSON.stringify(logs));
        });
    }

    // 2. Click Tracking
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .btn, a.btn');
        if (btn) {
            let clicks = parseInt(localStorage.getItem('str_total_clicks') || "0");
            localStorage.setItem('str_total_clicks', clicks + 1);
            
            let btnLabel = btn.innerText.trim() || btn.getAttribute('aria-label') || "Botón sin nombre";
            let btnStats = JSON.parse(localStorage.getItem('str_btn_stats') || "{}");
            btnStats[btnLabel] = (btnStats[btnLabel] || 0) + 1;
            localStorage.setItem('str_btn_stats', JSON.stringify(btnStats));
        }
    });

    // 3. Script Injection
    const headCode = localStorage.getItem('str_head_scripts');
    const bodyCode = localStorage.getItem('str_body_scripts');
    if (headCode) document.head.insertAdjacentHTML('beforeend', headCode);
    if (bodyCode) document.body.insertAdjacentHTML('beforeend', bodyCode);

    // 4. Dynamic Blog Loader
    const blogContainer = document.getElementById('blog-posts-container');
    if (blogContainer) {
        const posts = JSON.parse(localStorage.getItem('str_blog_posts') || "[]");
        if (posts.length > 0) {
            blogContainer.innerHTML = '';
            // Limitamos a 6 posts y aplicamos el estilo de recuadros pequeños
            posts.slice(0, 6).forEach(post => {
                const article = document.createElement('article');
                article.className = 'card reveal active';
                article.style.padding = '1.5rem';
                article.innerHTML = `
                    <img src="${post.image || 'https://via.placeholder.com/600x300'}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:1rem; border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.65rem; color: var(--accent); margin-bottom: 0.8rem;">ESTRATEGIA | ${post.date}</div>
                    <h4 style="font-size: 1rem;">${post.title}</h4>
                    <p style="font-size: 0.8rem; opacity: 0.6; margin: 0.8rem 0;">${post.content.substring(0, 80)}...</p>
                    <a href="blog.html" class="accent-text" style="font-size: 0.75rem; font-weight: 700; text-decoration: none;">LEER ARTÍCULO →</a>
                `;
                blogContainer.appendChild(article);
            });
        }
    }
});
