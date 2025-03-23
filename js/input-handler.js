class InputHandler {
    constructor(game) {
        this.game = game;
        this.gridSize = game.gridSize;
        this.lastKeyTime = 0;
        this.keyDebounceTime = 50; // Minimum time between key events in ms
        
        // Setup event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.getElementById('restart-btn').addEventListener('click', this.handleRestart.bind(this));
        document.getElementById('mute-btn').addEventListener('click', this.handleMute.bind(this));
        
        // Touch/swipe support for mobile
        this.setupTouchControls();
    }
    
    handleKeyDown(event) {
        // Prevent default behavior for arrow keys to avoid page scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            event.preventDefault();
        }
        
        // Handle game over restart with space
        if (event.key === ' ' && !this.game.gameActive) {
            this.game.restart();
            return;
        }
        
        // Handle sound toggle with 'm'
        if (event.key === 'm') {
            this.game.toggleMute();
            return;
        }
        
        if (!this.game.gameActive) return;
        
        // Debounce rapid key presses to prevent input flooding
        const now = performance.now();
        if (now - this.lastKeyTime < this.keyDebounceTime) {
            return;
        }
        this.lastKeyTime = now;
        
        // Handle directional controls
        switch(event.key) {
            case 'ArrowUp':
                if (this.game.dy !== this.gridSize) { // Not going down
                    this.game.changeDirection(0, -this.gridSize);
                }
                break;
            case 'ArrowDown':
                if (this.game.dy !== -this.gridSize) { // Not going up
                    this.game.changeDirection(0, this.gridSize);
                }
                break;
            case 'ArrowLeft':
                if (this.game.dx !== this.gridSize) { // Not going right
                    this.game.changeDirection(-this.gridSize, 0);
                }
                break;
            case 'ArrowRight':
                if (this.game.dx !== -this.gridSize) { // Not going left
                    this.game.changeDirection(this.gridSize, 0);
                }
                break;
        }
    }
    
    handleRestart() {
        this.game.restart();
    }
    
    handleMute() {
        this.game.toggleMute();
    }
    
    setupTouchControls() {
        const canvas = this.game.canvas;
        let touchStartX = 0;
        let touchStartY = 0;
        let lastTouchTime = 0;
        const touchDebounceTime = 200; // ms
        
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, false);
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        }, false);
        
        canvas.addEventListener('touchend', (e) => {
            if (!this.game.gameActive) {
                // Handle tap to restart when game over
                this.game.restart();
                e.preventDefault();
                return;
            }
            
            // Debounce rapid touches
            const now = performance.now();
            if (now - lastTouchTime < touchDebounceTime) {
                e.preventDefault();
                return;
            }
            lastTouchTime = now;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only handle significant swipes (avoid small accidental movements)
            const swipeThreshold = 30;
            
            // Determine if the swipe was horizontal or vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                // Horizontal swipe
                if (deltaX > 0 && this.game.dx !== -this.gridSize) {
                    // Right swipe
                    this.game.changeDirection(this.gridSize, 0);
                } else if (deltaX < 0 && this.game.dx !== this.gridSize) {
                    // Left swipe
                    this.game.changeDirection(-this.gridSize, 0);
                }
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > swipeThreshold) {
                // Vertical swipe
                if (deltaY > 0 && this.game.dy !== -this.gridSize) {
                    // Down swipe
                    this.game.changeDirection(0, this.gridSize);
                } else if (deltaY < 0 && this.game.dy !== this.gridSize) {
                    // Up swipe
                    this.game.changeDirection(0, -this.gridSize);
                }
            }
            
            e.preventDefault();
        }, false);
    }
} 