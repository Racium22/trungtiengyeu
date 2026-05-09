let queue = []; let currentIndex = -1; let writers = []; let transitioning = false;

function shuffle() { queue = [...data].sort(() => Math.random() - 0.5); currentIndex = 0; }

function handleFlip() {
    if (transitioning) return;
    const flipped = document.getElementById('cardContainer').classList.toggle('flipped');
    if (flipped) {
        setTimeout(() => writers.forEach(w => w.animateCharacter()), 400);
    }
}

function updateUI() {
    const card = queue[currentIndex];
    document.getElementById('frontMeaning').innerText = card.v;
    document.getElementById('backHanziText').innerText = card.h;
    document.getElementById('backPinyin').innerText = card.p;
    document.getElementById('backRadical').innerHTML = `<b>Bộ thủ/Ghi chú:</b> <br>${card.r}`;
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${data.length}`;
    
    const wrapper = document.getElementById('stroke-wrapper');
    wrapper.innerHTML = ''; writers = [];

    const charCount = card.h.length;
    const availableWidth = 350;
    let boxSize = Math.min(140, (availableWidth / charCount) - 10);

    card.h.split('').forEach((char, i) => {
        const id = `char-${i}`;
        const div = document.createElement('div');
        div.id = id; div.className = 'stroke-box';
        div.style.width = boxSize + 'px';
        div.style.height = boxSize + 'px';
        wrapper.appendChild(div);

        writers.push(HanziWriter.create(id, char, {
            width: boxSize, height: boxSize, padding: 10, strokeColor: '#d32f2f'
        }));
    });
}

async function nextCard(e) {
    if(e) e.stopPropagation(); 
    if (transitioning) return;
    const container = document.getElementById('cardContainer');
    if (container.classList.contains('flipped')) {
        transitioning = true; container.classList.remove('flipped');
        await new Promise(r => setTimeout(r, 600)); transitioning = false;
    }
    currentIndex++;
    if (currentIndex >= data.length) { alert("Xong!"); shuffle(); }
    updateUI();
}

function replayAll(e) { if(e) e.stopPropagation(); writers.forEach(w => w.animateCharacter()); }
window.onload = () => { shuffle(); updateUI(); };
