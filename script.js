/* ---------------- APPLICATION STATE ---------------- */
let currentActiveLetter = 0;
let isAdmin = false;
const ADMIN_PIN = "1234"; // Default PIN

// 1. PREVIEW PHOTOS (Mga picture sa labas/nakasilip sa sobre)
// I-update ang folder path kung nakalagay sa hiwalay na folder (e.g., "previews/preview1.jpg")
const previewPhotos = [
  "preview/preview1.jpg",
  "preview/preview2.jpg",
  "preview/preview3.jpg",
  "preview/preview4.jpg",
  "preview/preview5.jpg",
  "preview/preview6.jpg",
  "preview/preview7.jpg",
  "preview/preview1.jpg",
  "preview/preview2.jpg",
  "preview/preview3.jpg",
  "preview/preview4.jpg",
  "preview/preview5.jpg",
  "preview/preview6.jpg",
  "preview/preview7.jpg",
  "preview/preview1.jpg",
  "preview/preview2.jpg",
  "preview/preview3.jpg",
  "preview/preview4.jpg"
];

// 2. HANDWRITTEN LETTER SCANS OR VIDEO
// I-update ang folder path at exact file extension (.jpg, .png, .mp4, etc.)
const letterScans = [
  "letter/biancakes.jpg",
  "letter/kuyaj.jpg",
  "letter/bunso.jpg",
  "letter/peneng.jpg",
  "letter/pareng lhie.mp4", // <--- Halimbawa ng MP4 file sa sarili nitong folder
  "letter/mamadade.mp4",
  "letter/shyrann.jpg",
  "letter/gret.jpg",
  "letter/shiena.jpg",
  "letter/letter 10.jpg",
  "letter/letter 11.jpg",
  "letter/letter 12.jpg",
  "letter/letter 13.jpg",
  "letter/letter 14.jpg",
  "letter/letter 15.jpg",
  "letter/letter 16.jpg",
  "letter/letter 17.jpg",
  "letter/letter 18.jpg"
];

const letterTitles = [
  "Letter I",
  "Letter II",
  "Letter III",
  "Letter IV",
  "Letter V",
  "Letter VI",
  "Letter VII",
  "Letter VIII",
  "Letter IX",
  "Letter X",
  "Letter XI",
  "Letter XII",
  "Letter XIII",
  "Letter XIV",
  "Letter XV",
  "Letter XVI",
  "Letter XVII",
  "Letter XVIII"
];

function renderEnvelopes() {
  const grid = document.getElementById('envelopesGrid');
  if (!grid) return;

  const icons = ['fa-heart', 'fa-star', 'fa-crown', 'fa-sparkles', 'fa-bell', 'fa-gift', 'fa-dove', 'fa-moon', 'fa-sun', 'fa-camera', 'fa-hand-holding-heart', 'fa-music', 'fa-bolt', 'fa-seedling', 'fa-award', 'fa-rainbow', 'fa-birthday-cake', 'fa-kiss-wink-heart'];

  grid.innerHTML = letterTitles.map((title, index) => {
    const icon = icons[index % icons.length];
    const previewImg = previewPhotos[index] || "coverphoto.jpg"; 

    return `
      <div class="envelope-card" onclick="openLetterModal(${index})" aria-label="Open ${title}">
        <div class="envelope-visual">
          <div class="envelope-flap"></div>
          <div class="envelope-paper">
            <!-- PREVIEW PHOTO SA LABAS -->
            <img src="${previewImg}" alt="Preview ${index + 1}" class="envelope-letter-image">
          </div>
          <div class="wax-seal"><i class="fa-solid ${icon}"></i></div>
        </div>
        <h3 class="envelope-title">${title}</h3>
        <span class="envelope-tag">Special Note ${index + 1}</span>
        <br>
        <span class="btn-open-letter">Unseal Envelope <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    `;
  }).join('');
}

renderEnvelopes();

/* ---------------- AUDIO & MUSIC CONTROLS ---------------- */
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggleBtn');

  if (!music) return;

  if (music.paused) {
    music.play();
    if (btn) btn.classList.remove('paused');
  } else {
    music.pause();
    if (btn) btn.classList.add('paused');
  }
}

