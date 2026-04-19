let isanonymous = true;
let currentusername = "Anonymous User";
let currentroom = "midterms";
let resourceMap;

function enterApp() {
    const toggle = document.getElementById('anon-toggle');
    isanonymous = toggle.checked;
    if (!isanonymous) {
        const usernameinput = document.getElementById('username').value;
        currentusername = usernameinput || "Student User";
    }
    document.getElementById('in-app-anon-toggle').checked = isanonymous;
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    updateDisplayStatus();
    initBreathingText();
    initCanvas();
    initMap();
}

function switchTab(tabid, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabid).classList.add('active');
    
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    if (element) { element.classList.add('active'); }
    
    if (tabid === 'map-view' && resourceMap) { setTimeout(() => { resourceMap.invalidateSize(); }, 100); }
    if (tabid === 'stress') { initBubbles(); setTimeout(() => { initWorryDrop(); }, 100); }
}

function updateAnonymity() {
    isanonymous = document.getElementById('in-app-anon-toggle').checked;
    updateDisplayStatus();
}

function updateDisplayStatus() {
    const statusbox = document.getElementById('display-status');
    const labelbox = document.getElementById('anon-label');
    if (isanonymous) {
        statusbox.innerText = "Status: Strictly Anonymous";
        labelbox.innerText = "Currently Anonymous";
    } else {
        statusbox.innerText = `Status: Logged in as ${currentusername}`;
        labelbox.innerText = "Currently Visible";
    }
}

function initMap() {
    if(resourceMap) return; 
    resourceMap = L.map('gis-map').setView([8.9500, 125.5650], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(resourceMap);
    L.marker([8.9554, 125.5973]).addTo(resourceMap).bindPopup('CSU University Clinic');
}

function initBreathingText() {
    const textel = document.getElementById('breathe-text');
    setInterval(() => {
        setTimeout(() => { textel.innerText = "Hold"; }, 4000);
        setTimeout(() => { textel.innerText = "Exhale"; }, 5000);
        setTimeout(() => { textel.innerText = "Inhale"; }, 9000);
    }, 10000);
}

// Restored expanded array to prevent repeating duplicate messages
const safeSpaceMessages = [
    { title: "🤍 Gentle Reminder", content: "Unclench your jaw. Drop your shoulders. Remove your tongue from the roof of your mouth." },
    { title: "🤍 Gentle Reminder", content: "You do not have to earn your rest. You deserve rest simply because you are a human being." },
    { title: "🦋 Fact Check", content: "Feeling overwhelmed does not mean you are failing. It means your brain is overloaded. Step away." },
    { title: "🧠 Brain Fact", content: "Your brain consumes 20% of your body's energy. Studying hard is literally exhausting. Go eat a snack." },
    { title: "💧 Hydration Check", content: "Your brain is 73% water. Poor hydration mimics the symptoms of anxiety. Go drink a glass of water." },
    { title: "🌈 Validation", content: "Your feelings make sense. Give yourself permission to feel it without judging yourself." },
    { title: "🌿 Grounding", content: "Look around right now: find 5 things you can see, 4 you can touch, and 3 you can hear." },
    { title: "📚 Study Tip", content: "The Pomodoro technique (25 mins work, 5 mins rest) prevents academic burnout. Don't marathon study." },
    { title: "📉 Perspective", content: "A bad grade is a reflection of a single moment in time, not a reflection of your intelligence or worth." },
    { title: "✨ Soft Truth", content: "Rest is not a reward for finishing your modules. Rest is a basic human need." }
];

function flipNote(element) {
    // Prevent the user from double-clicking and breaking the animation
    if (element.classList.contains('flipping')) return;

    // Start the flip animation (takes 300ms in CSS)
    element.classList.add('flipping');
    
    // Wait exactly 300ms for the card to rotate 90 degrees (invisible) before swapping text
    setTimeout(() => {
        const randomMsg = safeSpaceMessages[Math.floor(Math.random() * safeSpaceMessages.length)];
        
        if (element.classList.contains('shape-cloud')) {
            element.innerHTML = `<p>${randomMsg.content} ✨</p>`;
        } else {
            element.innerHTML = `<h3>${randomMsg.title}</h3><p>${randomMsg.content}</p>`;
        }

        // Randomize colors for a fresh look
        element.classList.remove('highlight-purple', 'highlight-blue');
        if (Math.random() > 0.5) {
            element.classList.add('highlight-purple');
        } else {
            element.classList.add('highlight-blue');
        }
        
        // Remove class to flip the card back to normal, revealing the new text
        element.classList.remove('flipping');
    }, 300); 
}

let canvas, ctx, isdrawing = false, hasDrawn = false;

function initCanvas() {
    canvas = document.getElementById('doodle-pad');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4a148c';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrawing(e) { 
    if (e.cancelable) e.preventDefault(); 
    isdrawing = true; hasDrawn = true; 
    const coords = getCoordinates(e);
    ctx.beginPath(); ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
    if (!isdrawing) return;
    if (e.cancelable) e.preventDefault(); 
    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y); ctx.stroke();
}

function stopDrawing(e) { 
    if (e && e.cancelable) e.preventDefault();
    isdrawing = false; ctx.beginPath(); 
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); hasDrawn = false; }

