// Phone number reveal functionality
const phoneNumber = '+61 410 791 105';

function revealPhone(event) {
    event.preventDefault();
    const phoneElement = document.getElementById('phoneNumber');
    
    if (phoneElement.textContent === 'Click to reveal phone number') {
        phoneElement.textContent = phoneNumber;
        phoneElement.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
    } else {
        phoneElement.textContent = 'Click to reveal phone number';
        phoneElement.href = '#';
    }
}

// Starfield Animation
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.starCount = 100;
        this.starDustParticles = [];
        this.lastTime = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseActive = false;
        this.connectionDistance = 100;
        this.maxStarDustParticles = 50;

        this.resizeCanvas();
        this.initStars();
        this.initEventListeners();
        this.animate();
    }

    resizeCanvas() {
        const footer = this.canvas.parentElement;
        this.canvas.width = footer.offsetWidth;
        this.canvas.height = footer.offsetHeight;
        this.connectionDistance = Math.min(this.canvas.width, this.canvas.height) * 0.15;
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.mouseActive = true;
            this.addStarDust();
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseActive = false;
        });
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.2 + 0.05,
                brightness: Math.random() * 0.5 + 0.5,
                angle: Math.random() * Math.PI * 2,
                glowPhase: Math.random() * Math.PI * 2
            });
        }
    }

    addStarDust() {
        if (this.starDustParticles.length < this.maxStarDustParticles) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const distance = Math.random() * 20;
            
            this.starDustParticles.push({
                x: this.mouseX + Math.cos(angle) * distance,
                y: this.mouseY + Math.sin(angle) * distance,
                size: Math.random() * 1,
                speed: speed,
                life: 1,
                angle: angle,
                color: `rgba(255, 255, ${Math.random() * 55 + 200}, ${Math.random() * 0.5 + 0.5})`
            });
        }
    }

    drawConnections() {
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const dx = this.stars[i].x - this.stars[j].x;
                const dy = this.stars[i].y - this.stars[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
                    this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    update(deltaTime) {
        const time = performance.now() / 1000;
        
        // Update stars
        this.stars.forEach(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.glowPhase += 0.001 * star.speed;
            star.brightness = 0.5 + Math.sin(star.glowPhase) * 0.3;

            // Wrap around screen edges
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;
        });

        // Update stardust
        this.starDustParticles = this.starDustParticles.filter(particle => {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            particle.life -= deltaTime * 0.001;
            particle.size *= 0.95;
            return particle.life > 0 && particle.size > 0.1;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();

        // Draw stars with glow
        this.stars.forEach(star => {
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core of the star
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 1.5})`;
            this.ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw stardust with glow
        this.starDustParticles.forEach(particle => {
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(time => this.animate(time));
    }
}

// Initialize starfield when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starfield');
    if (canvas) {
        new Starfield(canvas);
    }
});