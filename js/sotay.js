let currentIndex = 0;
let writers = [];

function updateUI() {
    const card = words[currentIndex];
    document.getElementById('displayMeaning').innerText = card.v;
    document.getElementById('displayHanzi').innerText = card.h;
    document.getElementById('displayPinyin').innerText = card.p;
    document.getElementById('displayRadical').innerHTML = `<b>Bộ thủ/Ghi chú:</b> <br>${card.r}`;
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${words.length}`;
    
    const wrapper = document.getElementById('stroke-wrapper');
    wrapper.innerHTML = ''; 
    writers = [];

    const charCount = card.h.length;
    const availableWidth = 380; 
    let boxSize = Math.min(140, (availableWidth / charCount) - 10);

    card.h.split('').forEach((char, i) => {
        const id = `char-${i}`;
        const div = document.createElement('div');
        div.id = id; 
        div.className = 'stroke-box';
        div.style.width = `${boxSize}px`;
        div.style.height = `${boxSize}px`;
        wrapper.appendChild(div);

        const writer = HanziWriter.create(id, char, {
            width: boxSize, 
            height: boxSize, 
            padding: 10, 
            strokeColor: '#d32f2f', 
            delayBetweenStrokes: 100
        });
        writers.push(writer);
        writer.animateCharacter();
    });
}

function nextCard() { if (currentIndex < words.length - 1) { currentIndex++; updateUI(); } }
function prevCard() { if (currentIndex > 0) { currentIndex--; updateUI(); } }
function replayStroke() { writers.forEach(w => w.animateCharacter()); }

window.onload = updateUI;
