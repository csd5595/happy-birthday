const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//const match = document.querySelector(".match");
const cakeArea = document.querySelector(".cake-area");
const cakeImg = document.querySelector(".cake");
const birthdayPhoto = document.getElementById("birthday-photo");
const restartButton = document.getElementById("restart-button");
const birthdayVideo = document.getElementById("birthday-video");
// Constants
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const CAMERA_QUALITY_WIDTH = 640;
const CAMERA_QUALITY_HEIGHT = 480; // This is a standard 4:3 ratio (1.33)

const WEBCAM_WIDTH = isMobile ? 240 : 300;
const WEBCAM_HEIGHT = isMobile ? 180 : 225;
const BLOW_THRESHOLD = 70; // how sensitive the mic is
//const LIGHT_DISTANCE = 20; // how close match needs to be to light candles

canvas.width = WEBCAM_WIDTH;
canvas.height = WEBCAM_HEIGHT;

// Track hand position
let handPosition = { x: 0.5, y: 0.5 };
let isHandDetected = false;

let isCakeLit = true;
let isCandlesBlownOut = false;

// Initial setup: Ensure the cake is displayed as lit from the start
// NOTE: You should ensure your HTML/CSS sets the initial state correctly,
// but for safety, we set the source here.
cakeImg.src = "assets/cake_lit.gif";

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: isMobile ? 0 : 1,
  minDetectionConfidence: isMobile ? 0.6 : 0.7,
  minTrackingConfidence: isMobile ? 0.4 : 0.5,
});

// Hand tracking
/*hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
  ctx.restore();

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    isHandDetected = true;

    // get index finger tip (landmark 8)
    const indexTip = landmarks[8];

    handPosition.x = 1 - indexTip.x;
    handPosition.y = indexTip.y;

    //updateMatchPosition();

    //checkCandleLighting();
  } else {
    isHandDetected = false;
  }
});
*/
// Match
/*
function updateMatchPosition() {
  if (!isHandDetected) return;

  const cakeRect = cakeArea.getBoundingClientRect();

  const padding = 20;
  const matchX = padding + handPosition.x * (cakeRect.width - padding * 2 - 40);
  const matchY =
    padding + handPosition.y * (cakeRect.height - padding * 2 - 60);

  match.style.left = `${matchX}px`;
  match.style.top = `${matchY}px`;
}

// Light candles
function checkCandleLighting() {
  if (isCakeLit || isCandlesBlownOut) return;

  const matchRect = match.getBoundingClientRect();
  const cakeRect = cakeImg.getBoundingClientRect();

  const matchTipX = matchRect.left + matchRect.width / 2;
  const matchTipY = matchRect.top;

  const candleX = cakeRect.left + cakeRect.width / 2;
  const candleY = cakeRect.top + 10;

  const distance = Math.sqrt(
    Math.pow(matchTipX - candleX, 2) + Math.pow(matchTipY - candleY, 2)
  );

  if (distance < LIGHT_DISTANCE) {
    lightCake();
  }
}
*/

/*
function lightCake() {
  if (isCakeLit) return;

  isCakeLit = true;
  cakeImg.src = "assets/cake_lit.gif";
  match.style.display = "none";
}
  */

function blowOutCandles() {
  if (!isCakeLit || isCandlesBlownOut) return;

  isCandlesBlownOut = true;
  cakeImg.src = "assets/cake_unlit.gif";

  // NEW: Make the birthday photo appear
  if (birthdayPhoto) {
      birthdayPhoto.classList.remove("hidden");
  }

  //document.getElementById("background-music").pause();

 // 1. START FADE-IN (Appear)
  if (birthdayPhoto) {
    birthdayPhoto.classList.remove("hidden");
    birthdayPhoto.classList.add("visible");
  }

  // 2. Schedule the FADE-OUT (Disappear) after 4 seconds (4000 milliseconds)
  const displayDuration = 1500; 

  setTimeout(() => {
    if (birthdayPhoto) {
      // Remove the 'visible' class and add 'hidden' class to trigger fade-out
      birthdayPhoto.classList.remove("visible");
      birthdayPhoto.classList.add("hidden");
      

      setTimeout(() => {
        
        restartButton.classList.remove("hidden");     
      }, 1000); 
    } else {
      // If no photo is loaded, just show the button and fade up music after the duration
        restartButton.classList.remove("hidden");
    }
  }, displayDuration); // Wait for 4 seconds

  createConfetti();
}
function resetGame() {
    // 1. Reset Game State Flags
    isCandlesBlownOut = false;
    isCakeLit = true;
    
    // 2. Visual Reset (Relight Cake)
    cakeImg.src = "assets/cake_lit.gif";

    // 3. Hide the Restart Button
    restartButton.classList.add("hidden");

    // 4. Hide the Photo (if it's still visible)
    if (birthdayPhoto) {
        birthdayPhoto.classList.remove("visible");
        birthdayPhoto.classList.add("hidden");
    }
    // 3. MUSIC RESET: Set volume to full and restart playback
    const music = document.getElementById("background-music");
    if (music) {
        music.volume = 1.0; // Ensure volume is set to max
        playMusic();        // Attempt to play again
    }

}

