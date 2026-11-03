/**
 * Airport English - Module G: Progress & History
 * Detailed learning analytics, quiz history table & data reset
 */
import { storageService } from '../services/storageService.js';
import { formatDate, confirmDialog, showToast } from '../utils/helpers.js';

export function renderProgress(container, { vocabulary, navigateTo }) {
  const stats = storageService.getSummaryStats(vocabulary.length);
  const quizHistory = storageService.getQuizHistory();

  container.innerHTML = `
    <div class="progress-page">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 class="section-title">Tiến độ & Lịch sử Học tập</h2>
          <p class="section-subtitle">Theo dõi hành trình nâng cao năng lực tiếng Anh chuyên ngành hàng không</p>
        </div>
        <button class="btn btn-danger" id="btn-reset-progress" style="font-size: 13px;">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Xóa tiến độ học tập
        </button>
      </div>

      <!-- Metrics Cards -->
      <div class="dashboard-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="stat-card">
          <div class="stat-icon green">✓</div>
          <div class="stat-info">
            <div class="stat-value">${stats.wordsMastered}</div>
            <div class="stat-label">Từ đã thuộc</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">⏳</div>
          <div class="stat-info">
            <div class="stat-value">${stats.wordsNeedPractice}</div>
            <div class="stat-label">Từ cần ôn lại</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">🎯</div>
          <div class="stat-info">
            <div class="stat-value">${stats.totalQuizCompleted}</div>
            <div class="stat-label">Bài Quiz hoàn thành</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">🏆</div>
          <div class="stat-info">
            <div class="stat-value">${stats.bestScore}%</div>
            <div class="stat-label">Điểm cao nhất</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">📈</div>
          <div class="stat-info">
            <div class="stat-value">${stats.accuracyRate}%</div>
            <div class="stat-label">Tỷ lệ chính xác</div>
          </div>
        </div>
      </div>

      <!-- Overall Learning Bar -->
      <div class="progress-card">
        <div class="progress-header">
          <div class="progress-title">Tỷ lệ hoàn thành mục tiêu 57 thuật ngữ PBB</div>
          <div class="progress-percentage">${stats.progressPercentage}%</div>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${stats.progressPercentage}%;"></div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Đã học: <strong>${stats.wordsLearned}</strong> / ${stats.totalWords} từ</span>
          <span>Chưa bắt đầu: <strong>${stats.totalWords - stats.wordsLearned}</strong> từ</span>
        </div>
      </div>

      <!-- Quiz History Table -->
      <div class="card" style="margin-top: 24px;">
        <div class="section-header" style="margin-bottom: 16px;">
          <h3 class="section-title" style="font-size: 18px;">Lịch sử làm bài trắc nghiệm</h3>
          <p class="section-subtitle">Chi tiết kết quả các bài kiểm tra gần nhất</p>
        </div>

        <div class="history-table-wrapper">
          ${quizHistory.length === 0 ? `
            <div style="text-align: center; padding: 36px 16px; color: var(--text-muted); font-size: 14px;">
              Chưa có lịch sử làm bài Quiz nào. Hãy bắt đầu làm bài kiểm tra đầu tiên của bạn!
            </div>
          ` : `
            <table class="history-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Chế độ kiểm tra</th>
                  <th>Số câu hỏi</th>
                  <th>Điểm số</th>
                  <th>Tỷ lệ đúng</th>
                  <th>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                ${quizHistory.map(item => {
                  let badge = 'badge-rose';
                  let label = 'Cần cố gắng';
                  if (item.percentage >= 90) {
                    badge = 'badge-emerald';
                    label = 'Xuất sắc';
                  } else if (item.percentage >= 70) {
                    badge = 'badge-sky';
                    label = 'Rất tốt';
                  } else if (item.percentage >= 50) {
                    badge = 'badge-amber';
                    label = 'Đạt yêu cầu';
                  }

                  return `
                    <tr>
                      <td style="color: var(--text-muted); font-size: 13px;">${formatDate(item.timestamp)}</td>
                      <td style="font-weight: 600;">${item.mode}</td>
                      <td>${item.total} câu</td>
                      <td style="font-weight: 700;">${item.score} / ${item.total}</td>
                      <td>
                        <strong style="color: var(--navy-900);">${item.percentage}%</strong>
                      </td>
                      <td>
                        <span class="badge ${badge}">${label}</span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Reset Handler with confirmation dialog
  container.querySelector('#btn-reset-progress')?.addEventListener('click', () => {
    confirmDialog({
      title: 'Xác nhận xóa toàn bộ tiến độ?',
      message: 'Hành động này sẽ đặt lại toàn bộ danh sách từ đã học, lịch sử Quiz và tiến độ ghi nhớ về 0. Bạn có chắc chắn muốn tiếp tục không?',
      confirmText: 'Đồng ý xóa',
      cancelText: 'Hủy bỏ',
      onConfirm: () => {
        storageService.resetAllProgress();
        showToast('Toàn bộ tiến độ học tập đã được thiết lập lại!', 'info');
        renderProgress(container, { vocabulary, navigateTo });
      }
    });
  });
}