/* ---------------- PAGE NAVIGATION ---------------- */
function navigateToPage(pageNum) {
  const p1 = document.getElementById('welcomeScreen');
  const p2 = document.getElementById('mainScreen');
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggleBtn');

  if (pageNum === 2) {
    if (music) {
      music.volume = 0.4; // 40% volume
      music.play().then(() => {
        if (btn) btn.classList.remove('paused');
      }).catch(err => console.log("Autoplay blocked:", err));
    }

    p1.classList.remove('active');
    setTimeout(() => {
      p1.style.display = 'none';
      p2.style.display = 'flex';
      setTimeout(() => p2.classList.add('active'), 50);
      
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d8bbfd', '#fbbf24']
      });
    }, 400);
  } else {
    if (music) {
      music.pause();
      if (btn) btn.classList.add('paused');
    }

    p2.classList.remove('active');
    setTimeout(() => {
      p2.style.display = 'none';
      p1.style.display = 'flex';
      setTimeout(() => p1.classList.add('active'), 50);
    }, 400);
  }
}

/* ---------------- LETTER / VIDEO MODAL ---------------- */
function openLetterModal(index) {
  currentActiveLetter = index;
  document.getElementById('modalLetterTitle').innerText = letterTitles[index];
  
  const modalBody = document.querySelector('#letterModal .modal-body');
  const fileUrl = letterScans[index];

  // Tinitingnan kung video format ang file
  const isVideo = fileUrl.toLowerCase().endsWith('.mp4') || 
                  fileUrl.toLowerCase().endsWith('.webm') || 
                  fileUrl.toLowerCase().endsWith('.mov') ||
                  fileUrl.toLowerCase().endsWith('.m4v');

  if (isVideo) {
    // Nirerespeto ang orihinal na sukat at format ng video nang walang pilit na sizing
    modalBody.innerHTML = `
      <div class="letter-image-wrapper" style="background: transparent; border: none; box-shadow: none; width: 100%;">
        <video controls playsinline autoplay style="max-width: 100%; height: auto; display: block; border-radius: 12px; margin: 0 auto;">
          <source src="${fileUrl}">
          Your browser does not support playing this video.
        </video>
      </div>
    `;
  } else {
    // Nirerespeto ang orihinal na sukat at format ng larawan
    modalBody.innerHTML = `
      <div class="letter-image-wrapper">
        <img src="${fileUrl}" alt="Handwritten Letter Scan" id="modalLetterImg" class="letter-img">
      </div>
    `;
  }

  document.getElementById('letterModal').classList.add('active');
}

function closeLetterModal() {
  document.getElementById('letterModal').classList.remove('active');
  // Hihinto ang video/media kapag isinarad ang modal
  const modalBody = document.querySelector('#letterModal .modal-body');
  if (modalBody) modalBody.innerHTML = '';
}

/* ---------------- ADMIN AUTHENTICATION ---------------- */
function openAdminLoginModal() {
  document.getElementById('adminModal').classList.add('active');
  document.getElementById('adminPinInput').focus();
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
  document.getElementById('adminPinInput').value = '';
}

function attemptAdminLogin() {
  const inputPin = document.getElementById('adminPinInput').value;
  if (inputPin === ADMIN_PIN) {
    isAdmin = true;
    closeAdminModal();
    document.getElementById('adminBar').classList.add('active');
    document.getElementById('adminReplaceLetterBtn').style.display = 'inline-flex';
    alert("🔓 Admin mode activated!");
  } else {
    alert("❌ Incorrect PIN. Please try again.");
  }
}

function logoutAdmin() {
  isAdmin = false;
  document.getElementById('adminBar').classList.remove('active');
  document.getElementById('adminReplaceLetterBtn').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
    openAdminLoginModal();
  }
});

/* ---------------- ADMIN IMAGE UPDATES ---------------- */
function triggerCoverUpload() {
  document.getElementById('coverPhotoInput').click();
}

function handleCoverUpdate(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('coverImageDisplay').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function triggerLetterUpload() {
  document.getElementById('letterPhotoInput').click();
}

function handleLetterUpdate(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      letterScans[currentActiveLetter] = e.target.result;
      openLetterModal(currentActiveLetter);
    };
    reader.readAsDataURL(file);
  }
}

/* ---------------- AMBIENT BACKGROUND CANVAS ---------------- */
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.8 + 0.3;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = Math.random() > 0.3 ? '#d8bbfd' : '#fbbf24';
  }
  update() {
    this.y -= this.speedY;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 40; i++) {
  particles.push(new Particle());
}

function animateSparkles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateSparkles);
}
animateSparkles();
