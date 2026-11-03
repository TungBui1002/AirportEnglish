/**
 * Airport English - Module C: Flashcard
 */
import { storageService } from '../services/storageService.js';
import { shuffleArray, escapeHtml, showToast } from '../utils/helpers.js';

export function renderFlashcard(container, { vocabulary }) {
  let cards = [...vocabulary];
  let currentIndex = 0;
  let isFlipped = false;

  function updateCardUI() {
    const total = cards.length;
    if (total === 0) return;

    const currentWord = cards[currentIndex];
    const isFav = storageService.isFavorite(currentWord.id);
    const status = storageService.getWordStatus(currentWord.id);

    // Counter
    const counterEl = container.querySelector('#flashcard-counter-display');
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${total}`;
    }

    // Reset flip
    const cardContainer = container.querySelector('#flashcard-3d-box');
    isFlipped = false;
    cardContainer?.classList.remove('is-flipped');

    // Update Front
    const frontAbbr = container.querySelector('#card-front-abbr');
    const frontCategory = container.querySelector('#card-front-category');
    if (frontAbbr) frontAbbr.textContent = currentWord.abbreviation;
    if (frontCategory) frontCategory.textContent = currentWord.category;

    // Update Back
    const backAbbr = container.querySelector('#card-back-abbr');
    const backCategory = container.querySelector('#card-back-category');
    const backFullname = container.querySelector('#card-back-fullname');
    const backMeaning = container.querySelector('#card-back-meaning');
    const backExample = container.querySelector('#card-back-example-content');

    if (backAbbr) backAbbr.textContent = currentWord.abbreviation;
    if (backCategory) backCategory.textContent = currentWord.category;
    if (backFullname) backFullname.textContent = currentWord.fullName;
    if (backMeaning) backMeaning.textContent = currentWord.meaning;
    if (backExample) {
      if (currentWord.exampleSentence) {
        backExample.innerHTML = `
          <strong>Ví dụ:</strong> "${escapeHtml(currentWord.exampleSentence)}"
          ${currentWord.exampleTranslation ? `<div style="font-size: 11px; opacity: 0.85; margin-top: 3px;">→ ${escapeHtml(currentWord.exampleTranslation)}</div>` : ''}
        `;
        backExample.style.display = 'block';
      } else {
        backExample.style.display = 'none';
      }
    }

    // Favorite button state
    const favBtn = container.querySelector('#card-fav-btn');
    if (favBtn) {
      favBtn.classList.toggle('active', isFav);
      favBtn.setAttribute('title', isFav ? 'Bỏ yêu thích' : 'Yêu thích thẻ này');
    }

    // Disable prev/next if at bounds
    const prevBtn = container.querySelector('#btn-card-prev');
    const nextBtn = container.querySelector('#btn-card-next');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
  }

  container.innerHTML = `
    <div class="flashcard-wrapper">
      <div class="section-header" style="text-align: center; margin-bottom: 20px;">
        <h2 class="section-title">Thẻ ghi nhớ Flashcard</h2>
        <p class="section-subtitle">Chạm hoặc click vào thẻ để lật mặt xem ý nghĩa và câu ứng dụng thực tế</p>
      </div>

      <div class="flashcard-header-bar">
        <div class="flashcard-counter" id="flashcard-counter-display">
          1 / ${cards.length}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" id="btn-card-shuffle" title="Xáo trộn ngẫu nhiên">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Xáo trộn
          </button>
          <button class="btn btn-icon" id="card-fav-btn" title="Yêu thích">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 3D Interactive Flashcard -->
      <div class="flashcard-container" id="flashcard-3d-box" title="Nhấn để lật thẻ">
        <div class="flashcard-inner">
          <!-- Front Face -->
          <div class="flashcard-front">
            <div class="card-top-tag">
              <span class="badge badge-sky" id="card-front-category">Category</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Mặt trước (Ký hiệu)</span>
            </div>
            <div class="card-center-content">
              <div class="flashcard-term-large" id="card-front-abbr">PBB</div>
              <div class="flashcard-hint">Nhấp chuột hoặc chạm vào thẻ để xem nghĩa</div>
            </div>
            <div class="card-footer-tip">
              💡 Bấm phím [Khoảng trắng] hoặc [Enter] để lật thẻ
            </div>
          </div>

          <!-- Back Face -->
          <div class="flashcard-back">
            <div class="card-top-tag">
              <span class="badge badge-sky" id="card-back-category">Category</span>
              <span class="badge badge-emerald" id="card-back-abbr">PBB</span>
            </div>
            <div class="card-center-content" style="text-align: left;">
              <div class="flashcard-back-fullname" id="card-back-fullname">Passenger Boarding Bridge</div>
              <div class="flashcard-back-meaning" id="card-back-meaning">Cầu hành khách</div>
              <div class="flashcard-back-example" id="card-back-example-content"></div>
            </div>
            <div class="card-footer-tip">
              💡 Đánh giá mức độ ghi nhớ của bạn phía dưới
            </div>
          </div>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="flashcard-controls">
        <div class="flashcard-nav-btns">
          <button class="btn btn-secondary" id="btn-card-prev">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Thẻ trước
          </button>
          <button class="btn btn-secondary" id="btn-card-next">
            Thẻ sau
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="flashcard-status-btns">
          <button class="btn btn-amber" id="btn-need-practice" title="Cần ôn tập thêm từ này">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cần luyện thêm
          </button>
          <button class="btn btn-success" id="btn-know-this" title="Tôi đã thuộc từ này">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Tôi đã thuộc
          </button>
        </div>
      </div>
    </div>
  `;

  // Flip Handler
  const cardBox = container.querySelector('#flashcard-3d-box');
  const toggleFlip = () => {
    isFlipped = !isFlipped;
    cardBox?.classList.toggle('is-flipped', isFlipped);
  };
  cardBox?.addEventListener('click', toggleFlip);

  // Navigation handlers
  const prevBtn = container.querySelector('#btn-card-prev');
  const nextBtn = container.querySelector('#btn-card-next');
  const shuffleBtn = container.querySelector('#btn-card-shuffle');
  const favBtn = container.querySelector('#card-fav-btn');

  prevBtn?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCardUI();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCardUI();
    }
  });

  shuffleBtn?.addEventListener('click', () => {
    cards = shuffleArray(cards);
    currentIndex = 0;
    updateCardUI();
    showToast('Đã xáo trộn thứ tự các thẻ!', 'info');
  });

  favBtn?.addEventListener('click', () => {
    const currentWord = cards[currentIndex];
    const isNowFav = storageService.toggleFavorite(currentWord.id);
    favBtn.classList.toggle('active', isNowFav);
    showToast(isNowFav ? `Đã thêm ${currentWord.abbreviation} vào yêu thích` : `Đã bỏ yêu thích`, 'info');
  });

  // Status Handlers
  container.querySelector('#btn-know-this')?.addEventListener('click', () => {
    const currentWord = cards[currentIndex];
    storageService.setWordStatus(currentWord.id, 'mastered');
    showToast(`Tuyệt vời! Đã ghi nhớ "${currentWord.abbreviation}"`, 'success');
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCardUI();
    }
  });

  container.querySelector('#btn-need-practice')?.addEventListener('click', () => {
    const currentWord = cards[currentIndex];
    storageService.setWordStatus(currentWord.id, 'learning');
    showToast(`Đã thêm "${currentWord.abbreviation}" vào danh sách cần ôn tập`, 'warning');
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCardUI();
    }
  });

  // Keyboard navigation support
  const keyHandler = (e) => {
    // Only listen if user is in flashcard page
    if (!document.getElementById('flashcard-3d-box')) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleFlip();
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        updateCardUI();
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        currentIndex--;
        updateCardUI();
      }
    }
  };

  window.addEventListener('keydown', keyHandler);

  // Initial draw
  updateCardUI();
}

