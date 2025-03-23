class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game constants
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [];
        this.food = {};
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.gameActive = true;
        this.lastMoveTime = 0;
        this.moveInterval = 120;
        
        // Direction queue for smoother controls
        this.directionQueue = [];
        
        // Components
        this.renderer = new Renderer(this);
        this.soundFX = new SoundFX();
        this.inputHandler = new InputHandler(this);
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.finalScoreElement = document.getElementById('final-score');
        this.gameOverScreen = document.getElementById('game-over');
        this.muteBtn = document.getElementById('mute-btn');
        
        // Settings
        this.muted = false;
        
        // Animation frame ID
        this.animationFrameId = null;
        
        // Initialize game
        this.init();
        this.start();
    }
    
    init() {
        // Initialize snake
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        // Initialize direction
        this.dx = this.gridSize;
        this.dy = 0;
        this.directionQueue = [];
        
        // Initialize score
        this.score = 0;
        this.scoreElement.textContent = `Score: ${this.score}`;
        
        // Reset game state
        this.gameActive = true;
        this.gameOverScreen.style.visibility = 'hidden';
        this.moveInterval = 120;
        this.lastMoveTime = performance.now();
        
        // Initialize food
        this.generateFood();
        
        // Play start sound
        if (!this.muted) {
            this.soundFX.playStartSound();
        }
        
        // Draw initial state
        this.renderer.draw();
    }
    
    start() {
        // Cancel any existing animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Start game loop
        this.gameLoop();
    }
    
    gameLoop(timestamp) {
        if (!timestamp) timestamp = performance.now();
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
        
        this.update(timestamp);
        this.renderer.draw();
    }
    
    update(timestamp) {
        if (!this.gameActive) return;
        
        // Process direction queue if we have pending direction changes
        if (this.directionQueue.length > 0 && (timestamp - this.lastMoveTime) > (this.moveInterval / 2)) {
            const newDirection = this.directionQueue.shift();
            this.dx = newDirection.dx;
            this.dy = newDirection.dy;
        }
        
        // Check if it's time to move the snake
        if (timestamp - this.lastMoveTime < this.moveInterval) {
            return;
        }
        
        this.lastMoveTime = timestamp;
        
        // Move snake
        const head = {
            x: this.snake[0].x + this.dx/this.gridSize, 
            y: this.snake[0].y + this.dy/this.gridSize
        };
        
        // Check for collisions with walls
        if (this.checkWallCollision(head)) {
            this.gameOver();
            return;
        }
        
        // Check for collisions with self
        if (this.checkSelfCollision(head)) {
            this.gameOver();
            return;
        }
        
        // Update snake
        this.snake.unshift(head);
        
        // Check if snake eats food
        if (this.checkFoodCollision(head)) {
            this.score += 10;
            this.scoreElement.textContent = `Score: ${this.score}`;
            this.generateFood();
            
            if (!this.muted) {
                this.soundFX.playEatSound();
            }
            
            // Speed up slightly as score increases
            if (this.score % 50 === 0) {
                this.moveInterval = Math.max(50, 120 - Math.floor(this.score/50) * 5);
            }
        } else {
            this.snake.pop();
        }
    }
    
    changeDirection(newDx, newDy) {
        // Prevent reversing direction directly
        if (this.snake.length > 1 && newDx === -this.dx && newDy === -this.dy) {
            return false;
        }
        
        // If the same direction, ignore
        if (newDx === this.dx && newDy === this.dy) {
            return false;
        }
        
        // Queue the direction change
        this.directionQueue.push({dx: newDx, dy: newDy});
        
        // Only play sound if this is actually going to change direction
        if (!this.muted) {
            this.soundFX.playMoveSound();
        }
        
        return true;
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }
    
    gameOver() {
        this.gameActive = false;
        this.finalScoreElement.textContent = `Score: ${this.score}`;
        this.gameOverScreen.style.visibility = 'visible';
        
        if (!this.muted) {
            this.soundFX.playGameOverSound();
        }
    }
    
    restart() {
        this.init();
        this.start();
    }
    
    toggleMute() {
        this.muted = !this.muted;
        this.soundFX.setMuted(this.muted);
        this.muteBtn.textContent = this.muted ? 'SOUND: OFF' : 'SOUND: ON';
    }
    
    checkWallCollision(head) {
        return head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount;
    }
    
    checkSelfCollision(head) {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }
    
    checkFoodCollision(head) {
        return head.x === this.food.x && head.y === this.food.y;
    }
} 