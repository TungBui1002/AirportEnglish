/**
 * Airport English - Module D: Quiz
 * Core interactive testing module with 5 modes, feedback & history
 */
import { quizService, QUIZ_MODES } from '../services/quizService.js';
import { storageService } from '../services/storageService.js';
import { escapeHtml, showToast } from '../utils/helpers.js';

export function renderQuiz(container, { vocabulary, navigateTo }) {
  let selectedMode = 'RANDOM';
  let questionCount = 10;
  let questions = [];
  let currentQIndex = 0;
  let score = 0;
  let wrongQuestions = [];
  let isAnswered = false;
  let quizState = 'setup'; // 'setup' | 'playing' | 'result'

  function renderSetupScreen() {
    quizState = 'setup';
    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-setup-card">
          <div class="section-header" style="text-align: center;">
            <span class="badge badge-sky" style="margin-bottom: 8px;">Kiểm tra phản xạ từ vựng</span>
            <h2 class="section-title">Luyện tập Trắc nghiệm Chuyên sâu</h2>
            <p class="section-subtitle">Chọn chế độ và số lượng câu hỏi để kiểm tra kiến thức kỹ thuật hàng không PBB</p>
          </div>

          <!-- Mode selector cards -->
          <div style="font-size: 14px; font-weight: 700; color: var(--navy-900); margin-top: 24px;">1. Chọn chế độ trắc nghiệm:</div>
          <div class="mode-selector-grid">
            ${Object.values(QUIZ_MODES).map(mode => `
              <div class="mode-option ${mode.id === selectedMode ? 'selected' : ''}" data-mode="${mode.id}">
                <div class="mode-title">
                  <span>${mode.id === 'RANDOM' ? '🎲' : mode.id === 'EN_VI' ? '🇺🇸→🇻🇳' : mode.id === 'VI_EN' ? '🇻🇳→🇺🇸' : '📑'}</span>
                  ${escapeHtml(mode.name)}
                </div>
                <div class="mode-desc">${escapeHtml(mode.description)}</div>
              </div>
            `).join('')}
          </div>

          <!-- Question count picker -->
          <div style="font-size: 14px; font-weight: 700; color: var(--navy-900); margin-top: 10px;">2. Chọn số lượng câu hỏi:</div>
          <div class="quiz-count-group">
            <button class="count-btn ${questionCount === 10 ? 'selected' : ''}" data-count="10">10 Câu</button>
            <button class="count-btn ${questionCount === 20 ? 'selected' : ''}" data-count="20">20 Câu</button>
            <button class="count-btn ${questionCount === 30 ? 'selected' : ''}" data-count="30">30 Câu (Thử thách)</button>
          </div>

          <!-- Start Button -->
          <div style="margin-top: 32px; text-align: center;">
            <button class="btn btn-primary" id="btn-start-quiz" style="width: 100%; padding: 14px; font-size: 16px;">
              Bắt đầu làm bài Quiz ngay
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach setup handlers
    container.querySelectorAll('.mode-option').forEach(el => {
      el.addEventListener('click', () => {
        container.querySelectorAll('.mode-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        selectedMode = el.dataset.mode;
      });
    });

    container.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        questionCount = Number(btn.dataset.count);
      });
    });

    container.querySelector('#btn-start-quiz').addEventListener('click', startQuiz);
  }

  function startQuiz() {
    questions = quizService.generateQuiz(vocabulary, selectedMode, questionCount);
    if (!questions || questions.length === 0) {
      showToast('Chưa đủ dữ liệu từ vựng để tạo bài Quiz', 'error');
      return;
    }

    currentQIndex = 0;
    score = 0;
    wrongQuestions = [];
    isAnswered = false;
    quizState = 'playing';

    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    const q = questions[currentQIndex];
    isAnswered = false;
    const progressPercent = Math.round(((currentQIndex) / questions.length) * 100);

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-active-card">
          <!-- Progress bar & Header -->
          <div class="quiz-progress-section">
            <div class="quiz-meta-row">
              <span>Câu hỏi ${currentQIndex + 1} / ${questions.length}</span>
              <span>Điểm hiện tại: <strong style="color: var(--emerald-600);">${score}</strong></span>
            </div>
            <div class="progress-bar-track" style="margin-bottom: 0;">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <!-- Question prompt -->
          <div class="quiz-question-box">
            <div class="question-badge">
              <span class="badge badge-sky">${escapeHtml(q.badge)}</span>
              <span class="badge badge-navy">${escapeHtml(q.targetWord.category)}</span>
            </div>
            <h3 class="question-prompt">${escapeHtml(q.prompt)}</h3>
            ${q.promptSubtitle ? `<div class="question-subtitle">${escapeHtml(q.promptSubtitle)}</div>` : ''}
          </div>

          <!-- 4 Options -->
          <div class="quiz-options-grid" id="quiz-options-list">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-index="${idx}">
                <span>${escapeHtml(opt.text)}</span>
                <span class="opt-status-icon" style="font-size: 18px;"></span>
              </button>
            `).join('')}
          </div>

          <!-- Explanation box (Hidden initially) -->
          <div id="quiz-explanation" style="display: none;" class="quiz-explanation-box"></div>

          <!-- Bottom Action -->
          <div class="quiz-next-row">
            <button class="btn btn-primary" id="btn-quiz-next" style="display: none;">
              ${currentQIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach answer click listeners
    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    const explanationEl = container.querySelector('#quiz-explanation');
    const nextBtn = container.querySelector('#btn-quiz-next');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isAnswered) return;
        isAnswered = true;

        const optIndex = Number(btn.dataset.index);
        const selectedOption = q.options[optIndex];

        // Disable all option buttons
        optionBtns.forEach((b, i) => {
          b.disabled = true;
          if (q.options[i].isCorrect) {
            b.classList.add('correct');
            b.querySelector('.opt-status-icon').innerHTML = '✓';
          }
        });

        if (selectedOption.isCorrect) {
          score++;
          btn.classList.add('correct');
          // Update word status to learning/mastered if answered correctly
          const currentStatus = storageService.getWordStatus(q.targetWord.id);
          if (currentStatus === 'unknown') {
            storageService.setWordStatus(q.targetWord.id, 'learning');
          }
        } else {
          btn.classList.add('wrong');
          btn.querySelector('.opt-status-icon').innerHTML = '✕';

          wrongQuestions.push({
            questionNumber: currentQIndex + 1,
            prompt: q.prompt,
            mode: q.badge,
            userAnswer: selectedOption.text,
            correctAnswer: q.correctAnswer,
            word: q.targetWord
          });

          // Mark word as needing practice
          storageService.setWordStatus(q.targetWord.id, 'learning');
        }

        // Show explanation
        explanationEl.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>${selectedOption.isCorrect ? '🎉 Chính xác!' : '💡 Giải thích chi tiết:'}</span>
          </div>
          <div style="font-size: 13px;">
            <strong>${escapeHtml(q.targetWord.abbreviation)}</strong> — ${escapeHtml(q.targetWord.fullName)}: ${escapeHtml(q.targetWord.meaning)}.
          </div>
          ${q.targetWord.exampleSentence ? `
            <div style="margin-top: 6px; font-size: 12px; color: var(--navy-700);">
              <em>"${escapeHtml(q.targetWord.exampleSentence)}"</em>
            </div>
          ` : ''}
        `;
        explanationEl.style.display = 'block';
        nextBtn.style.display = 'inline-flex';
      });
    });

    nextBtn.addEventListener('click', () => {
      if (currentQIndex < questions.length - 1) {
        currentQIndex++;
        renderCurrentQuestion();
      } else {
        finishQuiz();
      }
    });
  }

  function finishQuiz() {
    quizState = 'result';
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    // Save result to LocalStorage
    storageService.saveQuizResult({
      mode: QUIZ_MODES[selectedMode]?.name || 'Quiz',
      total,
      score,
      wrongQuestions
    });

    let ratingText = 'Cần rèn luyện thêm!';
    let ratingColor = 'var(--rose-600)';
    let emoji = '💪';
    if (percentage >= 90) {
      ratingText = 'Xuất sắc! Sẵn sàng vận hành!';
      ratingColor = 'var(--emerald-600)';
      emoji = '🏆';
    } else if (percentage >= 70) {
      ratingText = 'Rất tốt! Nắm vững thuật ngữ!';
      ratingColor = 'var(--sky-600)';
      emoji = '👏';
    } else if (percentage >= 50) {
      ratingText = 'Khá ổn! Hãy củng cố thêm từ vựng!';
      ratingColor = 'var(--amber-600)';
      emoji = '📚';
    }

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-result-card">
          <div style="font-size: 48px; margin-bottom: 8px;">${emoji}</div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--navy-900); margin-bottom: 4px;">Hoàn thành bài Quiz!</h2>
          <p style="font-size: 15px; font-weight: 600; color: ${ratingColor}; margin-bottom: 24px;">${ratingText}</p>

          <div class="result-score-circle">
            <span class="result-score-number">${percentage}%</span>
            <span class="result-score-label">${score} / ${total} câu đúng</span>
          </div>

          <!-- Stats comparison -->
          <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 28px; font-size: 14px;">
            <div>
              <span style="color: var(--text-muted);">Chế độ:</span>
              <strong>${escapeHtml(QUIZ_MODES[selectedMode]?.name)}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Số câu sai:</span>
              <strong style="color: var(--rose-600);">${wrongQuestions.length} câu</strong>
            </div>
          </div>

          <!-- Wrong questions review section -->
          ${wrongQuestions.length > 0 ? `
            <div class="wrong-answers-section">
              <h4 style="font-size: 16px; font-weight: 700; color: var(--navy-900); margin-bottom: 12px;">
                Danh sách câu cần lưu ý ôn lại (${wrongQuestions.length}):
              </h4>
              ${wrongQuestions.map(w => `
                <div class="wrong-answer-item">
                  <div style="font-weight: 700; color: var(--navy-900); margin-bottom: 4px;">
                    Câu ${w.questionNumber}: ${escapeHtml(w.prompt)}
                  </div>
                  <div style="color: var(--rose-600); margin-bottom: 2px;">
                    ✕ Bạn chọn: ${escapeHtml(w.userAnswer)}
                  </div>
                  <div style="color: var(--emerald-600); font-weight: 600;">
                    ✓ Đáp án đúng: ${escapeHtml(w.correctAnswer)}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="padding: 16px; background: var(--emerald-100); color: var(--emerald-600); border-radius: var(--radius-md); font-weight: 600; margin-bottom: 24px;">
              🎉 Tuyệt vời! Bạn không trả lời sai bất kỳ câu nào trong bài kiểm tra này!
            </div>
          `}

          <!-- Actions -->
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="btn-quiz-back-setup">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Chọn bài khác
            </button>
            <button class="btn btn-primary" id="btn-quiz-retry">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm lại bài Quiz này
            </button>
            <button class="btn btn-outline" id="btn-quiz-to-progress">
              Xem tiến độ
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-quiz-back-setup')?.addEventListener('click', renderSetupScreen);
    container.querySelector('#btn-quiz-retry')?.addEventListener('click', startQuiz);
    container.querySelector('#btn-quiz-to-progress')?.addEventListener('click', () => navigateTo('progress'));
  }

  // Initial render
  renderSetupScreen();
}

