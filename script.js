document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    const targetDate = new Date('April 4, 2026 20:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            document.getElementById('countdown').innerHTML = "<h4>सुरू झाले आहे!</h4>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Mobile Menu ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');

    const toggleMenu = () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'initial';
    };

    navToggle.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) toggleMenu();
        });
    });

    // --- Like Button & Confetti ---
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    let count = parseInt(localStorage.getItem('mceLikeCount')) || 124;
    let isLiked = localStorage.getItem('mceIsLiked') === 'true';

    likeCount.textContent = count;
    if (isLiked) {
        likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', () => {
        if (!isLiked) {
            count++;
            isLiked = true;
            likeBtn.classList.add('liked');
            createConfetti(likeBtn);
        } else {
            count--;
            isLiked = false;
            likeBtn.classList.remove('liked');
        }
        likeCount.textContent = count;
        localStorage.setItem('mceLikeCount', count);
        localStorage.setItem('mceIsLiked', isLiked);
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Confetti Effect ---
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 4;
            this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
            this.vx = (Math.random() - 0.5) * 12;
            this.vy = (Math.random() - 0.5) * 12 - 8;
            this.gravity = 0.25;
            this.opacity = 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= 0.015;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(x, y));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.opacity > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // --- Scroll progress & Navbar ---
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Navbar State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Visitor Counter ---
    const visitorCount = document.getElementById('visitorCount');
    let visits = parseInt(localStorage.getItem('mceVisits')) || 450;
    visits += Math.floor(Math.random() * 3) + 1;
    visitorCount.textContent = visits;
    localStorage.setItem('mceVisits', visits);

    // --- Product Pop-up ---
    window.showProduct = (category) => {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        let content = '';
        if (category === 'Smartphones') {
            content = `<h2>📱 लेटेस्ट स्मार्टफोन्स</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Vivo V30 Series (५G)</li>
                    <li>✅ Samsung Galaxy A55 (५G)</li>
                    <li>✅ Oppo Reno 11 Pro</li>
                    <li>✅ MI 14 Ultra</li>
                </ul>
                <p style="margin-top:20px;"><strong>सर्व मोबाईल्सवर ०% व्याजावर हप्ते उपलब्ध!</strong></p>`;
        } else if (category === 'Smart TV') {
            content = `<h2>📺 स्मार्ट टीव्ही</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Sony Bravia 4K Ultra HD</li>
                    <li>✅ LG NanoCell Series</li>
                    <li>✅ Samsung QLED TV</li>
                </ul>
                <p style="margin-top:20px;"><strong>जुन्या टीव्हीवर आकर्षक एक्सचेंज ऑफर!</strong></p>`;
        } else if (category === 'Home Appliances') {
            content = `<h2>❄️ होम अप्लायन्सेस</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Whirlpool 3 Door Refrigerator</li>
                    <li>✅ LG Direct Drive Washing Machine</li>
                    <li>✅ Haier Double Door Fridge</li>
                </ul>`;
        } else if (category === 'Coolers') {
            content = `<h2>🌬️ एअर कूलर्स</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Symphony Diet 3D</li>
                    <li>✅ Bajaj Torque Personal Cooler</li>
                    <li>✅ Kenstar Desert Cooler</li>
                </ul>`;
        }

        modalBody.innerHTML = content;
        modal.style.display = 'flex';
    };

    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
});
