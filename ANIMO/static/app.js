let isanonymous = true;
let currentusername = "anonymous user";
let currentroom = "midterms";
let resourceMap;

function enterApp() {
    const toggle = document.getElementById('anon-toggle');
    isanonymous = toggle.checked;
    if (!isanonymous) {
        const usernameinput = document.getElementById('username').value;
        currentusername = usernameinput || "student user";
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

    // NEW: Initialize the stress relief games when the tab opens
    if (tabid === 'stress') {
        initBubbles();
        setTimeout(() => { initWorryDrop(); }, 100); // Wait 100ms for CSS to render the container width
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
        statusbox.innerText = "status: strictly anonymous";
        labelbox.innerText = "currently anonymous";
    } else {
        statusbox.innerText = `status: logged in as ${currentusername}`;
        labelbox.innerText = "currently visible";
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
        setTimeout(() => { textel.innerText = "hold"; }, 4000);
        setTimeout(() => { textel.innerText = "exhale"; }, 5000);
        setTimeout(() => { textel.innerText = "inhale"; }, 9000);
    }, 10000);
}

// ---------------- DASHBOARD MESSAGE FLIPPING LOGIC ----------------
const safeSpaceMessages = [
    { title: "🤍 gentle reminder", content: "unclench your jaw. drop your shoulders. remove your tongue from the roof of your mouth. take a slow sip of water." },
    { title: "🤍 gentle reminder", content: "you do not have to earn your rest. you deserve rest simply because you are a human being." },
    { title: "🤍 gentle reminder", content: "talk to yourself the exact same way you would talk to a classmate who is struggling." },
    { title: "🤍 gentle reminder", content: "you are allowed to take up space. you are allowed to ask for help. you are allowed to be a beginner." },
    { title: "🤍 gentle reminder", content: "forgive yourself for what you didn't know before you learned it." },
    { title: "🦋 fact check", content: "feeling overwhelmed does not mean you are failing. it means your brain is overloaded. step away from the screen." },
    { title: "🧠 brain fact", content: "your brain consumes 20% of your body's energy. studying hard is literally exhausting. go eat a snack." },
    { title: "🧬 science says", content: "sleep physically cleanses the brain of toxins built up during waking hours. prioritizing sleep is prioritizing success." },
    { title: "💧 hydration check", content: "your brain is 73% water. poor hydration mimics the symptoms of anxiety and brain fog. go drink a glass of water." },
    { title: "🫀 nervous system", content: "deep, slow exhales physically signal your nervous system that you are safe, slowing your heart rate almost instantly." },
    { title: "💌 professional advice", content: "\"academic stress is temporary, but your well-being is permanent. do not trade your mental health for a grade.\"" },
    { title: "💌 professional advice", content: "burnout cannot be cured by pushing through it. it is cured by resting." },
    { title: "💌 professional advice", content: "procrastination is rarely about laziness; it is usually an anxiety response to feeling overwhelmed. break the task into tiny pieces." },
    { title: "💌 professional advice", content: "you cannot hate yourself into becoming a better version of yourself. growth requires self-compassion." },
    { title: "💌 professional advice", content: "if a task feels impossible, lower your standard for the first draft. you can fix bad work; you cannot fix a blank page." },
    { title: "🌈 validation", content: "your feelings make sense. it makes sense that you are tired. give yourself permission to feel it without judging yourself." },
    { title: "🌈 validation", content: "it is okay if you are not operating at 100% today. 20% is still something. just give what you have." },
    { title: "🌈 validation", content: "you are not 'falling behind' in life. life is not a race, it is a personal journey. you are exactly where you need to be." },
    { title: "🌈 validation", content: "it is okay if your best today looks different than your best yesterday." },
    { title: "🌈 validation", content: "crying is not a sign of weakness. it is a biological mechanism to release stress hormones from your body." },
    { title: "🌿 5-4-3-2-1 grounding", content: "look around right now: find 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste." },
    { title: "💡 mindful moment", content: "where are your thoughts right now? gently guide them back to the present moment. you are safe here in the present." },
    { title: "🎧 focus", content: "close your eyes and try to identify the furthest sound you can hear right now. then, find the closest sound." },
    { title: "🌬️ box breathing", content: "inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. repeat twice." },
    { title: "🦶 grounding", content: "press your feet firmly into the floor. feel the solid ground supporting you. it isn't going anywhere." },
    { title: "📚 study tip", content: "the pomodoro technique (25 mins work, 5 mins rest) prevents academic burnout. do not marathon your studying." },
    { title: "📝 perspective", content: "five years from now, you will not remember the grade you got on this specific assignment. breathe." },
    { title: "🎒 heavy backpack", content: "you are carrying a lot right now—classes, family expectations, personal life. it's okay to feel weighed down." },
    { title: "📉 failing forward", content: "a bad grade is a reflection of a single moment in time, not a reflection of your intelligence or your worth." },
    { title: "🎓 you belong", content: "imposter syndrome lies to you. you earned your spot here. you are smart enough to be in this room." },
    { title: "☕ you are not alone", content: "over 60% of college students face mental health issues, yet few seek professional help. it is okay to reach out." },
    { title: "✨ soft truth", content: "rest is not a reward for finishing your modules. rest is a basic human need." },
    { title: "🌧️ it's okay", content: "it is okay if all you did today was survive. that is enough." },
    { title: "🔋 energy check", content: "you are like a phone battery. if you are at 10%, you need to plug in and recharge, not open 15 more apps." },
    { title: "🛡️ boundaries", content: "saying 'no' to extra tasks or social events right now is saying 'yes' to your mental health." },
    { title: "🌙 small steps", content: "you don't have to have the whole semester figured out right now. just figure out the next hour." },
    { title: "🎨 you are more", content: "you are more than your grades and your academic output. what is something you love doing just for fun?" },
    { title: "🌅 tomorrow", content: "no matter how today went, the sun will rise tomorrow, and you will get a completely fresh start." },
    { title: "🌻 bloom", content: "flowers do not force themselves to bloom all year round. they have seasons of rest. you are allowed a season of rest too." },
    { title: "🛤️ the path", content: "progress is rarely a straight line. it looks like a messy scribble. you are doing fine." },
    { title: "⭐ proud", content: "i am proud of you for showing up today, even when it was hard." },
    { title: "🛡️ safe space", content: "nothing is required of you in this little digital space. just exist." },
    { title: "🫂 virtual hug", content: "sending a quiet, calming virtual hug your way. you are doing a great job." },
    { title: "⚓ anchor", content: "you have survived 100% of your worst days so far. your track record is perfect." },
    { title: "🕯️ light", content: "even a tiny candle can light up a dark room. celebrate your smallest victories today." },
    { title: "🚪 open door", content: "it takes immense courage to admit you are struggling. that courage is your greatest strength." },
    { title: "🧭 direction", content: "it doesn't matter how slowly you go, as long as you do not stop." },
    { title: "🧩 pieces", content: "you do not have to have it all together. it is perfectly fine to be a work in progress." },
    { title: "🕰️ time", content: "give yourself the gift of time. rushing healing or learning only delays it." },
    { title: "💌 a note for you", content: "the world is genuinely a better place with you in it." }
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

// Helper function to get correct coordinates for both mouse and touch
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
    if (e.cancelable) e.preventDefault(); // Prevents screen from scrolling on mobile
    isdrawing = true; 
    hasDrawn = true; 
    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
    if (!isdrawing) return;
    if (e.cancelable) e.preventDefault(); // Prevents screen from scrolling on mobile
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
        statusmsg.innerText = "please write or draw something first.";
        setTimeout(() => { statusmsg.innerText = ""; }, 3000);
        return;
    }
    statusmsg.innerText = "saving securely...";
    const imageData = hasDrawn ? canvas.toDataURL('image/png') : null;
    try {
        const response = await fetch('/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentusername, text: text, image: imageData })
        });
        if (response.ok) {
            statusmsg.innerText = "journal locked and saved safely.";
            textElement.value = ''; 
            clearCanvas(); 
            setTimeout(() => { statusmsg.innerText = ""; }, 3000);
            if (!document.getElementById('journal-history').classList.contains('hidden')) { viewJournals(); }
        }
    } catch (error) { statusmsg.innerText = "error connecting to server."; }
}

