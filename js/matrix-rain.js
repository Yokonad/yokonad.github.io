class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('matrix-rain');
        
        this.container.appendChild(this.canvas);
        
        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.matrix = [];
        
        // Control de caída:
        this.step = 20;        // píxeles por fila
        this.speed = 0.6;      // filas por tick (sube para más rápido, baja para más lento)
        this.frameDelay = 25;  // ms entre frames (sube para más lento, baja para más rápido)
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.step);
        this.matrix = new Array(this.columns).fill(200);
    }
    
    init() {
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = '15px "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", monospace';
        
        for (let i = 0; i < this.matrix.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(char, i * this.step, this.matrix[i] * this.step);
            
            if (this.matrix[i] * this.step > this.canvas.height && Math.random() > 0.985) {
                this.matrix[i] = 0;
            }
            this.matrix[i] += this.speed; // velocidad de caída controlada aquí
        }

        setTimeout(() => {
            requestAnimationFrame(() => this.animate());
        }, this.frameDelay); // tiempo entre frames
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
});