// ASCII Confetti
const CONFETTI_SYMBOLS = [
  "⭒",
  "˚",
  "⋆",
  "⊹",
  "₊",
  "݁",
  "˖",
  "✦",
  "✧",
  "·",
  "°",
  "✶",
  "❤️",
  "✦",
  "✧",
  "❤️",
];

function createConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  const confettiCount = 80;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("span");
      confetti.className = "confetti";
      confetti.textContent =
        CONFETTI_SYMBOLS[Math.floor(Math.random() * CONFETTI_SYMBOLS.length)];

      confetti.style.left = Math.random() * 100 + "vw";

      confetti.style.fontSize = 0.8 + Math.random() * 1.2 + "rem";

      const duration = 4 + Math.random() * 4;
      confetti.style.animationDuration = duration + "s";

      confetti.style.animationDelay = Math.random() * 0.5 + "s";

      const swayAmount = (Math.random() - 0.5) * 100;
      confetti.style.setProperty("--sway", swayAmount + "px");

      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, (duration + 1) * 1000);
    }, i * 50);
  }

  setTimeout(() => {
    container.remove();
  }, 15000);
}

// Blow detection
let audioContext = null;
let analyser = null;
let microphone = null;
let isBlowDetectionActive = false;

async function initBlowDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    isBlowDetectionActive = true;

    detectBlow();
  } catch (err) {
    console.error("Error accessing microphone:", err);
  }
}

function detectBlow() {
  if (!isBlowDetectionActive) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  if (volume > BLOW_THRESHOLD && isCakeLit && !isCandlesBlownOut) {
    blowOutCandles();
  }

  requestAnimationFrame(detectBlow);
}
// ------------------------------------------
// 🎼 NEW MUSIC FUNCTIONALITY
// ------------------------------------------

function playMusic() {
    const music = document.getElementById("background-music");
    // Check if the music element exists and try to play it
    if (music && (audioContext || !isMobile)) {
        // Attempt to play, this might fail without user interaction
        music.play().catch(error => {
            console.log("Music auto-play failed, waiting for user interaction.", error);
        });
    }
}

// ------------------------------------------

// Camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
      },
    });

    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      startHandTracking();
    };
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Could not access webcam. Please allow camera permissions.");
  }
}

function startHandTracking() {
  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: WEBCAM_WIDTH,
    height: WEBCAM_HEIGHT,
  });

  camera.start();
}

window.addEventListener("DOMContentLoaded", () => {
  initCamera();
  playMusic();

  // 🌟 1. START THE BACKGROUND VIDEO IMMEDIATELY 🌟
  if (birthdayVideo) {
      // Attempt to start the video. Browsers might block this until a click.
      birthdayVideo.play().catch(e => console.error("Video start blocked by browser:", e));
  }

  if (isMobile) {
    document.body.addEventListener(
      "click",
      () => {
        if (!audioContext) {
          initBlowDetection();
        }

        if (birthdayVideo && birthdayVideo.paused) {
          birthdayVideo.play().catch(e => console.error("Video resume failed on click:", e));
        }
        playMusic();
      },
      { once: true }
    );
  } else {
    initBlowDetection();
    document.body.addEventListener("click", playMusic, { once: true });
    document.body.addEventListener("click", () => {
      if (birthdayVideo && birthdayVideo.paused) {
        birthdayVideo.play().catch(e => console.error("Desktop video resume failed:", e));
      }
    }, { once: true }); 
  }
  const restartButton = document.getElementById("restart-button");
  if(restartButton){
    restartButton.addEventListener("click", resetGame);
  }
});
