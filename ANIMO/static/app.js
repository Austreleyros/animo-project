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
    if (element) {
        element.classList.add('active');
    }
    
    if (tabid === 'map-view' && resourceMap) {
        setTimeout(() => { resourceMap.invalidateSize(); }, 100);
    }

    if (tabid === 'stress') {
        initBubbles();
        setTimeout(() => { initWorryDrop(); }, 100); 
    }
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

// ---------------- GIS MAP FEATURE ----------------
function initMap() {
    resourceMap = L.map('gis-map').setView([8.9500, 125.5650], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(resourceMap);

    L.marker([8.9554, 125.5973]).addTo(resourceMap).bindPopup('<b>📍 CSU University Clinic</b><br>Ampayon Campus.<br>Available for student guidance, basic counseling, and safe space check-ins.');
    L.marker([8.9475, 125.5406]).addTo(resourceMap).bindPopup('<b>🧠 PsycWorld Psychological Services</b><br>554 Montilla Boulevard.<br>Offers counseling, therapy, and LGBTQIA+ affirmative care. Contact: 0906-586-0624');
    L.marker([8.9450, 125.5410]).addTo(resourceMap).bindPopup('<b>🛋️ Gestalt Psychological Services</b><br>AD Curato St.<br>Provides hybrid consultations, therapy, and psychological assessment. Contact: 0963-914-7620');
    L.marker([8.9410, 125.5390]).addTo(resourceMap).bindPopup('<b>🏥 Holy Child Hospital</b><br>Provides counseling services handled by registered licensed guidance counselors and psychometricians.');
    L.marker([8.9320, 125.5350]).addTo(resourceMap).bindPopup('<b>🏥 ACE Medical Center Neuroscience</b><br>South Montilla Blvd.<br>Offers advanced neurological and psychiatric diagnostics for severe cases.');
    L.marker([8.9550, 125.5320]).addTo(resourceMap).bindPopup('<b>🏥 Butuan Medical Center (BMC)</b><br>Public hospital option for psychological assessments and general psychiatric help.');
}

function initBreathingText() {
    const textel = document.getElementById('breathe-text');
    setInterval(() => {
        setTimeout(() => { textel.innerText = "Hold"; }, 4000);
        setTimeout(() => { textel.innerText = "Exhale"; }, 5000);
        setTimeout(() => { textel.innerText = "Inhale"; }, 9000);
    }, 10000);
}

// ---------------- DASHBOARD MESSAGE FLIPPING LOGIC ----------------
const safeSpaceMessages = [
    { title: "🤍 Gentle Reminder", content: "Unclench your jaw. Drop your shoulders. Remove your tongue from the roof of your mouth. Take a slow sip of water." },
    { title: "🤍 Gentle Reminder", content: "You do not have to earn your rest. You deserve rest simply because you are a human being." },
    { title: "🤍 Gentle Reminder", content: "Talk to yourself the exact same way you would talk to a classmate who is struggling." },
    { title: "🤍 Gentle Reminder", content: "You are allowed to take up space. You are allowed to ask for help. You are allowed to be a beginner." },
    { title: "🤍 Gentle Reminder", content: "Forgive yourself for what you didn't know before you learned it." },
    { title: "🦋 Fact Check", content: "Feeling overwhelmed does not mean you are failing. It means your brain is overloaded. Step away from the screen." },
    { title: "🧠 Brain Fact", content: "Your brain consumes 20% of your body's energy. Studying hard is literally exhausting. Go eat a snack." },
    { title: "🧬 Science Says", content: "Sleep physically cleanses the brain of toxins built up during waking hours. Prioritizing sleep is prioritizing success." },
    { title: "💧 Hydration Check", content: "Your brain is 73% water. Poor hydration mimics the symptoms of anxiety and brain fog. Go drink a glass of water." },
    { title: "🫀 Nervous System", content: "Deep, slow exhales physically signal your nervous system that you are safe, slowing your heart rate almost instantly." },
    { title: "💌 Professional Advice", content: "\"Academic stress is temporary, but your well-being is permanent. Do not trade your mental health for a grade.\"" },
    { title: "💌 Professional Advice", content: "Burnout cannot be cured by pushing through it. It is cured by resting." },
    { title: "💌 Professional Advice", content: "Procrastination is rarely about laziness; it is usually an anxiety response to feeling overwhelmed. Break the task into tiny pieces." },
    { title: "💌 Professional Advice", content: "You cannot hate yourself into becoming a better version of yourself. Growth requires self-compassion." },
    { title: "💌 Professional Advice", content: "If a task feels impossible, lower your standard for the first draft. You can fix bad work; you cannot fix a blank page." },
    { title: "🌈 Validation", content: "Your feelings make sense. It makes sense that you are tired. Give yourself permission to feel it without judging yourself." },
    { title: "🌈 Validation", content: "It is okay if you are not operating at 100% today. 20% is still something. Just give what you have." },
    { title: "🌈 Validation", content: "You are not 'falling behind' in life. Life is not a race, it is a personal journey. You are exactly where you need to be." },
    { title: "🌈 Validation", content: "It is okay if your best today looks different than your best yesterday." },
    { title: "🌈 Validation", content: "Crying is not a sign of weakness. It is a biological mechanism to release stress hormones from your body." },
    { title: "🌿 5-4-3-2-1 Grounding", content: "Look around right now: find 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste." },
    { title: "💡 Mindful Moment", content: "Where are your thoughts right now? Gently guide them back to the present moment. You are safe here in the present." },
    { title: "🎧 Focus", content: "Close your eyes and try to identify the furthest sound you can hear right now. Then, find the closest sound." },
    { title: "🌬️ Box Breathing", content: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat twice." },
    { title: "🦶 Grounding", content: "Press your feet firmly into the floor. Feel the solid ground supporting you. It isn't going anywhere." },
    { title: "📚 Study Tip", content: "The Pomodoro technique (25 mins work, 5 mins rest) prevents academic burnout. Do not marathon your studying." },
    { title: "📝 Perspective", content: "Five years from now, you will not remember the grade you got on this specific assignment. Breathe." },
    { title: "🎒 Heavy Backpack", content: "You are carrying a lot right now—classes, family expectations, personal life. It's okay to feel weighed down." },
    { title: "📉 Failing Forward", content: "A bad grade is a reflection of a single moment in time, not a reflection of your intelligence or your worth." },
    { title: "🎓 You Belong", content: "Imposter syndrome lies to you. You earned your spot here. You are smart enough to be in this room." },
    { title: "☕ You Are Not Alone", content: "Over 60% of college students face mental health issues, yet few seek professional help. It is okay to reach out." },
    { title: "✨ Soft Truth", content: "Rest is not a reward for finishing your modules. Rest is a basic human need." },
    { title: "🌧️ It's Okay", content: "It is okay if all you did today was survive. That is enough." },
    { title: "🔋 Energy Check", content: "You are like a phone battery. If you are at 10%, you need to plug in and recharge, not open 15 more apps." },
    { title: "🛡️ Boundaries", content: "Saying 'No' to extra tasks or social events right now is saying 'Yes' to your mental health." },
    { title: "🌙 Small Steps", content: "You don't have to have the whole semester figured out right now. Just figure out the next hour." },
    { title: "🎨 You Are More", content: "You are more than your grades and your academic output. What is something you love doing just for fun?" },
    { title: "🌅 Tomorrow", content: "No matter how today went, the sun will rise tomorrow, and you will get a completely fresh start." },
    { title: "🌻 Bloom", content: "Flowers do not force themselves to bloom all year round. They have seasons of rest. You are allowed a season of rest too." },
    { title: "🛤️ The Path", content: "Progress is rarely a straight line. It looks like a messy scribble. You are doing fine." },
    { title: "⭐ Proud", content: "I am proud of you for showing up today, even when it was hard." },
    { title: "🛡️ Safe Space", content: "Nothing is required of you in this little digital space. Just exist." },
    { title: "🫂 Virtual Hug", content: "Sending a quiet, calming virtual hug your way. You are doing a great job." },
    { title: "⚓ Anchor", content: "You have survived 100% of your worst days so far. Your track record is perfect." },
    { title: "🕯️ Light", content: "Even a tiny candle can light up a dark room. Celebrate your smallest victories today." },
    { title: "🚪 Open Door", content: "It takes immense courage to admit you are struggling. That courage is your greatest strength." },
    { title: "🧭 Direction", content: "It doesn't matter how slowly you go, as long as you do not stop." },
    { title: "🧩 Pieces", content: "You do not have to have it all together. It is perfectly fine to be a work in progress." },
    { title: "🕰️ Time", content: "Give yourself the gift of time. Rushing healing or learning only delays it." },
    { title: "💌 A Note For You", content: "The world is genuinely a better place with you in it." }
];

function flipNote(element) {
    element.classList.add('flipping');
    setTimeout(() => {
        const randomMsg = safeSpaceMessages[Math.floor(Math.random() * safeSpaceMessages.length)];
        if (element.classList.contains('shape-cloud')) {
            element.innerHTML = `<p>${randomMsg.content} ✨</p>`;
        } else {
            element.innerHTML = `<h3>${randomMsg.title}</h3><p>${randomMsg.content}</p>`;
        }
        element.classList.remove('tilt-left', 'tilt-right');
        element.classList.add(Math.random() > 0.5 ? 'tilt-left' : 'tilt-right');
        element.classList.remove('highlight-purple', 'highlight-blue');
        const colorChance = Math.random();
        if (colorChance > 0.66) element.classList.add('highlight-purple');
        else if (colorChance > 0.33) element.classList.add('highlight-blue');
        element.classList.remove('flipping');
    }, 150); 
}

// ---------------- DOODLE CANVAS ----------------
let canvas, ctx, isdrawing = false, hasDrawn = false;

function initCanvas() {
    canvas = document.getElementById('doodle-pad');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4a148c';
    
    // Desktop Mouse Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Mobile Touch Events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startDrawing(e) { 
    if (e.cancelable) e.preventDefault(); 
    isdrawing = true; 
    hasDrawn = true; 
    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
    if (!isdrawing) return;
    if (e.cancelable) e.preventDefault(); 
    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y); 
    ctx.stroke();
}

function stopDrawing(e) { 
    if (e && e.cancelable) e.preventDefault();
    isdrawing = false; 
    ctx.beginPath(); 
}

function clearCanvas() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    hasDrawn = false; 
}

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
        if (response.ok) {
            statusmsg.innerText = "Journal locked and saved safely.";
            textElement.value = ''; 
            clearCanvas(); 
            setTimeout(() => { statusmsg.innerText = ""; }, 3000);
            if (!document.getElementById('journal-history').classList.contains('hidden')) { viewJournals(); }
        }
    } catch (error) { statusmsg.innerText = "Error connecting to server."; }
}

