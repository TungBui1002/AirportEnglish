/**
 * Airport English - Module A: Dashboard
 */
import { storageService } from '../services/storageService.js';
import { formatDate } from '../utils/helpers.js';

export function renderDashboard(container, { vocabulary, sentences, navigateTo }) {
  const stats = storageService.getSummaryStats(vocabulary.length);
  const activities = storageService.getRecentActivities();

  container.innerHTML = `
    <div class="dashboard-page">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <span class="hero-tag">Aviation English for PBB Operators</span>
          <h2 class="hero-title">Airport English – PBB Learning</h2>
          <p class="hero-desc">
            Learn English. Understand Aviation. Operate Safely. Nền tảng học thuật ngữ và khẩu lệnh tiếng Anh chuyên ngành cầu hành khách sân bay.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" id="btn-continue-learning">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tiếp tục học ngay
            </button>
            <button class="btn btn-outline" id="btn-quick-quiz">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Làm bài Quiz nhanh
            </button>
          </div>
        </div>
      </div>

      <!-- Key Metrics Stats Grid -->
      <div class="dashboard-stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalWords}</div>
            <div class="stat-label">Tổng số thuật ngữ</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.wordsLearned}</div>
            <div class="stat-label">Đã học (Learned)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.wordsMastered}</div>
            <div class="stat-label">Đã thành thạo (Mastered)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalQuizCompleted}</div>
            <div class="stat-label">Bài Quiz đã hoàn thành</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.avgScore}%</div>
            <div class="stat-label">Điểm trung bình Quiz</div>
          </div>
        </div>
      </div>

      <!-- Learning Progress Bar -->
      <div class="progress-card">
        <div class="progress-header">
          <div class="progress-title">Tiến độ ghi nhớ toàn diện</div>
          <div class="progress-percentage">${stats.progressPercentage}%</div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${stats.progressPercentage}%"></div>
        </div>
        <div class="progress-breakdown">
          <div class="breakdown-item">
            <div class="breakdown-dot" style="background: var(--emerald-500)"></div>
            <span class="breakdown-label">Thành thạo:</span>
            <span class="breakdown-value">${stats.wordsMastered} từ</span>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-dot" style="background: var(--amber-500)"></div>
            <span class="breakdown-label">Cần luyện thêm:</span>
            <span class="breakdown-value">${stats.wordsNeedPractice} từ</span>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-dot" style="background: var(--gray-400)"></div>
            <span class="breakdown-label">Chưa học:</span>
            <span class="breakdown-value">${stats.totalWords - stats.wordsLearned} từ</span>
          </div>
        </div>
      </div>

      <!-- Dashboard Two Columns: Quick Actions + Recent Activities -->
      <div class="dashboard-columns">
        <!-- Quick Launch Module Grid -->
        <div class="card">
          <div class="section-header">
            <h3 class="section-title" style="font-size: 18px;">Lộ trình học tập</h3>
            <p class="section-subtitle">Lựa chọn phương pháp rèn luyện phù hợp với mục tiêu hôm nay</p>
          </div>
          <div class="quick-launch-grid">
            <div class="quick-launch-item" id="ql-flashcard" style="cursor: pointer;">
              <div class="quick-launch-icon" style="background: var(--sky-100); color: var(--sky-600);">
                🗂️
              </div>
              <div class="quick-launch-name">Flashcard</div>
              <span class="badge badge-sky">Lật thẻ 3D</span>
            </div>

            <div class="quick-launch-item" id="ql-quiz" style="cursor: pointer;">
              <div class="quick-launch-icon" style="background: var(--emerald-100); color: var(--emerald-600);">
                🎯
              </div>
              <div class="quick-launch-name">Trắc nghiệm</div>
              <span class="badge badge-emerald">5 Chế độ</span>
            </div>

            <div class="quick-launch-item" id="ql-sentence" style="cursor: pointer;">
              <div class="quick-launch-icon" style="background: var(--amber-100); color: var(--amber-600);">
                ✈️
              </div>
              <div class="quick-launch-name">Mẫu câu PBB</div>
              <span class="badge badge-amber">8 Chủ đề</span>
            </div>

            <div class="quick-launch-item" id="ql-sentence-quiz" style="cursor: pointer;">
              <div class="quick-launch-icon" style="background: #ede9fe; color: #7c3aed;">
                🧩
              </div>
              <div class="quick-launch-name">Ghép câu</div>
              <span class="badge" style="background: #ede9fe; color: #7c3aed;">Thực hành</span>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="card">
          <div class="section-header">
            <h3 class="section-title" style="font-size: 18px;">Hoạt động gần đây</h3>
            <p class="section-subtitle">Nhật ký quá trình rèn luyện trên thiết bị này</p>
          </div>
          <div class="activity-list">
            ${activities.length === 0 ? '<div style="color: var(--text-muted); font-size: 13px;">Chưa có hoạt động nào được ghi nhận.</div>' : ''}
            ${activities.slice(0, 5).map(act => `
              <div class="activity-item">
                <div class="activity-icon">
                  ${act.type === 'quiz' ? '🎯' : act.type === 'sentence' ? '✈️' : act.type === 'vocab' ? '📖' : '🚀'}
                </div>
                <div class="activity-body">
                  <div class="activity-title">${act.title}</div>
                  <div class="activity-desc">${act.description}</div>
                  <div class="activity-time">${formatDate(act.timestamp)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelector('#btn-continue-learning')?.addEventListener('click', () => {
    navigateTo('flashcard');
  });

  container.querySelector('#btn-quick-quiz')?.addEventListener('click', () => {
    navigateTo('quiz');
  });

  container.querySelector('#ql-flashcard')?.addEventListener('click', () => navigateTo('flashcard'));
  container.querySelector('#ql-quiz')?.addEventListener('click', () => navigateTo('quiz'));
  container.querySelector('#ql-sentence')?.addEventListener('click', () => navigateTo('sentence-practice'));
  container.querySelector('#ql-sentence-quiz')?.addEventListener('click', () => navigateTo('sentence-quiz'));
}