async function viewJournals() {
    const historyContainer = document.getElementById('journal-history');
    const historyList = document.getElementById('journal-history-list');
    historyContainer.classList.remove('hidden');
    historyList.innerHTML = '<p style="font-family: var(--hand-font);">unlocking journal...</p>';
    try {
        const response = await fetch(`/api/journal?username=${encodeURIComponent(currentusername)}`);
        const entries = await response.json();
        historyList.innerHTML = ''; 
        if (entries.length === 0) {
            historyList.innerHTML = '<p style="font-family: var(--hand-font); color: var(--text-light);">no past entries found. start writing above!</p>';
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
    } catch (error) { historyList.innerHTML = '<p style="font-family: var(--hand-font); color: red;">error reading journal. is the python server running?</p>'; }
}

// ---------------- QUIZ & MOOD ----------------
async function submitQuiz() {
    let score = 0;
    for(let i = 1; i <= 10; i++) { score += parseInt(document.getElementById('q' + i).value); }
    let advice = "";
    if (score <= 15) { advice = "you are carrying a manageable load today. it is wonderful that you are navigating things well. please remember to keep up your gentle self-care routines, drink a glass of water, and celebrate your small wins today."; } 
    else if (score <= 24) { advice = "you are carrying quite a bit of weight right now, and it makes complete sense that you feel tired. please be gentle with yourself today. your grades do not define your worth. taking a 10-minute break to just breathe is a productive thing to do."; } 
    else { advice = "you are carrying a very heavy burden right now, and i want you to know your feelings are completely valid. please do not hold this alone. you deserve care, rest, and support. consider reaching out to our support circles or a counselor. we are here for you."; }

    const resultbox = document.getElementById('quiz-result');
    resultbox.innerHTML = `<strong>check-in score: ${score}/30</strong><br><br>${advice}`;
    resultbox.classList.remove('hidden');
    document.getElementById('download-report-btn').classList.remove('hidden');
    
    window.lastQuizData = { score: score, advice: advice };

    const list = document.getElementById('quiz-history-list');
    const entry = document.createElement('li');
    const date = new Date();
    const datestring = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let preview = advice.substring(0, 50) + "...";
    entry.innerHTML = `<span><strong>score: ${score}/30</strong> - <em>"${preview}"</em></span> <span style="color: var(--text-light); font-size: 12px;">${datestring}</span>`;
    list.insertBefore(entry, list.firstChild);

    try {
        await fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentusername, score: score, recommendation: advice })
        });
    } catch (error) { console.log("quiz data ready to save."); }
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
    entry.innerHTML = `<span>felt ${moodtext}</span> <span>${timestring}</span>`;
    list.insertBefore(entry, list.firstChild);
}

