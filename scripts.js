document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle --- 
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply theme based on preference
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        // Update button content via CSS variable change
        // CSS already handles the icon switch using ::before and var(--theme-toggle-icon)
    };

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = 'light'; // Default to light
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (prefersDark) {
        currentTheme = 'dark';
    }

    applyTheme(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // --- Initialize Typed.js --- 
    const typedStringsElement = document.getElementById('typed-strings');
    const typedLastNameElement = document.getElementById('typed-lastname');

    // Typing effect for the last name
    if (typedLastNameElement) {
        const lastNameTyped = new Typed('#typed-lastname', {
            strings: ['Karmakar'], // Only type the last name
            typeSpeed: 100, // Adjust speed as desired
            backSpeed: 50, // Speed of deleting
            backDelay: 3000, // Pause for 3 seconds before re-typing
            loop: true, // Loop the animation
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true // Ensure cursor styles are injected
        });
    }

    // --- Scroll Animations --- 
    // Target only the top-level elements for entrance animation
    const animatedElements = document.querySelectorAll('section'); // Animate sections only

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Existing Network Canvas Code --- (Keep this)
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let links = [];
    const maxNodes = 50;
    const maxDist = 150;
    const interactionRadius = 200;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 0.5 - 0.25; // Slower speed
            this.vy = Math.random() * 0.5 - 0.25; // Slower speed
            this.radius = Math.random() * 2 + 1; // Smaller nodes
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--link-color');
            ctx.fill();
        }
    }

    function init() {
        resizeCanvas();
        nodes = [];
        for (let i = 0; i < maxNodes; i++) {
            nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
        }
        requestAnimationFrame(animate);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const linkColor = getComputedStyle(document.documentElement).getPropertyValue('--link-color');
        const nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color'); // Use text color for nodes perhaps?

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            // Set node color based on theme
            ctx.fillStyle = nodeColor; 
            node.draw();
        });

        // Create and draw links
        links = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    links.push({ n1: nodes[i], n2: nodes[j], opacity: 1 - dist / maxDist });
                }
            }
        }

        links.forEach(link => {
            ctx.beginPath();
            ctx.moveTo(link.n1.x, link.n1.y);
            ctx.lineTo(link.n2.x, link.n2.y);
            ctx.strokeStyle = linkColor;
            ctx.globalAlpha = link.opacity * 0.5; // Make links more subtle
            ctx.lineWidth = 0.5; // Thinner lines
            ctx.stroke();
            ctx.globalAlpha = 1.0; // Reset global alpha
        });

        requestAnimationFrame(animate);
    }
    
    // Mouse interaction effect (optional, can be added)
    // let mouse = { x: undefined, y: undefined };
    // window.addEventListener('mousemove', (event) => {
    //     mouse.x = event.clientX;
    //     mouse.y = event.clientY;
    // });

    window.addEventListener('resize', resizeCanvas);
    init();
});