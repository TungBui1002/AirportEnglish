/**
 * Airport English - Module E: Sentence Practice
 * Practical airport & PBB operational sentences across 8 topics
 */
import { storageService } from '../services/storageService.js';
import { escapeHtml, showToast } from '../utils/helpers.js';

export function renderSentencePractice(container, { sentences, navigateTo }) {
  let selectedTopicId = 0; // 0 means all
  let searchTerm = '';

  const topics = [
    { id: 0, name: 'Tất cả chủ đề' },
    { id: 1, name: '1. PBB Operations' },
    { id: 2, name: '2. Parking & Docking' },
    { id: 3, name: '3. Safety Instructions' },
    { id: 4, name: '4. Emergency Situations' },
    { id: 5, name: '5. Equipment Inspection' },
    { id: 6, name: '6. Technical Maintenance' },
    { id: 7, name: '7. Airport Communication' },
    { id: 8, name: '8. Electrical & Control' }
  ];

  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Trình duyệt không hỗ trợ phát âm thanh Web Speech', 'warning');
    }
  }

  function getFilteredSentences() {
    return sentences.filter(s => {
      const matchesTopic = selectedTopicId === 0 || s.topicId === selectedTopicId;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        s.english.toLowerCase().includes(term) ||
        s.vietnamese.toLowerCase().includes(term) ||
        s.situation.toLowerCase().includes(term) ||
        s.importantVocabulary.some(v => v.word.toLowerCase().includes(term) || v.meaning.toLowerCase().includes(term));

      return matchesTopic && matchesSearch;
    });
  }

  function renderList() {
    const listEl = container.querySelector('#sentences-list-container');
    const filtered = getFilteredSentences();

    if (!listEl) return;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 48px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <div style="font-size: 32px; margin-bottom: 8px;">✈️</div>
          <h4 style="font-size: 16px; font-weight: 700; color: var(--navy-900);">Không có mẫu câu phù hợp</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Hãy thử tìm kiếm với từ khóa khác.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      const isCompleted = storageService.isSentenceCompleted(item.id);

      let diffBadgeClass = 'badge-sky';
      if (item.difficulty === 'Intermediate') diffBadgeClass = 'badge-amber';
      if (item.difficulty === 'Advanced') diffBadgeClass = 'badge-rose';

      return `
        <div class="sentence-card" data-id="${item.id}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge ${diffBadgeClass}">${escapeHtml(item.difficulty)}</span>
              <span class="badge badge-navy" style="font-size: 11px;">${escapeHtml(item.topic)}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-icon btn-speak" data-text="${escapeHtml(item.english)}" title="Phát âm tiếng Anh">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              <button class="btn ${isCompleted ? 'btn-success' : 'btn-outline'} btn-complete-toggle" data-id="${item.id}" style="font-size: 12px; padding: 4px 10px;">
                ${isCompleted ? '✓ Đã học' : 'Đánh dấu đã học'}
              </button>
            </div>
          </div>

          <div class="sentence-english">${escapeHtml(item.english)}</div>
          <div class="sentence-vietnamese">${escapeHtml(item.vietnamese)}</div>

          <!-- Important vocabulary chips -->
          <div style="margin-bottom: 8px; font-size: 12px; font-weight: 600; color: var(--navy-800);">Từ vựng then chốt:</div>
          <div class="sentence-vocab-chips">
            ${item.importantVocabulary.map(v => `
              <span class="vocab-chip">
                <strong>${escapeHtml(v.word)}:</strong> ${escapeHtml(v.meaning)}
              </span>
            `).join('')}
          </div>

          <!-- Situation / context -->
          <div class="sentence-situation">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="flex-shrink: 0;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Tình huống:</strong> ${escapeHtml(item.situation)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="sentence-practice-page">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 class="section-title">Mẫu câu Giao tiếp & Tác nghiệp PBB</h2>
          <p class="section-subtitle">8 nhóm chủ đề chuẩn hóa trong môi trường khai thác cầu dẫn hành khách sân bay</p>
        </div>
        <div>
          <button class="btn btn-primary" id="btn-goto-sentence-quiz">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Luyện tập Ghép câu & Trắc nghiệm
          </button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="filter-bar">
        <div class="search-box" style="width: 100%;">
          <svg class="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" id="sentence-search-input" class="search-input" placeholder="Tìm theo câu tiếng Anh, tiếng Việt, từ vựng hoặc tình huống..." />
        </div>
      </div>

      <!-- Topic Navigation Tabs -->
      <div class="topic-tabs">
        ${topics.map(t => `
          <button class="topic-tab ${t.id === selectedTopicId ? 'active' : ''}" data-topic-id="${t.id}">
            ${escapeHtml(t.name)}
          </button>
        `).join('')}
      </div>

      <!-- Sentences List -->
      <div id="sentences-list-container"></div>
    </div>
  `;

  // Attach tab click listeners
  container.querySelectorAll('.topic-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedTopicId = Number(tab.dataset.topicId);
      renderList();
    });
  });

  // Attach search listener
  container.querySelector('#sentence-search-input')?.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderList();
  });

  // Attach goto sentence quiz
  container.querySelector('#btn-goto-sentence-quiz')?.addEventListener('click', () => {
    navigateTo('sentence-quiz');
  });

  // Delegation for Speak and Complete toggle
  container.querySelector('#sentences-list-container')?.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('.btn-speak');
    if (speakBtn) {
      const text = speakBtn.dataset.text;
      speakText(text);
      return;
    }

    const toggleBtn = e.target.closest('.btn-complete-toggle');
    if (toggleBtn) {
      const sId = Number(toggleBtn.dataset.id);
      storageService.markSentenceCompleted(sId);
      showToast('Đã ghi nhận hoàn thành mẫu câu!', 'success');
      renderList();
    }
  });

  // Initial render
  renderList();
}

