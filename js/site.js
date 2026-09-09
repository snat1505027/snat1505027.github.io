import { publications, experience, education } from './data.js';

const portraitSamples = [
  { src:'images/portraits/candidate-1.jpg', position:'50% 58%' },
  { src:'images/portraits/candidate-2.jpg', position:'50% 56%' },
  { src:'images/portraits/candidate-3.jpg', position:'50% 52%' },
  { src:'images/portraits/candidate-4.jpg', position:'50% 52%' },
  { src:'images/portraits/candidate-5.jpg?v=2', position:'67% 48%' }
];

const requestedPortrait = Number(new URLSearchParams(window.location.search).get('portrait'));
if (requestedPortrait >= 1 && requestedPortrait <= portraitSamples.length) {
  const portrait = document.querySelector('#hero-portrait');
  const sample = portraitSamples[requestedPortrait - 1];
  portrait.src = sample.src;
  portrait.style.objectPosition = sample.position;
  const switcher = document.querySelector('#portrait-samples');
  switcher.hidden = false;
  switcher.innerHTML = portraitSamples.map((_, index) => {
    const number = index + 1;
    const active = number === requestedPortrait;
    return `<a href="?portrait=${number}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''} aria-label="View portrait sample ${number}">${number}</a>`;
  }).join('');
}

const escapeHTML = (value) => value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
const emphasizeName = (authors) => escapeHTML(authors).replaceAll('Syeda Nahida Akter', '<strong>Syeda Nahida Akter</strong>');

const publicationList = document.querySelector('#publication-list');
const controls = document.createElement('div');
controls.className = 'publication-controls';
controls.setAttribute('aria-label', 'Filter publications');
controls.innerHTML = `
  <div class="filter-group">
    <button class="filter active" type="button" data-filter="all" aria-pressed="true">All</button>
    <button class="filter" type="button" data-filter="llm" aria-pressed="false">Language models</button>
    <button class="filter" type="button" data-filter="multimodal" aria-pressed="false">Multimodal</button>
    <button class="filter" type="button" data-filter="other" aria-pressed="false">Earlier work</button>
  </div>
  <p class="publication-count" aria-live="polite"></p>`;
publicationList.before(controls);

function renderPublications(filter = 'all') {
  const selected = publications.filter((item) => filter === 'all' || item.category === filter);
  publicationList.innerHTML = selected.map((item) => `
    <article class="publication-card">
      <div class="publication-meta"><span>${item.year}</span><span>${escapeHTML(item.venue)}</span></div>
      <div>
        <h3><a href="${item.url}">${escapeHTML(item.title)} <span aria-hidden="true">↗</span></a></h3>
        <p>${emphasizeName(item.authors)}</p>
      </div>
    </article>`).join('');
  document.querySelector('.publication-count').textContent = `${selected.length} publication${selected.length === 1 ? '' : 's'}`;
}

controls.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  controls.querySelectorAll('.filter').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderPublications(button.dataset.filter);
});

document.querySelector('#experience-list').innerHTML = experience.map((item) => `
  <article class="timeline-item">
    <p class="timeline-range">${escapeHTML(item.range)}</p>
    <div><h3>${escapeHTML(item.role)}</h3><p class="timeline-org">${escapeHTML(item.org)}</p><p>${escapeHTML(item.summary)}</p></div>
  </article>`).join('');

document.querySelector('#education-list').innerHTML = education.map((item) => `
  <article class="education-card">
    <p>${escapeHTML(item.range)}</p><h3>${escapeHTML(item.degree)}</h3><p class="school">${escapeHTML(item.school)}</p><p>${escapeHTML(item.detail)}</p>
  </article>`).join('');

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});
nav.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); });

renderPublications();
