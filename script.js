const year = document.getElementById('year');
const heroTitle = document.getElementById('hero-title');
const heroIntro = document.getElementById('hero-intro');
const roleSwitcher = document.getElementById('role-switcher');
const environmentButtons = Array.from(document.querySelectorAll('.env-pill'));
const automorphToggle = document.getElementById('automorph-toggle');
const automorphNext = document.getElementById('automorph-next');
const body = document.body;

const environments = [
  { key: 'night-sky', label: 'Aurora' },
  { key: 'ledger', label: 'Ledger' },
  { key: 'terminal', label: 'Console' },
  { key: 'editorial', label: 'Editorial' },
];

const roles = [
  'Software Engineer',
  'AI Initiatives Lead',
  'Solutions Architect',
  'Technical Program Manager',
];

const highlights = [
  'I wear a lot of hats. I write code, design systems, experiment with AI, work with people, and figure things out when there isn\u2019t a playbook.',
];

let currentEnvironment = 0;
let isAutoMorph = true;
let autoMorphTimer;
let currentRole = 0;
let roleTimer;
let isTransitioning = false;

// Color map for the radial wash transition
const themeColors = {
  'night-sky': { bg: '#0f1b2d', accent: '#5ed4b5' },
  'ledger': { bg: '#f5f3ed', accent: '#3f6fee' },
  'terminal': { bg: '#000000', accent: '#00ff41' },
  'editorial': { bg: '#1a1714', accent: '#ff9f70' },
};

// Create the transition overlay element
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'theme-transition-overlay';
document.body.appendChild(transitionOverlay);

function applyEnvironment(index) {
  if (isTransitioning) return;
  const prevIndex = currentEnvironment;
  if (prevIndex === index) return;

  currentEnvironment = index;
  const environment = environments[index];
  const nextColors = themeColors[environment.key];

  // Fluid color wash behind content
  isTransitioning = true;
  transitionOverlay.style.background = `radial-gradient(ellipse at 50% 40%, ${nextColors.accent}44 0%, ${nextColors.bg} 70%)`;

  void transitionOverlay.offsetWidth;
  transitionOverlay.classList.add('is-active');

  // Swap the theme while the wash is visible
  setTimeout(() => {
    body.classList.remove(...environments.map((entry) => `environment-${entry.key}`));
    body.classList.add(`environment-${environment.key}`);
    body.dataset.environment = environment.key;

    environmentButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (automorphNext) {
      const next = environments[(index + 1) % environments.length];
      automorphNext.textContent = `next \u25b8 ${next.label}`;
    }
  }, 400);

  // Fade out the wash
  setTimeout(() => {
    transitionOverlay.classList.remove('is-active');
    transitionOverlay.classList.add('is-fading');
  }, 1000);

  setTimeout(() => {
    transitionOverlay.classList.remove('is-fading');
    isTransitioning = false;
  }, 2000);
}

function startAutoMorph() {
  clearInterval(autoMorphTimer);
  if (!isAutoMorph) {
    return;
  }

  autoMorphTimer = setInterval(() => {
    applyEnvironment((currentEnvironment + 1) % environments.length);
  }, 30000);
}

function updateRole(index, animate) {
  if (!roleSwitcher) {
    return;
  }

  if (!animate) {
    roleSwitcher.textContent = roles[index];
    return;
  }

  roleSwitcher.classList.add('is-fading');
  window.setTimeout(() => {
    roleSwitcher.textContent = roles[index];
    roleSwitcher.classList.remove('is-fading');
  }, 300);
}

function startRoleRotation() {
  clearInterval(roleTimer);
  roleTimer = setInterval(() => {
    currentRole = (currentRole + 1) % roles.length;
    updateRole(currentRole, true);
  }, 1400);
}

function typeHighlight(index) {
  if (!heroIntro) {
    return;
  }

  heroIntro.textContent = highlights[index];
}

if (year) {
  year.textContent = new Date().getFullYear();
}

updateRole(currentRole, false);
startRoleRotation();

environmentButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    applyEnvironment(index);
    startAutoMorph();
  });
});

if (automorphToggle) {
  automorphToggle.addEventListener('click', () => {
    isAutoMorph = !isAutoMorph;
    automorphToggle.classList.toggle('is-active', isAutoMorph);
    automorphToggle.setAttribute('aria-pressed', String(isAutoMorph));
    startAutoMorph();
  });
}

// Apply the initial theme directly (applyEnvironment skips when prev === current)
body.classList.add(`environment-${environments[currentEnvironment].key}`);
body.dataset.environment = environments[currentEnvironment].key;

startAutoMorph();
typeHighlight(0);
