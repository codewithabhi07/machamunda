document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    // Shop is already open, disabling countdown
    /*
    const targetDate = new Date('April 4, 2026 20:00:00').getTime();
    ...
    */
    const updateCountdown = () => {
        // No longer needed
    };

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

        // Mobile Nav active state
        const sections = document.querySelectorAll('section, header');
        const navItems = document.querySelectorAll('.nav-item-mobile');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // --- Shop Open/Closed Status ---
    const updateShopStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        const statusElement = document.createElement('div');
        statusElement.style.padding = '5px 15px';
        statusElement.style.borderRadius = '50px';
        statusElement.style.display = 'inline-block';
        statusElement.style.marginTop = '10px';
        statusElement.style.fontWeight = '700';
        statusElement.style.fontSize = '0.9rem';

        const shopTimings = document.querySelector('.shop-timings');
        
        if (hour >= 9 && hour < 21) {
            statusElement.innerHTML = '<i class="fas fa-circle" style="color:#25d366; font-size:0.7rem;"></i> आता सुरू आहे';
            statusElement.style.background = 'rgba(37, 211, 102, 0.1)';
            statusElement.style.color = '#15803d';
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle" style="color:#ef4444; font-size:0.7rem;"></i> आता बंद आहे';
            statusElement.style.background = 'rgba(239, 68, 68, 0.1)';
            statusElement.style.color = '#b91c1c';
        }
        
        if (shopTimings && !shopTimings.querySelector('.status-badge')) {
            statusElement.classList.add('status-badge');
            shopTimings.appendChild(statusElement);
        }
    };
    updateShopStatus();
    setInterval(updateShopStatus, 60000);

    // --- Visitor Counter ---
    const visitorCount = document.getElementById('visitorCount');
    let visits = parseInt(localStorage.getItem('mceVisits')) || 450;
    visits += Math.floor(Math.random() * 3) + 1;
    visitorCount.textContent = visits;
    localStorage.setItem('mceVisits', visits);

    // --- Share Invitation ---
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => {
        const shareText = `*माँ चामुंडा इलेक्ट्रॉनिक्स & मोबाइल - भव्य शुभारंभ* 🎉\n\nतुम्हाला माँ चामुंडा इलेक्ट्रॉनिक्स & मोबाइलच्या भव्य शुभारंभाचे आग्रहाचे निमंत्रण!\n\n📅 *दिनांक:* ४ एप्रिल २०२६\n📍 *स्थळ:* पारोळा\n\nआपल्या उपस्थितीची आम्ही वाट पाहत आहोत! 🙏\n\n🔗 *लिंक:* ${window.location.href}`;

        const shareData = {
            title: 'माँ चामुंडा इलेक्ट्रॉनिक्स & मोबाइल - भव्य शुभारंभ',
            text: shareText
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(waUrl, '_blank');
        }
    });

    // --- Product Pop-up ---
    window.showProduct = (category) => {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        let content = '';
        let waMessage = '';

        if (category === 'Smartphones') {
            waMessage = 'नमस्कार, मला लेटेस्ट स्मार्टफोन्सबद्दल माहिती हवी आहे.';
            content = `<h2>📱 लेटेस्ट स्मार्टफोन्स</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Vivo V30 Pro (५G)</li>
                    <li>✅ Samsung Galaxy S24 Series</li>
                    <li>✅ Oppo Reno 12 Pro</li>
                    <li>✅ iPhone 15 & 16 Series</li>
                </ul>`;
        } else if (category === 'AC') {
            waMessage = 'नमस्कार, मला एअर कंडिशनर्स (AC) बद्दल माहिती हवी आहे.';
            content = `<h2>❄️ एअर कंडिशनर्स (AC)</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Voltas Adjustable Inverter AC</li>
                    <li>✅ LG Dual Inverter AC</li>
                    <li>✅ Daikin 5 Star Split AC</li>
                    <li>✅ Lloyd Stellar Series</li>
                </ul>`;
        } else if (category === 'Smart TV') {
            waMessage = 'नमस्कार, मला स्मार्ट टीव्हीच्या ऑफर्सबद्दल माहिती हवी आहे.';
            content = `<h2>📺 स्मार्ट टीव्ही</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Sony Bravia 4K Ultra HD</li>
                    <li>✅ LG OLED & QNED Series</li>
                    <li>✅ Samsung Crystal 4K Neo</li>
                    <li>✅ MI X Pro Series</li>
                </ul>`;
        } else if (category === 'Home Appliances') {
            waMessage = 'नमस्कार, मला फ्रिज आणि वॉशिंग मशीनबद्दल माहिती हवी आहे.';
            content = `<h2>🧺 होम अप्लायन्सेस</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Whirlpool 3 Door Protton Fridge</li>
                    <li>✅ LG Front Load AI Washing Machine</li>
                    <li>✅ Samsung Double Door Refrigerator</li>
                </ul>`;
        } else if (category === 'WaterFilter') {
            waMessage = 'नमस्कार, मला वॉटर प्युरिफायरबद्दल माहिती हवी आहे.';
            content = `<h2>💧 वॉटर प्युरिफायर (RO)</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Kent Grand Plus RO+UV</li>
                    <li>✅ Aquaguard Ritz RO+UV</li>
                    <li>✅ Pureit Copper+ Mineral RO</li>
                </ul>`;
        } else if (category === 'Coolers') {
            waMessage = 'नमस्कार, मला एअर कूलर्सबद्दल माहिती हवी आहे.';
            content = `<h2>🌬️ एअर कूलर्स</h2>
                <ul style="margin-top:20px; text-align:left; list-style:none;">
                    <li>✅ Symphony Diet 3D 55i</li>
                    <li>✅ Bajaj DMH 90 Neo Desert Cooler</li>
                    <li>✅ Kenstar Tall Boy Series</li>
                </ul>`;
        }

        modalBody.innerHTML = content + `
            <div style="margin-top:30px;">
                <p><strong>सर्व उत्पादनांवर सुलभ हप्ते (EMI) उपलब्ध!</strong></p>
                <p style="color:var(--primary); font-weight:700; margin-top:5px;">आकर्षक डिस्काउंट आणि सर्वोत्तम दरासाठी संपर्क करा.</p>
                <a href="https://wa.me/919699627500?text=${encodeURIComponent(waMessage)}" target="_blank" class="btn btn-whatsapp w-100" style="margin-top:15px; text-decoration:none; justify-content:center;">
                    <i class="fab fa-whatsapp"></i> व्हॉट्सॲपवर चौकशी करा
                </a>
            </div>`;
        modal.style.display = 'flex';
    };

    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
});
