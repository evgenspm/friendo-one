// Prompts shown inside the phone — indexes match the pills
const PROMPTS = [
  "Bake me extra-gooey chocolate chip cookies",
  "Pick a movie for a rainy Sunday night",
  "Plan my dad's 60th birthday party",
  "Find a cozy ramen spot open late",
  "Compare the top electric cars of 2026",
];

const WORD_MS = 150; // stagger between words appearing
const HOLD_MS = 2600; // pause after the last word is in
const FADE_MS = 300; // prompt fade-out

const promptEl = document.getElementById("phonePrompt");
const tracks = Array.from(document.querySelectorAll(".pills-track"));

// Triple the pills in each track so the carousel can keep sliding left
tracks.forEach((track) => {
  track.innerHTML += track.innerHTML + track.innerHTML;
});

const N = PROMPTS.length;
let current = 0;
let timer = null;

function setActivePill(i, fillMs) {
  tracks.forEach((track) => {
    track.querySelectorAll(".pill").forEach((pill) => {
      pill.classList.remove("active");
    });
    // reflow so the fill width resets before the next transition starts
    void track.offsetWidth;

    const copies = track.querySelectorAll(`.pill[data-i="${i}"]`);
    copies.forEach((pill) => pill.classList.add("active"));

    // slide the track so the active pill (middle copy) sits at the left edge
    const middle = copies[1];
    if (middle) {
      track.style.setProperty("--fill-ms", `${fillMs}ms`);
      track.style.transform = `translateX(${-middle.offsetLeft + 28}px)`;
    }
  });
}

function showPrompt(i) {
  clearTimeout(timer);
  promptEl.classList.remove("out");
  promptEl.textContent = "";

  const words = PROMPTS[i].split(" ");
  words.forEach((word, k) => {
    const span = document.createElement("span");
    span.className = "w";
    span.textContent = word;
    promptEl.appendChild(span);
    if (k < words.length - 1) {
      promptEl.appendChild(document.createTextNode(" "));
    }
    setTimeout(() => span.classList.add("in"), 30 + k * WORD_MS);
  });

  const totalMs = words.length * WORD_MS + HOLD_MS;
  setActivePill(i, totalMs);

  timer = setTimeout(() => {
    promptEl.classList.add("out");
    timer = setTimeout(() => {
      current = (current + 1) % N;
      showPrompt(current);
    }, FADE_MS);
  }, totalMs);
}

showPrompt(current);

// Clicking a pill jumps straight to that prompt
tracks.forEach((track) => {
  track.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;
    current = Number(pill.dataset.i);
    showPrompt(current);
  });
});

// Mobile menu
const burger = document.getElementById("navBurger");
const menu = document.getElementById("mMenu");

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