function switchRoom(roomid) {
    document.querySelectorAll('.room-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentroom = roomid;
    const welcome = document.getElementById('room-welcome');
    if (roomid === 'midterms') welcome.innerText = "welcome to the midterms support room.";
    if (roomid === 'anxiety') welcome.innerText = "welcome to the general anxiety room.";
    if (roomid === 'mothers') welcome.innerText = "welcome to the student mothers circle.";
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
    // Create 35 bubbles
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
    if(worryEngine) return; // Prevent double initialization
    
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

    // Create the invisible walls to keep blocks inside
    const leftWall = Bodies.rectangle(0, height/2, 20, height, { isStatic: true, render: { fillStyle: 'transparent' } });
    const rightWall = Bodies.rectangle(width, height/2, 20, height, { isStatic: true, render: { fillStyle: 'transparent' } });
    bottomWall = Bodies.rectangle(width/2, height, width, 20, { isStatic: true, render: { fillStyle: '#ccc' } });

    Composite.add(worryWorld, [leftWall, rightWall, bottomWall]);

    // Allow user to drag blocks with mouse
    const mouse = Mouse.create(worryRender.canvas);
    const mouseConstraint = MouseConstraint.create(worryEngine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(worryWorld, mouseConstraint);
    worryRender.mouse = mouse;

    // Draw text perfectly centered on the blocks
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

    // Pastel colors for the blocks
    const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Estimate box width based on text length
    const boxWidth = Math.max(100, text.length * 10);

    const block = Matter.Bodies.rectangle(width/2 + (Math.random()*40-20), -20, boxWidth, 40, {
        restitution: 0.5,
        label: text, // Store the text to draw it later
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
    // Translate the floor deep down so blocks fall out
    Matter.Body.translate(bottomWall, { x: 0, y: 1000 }); 
    
    setTimeout(() => {
        // Bring the floor back
        Matter.Body.translate(bottomWall, { x: 0, y: -1000 }); 
        
        // Delete all the bodies that fell away so they don't lag the computer
        const bodies = Matter.Composite.allBodies(worryWorld);
        bodies.forEach(body => {
            if(!body.isStatic && body.position.y > 500) {
                Matter.Composite.remove(worryWorld, body);
            }
        });
    }, 2000);
}
