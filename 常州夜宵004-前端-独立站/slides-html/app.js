const slides = [...document.querySelectorAll('.slide')];
const progressBar = document.querySelector('#progressBar');
const slideCounter = document.querySelector('#slideCounter');
const overviewDialog = document.querySelector('#overviewDialog');
const overviewGrid = document.querySelector('#overviewGrid');
const notesPanel = document.querySelector('#notesPanel');
const notesContent = document.querySelector('#notesContent');

const appendixIndex = slides.findIndex((slide) => slide.classList.contains('appendix'));
let currentIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

function indexFromHash() {
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  if (!match) return 0;
  return Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1));
}

function updateNotes() {
  const note = slides[currentIndex].querySelector('.speaker-note');
  notesContent.textContent = note?.textContent.trim() || '本页没有额外讲师备注。';
}

function updateOverview() {
  overviewGrid.querySelectorAll('button').forEach((button, index) => {
    button.classList.toggle('current', index === currentIndex);
  });
}

function showSlide(index, { updateHash = true } = {}) {
  const nextIndex = Math.min(slides.length - 1, Math.max(0, index));
  slides[currentIndex]?.classList.remove('active');
  currentIndex = nextIndex;
  slides[currentIndex].classList.add('active');

  const title = slides[currentIndex].dataset.title || `第 ${currentIndex + 1} 页`;
  const progress = ((currentIndex + 1) / slides.length) * 100;
  slideCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
  progressBar.style.width = `${progress}%`;
  document.title = `${title}｜纯前端 Vibe Coding`;

  if (updateHash) history.replaceState(null, '', `#slide-${currentIndex + 1}`);
  updateNotes();
  updateOverview();
}

function nextSlide() { showSlide(currentIndex + 1); }
function previousSlide() { showSlide(currentIndex - 1); }

function buildOverview() {
  const fragment = document.createDocumentFragment();
  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = slide.classList.contains('appendix') ? 'appendix-thumb' : '';
    button.innerHTML = `<small>${String(index + 1).padStart(2, '0')}</small>${slide.dataset.title || '未命名页面'}`;
    button.addEventListener('click', () => {
      showSlide(index);
      overviewDialog.close();
    });
    fragment.appendChild(button);
  });
  overviewGrid.appendChild(fragment);
}

function openOverview() {
  if (!overviewDialog.open) overviewDialog.showModal();
  updateOverview();
}

function toggleNotes(force) {
  const nextState = typeof force === 'boolean' ? force : !notesPanel.classList.contains('open');
  notesPanel.classList.toggle('open', nextState);
  notesPanel.setAttribute('aria-hidden', String(!nextState));
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    // Some browsers block fullscreen from file:// or non-user initiated calls.
  }
}

document.querySelector('#prevSlide').addEventListener('click', previousSlide);
document.querySelector('#nextSlide').addEventListener('click', nextSlide);
document.querySelector('#openOverview').addEventListener('click', openOverview);
document.querySelector('#toggleFullscreen').addEventListener('click', toggleFullscreen);
document.querySelector('#closeOverview').addEventListener('click', () => overviewDialog.close());
document.querySelector('#closeNotes').addEventListener('click', () => toggleNotes(false));

overviewDialog.addEventListener('click', (event) => {
  if (event.target === overviewDialog) overviewDialog.close();
});

window.addEventListener('hashchange', () => showSlide(indexFromHash(), { updateHash: false }));

window.addEventListener('keydown', (event) => {
  const tagName = document.activeElement?.tagName;
  const isInteractive = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tagName);

  if (event.key === 'Escape' && notesPanel.classList.contains('open')) {
    toggleNotes(false);
    return;
  }

  if (isInteractive && !['Escape'].includes(event.key)) return;

  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    nextSlide();
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    previousSlide();
  } else if (event.key === 'Home') {
    event.preventDefault();
    showSlide(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    showSlide(slides.length - 1);
  } else if (event.key.toLowerCase() === 'f') {
    toggleFullscreen();
  } else if (event.key.toLowerCase() === 'o') {
    openOverview();
  } else if (event.key.toLowerCase() === 'n') {
    toggleNotes();
  } else if (event.key.toLowerCase() === 'a' && appendixIndex >= 0) {
    showSlide(appendixIndex);
  }
});

const deck = document.querySelector('#deck');
deck.addEventListener('touchstart', (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

deck.addEventListener('touchend', (event) => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (deltaX < 0) nextSlide();
  else previousSlide();
}, { passive: true });

document.querySelector('.upgrade-step.raw a').addEventListener('click', (event) => event.preventDefault());
document.querySelector('.mini-action').addEventListener('click', (event) => {
  event.currentTarget.classList.toggle('clicked');
  event.currentTarget.textContent = event.currentTarget.classList.contains('clicked') ? '✓ 已经响应' : '点我试试';
  document.querySelector('.mini-feedback').classList.toggle('on');
});

const timerDisplay = document.querySelector('#timerDisplay');
const timerStart = document.querySelector('#timerStart');
const timerReset = document.querySelector('#timerReset');
const timerTotalSeconds = 40 * 60;
let timerRemaining = timerTotalSeconds;
let timerInterval = null;
let timerEndsAt = null;

function renderTimer() {
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.classList.toggle('timer-finished', timerRemaining === 0);
}

function stopTimer() {
  if (timerInterval) window.clearInterval(timerInterval);
  timerInterval = null;
  timerEndsAt = null;
}

function tickTimer() {
  timerRemaining = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
  renderTimer();
  if (timerRemaining === 0) stopTimer();
}

timerStart.addEventListener('click', () => {
  if (timerInterval) {
    tickTimer();
    stopTimer();
    return;
  }
  if (timerRemaining === 0) timerRemaining = timerTotalSeconds;
  timerEndsAt = Date.now() + timerRemaining * 1000;
  timerInterval = window.setInterval(tickTimer, 250);
  renderTimer();
});

timerReset.addEventListener('click', () => {
  stopTimer();
  timerRemaining = timerTotalSeconds;
  renderTimer();
});

buildOverview();
renderTimer();
showSlide(indexFromHash(), { updateHash: !window.location.hash });
