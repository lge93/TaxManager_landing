document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // 🧼 UTM SANITIZE + PERSISTENCIA
    // ================================
    function sanitizeUTM(value) {
        if (!value) return "";
        try {
            value = decodeURIComponent(value);
        } catch (e) { }
        return value
            .replace(/[^a-zA-Z0-9_-]/g, '')
            .slice(0, 50)
            .toLowerCase();
    }

    const params = new URLSearchParams(window.location.search);

    function getUTM(param) {
        const value = sanitizeUTM(params.get(param));
        if (value) {
            localStorage.setItem(param, value);
            return value;
        }
        return localStorage.getItem(param) || "";
    }

    ["utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = getUTM(field);
    });

    // ================================
    // 🍔 Hamburger Menu
    // ================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ================================
    // 🎯 Scroll optimizado
    // ================================
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    const banner = document.querySelector('.banner-section');

    if (navbar && hero) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {

                    if (window.scrollY > hero.offsetHeight - 80) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    if (banner) {
                        const rect = banner.getBoundingClientRect();
                        if (rect.top < window.innerHeight * 0.85) {
                            banner.classList.add('in-view');
                        }
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ================================
    // 📂 Accordion
    // ================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        header.addEventListener('click', () => {

            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });

            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // ================================
    // 📩 Form + WhatsApp + Tracking + Apps Script
    // ================================
    const form = document.querySelector('.contact-form');
    const button = form ? form.querySelector('button[type="submit"]') : null;

    let submitted = false;

    // 🔴 PEGÁ ACÁ TU URL REAL (/exec)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwcKY3gfxrGSSvHAsUN0U2w-We-zy5YiWXLXuZxiVLcqWNuCpGex_V848jEB982mw17/exec";

    if (form) {
        form.addEventListener('submit', (e) => {

            e.preventDefault(); // 🔥 CLAVE

            if (submitted) return;
            submitted = true;

            if (button) {
                button.innerText = "Enviando...";
                button.disabled = true;
            }

            const formData = new FormData(form);

            // 📡 ENVÍO A APPS SCRIPT
            fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams(formData)
            })
                .then(() => {

                    // UX éxito
                    form.style.display = "none";
                    const success = document.getElementById("form-success");
                    if (success) success.style.display = "block";

                    // 📊 Tracking conversión REAL para :contentReference[oaicite:1]{index=1}
                    if (typeof gtag === "function") {
                        gtag('event', 'conversion', {
                            send_to: 'AW-18112164633/dYeRCPvZrqQcEJnmxrxD'
                        });
                    }

                    // 📊 Evento GA4
                    if (typeof gtag === "function") {
                        gtag('event', 'lead_generated', {
                            event_category: 'conversion',
                            event_label: 'form_success'
                        });
                    }

                    // 📲 WhatsApp
                    const nombre = formData.get('nombre');
                    const tipo = formData.get('tipo');
                    const mensaje = formData.get('mensaje') || "No especificado";

                    const texto = `Hola! Soy ${nombre}.\nEstoy interesado en el servicio: ${tipo}.\nConsulta: ${mensaje}`;
                    const url = `https://wa.me/5491123985356?text=${encodeURIComponent(texto)}`;

                    window.open(url, '_blank');

                })
                .catch(() => {
                    button.innerText = "Error. Reintentar";
                    button.disabled = false;
                    submitted = false;
                });
        });
    }

    // ================================
    // 🎬 Hero slideshow
    // ================================
    const slides = document.querySelectorAll('.hero-slideshow .slide');

    if (slides.length > 0) {
        let currentSlide = 0;

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

});