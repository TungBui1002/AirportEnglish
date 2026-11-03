/**
 * Airport English - Module F: Sentence Quiz
 * Interactive sentence exercises: Arrange words, Fill-in-blank & Multiple choice translations
 */
import { storageService } from '../services/storageService.js';
import { shuffleArray, escapeHtml, showToast } from '../utils/helpers.js';

export function renderSentenceQuiz(container, { sentences, navigateTo }) {
  let currentExerciseIndex = 0;
  let score = 0;
  let exercises = [];
  let isAnswered = false;

  // Generate interactive exercises from the 24 operational sentences
  function generateExercises() {
    const pool = shuffleArray(sentences).slice(0, 8);
    const exerciseTypes = ['ARRANGE', 'FILL_BLANK', 'EN_VI', 'VI_EN'];

    return pool.map((s, idx) => {
      const type = exerciseTypes[idx % exerciseTypes.length];
      return createExercise(s, type, idx + 1);
    });
  }

  function createExercise(sentence, type, number) {
    if (type === 'ARRANGE') {
      // Split sentence into words, sanitize punctuation
      const cleanWords = sentence.english.replace(/[.,]/g, '').split(/\s+/);
      const shuffledTiles = shuffleArray(cleanWords.map((w, i) => ({ id: `w_${i}_${w}`, text: w })));

      return {
        number,
        type: 'ARRANGE',
        badge: 'Xếp từ thành câu',
        prompt: 'Nhấp chọn các từ theo đúng thứ tự ngữ pháp để hoàn thành câu:',
        vietnamesePrompt: sentence.vietnamese,
        originalEnglish: sentence.english,
        correctSequence: cleanWords,
        bankTiles: shuffledTiles,
        selectedTiles: [],
        sentence
      };
    }

    if (type === 'FILL_BLANK') {
      // Pick one important vocabulary word from the sentence
      const targetVocab = sentence.importantVocabulary[0] || { word: 'check', meaning: 'kiểm tra' };
      const blankWord = targetVocab.word;
      
      // Regex replace word case-insensitively
      const regex = new RegExp(`\\b${blankWord}\\b`, 'i');
      const blankedSentence = sentence.english.replace(regex, '______');

      // Generate 3 distractors from other sentences
      const otherWords = sentences
        .flatMap(s => s.importantVocabulary.map(v => v.word))
        .filter(w => w.toLowerCase() !== blankWord.toLowerCase());
      const distractors = shuffleArray(Array.from(new Set(otherWords))).slice(0, 3);

      const options = shuffleArray([
        { text: blankWord, isCorrect: true },
        ...distractors.map(d => ({ text: d, isCorrect: false }))
      ]);

      return {
        number,
        type: 'FILL_BLANK',
        badge: 'Điền từ vào chỗ trống',
        prompt: blankedSentence,
        vietnamesePrompt: sentence.vietnamese,
        correctAnswer: blankWord,
        options,
        sentence
      };
    }

    if (type === 'EN_VI') {
      // Multiple choice EN -> VI
      const distractors = shuffleArray(sentences.filter(s => s.id !== sentence.id)).slice(0, 3);
      const options = shuffleArray([
        { text: sentence.vietnamese, isCorrect: true },
        ...distractors.map(d => ({ text: d.vietnamese, isCorrect: false }))
      ]);

      return {
        number,
        type: 'EN_VI',
        badge: 'Dịch câu English → Tiếng Việt',
        prompt: sentence.english,
        correctAnswer: sentence.vietnamese,
        options,
        sentence
      };
    }

    // Default VI_EN
    const distractors = shuffleArray(sentences.filter(s => s.id !== sentence.id)).slice(0, 3);
    const options = shuffleArray([
      { text: sentence.english, isCorrect: true },
      ...distractors.map(d => ({ text: d.english, isCorrect: false }))
    ]);

    return {
      number,
      type: 'VI_EN',
      badge: 'Dịch câu Tiếng Việt → English',
      prompt: sentence.vietnamese,
      correctAnswer: sentence.english,
      options,
      sentence
    };
  }

  function startQuiz() {
    exercises = generateExercises();
    currentExerciseIndex = 0;
    score = 0;
    isAnswered = false;
    renderCurrentExercise();
  }

  function renderCurrentExercise() {
    isAnswered = false;
    const ex = exercises[currentExerciseIndex];
    const progressPct = Math.round((currentExerciseIndex / exercises.length) * 100);

    let exerciseBodyHtml = '';

    if (ex.type === 'ARRANGE') {
      exerciseBodyHtml = `
        <div style="font-size: 15px; font-weight: 600; color: var(--navy-800); margin-bottom: 12px;">
          Nghĩa tiếng Việt: <span style="color: var(--sky-600);">${escapeHtml(ex.vietnamesePrompt)}</span>
        </div>

        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">Vùng ghép câu:</div>
        <div id="sentence-slot-target" class="sentence-slot-area">
          ${ex.selectedTiles.length === 0 ? '<span style="color: var(--gray-400); font-size: 13px;">Chạm vào các từ bên dưới để ghép vào đây...</span>' : ''}
          ${ex.selectedTiles.map(t => `
            <div class="word-tile" data-tile-id="${t.id}" data-location="selected">${escapeHtml(t.text)}</div>
          `).join('')}
        </div>

        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">Kho từ vựng:</div>
        <div id="word-bank-source" class="word-bank">
          ${ex.bankTiles.map(t => `
            <div class="word-tile" data-tile-id="${t.id}" data-location="bank">${escapeHtml(t.text)}</div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button class="btn btn-outline" id="btn-arrange-reset" style="font-size: 13px; padding: 6px 12px;">Xếp lại từ đầu</button>
          <button class="btn btn-success" id="btn-arrange-check" style="font-size: 13px; padding: 6px 16px;">Kiểm tra đáp án</button>
        </div>
      `;
    } else {
      // Options format for Fill blank or Translations
      exerciseBodyHtml = `
        ${ex.vietnamesePrompt ? `
          <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
            Ý nghĩa: <strong style="color: var(--navy-900);">${escapeHtml(ex.vietnamesePrompt)}</strong>
          </div>
        ` : ''}

        <div class="quiz-options-grid" id="sentence-options-list">
          ${ex.options.map((opt, idx) => `
            <button class="quiz-option-btn" data-index="${idx}">
              <span>${escapeHtml(opt.text)}</span>
              <span class="opt-status-icon"></span>
            </button>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-active-card">
          <!-- Progress -->
          <div class="quiz-progress-section">
            <div class="quiz-meta-row">
              <span>Bài tập mẫu câu ${currentExerciseIndex + 1} / ${exercises.length}</span>
              <span>Điểm: <strong style="color: var(--emerald-600);">${score}</strong></span>
            </div>
            <div class="progress-bar-track" style="margin-bottom: 0;">
              <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <!-- Question Header -->
          <div class="quiz-question-box">
            <div class="question-badge">
              <span class="badge badge-sky">${escapeHtml(ex.badge)}</span>
              <span class="badge badge-navy">${escapeHtml(ex.sentence.topic)}</span>
            </div>
            <h3 class="question-prompt" style="font-size: 20px;">${escapeHtml(ex.prompt)}</h3>
          </div>

          <!-- Dynamic Exercise Area -->
          ${exerciseBodyHtml}

          <!-- Feedback message -->
          <div id="sentence-feedback" class="quiz-explanation-box" style="display: none; margin-top: 20px;"></div>

          <!-- Next Button -->
          <div class="quiz-next-row" style="margin-top: 20px;">
            <button class="btn btn-primary" id="btn-exercise-next" style="display: none;">
              ${currentExerciseIndex === exercises.length - 1 ? 'Xem kết quả bài tập' : 'Câu tiếp theo'}
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Handlers for Multiple Choice / Fill Blank
    if (ex.type !== 'ARRANGE') {
      const optionBtns = container.querySelectorAll('.quiz-option-btn');
      const feedbackEl = container.querySelector('#sentence-feedback');
      const nextBtn = container.querySelector('#btn-exercise-next');

      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (isAnswered) return;
          isAnswered = true;

          const optIndex = Number(btn.dataset.index);
          const chosen = ex.options[optIndex];

          optionBtns.forEach((b, i) => {
            b.disabled = true;
            if (ex.options[i].isCorrect) {
              b.classList.add('correct');
              b.querySelector('.opt-status-icon').innerHTML = '✓';
            }
          });

          if (chosen.isCorrect) {
            score++;
            btn.classList.add('correct');
            feedbackEl.innerHTML = `
              <strong>🎉 Chính xác!</strong>
              <div style="font-size: 13px; margin-top: 4px;">Câu chuẩn: "${escapeHtml(ex.sentence.english)}"</div>
            `;
          } else {
            btn.classList.add('wrong');
            btn.querySelector('.opt-status-icon').innerHTML = '✕';
            feedbackEl.innerHTML = `
              <strong>💡 Đáp án chính xác:</strong>
              <div style="font-size: 13px; margin-top: 4px;">"${escapeHtml(ex.sentence.english)}"</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">→ ${escapeHtml(ex.sentence.vietnamese)}</div>
            `;
          }

          feedbackEl.style.display = 'block';
          nextBtn.style.display = 'inline-flex';
        });
      });
    } else {
      // ARRANGE Handlers: moving tiles between bank and slot
      const wordBank = container.querySelector('#word-bank-source');
      const targetSlot = container.querySelector('#sentence-slot-target');
      const feedbackEl = container.querySelector('#sentence-feedback');
      const nextBtn = container.querySelector('#btn-exercise-next');

      // Click on tile in bank -> move to slot
      wordBank?.addEventListener('click', (e) => {
        if (isAnswered) return;
        const tile = e.target.closest('.word-tile');
        if (!tile) return;
        const tileId = tile.dataset.tileId;
        const tileObjIndex = ex.bankTiles.findIndex(t => t.id === tileId);
        if (tileObjIndex > -1) {
          const [moved] = ex.bankTiles.splice(tileObjIndex, 1);
          ex.selectedTiles.push(moved);
          renderCurrentExercise();
        }
      });

      // Click on tile in slot -> move back to bank
      targetSlot?.addEventListener('click', (e) => {
        if (isAnswered) return;
        const tile = e.target.closest('.word-tile');
        if (!tile) return;
        const tileId = tile.dataset.tileId;
        const tileObjIndex = ex.selectedTiles.findIndex(t => t.id === tileId);
        if (tileObjIndex > -1) {
          const [moved] = ex.selectedTiles.splice(tileObjIndex, 1);
          ex.bankTiles.push(moved);
          renderCurrentExercise();
        }
      });

      // Reset
      container.querySelector('#btn-arrange-reset')?.addEventListener('click', () => {
        if (isAnswered) return;
        ex.bankTiles = [...ex.bankTiles, ...ex.selectedTiles];
        ex.selectedTiles = [];
        renderCurrentExercise();
      });

      // Check
      container.querySelector('#btn-arrange-check')?.addEventListener('click', () => {
        if (isAnswered) return;
        if (ex.selectedTiles.length === 0) {
          showToast('Vui lòng chọn các từ để ghép câu trước khi kiểm tra!', 'warning');
          return;
        }

        isAnswered = true;
        const formedWords = ex.selectedTiles.map(t => t.text.toLowerCase());
        const expectedWords = ex.correctSequence.map(w => w.toLowerCase());

        const isMatch = formedWords.length === expectedWords.length &&
          formedWords.every((w, i) => w === expectedWords[i]);

        if (isMatch) {
          score++;
          feedbackEl.innerHTML = `
            <strong>🎉 Hoàn hảo! Bạn đã sắp xếp câu chuẩn xác!</strong>
            <div style="font-size: 13px; margin-top: 4px;">"${escapeHtml(ex.originalEnglish)}"</div>
          `;
        } else {
          feedbackEl.innerHTML = `
            <strong>💡 Thứ tự chuẩn xác là:</strong>
            <div style="font-size: 14px; font-weight: 600; color: var(--navy-900); margin-top: 4px;">"${escapeHtml(ex.originalEnglish)}"</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Ý nghĩa: ${escapeHtml(ex.vietnamesePrompt)}</div>
          `;
        }

        feedbackEl.style.display = 'block';
        nextBtn.style.display = 'inline-flex';
      });
    }

    // Next button
    container.querySelector('#btn-exercise-next')?.addEventListener('click', () => {
      if (currentExerciseIndex < exercises.length - 1) {
        currentExerciseIndex++;
        renderCurrentExercise();
      } else {
        finishExercise();
      }
    });
  }

  function finishExercise() {
    const total = exercises.length;
    const percentage = Math.round((score / total) * 100);

    storageService.saveSentenceQuizResult({
      score,
      total,
      mode: 'Luyện tập Mẫu câu'
    });

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-result-card">
          <div style="font-size: 44px; margin-bottom: 8px;">✈️</div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--navy-900);">Hoàn thành bài luyện mẫu câu!</h2>
          <p style="font-size: 14px; color: var(--text-muted); margin-top: 4px; margin-bottom: 24px;">
            Bạn đã hoàn thành phiên luyện tập ghép câu và dịch nghĩa tác nghiệp PBB.
          </p>

          <div class="result-score-circle">
            <span class="result-score-number">${percentage}%</span>
            <span class="result-score-label">${score} / ${total} câu đúng</span>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="btn-back-to-practice">
              Về danh sách mẫu câu
            </button>
            <button class="btn btn-primary" id="btn-retry-sentence-quiz">
              Luyện tiếp bài mới
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-back-to-practice')?.addEventListener('click', () => {
      navigateTo('sentence-practice');
    });

    container.querySelector('#btn-retry-sentence-quiz')?.addEventListener('click', () => {
      startQuiz();
    });
  }

  // Start initial session
  startQuiz();
}
