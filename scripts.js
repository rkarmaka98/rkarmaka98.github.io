document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    

    const nodes = [];
    const nodeCount = 30;
    const maxDistance = 150;
    let impulseColor = 'rgba(170, 170, 170, 0.5)'; // Initial impulse color
    const sections = document.querySelectorAll('section');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });


    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            impulse: 0,
            alpha: 1
        });
    }

    function drawNodes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(169, 169, 169, ${node.alpha})`; // Gray color with varying alpha
            ctx.fill();
            ctx.closePath();
        });
    }

    function drawEdges() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.closePath();
                }

                // Draw impulse
                if (nodes[i].impulse > 0) {
                    const impulseX = nodes[i].x + (nodes[j].x - nodes[i].x) * nodes[i].impulse;
                    const impulseY = nodes[i].y + (nodes[j].y - nodes[i].y) * nodes[i].impulse;
                    ctx.beginPath();
                    ctx.arc(impulseX, impulseY, 3, 0, Math.PI * 2);
                    ctx.fillStyle = impulseColor;
                    ctx.fill();
                    ctx.closePath();

                    // Draw edge between impulse nodes
                    if (nodes[j].impulse > 0) {
                        const impulseX2 = nodes[j].x + (nodes[i].x - nodes[j].x) * nodes[j].impulse;
                        const impulseY2 = nodes[j].y + (nodes[i].y - nodes[j].y) * nodes[j].impulse;
                        ctx.beginPath();
                        ctx.moveTo(impulseX, impulseY);
                        ctx.lineTo(impulseX2, impulseY2);
                        ctx.strokeStyle = impulseColor;
                        ctx.lineWidth = 0.5; // Thinner lines for impulses
                        ctx.stroke();
                        ctx.closePath();
                    }
                }

            }
        }
    }

    function updateNodes() {
        nodes.forEach(node => {
            node.x += node.dx;
            node.y += node.dy;

            if (node.x < 0 || node.x > canvas.width) node.dx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.dy *= -1;
        
            // Update impulse
            node.impulse += 0.005;
            if (node.impulse > 1) {
                node.impulse = 0;
                node.alpha = Math.random(); // Change alpha value after each impulse
            }
        });
    }


    function animate() {
        drawNodes();
        drawEdges();
        updateNodes();
        requestAnimationFrame(animate);
    }
    animate();
});