async function viewJournals() {
    const historyContainer = document.getElementById('journal-history');
    const historyList = document.getElementById('journal-history-list');
    historyContainer.classList.remove('hidden');
    historyList.innerHTML = '<p style="font-family: var(--hand-font);">Unlocking journal...</p>';
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

// ---------------- QUIZ & MOOD ----------------
async function submitQuiz() {
    let score = 0;
    for(let i = 1; i <= 10; i++) { score += parseInt(document.getElementById('q' + i).value); }
    let advice = "";
    if (score <= 15) { advice = "You are carrying a manageable load today. It is wonderful that you are navigating things well. Please remember to keep up your gentle self-care routines, drink a glass of water, and celebrate your small wins today."; } 
    else if (score <= 24) { advice = "You are carrying quite a bit of weight right now, and it makes complete sense that you feel tired. Please be gentle with yourself today. Your grades do not define your worth. Taking a 10-minute break to just breathe is a productive thing to do."; } 
    else { advice = "You are carrying a very heavy burden right now, and I want you to know your feelings are completely valid. Please do not hold this alone. You deserve care, rest, and support. Consider reaching out to our support circles or a counselor. We are here for you."; }

    const resultbox = document.getElementById('quiz-result');
    resultbox.innerHTML = `<strong>Check-in Score: ${score}/30</strong><br><br>${advice}`;
    resultbox.classList.remove('hidden');
    document.getElementById('download-report-btn').classList.remove('hidden');
    
    window.lastQuizData = { score: score, advice: advice };

    const list = document.getElementById('quiz-history-list');
    const entry = document.createElement('li');
    const date = new Date();
    const datestring = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let preview = advice.substring(0, 50) + "...";
    entry.innerHTML = `<span><strong>Score: ${score}/30</strong> - <em>"${preview}"</em></span> <span style="color: var(--text-light); font-size: 12px;">${datestring}</span>`;
    list.insertBefore(entry, list.firstChild);

    try {
        await fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentusername, score: score, recommendation: advice })
        });
    } catch (error) { console.log("Quiz data ready to save."); }
}

