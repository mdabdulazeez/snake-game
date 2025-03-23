class Renderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.canvas = game.canvas;
        this.gridSize = game.gridSize;
        
        // To avoid redrawing static elements every frame
        this.needsFullRedraw = true;
        this.lastFoodPos = { x: -1, y: -1 };
        
        // Create separate canvas for grid (improves performance)
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.width = this.canvas.width;
        this.gridCanvas.height = this.canvas.height;
        this.gridCtx = this.gridCanvas.getContext('2d');
        
        // Pre-render the grid to improve performance
        this.renderGrid();
    }
    
    draw() {
        // Clear canvas
        this.clearCanvas();
        
        // Draw pre-rendered grid
        this.ctx.drawImage(this.gridCanvas, 0, 0);
        
        // Draw game elements
        this.drawFood();
        this.drawSnake();
        this.drawCRTEffect();
    }
    
    renderGrid() {
        this.gridCtx.fillStyle = '#000';
        this.gridCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.gridCtx.strokeStyle = '#111';
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.canvas.height);
            this.gridCtx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.canvas.width, y);
            this.gridCtx.stroke();
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawFood() {
        const food = this.game.food;
        
        // Draw food
        this.ctx.fillStyle = '#ff3333';
        this.ctx.fillRect(
            food.x * this.gridSize, 
            food.y * this.gridSize, 
            this.gridSize-2, 
            this.gridSize-2
        );
        
        // Add shine to food
        this.ctx.fillStyle = '#ff9999';
        this.ctx.fillRect(
            food.x * this.gridSize + 2, 
            food.y * this.gridSize + 2, 
            4, 
            4
        );
        
        // Record last food position
        this.lastFoodPos = { x: food.x, y: food.y };
    }
    
    drawSnake() {
        const snake = this.game.snake;
        const dx = this.game.dx;
        const dy = this.game.dy;
        
        // Extra pixel spacing for visibility
        const spacing = 2;
        const blockSize = this.gridSize - spacing;
        
        snake.forEach((segment, index) => {
            // Head is a different color than body
            if (index === 0) {
                this.ctx.fillStyle = '#55ff55'; // Brighter green for head
            } else {
                // Create color gradient for body
                const gradientIndex = Math.min(255, Math.floor(180 + (75 * index / snake.length)));
                this.ctx.fillStyle = `rgb(51, ${gradientIndex}, 51)`;
            }
            
            // Draw snake segment with rounded corners
            this.roundedRect(
                segment.x * this.gridSize + spacing/2,
                segment.y * this.gridSize + spacing/2,
                blockSize, 
                blockSize, 
                index === 0 ? 3 : 2
            );
            
            // Add eyes to head
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                
                if (dx > 0) { // right
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 5, 4, 4);
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 11, 4, 4);
                } else if (dx < 0) { // left
                    this.ctx.fillRect(segment.x * this.gridSize + 4, segment.y * this.gridSize + 5, 4, 4);
                    this.ctx.fillRect(segment.x * this.gridSize + 4, segment.y * this.gridSize + 11, 4, 4);
                } else if (dy > 0) { // down
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 12, 4, 4);
                    this.ctx.fillRect(segment.x * this.gridSize + 11, segment.y * this.gridSize + 12, 4, 4);
                } else { // up
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 4, 4, 4);
                    this.ctx.fillRect(segment.x * this.gridSize + 11, segment.y * this.gridSize + 4, 4, 4);
                }
            }
        });
    }
    
    // Helper for drawing rounded rectangles
    roundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawCRTEffect() {
        // Draw scanlines for CRT effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let y = 0; y < this.canvas.height; y += 4) {
            this.ctx.fillRect(0, y, this.canvas.width, 2);
        }
    }
} 