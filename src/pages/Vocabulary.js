/**
 * Airport English - Module B: Vocabulary
 */
import { storageService } from '../services/storageService.js';
import { escapeHtml, showToast } from '../utils/helpers.js';

export function renderVocabulary(container, { vocabulary }) {
  let searchTerm = '';
  let selectedCategory = 'all';
  let sortBy = 'abbr-asc';
  let filterStatus = 'all'; // all, favorites, known, unknown

  // Extract unique categories
  const categories = Array.from(new Set(vocabulary.map(v => v.category))).sort();

  function getFilteredAndSortedWords() {
    return vocabulary
      .filter(item => {
        // Search term
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch = !term ||
          item.abbreviation.toLowerCase().includes(term) ||
          item.fullName.toLowerCase().includes(term) ||
          item.meaning.toLowerCase().includes(term);

        // Category filter
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        // Status filter
        let matchesStatus = true;
        const currentStatus = storageService.getWordStatus(item.id);
        const isFav = storageService.isFavorite(item.id);

        if (filterStatus === 'favorites') {
          matchesStatus = isFav;
        } else if (filterStatus === 'known') {
          matchesStatus = currentStatus === 'learning' || currentStatus === 'mastered';
        } else if (filterStatus === 'unknown') {
          matchesStatus = currentStatus === 'unknown';
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'abbr-asc') return a.abbreviation.localeCompare(b.abbreviation);
        if (sortBy === 'abbr-desc') return b.abbreviation.localeCompare(a.abbreviation);
        if (sortBy === 'name-asc') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'name-desc') return b.fullName.localeCompare(a.fullName);
        return a.id - b.id;
      });
  }

  function renderWordGrid() {
    const words = getFilteredAndSortedWords();
    const gridEl = container.querySelector('#vocab-grid-container');
    const countEl = container.querySelector('#vocab-result-count');

    if (countEl) {
      countEl.textContent = `Hiển thị ${words.length} / ${vocabulary.length} thuật ngữ`;
    }

    if (!gridEl) return;

    if (words.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <div style="font-size: 36px; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 16px; color: var(--navy-900); font-weight: 700;">Không tìm thấy thuật ngữ phù hợp</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc.</p>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = words.map(item => {
      const isFav = storageService.isFavorite(item.id);
      const status = storageService.getWordStatus(item.id);

      let statusBadgeLabel = 'Chưa học';
      let statusClass = 'status-unknown';
      if (status === 'learning') {
        statusBadgeLabel = 'Đang học';
        statusClass = 'status-learning';
      } else if (status === 'mastered') {
        statusBadgeLabel = 'Đã thuộc';
        statusClass = 'status-mastered';
      }

      return `
        <div class="vocab-card" data-id="${item.id}">
          <div class="vocab-card-header">
            <span class="vocab-abbr">${escapeHtml(item.abbreviation)}</span>
            <div class="vocab-actions">
              <span class="badge badge-sky">${escapeHtml(item.category)}</span>
              <button class="favorite-btn ${isFav ? 'active' : ''}" data-action="favorite" data-id="${item.id}" title="${isFav ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}">
                <svg width="20" height="20" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="vocab-fullname">${escapeHtml(item.fullName)}</div>
          <div class="vocab-meaning">${escapeHtml(item.meaning)}</div>

          ${item.exampleSentence ? `
            <div class="vocab-example">
              <strong>Ví dụ:</strong> "${escapeHtml(item.exampleSentence)}"
              ${item.exampleTranslation ? `<div style="color: var(--text-muted); font-size: 11px; margin-top: 3px;">→ ${escapeHtml(item.exampleTranslation)}</div>` : ''}
            </div>
          ` : ''}

          <div class="vocab-card-footer">
            <button class="status-toggle-btn ${statusClass}" data-action="toggle-status" data-id="${item.id}">
              ${statusBadgeLabel}
            </button>
            <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" data-action="view-detail" data-id="${item.id}">
              Chi tiết
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function showWordDetailModal(word) {
    const isFav = storageService.isFavorite(word.id);
    const status = storageService.getWordStatus(word.id);

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="vocab-abbr" style="font-size: 24px;">${escapeHtml(word.abbreviation)}</span>
            <span class="badge badge-sky">${escapeHtml(word.category)}</span>
          </div>
          <button class="modal-close-btn" id="modal-detail-close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Tên đầy đủ (Full Name)</div>
            <div style="font-size: 17px; font-weight: 700; color: var(--sky-600);">${escapeHtml(word.fullName)}</div>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Ý nghĩa tiếng Việt chuyên ngành</div>
            <div style="font-size: 15px; font-weight: 600; color: var(--navy-900);">${escapeHtml(word.meaning)}</div>
          </div>
          ${word.exampleSentence ? `
            <div style="margin-bottom: 14px; background: var(--gray-50); padding: 12px; border-radius: var(--radius-md); border-left: 3px solid var(--sky-500);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Khẩu lệnh / Câu ví dụ tác nghiệp</div>
              <div style="font-size: 13px; font-weight: 500; color: var(--navy-800); margin-top: 4px;">"${escapeHtml(word.exampleSentence)}"</div>
              ${word.exampleTranslation ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">→ ${escapeHtml(word.exampleTranslation)}</div>` : ''}
            </div>
          ` : ''}
          ${word.note ? `
            <div style="font-size: 12px; color: var(--amber-600); background: var(--amber-100); padding: 8px 12px; border-radius: var(--radius-sm);">
              ⚠️ ${escapeHtml(word.note)}
            </div>
          ` : ''}
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-secondary" id="modal-detail-fav-btn">
            ${isFav ? '★ Đang yêu thích' : '☆ Thêm yêu thích'}
          </button>
          <button class="btn btn-primary" id="modal-detail-close-btn">Đóng</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('#modal-detail-close').addEventListener('click', closeModal);
    modal.querySelector('#modal-detail-close-btn').addEventListener('click', closeModal);
    modal.querySelector('#modal-detail-fav-btn').addEventListener('click', () => {
      const nowFav = storageService.toggleFavorite(word.id);
      showToast(nowFav ? `Đã thêm ${word.abbreviation} vào yêu thích` : `Đã bỏ yêu thích ${word.abbreviation}`, 'info');
      closeModal();
      renderWordGrid();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Initial markup
  container.innerHTML = `
    <div class="vocabulary-page">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 class="section-title">Từ vựng & Thuật ngữ Hàng không PBB</h2>
          <p class="section-subtitle">Kho 57 thuật ngữ chuẩn hóa cho kỹ thuật và khai thác cầu hành khách</p>
        </div>
        <div id="vocab-result-count" style="font-size: 13px; font-weight: 600; color: var(--text-muted);">
          Đang tải...
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="filter-bar">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" id="vocab-search" class="search-input" placeholder="Tìm theo chữ viết tắt, tên tiếng Anh, nghĩa tiếng Việt..." />
        </div>

        <select id="vocab-category-filter" class="filter-select">
          <option value="all">Tất cả nhóm ngành</option>
          ${categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
        </select>

        <select id="vocab-status-filter" class="filter-select">
          <option value="all">Tất cả trạng thái</option>
          <option value="favorites">⭐ Đã yêu thích</option>
          <option value="known">✓ Đã học</option>
          <option value="unknown">⏳ Chưa học</option>
        </select>

        <select id="vocab-sort-select" class="filter-select">
          <option value="abbr-asc">Sắp xếp: Ký hiệu A → Z</option>
          <option value="abbr-desc">Sắp xếp: Ký hiệu Z → A</option>
          <option value="name-asc">Sắp xếp: Tên đầy đủ A → Z</option>
          <option value="name-desc">Sắp xếp: Tên đầy đủ Z → A</option>
        </select>
      </div>

      <!-- Vocabulary Card Grid -->
      <div id="vocab-grid-container" class="vocab-grid"></div>
    </div>
  `;

  // Attach Listeners
  const searchInput = container.querySelector('#vocab-search');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderWordGrid();
  });

  container.querySelector('#vocab-category-filter').addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    renderWordGrid();
  });

  container.querySelector('#vocab-status-filter').addEventListener('change', (e) => {
    filterStatus = e.target.value;
    renderWordGrid();
  });

  container.querySelector('#vocab-sort-select').addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderWordGrid();
  });

  // Event Delegation for Cards (Favorite, Status toggle, Detail modal)
  container.querySelector('#vocab-grid-container').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const wordId = Number(btn.dataset.id);
    const word = vocabulary.find(w => w.id === wordId);
    if (!word) return;

    if (action === 'favorite') {
      const isFav = storageService.toggleFavorite(wordId);
      showToast(isFav ? `Đã thêm ${word.abbreviation} vào yêu thích` : `Đã bỏ yêu thích ${word.abbreviation}`, 'info');
      renderWordGrid();
    } else if (action === 'toggle-status') {
      const current = storageService.getWordStatus(wordId);
      let next = 'learning';
      if (current === 'unknown') next = 'learning';
      else if (current === 'learning') next = 'mastered';
      else next = 'unknown';

      storageService.setWordStatus(wordId, next);
      showToast(`${word.abbreviation}: ${next === 'mastered' ? 'Đã thành thạo' : next === 'learning' ? 'Đang học' : 'Chưa học'}`, 'success');
      renderWordGrid();
    } else if (action === 'view-detail') {
      showWordDetailModal(word);
    }
  });

  // Render initial grid
  renderWordGrid();
}

