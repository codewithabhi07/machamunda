document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    const targetDate = new Date('April 4, 2026 20:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

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
    };

    navToggle.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    // --- Like Button & Confetti ---
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    let count = parseInt(localStorage.getItem('mceLikeCount')) || 124;
    let isLiked = localStorage.getItem('mceIsLiked') === 'true';

    likeCount.textContent = count;
    if (isLiked) likeBtn.classList.add('liked');

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
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
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
            this.size = Math.random() * 8 + 4;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10 - 5;
            this.gravity = 0.2;
            this.opacity = 1;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= 0.01;
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        for (let i = 0; i < 30; i++) particles.push(new Particle(x, y));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.opacity > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
});
