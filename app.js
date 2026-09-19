/* ===== CAML — Carbon-Aware Machine Learning Scheduling ===== */
/* All data is simulated. No APIs, no backend. */

(function () {
    'use strict';

    // ========== NAVIGATION ==========
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('[data-page]');
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');

    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.nav-link[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Initialize page-specific content
        if (pageId === 'dashboard') initDashboard();
        if (pageId === 'admin') initAdmin();
        if (pageId === 'logistics') initLogistics();
        if (pageId === 'agriculture') initAgriculture();

        // Close mobile menu
        navLinksContainer.classList.remove('mobile-open');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Learn More button scrolls to "How It Works"
    const btnLearnMore = document.getElementById('btn-learn-more');
    if (btnLearnMore) {
        btnLearnMore.addEventListener('click', () => {
            document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Hamburger
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-open');
    });

    // Nav scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // ========== HERO PARTICLE CANVAS ==========
    const heroCanvas = document.getElementById('hero-canvas');
    const hCtx = heroCanvas.getContext('2d');
    let heroParticles = [];
    let heroAnimFrame;

    function resizeHeroCanvas() {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = 140 + Math.random() * 40; // green-cyan range
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;
        }
        draw() {
            hCtx.beginPath();
            hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            hCtx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
            hCtx.fill();
        }
    }

    function initHeroParticles() {
        resizeHeroCanvas();
        heroParticles = [];
        const count = Math.min(Math.floor((heroCanvas.width * heroCanvas.height) / 8000), 150);
        for (let i = 0; i < count; i++) {
            heroParticles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < heroParticles.length; i++) {
            for (let j = i + 1; j < heroParticles.length; j++) {
                const dx = heroParticles[i].x - heroParticles[j].x;
                const dy = heroParticles[i].y - heroParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    hCtx.beginPath();
                    hCtx.moveTo(heroParticles[i].x, heroParticles[i].y);
                    hCtx.lineTo(heroParticles[j].x, heroParticles[j].y);
                    hCtx.strokeStyle = `rgba(0, 230, 138, ${0.06 * (1 - dist / 120)})`;
                    hCtx.lineWidth = 0.5;
                    hCtx.stroke();
                }
            }
        }
    }

    function animateHero() {
        hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        heroParticles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        heroAnimFrame = requestAnimationFrame(animateHero);
    }

    window.addEventListener('resize', () => {
        resizeHeroCanvas();
    });

    initHeroParticles();
    animateHero();

    // ========== MINI HERO CHART ==========
    function drawMiniHeroChart() {
        const canvas = document.getElementById('mini-chart-hero');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const data = [680, 720, 710, 690, 650, 580, 490, 420, 350, 260, 220, 210, 240, 280, 350];
        const maxVal = 750;
        const step = w / (data.length - 1);

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(255, 107, 107, 0.15)');
        gradient.addColorStop(0.5, 'rgba(254, 202, 87, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 230, 138, 0.02)');

        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((v, i) => {
            const x = i * step;
            const y = h - (v / maxVal) * h;
            if (i === 0) ctx.lineTo(x, y);
            else {
                const prev = { x: (i - 1) * step, y: h - (data[i - 1] / maxVal) * h };
                const cpx = (prev.x + x) / 2;
                ctx.bezierCurveTo(cpx, prev.y, cpx, y, x, y);
            }
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * step;
            const y = h - (v / maxVal) * h;
            if (i === 0) ctx.moveTo(x, y);
            else {
                const prev = { x: (i - 1) * step, y: h - (data[i - 1] / maxVal) * h };
                const cpx = (prev.x + x) / 2;
                ctx.bezierCurveTo(cpx, prev.y, cpx, y, x, y);
            }
        });
        const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
        lineGrad.addColorStop(0, '#ff6b6b');
        lineGrad.addColorStop(0.5, '#feca57');
        lineGrad.addColorStop(1, '#00e68a');
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawMiniHeroChart();

    // ========== STAT COUNTER ANIMATION ==========
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const decimals = parseInt(counter.dataset.decimals) || 0;
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const eased = 1 - Math.pow(2, -10 * progress);
                const current = (target * eased).toFixed(decimals);
                counter.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // Intersection Observer for stats
    const statsBar = document.getElementById('stats-bar');
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });
    if (statsBar) statsObserver.observe(statsBar);

    // ========== FLOW STEPS ANIMATION ==========
    const flowSteps = document.querySelectorAll('.flow-step');
    const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = parseInt(entry.target.dataset.step) || 1;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (step - 1) * 150);
            }
        });
    }, { threshold: 0.2 });
    flowSteps.forEach(s => flowObserver.observe(s));

    // ========== DASHBOARD ==========
    let dashboardInitialized = false;

    function initDashboard() {
        if (dashboardInitialized) return;
        dashboardInitialized = true;
        renderSchedulerTable();
        drawCarbonChart();
        updateDashTime();
        setInterval(updateDashTime, 1000);
        simulateKPIUpdates();
    }

    // Dashboard Time
    function updateDashTime() {
        const el = document.getElementById('dash-time');
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // ========== CARBON FORECAST CHART ==========
    function drawCarbonChart() {
        const canvas = document.getElementById('carbon-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Set proper dimensions
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = 800 * dpr;
        canvas.height = 300 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);

        const w = 800;
        const h = 300;
        const padding = { top: 30, right: 30, bottom: 45, left: 55 };

        const labels = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
        const data = [680, 720, 700, 620, 480, 420, 250, 210, 230, 310, 420, 500];
        const maxVal = 800;

        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        function getColor(val) {
            if (val >= 500) return '#ff6b6b';
            if (val >= 300) return '#feca57';
            return '#00e68a';
        }

        // Animation
        let animProgress = 0;

        function draw() {
            ctx.clearRect(0, 0, w, h);

            // Grid lines
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (chartH / 4) * i;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(w - padding.right, y);
                ctx.stroke();

                // Y-axis labels
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '11px Inter';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 10, y + 4);
            }

            // X-axis labels
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '11px Inter';
            const step = chartW / (labels.length - 1);
            labels.forEach((label, i) => {
                const x = padding.left + i * step;
                ctx.fillText(label, x, h - 10);
            });

            // Calculate animated data points
            const visibleCount = Math.floor(animProgress * data.length);
            const partialProgress = (animProgress * data.length) - visibleCount;

            if (visibleCount === 0 && animProgress === 0) return;

            const points = [];
            for (let i = 0; i <= Math.min(visibleCount, data.length - 1); i++) {
                const x = padding.left + i * step;
                const y = padding.top + chartH - (data[i] / maxVal) * chartH;
                points.push({ x, y, val: data[i] });
            }

            if (points.length < 2) {
                if (animProgress < 1) {
                    animProgress += 0.02;
                    requestAnimationFrame(draw);
                }
                return;
            }

            // Gradient fill under curve
            const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
            gradient.addColorStop(0, 'rgba(255, 107, 107, 0.12)');
            gradient.addColorStop(0.4, 'rgba(254, 202, 87, 0.06)');
            gradient.addColorStop(1, 'rgba(0, 230, 138, 0.02)');

            ctx.beginPath();
            ctx.moveTo(points[0].x, h - padding.bottom);
            ctx.lineTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                const cpx = (points[i - 1].x + points[i].x) / 2;
                ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
            }
            ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            // Line
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                const cpx = (points[i - 1].x + points[i].x) / 2;
                ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Data points
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = getColor(p.val);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            });

            // Highlight optimal zone (indices 6-7, values 250 and 210)
            if (visibleCount >= 7) {
                const zoneStart = padding.left + 5 * step;
                const zoneEnd = padding.left + 8 * step;
                ctx.fillStyle = 'rgba(0, 230, 138, 0.06)';
                ctx.fillRect(zoneStart, padding.top, zoneEnd - zoneStart, chartH);

                ctx.strokeStyle = 'rgba(0, 230, 138, 0.2)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(zoneStart, padding.top);
                ctx.lineTo(zoneStart, h - padding.bottom);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(zoneEnd, padding.top);
                ctx.lineTo(zoneEnd, h - padding.bottom);
                ctx.stroke();
                ctx.setLineDash([]);

                // Label
                ctx.fillStyle = '#00e68a';
                ctx.font = 'bold 11px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('⚡ Optimal Window', (zoneStart + zoneEnd) / 2, padding.top - 10);
            }

            // Value labels on specific points
            points.forEach((p, i) => {
                if (i === 0 || i === 1 || i === 6 || i === 7 || i === points.length - 1) {
                    ctx.fillStyle = getColor(p.val);
                    ctx.font = 'bold 11px Inter';
                    ctx.textAlign = 'center';
                    ctx.fillText(p.val, p.x, p.y - 14);
                }
            });

            if (animProgress < 1) {
                animProgress += 0.015;
                requestAnimationFrame(draw);
            }
        }

        draw();
    }

    // ========== WORKLOAD SCHEDULER ==========
    const schedulerJobs = [
        { name: 'Model Training A', priority: 'Medium', status: 'Waiting', impact: 'High', time: '5:00 PM' },
        { name: 'Image Classification Batch', priority: 'Low', status: 'Waiting', impact: 'Medium', time: '6:00 PM' },
        { name: 'Customer Inference API', priority: 'High', status: 'Running', impact: 'Low', time: 'Immediate' },
        { name: 'NLP Sentiment Pipeline', priority: 'Medium', status: 'Waiting', impact: 'High', time: '5:30 PM' },
        { name: 'Recommendation Engine v2', priority: 'Low', status: 'Waiting', impact: 'Medium', time: '7:00 PM' },
        { name: 'Fraud Detection Stream', priority: 'High', status: 'Running', impact: 'Low', time: 'Immediate' },
    ];

    function renderSchedulerTable() {
        const tbody = document.getElementById('scheduler-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        schedulerJobs.forEach((job, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="job-name">${job.name}</span></td>
                <td><span class="priority-badge priority-${job.priority.toLowerCase()}">${job.priority}</span></td>
                <td><span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span></td>
                <td><span class="carbon-impact impact-${job.impact.toLowerCase()}">${job.impact}</span></td>
                <td>${job.time}</td>
                <td>
                    <div class="job-actions">
                        ${job.status !== 'Running' ? `
                            <button class="btn-action btn-delay" data-idx="${idx}" data-action="delay">Delay</button>
                            <button class="btn-action btn-run" data-idx="${idx}" data-action="run">Run Now</button>
                        ` : ''}
                        <button class="btn-action btn-optimize" data-idx="${idx}" data-action="optimize">Optimize</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach action handlers
        tbody.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', () => handleJobAction(parseInt(btn.dataset.idx), btn.dataset.action));
        });

        // Optimize All
        const optimizeAllBtn = document.getElementById('btn-optimize-all');
        if (optimizeAllBtn) {
            optimizeAllBtn.addEventListener('click', () => {
                schedulerJobs.forEach((job, i) => {
                    if (job.status === 'Waiting') {
                        job.status = 'Delayed';
                        job.time = getOptimalTime();
                    }
                });
                renderSchedulerTable();
                showToast('All workloads optimized for lowest carbon window', 'success');
            });
        }
    }

    function handleJobAction(idx, action) {
        const job = schedulerJobs[idx];
        if (!job) return;

        if (action === 'delay') {
            job.status = 'Delayed';
            job.time = getOptimalTime();
            showToast(`${job.name} delayed to optimal carbon window`, 'info');
        } else if (action === 'run') {
            job.status = 'Running';
            job.time = 'Now';
            showToast(`${job.name} started immediately`, 'warning');
        } else if (action === 'optimize') {
            if (job.status === 'Running') {
                showToast(`${job.name} is already running — no further optimization`, 'info');
            } else {
                job.status = 'Delayed';
                job.time = getOptimalTime();
                showToast(`${job.name} rescheduled for optimal emissions`, 'success');
            }
        }
        renderSchedulerTable();
    }

    function getOptimalTime() {
        const times = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'];
        return times[Math.floor(Math.random() * times.length)];
    }

    // ========== TOAST NOTIFICATIONS ==========
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { success: '✓', info: 'ℹ', warning: '⚠' };
        toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ========== SIMULATED KPI UPDATES ==========
    function simulateKPIUpdates() {
        setInterval(() => {
            const carbonEl = document.getElementById('kpi-carbon-val');
            if (carbonEl) {
                const val = 680 + Math.floor(Math.random() * 80);
                carbonEl.textContent = val;
            }
        }, 5000);
    }

    // ========== ADMIN PANEL ==========
    let adminInitialized = false;

    function initAdmin() {
        if (adminInitialized) return;
        adminInitialized = true;
        drawAdminBarChart();
        drawAdminDonutChart();
        renderJobsMonitor();
        simulateAdminUpdates();
    }

    // ========== ADMIN BAR CHART ==========
    function drawAdminBarChart() {
        const canvas = document.getElementById('admin-bar-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 700 * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);

        const w = 700;
        const h = 280;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [620, 750, 840, 710, 890, 560, 847];
        const maxVal = 1000;

        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const barW = chartW / days.length * 0.5;
        const gap = chartW / days.length;

        let animProgress = 0;

        function draw() {
            ctx.clearRect(0, 0, w, h);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (chartH / 4) * i;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(w - padding.right, y);
                ctx.stroke();

                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '11px Inter';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 10, y + 4);
            }

            // Bars
            days.forEach((day, i) => {
                const x = padding.left + i * gap + (gap - barW) / 2;
                const barH = (values[i] / maxVal) * chartH * Math.min(animProgress * 2, 1);
                const y = padding.top + chartH - barH;

                // Bar gradient
                const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
                grad.addColorStop(0, 'rgba(0, 230, 138, 0.8)');
                grad.addColorStop(1, 'rgba(0, 210, 211, 0.3)');

                ctx.beginPath();
                const radius = 4;
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + barW - radius, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
                ctx.lineTo(x + barW, padding.top + chartH);
                ctx.lineTo(x, padding.top + chartH);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.fill();

                // Value label
                if (animProgress > 0.8) {
                    ctx.fillStyle = '#00e68a';
                    ctx.font = 'bold 11px Inter';
                    ctx.textAlign = 'center';
                    ctx.fillText(values[i], x + barW / 2, y - 8);
                }

                // Day label
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(day, x + barW / 2, h - 12);
            });

            if (animProgress < 1) {
                animProgress += 0.02;
                requestAnimationFrame(draw);
            }
        }
        draw();
    }

    // ========== ADMIN DONUT CHART ==========
    function drawAdminDonutChart() {
        const canvas = document.getElementById('admin-donut-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 280 * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = '240px';
        canvas.style.height = '240px';
        ctx.scale(dpr, dpr);

        const cx = 140;
        const cy = 140;
        const radius = 100;
        const innerRadius = 65;

        const segments = [
            { label: 'Solar', value: 32, color: '#feca57' },
            { label: 'Wind', value: 24, color: '#54a0ff' },
            { label: 'Hydro', value: 12, color: '#00d2d3' },
            { label: 'Nuclear', value: 14, color: '#a29bfe' },
            { label: 'Natural Gas', value: 12, color: '#ff9f43' },
            { label: 'Coal', value: 6, color: '#636e72' },
        ];

        const total = segments.reduce((s, seg) => s + seg.value, 0);
        let animProgress = 0;

        function draw() {
            ctx.clearRect(0, 0, 280, 280);

            let startAngle = -Math.PI / 2;
            const totalAngle = Math.PI * 2 * Math.min(animProgress * 1.5, 1);

            segments.forEach(seg => {
                const sliceAngle = (seg.value / total) * totalAngle;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
                ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = seg.color;
                ctx.fill();
                startAngle += sliceAngle;
            });

            // Center text
            if (animProgress > 0.6) {
                ctx.fillStyle = '#e8edf5';
                ctx.font = 'bold 28px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('68%', cx, cy - 8);
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = '11px Inter';
                ctx.fillText('Renewable', cx, cy + 16);
            }

            if (animProgress < 1) {
                animProgress += 0.02;
                requestAnimationFrame(draw);
            }
        }

        draw();

        // Legend
        const legend = document.getElementById('donut-legend');
        if (legend) {
            legend.innerHTML = segments.map(seg => `
                <div class="donut-legend-item">
                    <span class="donut-legend-dot" style="background:${seg.color}"></span>
                    <span>${seg.label}</span>
                    <span class="donut-legend-value">${seg.value}%</span>
                </div>
            `).join('');
        }
    }

    // ========== JOBS MONITOR ==========
    const monitorJobs = [
        { name: 'GPT Fine-tune Batch 12', progress: 78, gpu: '4x A100', carbon: '24 gCO₂' },
        { name: 'BERT Inference Pipeline', progress: 92, gpu: '2x V100', carbon: '8 gCO₂' },
        { name: 'Image Segmentation v4', progress: 45, gpu: '8x A100', carbon: '52 gCO₂' },
        { name: 'Voice Recognition Train', progress: 31, gpu: '4x H100', carbon: '18 gCO₂' },
        { name: 'Anomaly Detection Stream', progress: 100, gpu: '1x T4', carbon: '3 gCO₂' },
        { name: 'Video Classification Batch', progress: 67, gpu: '2x A100', carbon: '32 gCO₂' },
        { name: 'Reinforcement Learning Sim', progress: 15, gpu: '8x H100', carbon: '41 gCO₂' },
        { name: 'Data Preprocessing ETL', progress: 88, gpu: 'CPU Cluster', carbon: '6 gCO₂' },
    ];

    function renderJobsMonitor() {
        const container = document.getElementById('jobs-monitor');
        if (!container) return;
        container.innerHTML = monitorJobs.map(job => `
            <div class="job-monitor-card">
                <div class="job-monitor-header">
                    <span class="job-monitor-name">${job.name}</span>
                    <span class="status-badge ${job.progress === 100 ? 'status-completed' : 'status-running'}">${job.progress === 100 ? 'Completed' : 'Running'}</span>
                </div>
                <div class="job-monitor-progress">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width:${job.progress}%"></div>
                    </div>
                </div>
                <div class="job-monitor-stats">
                    <span>${job.gpu}</span>
                    <span>${job.progress}% • ${job.carbon}/kWh</span>
                </div>
            </div>
        `).join('');
    }

    // Simulate progress updates
    function simulateAdminUpdates() {
        setInterval(() => {
            monitorJobs.forEach(job => {
                if (job.progress < 100) {
                    job.progress = Math.min(100, job.progress + Math.floor(Math.random() * 3));
                }
            });
            renderJobsMonitor();

            // Update admin KPIs
            const savedEl = document.getElementById('admin-carbon-saved');
            if (savedEl) {
                const base = 847;
                const val = base + Math.floor(Math.random() * 10);
                savedEl.innerHTML = `${val} <small>kg</small>`;
            }
        }, 4000);
    }

    // ========== LOGISTICS PAGE ==========
    let logisticsInitialized = false;

    function initLogistics() {
        if (logisticsInitialized) return;
        logisticsInitialized = true;
        initLogisticsTabs();
        drawEcoRoutingMap();
        drawTrafficMap();
        drawTrafficChart();
        simulateFleetUpdates();
    }

    function initLogisticsTabs() {
        const tabs = document.querySelectorAll('[data-ltab]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.module-tab-content[id^="ltab-"]').forEach(c => c.classList.remove('active'));
                const target = document.getElementById('ltab-' + tab.dataset.ltab);
                if (target) target.classList.add('active');
            });
        });
    }

    // Eco-Routing Map - Stylized map with carbon-optimized route
    function drawEcoRoutingMap() {
        const canvas = document.getElementById('eco-routing-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 600 * dpr;
        canvas.height = 350 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);
        const w = 600, h = 350;

        // Background - subtle terrain
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#0f1a2e');
        bgGrad.addColorStop(0.5, '#0d1825');
        bgGrad.addColorStop(1, '#111d30');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Draw grid roads
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let x = 40; x < w; x += 60) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 40; y < h; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Draw main roads (thicker)
        const mainRoads = [
            [[50, 100], [200, 100], [350, 80], [550, 120]],
            [[80, 280], [200, 250], [350, 200], [500, 280]],
            [[100, 50], [120, 150], [140, 250], [130, 330]],
            [[300, 30], [310, 130], [340, 220], [380, 320]],
            [[480, 40], [490, 150], [510, 250], [520, 330]],
        ];

        mainRoads.forEach(road => {
            ctx.beginPath();
            ctx.moveTo(road[0][0], road[0][1]);
            for (let i = 1; i < road.length; i++) {
                ctx.lineTo(road[i][0], road[i][1]);
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 3;
            ctx.stroke();
        });

        // Draw eco-optimized route
        const route = [
            { x: 80, y: 310, carbon: 'verylow' },
            { x: 130, y: 260, carbon: 'verylow' },
            { x: 200, y: 200, carbon: 'low' },
            { x: 260, y: 160, carbon: 'medium' },
            { x: 320, y: 130, carbon: 'high' },
            { x: 390, y: 110, carbon: 'medium' },
            { x: 450, y: 90, carbon: 'low' },
            { x: 530, y: 70, carbon: 'verylow' },
        ];

        const carbonColors = {
            verylow: '#00e68a',
            low: '#7bed9f',
            medium: '#feca57',
            high: '#ff9f43',
            veryhigh: '#ff6b6b'
        };

        // Route glow
        for (let i = 0; i < route.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(route[i].x, route[i].y);
            const cpx = (route[i].x + route[i + 1].x) / 2;
            const cpy = Math.min(route[i].y, route[i + 1].y) - 15;
            ctx.quadraticCurveTo(cpx, cpy, route[i + 1].x, route[i + 1].y);
            ctx.strokeStyle = carbonColors[route[i].carbon] + '30';
            ctx.lineWidth = 10;
            ctx.stroke();
        }

        // Route line
        for (let i = 0; i < route.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(route[i].x, route[i].y);
            const cpx = (route[i].x + route[i + 1].x) / 2;
            const cpy = Math.min(route[i].y, route[i + 1].y) - 15;
            ctx.quadraticCurveTo(cpx, cpy, route[i + 1].x, route[i + 1].y);
            ctx.strokeStyle = carbonColors[route[i].carbon];
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Waypoints
        route.forEach((pt, i) => {
            // Outer ring
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = carbonColors[pt.carbon] + '30';
            ctx.fill();
            // Inner dot
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = carbonColors[pt.carbon];
            ctx.fill();
            // White center
            if (i === 0 || i === route.length - 1) {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
                ctx.strokeStyle = carbonColors[pt.carbon];
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        });

        // City labels
        ctx.font = '10px Inter';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Depot A', 60, 328);
        ctx.fillText('Warehouse B', 500, 58);
        ctx.fillText('Hub C', 250, 148);
    }

    // Traffic Map - Grid-based city traffic
    function drawTrafficMap() {
        const canvas = document.getElementById('traffic-map-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 600 * dpr;
        canvas.height = 350 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);
        const w = 600, h = 350;

        // Background
        ctx.fillStyle = '#12192a';
        ctx.fillRect(0, 0, w, h);

        // City blocks
        const blockSize = 55;
        const roadWidth = 12;
        const startX = 35, startY = 25;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                const bx = startX + col * (blockSize + roadWidth);
                const by = startY + row * (blockSize + roadWidth);
                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.fillRect(bx, by, blockSize, blockSize);
            }
        }

        // Traffic colors
        const trafficColors = ['#00e68a', '#feca57', '#ff9f43', '#ff6b6b'];

        // Horizontal roads
        for (let row = 0; row <= 5; row++) {
            const y = startY + row * (blockSize + roadWidth) - roadWidth / 2;
            for (let col = 0; col < 8; col++) {
                const x = startX + col * (blockSize + roadWidth);
                const colorIdx = Math.floor(Math.random() * 4);
                // Bias toward free flow
                const biasedIdx = Math.random() < 0.5 ? 0 : (Math.random() < 0.4 ? 1 : (Math.random() < 0.5 ? 2 : 3));
                ctx.fillStyle = trafficColors[biasedIdx] + '80';
                ctx.fillRect(x, y, blockSize, roadWidth - 2);
            }
        }

        // Vertical roads
        for (let col = 0; col <= 8; col++) {
            const x = startX + col * (blockSize + roadWidth) - roadWidth / 2;
            for (let row = 0; row < 5; row++) {
                const y = startY + row * (blockSize + roadWidth);
                const biasedIdx = Math.random() < 0.5 ? 0 : (Math.random() < 0.4 ? 1 : (Math.random() < 0.5 ? 2 : 3));
                ctx.fillStyle = trafficColors[biasedIdx] + '80';
                ctx.fillRect(x, y, roadWidth - 2, blockSize);
            }
        }

        // Intersections
        for (let row = 0; row <= 5; row++) {
            for (let col = 0; col <= 8; col++) {
                const ix = startX + col * (blockSize + roadWidth) - roadWidth / 2;
                const iy = startY + row * (blockSize + roadWidth) - roadWidth / 2;
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.fillRect(ix, iy, roadWidth - 2, roadWidth - 2);
            }
        }

        // Sensors (small squares)
        const sensors = [[150, 90], [320, 160], [480, 230], [200, 270], [420, 80]];
        sensors.forEach(([sx, sy]) => {
            ctx.fillStyle = 'rgba(84, 160, 255, 0.7)';
            ctx.fillRect(sx - 5, sy - 5, 10, 10);
            ctx.strokeStyle = 'rgba(84, 160, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - 8, sy - 8, 16, 16);
        });

        // Incidents (triangles)
        const incidents = [[280, 130], [450, 290]];
        incidents.forEach(([ix, iy]) => {
            ctx.beginPath();
            ctx.moveTo(ix, iy - 8);
            ctx.lineTo(ix + 7, iy + 5);
            ctx.lineTo(ix - 7, iy + 5);
            ctx.closePath();
            ctx.fillStyle = '#ff6b6b';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 8px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('!', ix, iy + 3);
        });
    }

    // Traffic Chart for Traffic tab
    function drawTrafficChart() {
        const canvas = document.getElementById('traffic-flow-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 800 * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);
        const w = 800, h = 280;
        const padding = { top: 25, right: 20, bottom: 40, left: 50 };

        const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
        const congestion = [0.3, 0.72, 0.85, 0.6, 0.55, 0.78, 0.92, 0.45, 0.22];
        const speed = [42, 18, 12, 28, 32, 20, 10, 35, 48];
        const maxCong = 1.0;
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const step = chartW / (hours.length - 1);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
            ctx.fillText((1 - i * 0.25).toFixed(2), padding.left - 8, y + 3);
        }

        // X labels
        ctx.textAlign = 'center';
        hours.forEach((label, i) => {
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter';
            ctx.fillText(label, padding.left + i * step, h - 12);
        });

        // Congestion area fill
        const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        grad.addColorStop(0, 'rgba(255, 107, 107, 0.15)'); grad.addColorStop(1, 'rgba(255, 107, 107, 0.01)');
        ctx.beginPath(); ctx.moveTo(padding.left, h - padding.bottom);
        congestion.forEach((v, i) => {
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxCong) * chartH;
            if (i === 0) ctx.lineTo(x, y); else { const px = padding.left + (i - 1) * step; ctx.bezierCurveTo((px + x) / 2, padding.top + chartH - (congestion[i - 1] / maxCong) * chartH, (px + x) / 2, y, x, y); }
        });
        ctx.lineTo(padding.left + (hours.length - 1) * step, h - padding.bottom); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

        // Congestion line
        ctx.beginPath();
        congestion.forEach((v, i) => {
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxCong) * chartH;
            if (i === 0) ctx.moveTo(x, y); else { const px = padding.left + (i - 1) * step; ctx.bezierCurveTo((px + x) / 2, padding.top + chartH - (congestion[i - 1] / maxCong) * chartH, (px + x) / 2, y, x, y); }
        });
        ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 2.5; ctx.stroke();

        // Data points
        congestion.forEach((v, i) => {
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxCong) * chartH;
            ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#ff6b6b'; ctx.fill();
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        });
    }

    function simulateFleetUpdates() {
        const statusEls = {
            onroute: document.getElementById('fleet-onroute'),
            idle: document.getElementById('fleet-idle'),
        };
        setInterval(() => {
            if (statusEls.onroute) {
                const v = 380 + Math.floor(Math.random() * 15);
                statusEls.onroute.innerHTML = `${v} <small>${(v / 512 * 100).toFixed(1)}%</small>`;
            }
            if (statusEls.idle) {
                const v = 70 + Math.floor(Math.random() * 16);
                statusEls.idle.innerHTML = `${v} <small>${(v / 512 * 100).toFixed(1)}%</small>`;
            }
        }, 5000);
    }

    // ========== AGRICULTURE PAGE ==========
    let agricultureInitialized = false;

    function initAgriculture() {
        if (agricultureInitialized) return;
        agricultureInitialized = true;
        initAgriTabs();
        drawFieldHealthMap();
        drawCropYieldChart();
        simulateAgriUpdates();
    }

    function initAgriTabs() {
        const tabs = document.querySelectorAll('[data-atab]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.module-tab-content[id^="atab-"]').forEach(c => c.classList.remove('active'));
                const target = document.getElementById('atab-' + tab.dataset.atab);
                if (target) target.classList.add('active');
            });
        });
    }

    // Field Health Map
    function drawFieldHealthMap() {
        const canvas = document.getElementById('field-health-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 600 * dpr;
        canvas.height = 350 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);
        const w = 600, h = 350;

        // Background
        ctx.fillStyle = '#0b1620';
        ctx.fillRect(0, 0, w, h);

        // Field grid
        const fields = [
            { x: 30, y: 30, w: 120, h: 90, name: 'Field A1', health: 0.92, crop: 'Wheat' },
            { x: 160, y: 30, w: 100, h: 90, name: 'Field A2', health: 0.85, crop: 'Corn' },
            { x: 270, y: 30, w: 140, h: 90, name: 'Field A3', health: 0.78, crop: 'Soybean' },
            { x: 420, y: 30, w: 150, h: 90, name: 'Field B1', health: 0.95, crop: 'Wheat' },
            { x: 30, y: 135, w: 150, h: 80, name: 'Field B2', health: 0.45, crop: 'Rice' },
            { x: 190, y: 135, w: 120, h: 80, name: 'Field B3', health: 0.88, crop: 'Corn' },
            { x: 320, y: 135, w: 130, h: 80, name: 'Field C1', health: 0.72, crop: 'Barley' },
            { x: 460, y: 135, w: 110, h: 80, name: 'Field C2', health: 0.91, crop: 'Wheat' },
            { x: 30, y: 230, w: 180, h: 95, name: 'Field D1', health: 0.35, crop: 'Soybean' },
            { x: 220, y: 230, w: 160, h: 95, name: 'Field D2', health: 0.82, crop: 'Corn' },
            { x: 390, y: 230, w: 180, h: 95, name: 'Field D3', health: 0.89, crop: 'Rice' },
        ];

        function healthColor(h) {
            if (h >= 0.85) return { fill: 'rgba(0, 230, 138, 0.25)', border: 'rgba(0, 230, 138, 0.5)' };
            if (h >= 0.7) return { fill: 'rgba(123, 237, 159, 0.2)', border: 'rgba(123, 237, 159, 0.4)' };
            if (h >= 0.5) return { fill: 'rgba(254, 202, 87, 0.2)', border: 'rgba(254, 202, 87, 0.4)' };
            return { fill: 'rgba(255, 107, 107, 0.2)', border: 'rgba(255, 107, 107, 0.4)' };
        }

        fields.forEach(f => {
            const c = healthColor(f.health);
            ctx.fillStyle = c.fill;
            ctx.strokeStyle = c.border;
            ctx.lineWidth = 1.5;
            // Rounded rect
            const r = 4;
            ctx.beginPath();
            ctx.moveTo(f.x + r, f.y); ctx.lineTo(f.x + f.w - r, f.y);
            ctx.quadraticCurveTo(f.x + f.w, f.y, f.x + f.w, f.y + r);
            ctx.lineTo(f.x + f.w, f.y + f.h - r);
            ctx.quadraticCurveTo(f.x + f.w, f.y + f.h, f.x + f.w - r, f.y + f.h);
            ctx.lineTo(f.x + r, f.y + f.h);
            ctx.quadraticCurveTo(f.x, f.y + f.h, f.x, f.y + f.h - r);
            ctx.lineTo(f.x, f.y + r);
            ctx.quadraticCurveTo(f.x, f.y, f.x + r, f.y);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Field name
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(f.name, f.x + 8, f.y + 16);

            // Crop label
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.font = '9px Inter';
            ctx.fillText(f.crop, f.x + 8, f.y + 28);

            // Health percentage
            const hColor = f.health >= 0.7 ? '#00e68a' : (f.health >= 0.5 ? '#feca57' : '#ff6b6b');
            ctx.fillStyle = hColor;
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(f.health * 100) + '%', f.x + f.w / 2, f.y + f.h / 2 + 8);

            // Sensor icon (small dot)
            ctx.beginPath();
            ctx.arc(f.x + f.w - 12, f.y + f.h - 12, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#54a0ff';
            ctx.fill();
        });
    }

    // Crop Yield Forecast
    function drawCropYieldChart() {
        const canvas = document.getElementById('crop-yield-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 800 * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(dpr, dpr);
        const w = 800, h = 280;
        const padding = { top: 25, right: 20, bottom: 40, left: 50 };

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const projected = [0, 0, 5, 18, 35, 52, 68, 80, 88, 92, 94, 95];
        const actual = [0, 0, 4, 16, 32, 48, 65, 78, 86, null, null, null];
        const maxVal = 100;
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const step = chartW / (months.length - 1);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
            ctx.fillText((100 - i * 25) + '%', padding.left - 8, y + 3);
        }

        // X labels
        ctx.textAlign = 'center';
        months.forEach((m, i) => {
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter';
            ctx.fillText(m, padding.left + i * step, h - 12);
        });

        // Projected line (dashed)
        ctx.beginPath(); ctx.setLineDash([6, 4]);
        projected.forEach((v, i) => {
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(0, 230, 138, 0.4)'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);

        // Actual line (solid)
        ctx.beginPath();
        actual.forEach((v, i) => {
            if (v === null) return;
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#00e68a'; ctx.lineWidth = 2.5; ctx.stroke();

        // Data points for actual
        actual.forEach((v, i) => {
            if (v === null) return;
            const x = padding.left + i * step, y = padding.top + chartH - (v / maxVal) * chartH;
            ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#00e68a'; ctx.fill();
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        });

        // Current month indicator
        const currentMonth = 8; // Sep (index)
        const cx = padding.left + currentMonth * step;
        ctx.strokeStyle = 'rgba(84, 160, 255, 0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(cx, padding.top); ctx.lineTo(cx, h - padding.bottom); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#54a0ff'; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center'; ctx.fillText('Current', cx, padding.top - 8);
    }

    function simulateAgriUpdates() {
        setInterval(() => {
            const soilEl = document.getElementById('agri-soil-moisture');
            if (soilEl) {
                const v = (62 + Math.random() * 8).toFixed(1);
                soilEl.textContent = v + '%';
            }
            const tempEl = document.getElementById('agri-soil-temp');
            if (tempEl) {
                const v = (22 + Math.random() * 4).toFixed(1);
                tempEl.textContent = v + '°C';
            }
        }, 6000);
    }

    // ========== INITIALIZATION ==========
    // Check if URL hash has a page
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
        navigateTo(hash);
    }
})();
