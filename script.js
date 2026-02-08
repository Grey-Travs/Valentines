/* --- CONFIGURATION --- */
const CONFIG = {
    validNames: ['von', 'travis'],
    reasons: [
        "Your contagious laugh",
        "How hard you work for your dreams",
        "Your PRETTIEST SMILE",
        "Your taste in music",
        "How pretty you look every single day",
        "Your kindness to everyone around you",
        "Your sweet and caring heart",
        "Your incredible patience",
        "Just how amazing you are in every way",
        "And so much more that I can't even put into words!"
        
    ]
};

/* --- STATE MANAGEMENT --- */
let musicPlaying = false;
let noClickCount = 0;

/* --- DOM ELEMENTS --- */
const screens = {
    login: document.getElementById('login-screen'),
    welcome: document.getElementById('welcome-screen'),
    travis: document.getElementById('travis-screen'),
    envelope: document.getElementById('envelope-screen'),
    letter: document.getElementById('letter-screen'),
    question: document.getElementById('question-screen'),
    details: document.getElementById('von-details-screen')
};

const audio = {
    bg: document.getElementById('bg-music'),
    envelope: document.getElementById('sound-envelope'),
    celebration: document.getElementById('sound-celebration')
};

/* --- INITIALIZATION --- */
window.onload = () => {
    console.log('Valentine site loaded!');
    
    // Loading Screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 1000);
        createPetals();
    }, 1500);

    // Event Listeners
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    document.getElementById('music-btn').addEventListener('click', toggleMusic);
    document.getElementById('envelope').addEventListener('click', openEnvelope);
    document.getElementById('next-step-btn').addEventListener('click', () => showScreen('question'));
    
    // Question Buttons
    document.getElementById('yes-btn').addEventListener('click', handleYes);
    const noBtn = document.getElementById('no-btn');
    noBtn.addEventListener('click', handleNoInteraction);
    noBtn.addEventListener('mouseover', (e) => {
        if (noClickCount >= 3) moveNoButton(e.target);
    });

    // Check Local Storage
    const savedName = localStorage.getItem('valentineName');
    if (savedName) {
        document.getElementById('name-input').value = savedName;
    }
};

/* --- CORE FUNCTIONS --- */

function showScreen(screenName) {
    console.log('Showing screen:', screenName);
    
    // Hide all screens
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.remove('hidden');
        // Small delay to allow display:flex to apply before opacity transition
        setTimeout(() => {
            screens[screenName].classList.add('active');
        }, 50);
    }
    
    updateProgress(screenName);
}

function updateProgress(screenName) {
    const steps = {
        'login': 1, 'welcome': 2, 'envelope': 3, 
        'letter': 4, 'question': 5, 'details': 5
    };
    const current = steps[screenName] || 1;
    
    for (let i = 1; i <= 5; i++) {
        const heart = document.getElementById(`step${i}`);
        if (i <= current) heart.classList.add('active');
        else heart.classList.remove('active');
    }
}

/* --- LOGIC HANDLERS --- */

function handleLogin() {
    const input = document.getElementById('name-input');
    const name = input.value.trim().toLowerCase();
    const errorMsg = document.getElementById('error-msg');

    if (CONFIG.validNames.includes(name)) {
        localStorage.setItem('valentineName', name);
        errorMsg.textContent = "";
        
        // Try playing music on interaction
        if (!musicPlaying) toggleMusic();

        // Branching Paths
        if (name === 'travis') {
            showScreen('welcome');
            document.getElementById('welcome-text').textContent = `Hello Travis!`;
            setTimeout(() => showScreen('travis'), 3000);
        } else {
            showScreen('welcome');
            document.getElementById('welcome-text').textContent = `Hello Von!`;
            setTimeout(() => showScreen('envelope'), 3000);
        }
    } else {
        errorMsg.textContent = "Nice try! 😊 This is invitation-only~";
        input.parentElement.classList.add('wobble');
        setTimeout(() => input.parentElement.classList.remove('wobble'), 500);
    }
}

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        try { 
            audio.envelope.play(); 
        } catch(e) {
            console.log('Envelope sound error:', e);
        }
        
        // Wait for animation then go to letter
        setTimeout(() => {
            showScreen('letter');
        }, 2000);
    }
}

function handleNoInteraction() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    
    noClickCount++;
    console.log('No clicked:', noClickCount, 'times');
    
    // Resize Logic
    const currentScale = 1 - (noClickCount * 0.2);
    noBtn.style.transform = `scale(${Math.max(0, currentScale)})`;
    
    const yesScale = 1 + (noClickCount * 0.4);
    yesBtn.style.transform = `scale(${yesScale})`;

    if (noClickCount >= 5) {
        noBtn.style.display = 'none';
    }
}

function moveNoButton(btn) {
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

function handleYes() {
    console.log('YES! Celebration time!');
    
    try { 
        audio.celebration.play(); 
    } catch(e) {
        console.log('Celebration sound error:', e);
    }
    
    startConfetti();
    
    setTimeout(() => {
        showScreen('details');
        
        // CRITICAL: Small delay to ensure DOM is ready
        setTimeout(() => {
            showReasons();
            animatePolaroids();
        }, 100);
    }, 1000);
}

function showReasons() {
    console.log('showReasons() called');
    
    const list = document.getElementById('reasons-list');
    
    if (!list) {
        console.error('reasons-list element not found!');
        return;
    }
    
    // Clear any existing content
    list.innerHTML = '';
    
    console.log('Adding', CONFIG.reasons.length, 'reasons');
    
    // Add each reason with staggered animation
    CONFIG.reasons.forEach((reason, index) => {
        const li = document.createElement('li');
        li.textContent = reason;
        list.appendChild(li);
        
        console.log(`Reason ${index + 1}: ${reason}`);
        
        // Trigger fade-in animation with delay
        setTimeout(() => {
            li.classList.add('fade-in');
        }, index * 800); // 800ms between each reason
    });
}

function animatePolaroids() {
    console.log('Animating polaroid collage');
    
    const polaroids = document.querySelectorAll('.polaroid-collage-side .polaroid');
    
    console.log('Found', polaroids.length, 'polaroids');
    
    polaroids.forEach((p, i) => {
        p.style.opacity = '0';
        p.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            p.style.opacity = '1';
        }, i * 100); // Stagger by 100ms
    });
}

/* --- AUDIO & VISUAL EFFECTS --- */

function toggleMusic() {
    if (musicPlaying) {
        audio.bg.pause();
        document.getElementById('music-btn').textContent = '🔇';
    } else {
        audio.bg.play().catch(e => console.log("Audio autoplay blocked:", e));
        document.getElementById('music-btn').textContent = '🔊';
    }
    musicPlaying = !musicPlaying;
}

function createPetals() {
    const container = document.getElementById('petals-container');
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.width = `${Math.random() * 10 + 10}px`;
        petal.style.height = `${Math.random() * 10 + 10}px`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(petal);
    }
}

function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.classList.add('active');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#ffffff', '#ff758f'];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 3,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5
        });
    }
    
    let activeCount = particles.length;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        activeCount = 0;
        
        particles.forEach(p => {
            if (p.y < canvas.height + 20) {
                activeCount++;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();
                
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                p.speedY += 0.1; // Gravity
            }
        });
        
        if (activeCount > 0) {
            requestAnimationFrame(animate);
        } else {
            console.log('Confetti finished');
            canvas.classList.remove('active');
        }
    }
    
    animate();
}