function downloadReport() {
    if (!window.lastQuizData) return;
    const date = new Date();
    const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    const reportContent = `
======================================
ANIMO: ANONYMOUS MENTAL HEALTH REPORT
======================================
Date: ${dateString}
Status: Anonymous Student (Caraga State University)

CHECK-IN SCORE: ${window.lastQuizData.score} / 30
(Note for counselors: A higher score indicates higher levels of academic stress, anxiety, or burnout symptoms.)

SYSTEM ASSESSMENT & ADVICE:
${window.lastQuizData.advice}

--------------------------------------
This report was generated securely and anonymously via the Animo platform. 
Please provide this document to your guidance counselor or mental health 
professional to help them establish a baseline for your well-being.
======================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'animo_wellness_report.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

function logMood(moodtext, colorcode) {
    const list = document.getElementById('mood-list');
    const entry = document.createElement('li');
    const timestring = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    entry.style.borderLeft = `5px solid ${colorcode}`;
    entry.innerHTML = `<span>Felt ${moodtext}</span> <span>${timestring}</span>`;
    list.insertBefore(entry, list.firstChild);
}

function switchRoom(roomid) {
    document.querySelectorAll('.room-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentroom = roomid;
    const welcome = document.getElementById('room-welcome');
    if (roomid === 'midterms') welcome.innerText = "Welcome to the Midterms Support Room.";
    if (roomid === 'anxiety') welcome.innerText = "Welcome to the General Anxiety Room.";
    if (roomid === 'mothers') welcome.innerText = "Welcome to the Student Mothers Circle.";
    const messages = document.getElementById('chat-messages');
    while (messages.children.length > 1) messages.removeChild(messages.lastChild);
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text === "") return;
    const chatmessages = document.getElementById('chat-messages');
    const msgdiv = document.createElement('div');
    msgdiv.className = 'message user';
    msgdiv.innerText = text;
    chatmessages.appendChild(msgdiv);
    input.value = "";
    chatmessages.scrollTop = chatmessages.scrollHeight;
}

function sendHug() {
    const container = document.getElementById('hug-container');
    const hug = document.createElement('div');
    hug.className = 'floating-hug';
    const icons = ['✨', '💛', '🌟', '🫂'];
    hug.innerText = icons[Math.floor(Math.random() * icons.length)];
    hug.style.left = `${Math.random() * window.innerWidth}px`;
    container.appendChild(hug);
    setTimeout(() => container.removeChild(hug), 3000);
}

// ---------------- NEW: STRESS RELIEF ZONE GAMES ----------------

// 1. Virtual Bubble Wrap
function initBubbles() {
    const grid = document.getElementById('bubble-wrap-grid');
    grid.innerHTML = '';
    for(let i = 0; i < 35; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.onclick = function() {
            if(!this.classList.contains('popped')) {
                this.classList.add('popped');
            }
        };
        grid.appendChild(bubble);
    }
}
function resetBubbles() { initBubbles(); }


// 2. The Worry Drop (Physics Engine)
let worryEngine, worryRender, worryWorld, bottomWall;

function initWorryDrop() {
    if(worryEngine) return; 
    
    const Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint;

    worryEngine = Engine.create();
    worryWorld = worryEngine.world;

    const container = document.getElementById('worry-canvas-container');
    const width = container.clientWidth || 500;
    const height = 250;

    worryRender = Render.create({
        element: container,
        engine: worryEngine,
        options: { width: width, height: height, wireframes: false, background: 'transparent' }
    });

    const leftWall = Bodies.rectangle(0, height/2, 20, height, { isStatic: true, render: { fillStyle: 'transparent' } });
    const rightWall = Bodies.rectangle(width, height/2, 20, height, { isStatic: true, render: { fillStyle: 'transparent' } });
    bottomWall = Bodies.rectangle(width/2, height, width, 20, { isStatic: true, render: { fillStyle: '#ccc' } });

    Composite.add(worryWorld, [leftWall, rightWall, bottomWall]);

    const mouse = Mouse.create(worryRender.canvas);
    const mouseConstraint = MouseConstraint.create(worryEngine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(worryWorld, mouseConstraint);
    worryRender.mouse = mouse;

    Matter.Events.on(worryRender, 'afterRender', function() {
        const context = worryRender.context;
        const bodies = Matter.Composite.allBodies(worryWorld);
        
        context.font = "14px 'Comic Sans MS', 'Chalkboard SE', sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#333";
        
        bodies.forEach(body => {
            if(body.label && body.label !== 'Rectangle Body') {
                context.fillText(body.label, body.position.x, body.position.y);
            }
        });
    });

    Render.run(worryRender);
    Runner.run(Runner.create(), worryEngine);
}

function dropWorry() {
    const input = document.getElementById('worry-input');
    const text = input.value.trim();
    if(!text) return;

    const container = document.getElementById('worry-canvas-container');
    const width = container.clientWidth || 500;

    const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const boxWidth = Math.max(100, text.length * 10);

    const block = Matter.Bodies.rectangle(width/2 + (Math.random()*40-20), -20, boxWidth, 40, {
        restitution: 0.5,
        label: text, 
        render: { fillStyle: color, strokeStyle: '#333', lineWidth: 2 }
    });
    
    Matter.Composite.add(worryWorld, block);
    input.value = '';
}

function shakeWorries() {
    const bodies = Matter.Composite.allBodies(worryWorld);
    bodies.forEach(body => {
        if(!body.isStatic) {
            Matter.Body.applyForce(body, body.position, { x: (Math.random()-0.5)*0.05, y: -0.05 });
        }
    });
}

function letGoWorries() {
    Matter.Body.translate(bottomWall, { x: 0, y: 1000 }); 
    
    setTimeout(() => {
        Matter.Body.translate(bottomWall, { x: 0, y: -1000 }); 
        
        const bodies = Matter.Composite.allBodies(worryWorld);
        bodies.forEach(body => {
            if(!body.isStatic && body.position.y > 500) {
                Matter.Composite.remove(worryWorld, body);
            }
        });
    }, 2000);
}