async function saveJournal() {
    const textElement = document.getElementById('journal-text');
    const text = textElement.value.trim();
    const statusmsg = document.getElementById('journal-status');
    
    if (!text && !hasDrawn) {
        statusmsg.innerText = "Please write or draw something first.";
        setTimeout(() => { statusmsg.innerText = ""; }, 3000);
        return;
    }
    statusmsg.innerText = "Saving securely...";
    
    const imageData = hasDrawn ? canvas.toDataURL('image/png') : null;
    
    try {
        const response = await fetch('/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentusername, text: text, image: imageData })
        });
        
        if(response.ok) {
            statusmsg.innerText = "Journal locked and saved safely."; 
            textElement.value = ''; clearCanvas(); 
            setTimeout(() => { statusmsg.innerText = ""; }, 3000);
            if (!document.getElementById('journal-history').classList.contains('hidden')) { viewJournals(); }
        }
    } catch (error) {
        statusmsg.innerText = "Error saving. Make sure Flask is running.";
    }
}

async function viewJournals() {
    const historyContainer = document.getElementById('journal-history');
    const historyList = document.getElementById('journal-history-list');
    historyContainer.classList.remove('hidden');
    historyList.innerHTML = '<p style="font-family: var(--hand-font);">Unlocking Journal...</p>';
    try {
        const response = await fetch(`/api/journal?username=${encodeURIComponent(currentusername)}`);
        const entries = await response.json();
        historyList.innerHTML = ''; 
        if (entries.length === 0) {
            historyList.innerHTML = '<p style="font-family: var(--hand-font); color: var(--text-light);">No past entries found. Start writing above!</p>';
            return;
        }
        entries.reverse().forEach((entry, index) => {
            const note = document.createElement('div');
            const tilt = index % 2 === 0 ? 'tilt-left' : 'tilt-right';
            note.className = `doodle-note ${tilt}`;
            note.style.width = '100%'; 
            let entryHTML = `<p style="font-size: 12px; color: var(--main-purple); margin-bottom: 10px;">📅 ${entry.date}</p>`;
            if (entry.text) { entryHTML += `<p style="white-space: pre-wrap; margin-bottom: 15px;">${entry.text}</p>`; }
            if (entry.image) { entryHTML += `<img src="${entry.image}" style="max-width: 100%; border: 2px dashed #ccc; border-radius: 8px; background: #fff; margin-top: 10px;" alt="journal doodle">`; }
            note.innerHTML = entryHTML;
            historyList.appendChild(note);
        });
    } catch (error) { historyList.innerHTML = '<p style="font-family: var(--hand-font); color: red;">Error reading journal. Is the Python server running?</p>'; }
}

function logMood(moodtext, colorcode) {
    const list = document.getElementById('mood-list');
    const entry = document.createElement('li');
    entry.innerHTML = `<span style="color:${colorcode}">●</span> Felt ${moodtext}`;
    list.insertBefore(entry, list.firstChild);
}

function submitQuiz() {
    document.getElementById('quiz-result').innerText = "Thank you for checking in. Take a deep breath.";
    document.getElementById('quiz-result').classList.remove('hidden');
}

function switchRoom(roomid) {
    document.querySelectorAll('.room-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('room-welcome').innerText = `Welcome to the ${roomid} room.`;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if (input.value.trim() === "") return;
    const msgdiv = document.createElement('div');
    msgdiv.className = 'message user';
    msgdiv.innerText = input.value;
    document.getElementById('chat-messages').appendChild(msgdiv);
    input.value = "";
}

function sendHug() {
    const container = document.getElementById('hug-container');
    const hug = document.createElement('div');
    hug.className = 'floating-hug';
    hug.innerText = '🫂';
    hug.style.left = `${Math.random() * window.innerWidth}px`;
    container.appendChild(hug);
    setTimeout(() => container.removeChild(hug), 3000);
}

function initBubbles() {
    const grid = document.getElementById('bubble-wrap-grid');
    grid.innerHTML = '';
    for(let i = 0; i < 35; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.onclick = function() { this.classList.add('popped'); };
        grid.appendChild(bubble);
    }
}
function resetBubbles() { initBubbles(); }

let worryEngine;
function initWorryDrop() {
    if(worryEngine) return; 
    worryEngine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.getElementById('worry-canvas-container'),
        engine: worryEngine,
        options: { width: 400, height: 250, wireframes: false, background: 'transparent' }
    });
    Matter.Composite.add(worryEngine.world, [
        Matter.Bodies.rectangle(200, 250, 400, 20, { isStatic: true })
    ]);
    Matter.Render.run(render);
    Matter.Runner.run(Matter.Runner.create(), worryEngine);
}

function dropWorry() {
    const text = document.getElementById('worry-input').value;
    if(!text) return;
    const block = Matter.Bodies.rectangle(200 + (Math.random()*40-20), 0, 80, 40, { restitution: 0.5 });
    Matter.Composite.add(worryEngine.world, block);
    document.getElementById('worry-input').value = '';
}

function shakeWorries() {
    Matter.Composite.allBodies(worryEngine.world).forEach(body => {
        if(!body.isStatic) Matter.Body.applyForce(body, body.position, { x: 0, y: -0.05 });
    });
}

function letGoWorries() {
    Matter.Composite.clear(worryEngine.world);
    Matter.Composite.add(worryEngine.world, [Matter.Bodies.rectangle(200, 250, 400, 20, { isStatic: true })]);
}
