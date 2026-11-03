/**
 * Airport English - Helper utilities
 */

/**
 * Shuffle an array immutably
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Format timestamp into human readable Vietnamese date-time
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'Gần đây';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Escape HTML to prevent injection
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Show a quick toast notification
 */
export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-visible');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2600);
}

/**
 * Global confirmation modal
 */
export function confirmDialog({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', onConfirm }) {
  const existing = document.getElementById('app-confirm-dialog');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'app-confirm-dialog';
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">${escapeHtml(title)}</h3>
        <button class="modal-close-btn" id="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modal-cancel">${escapeHtml(cancelText)}</button>
        <button class="btn btn-danger" id="modal-confirm">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.add('closing');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#modal-close').addEventListener('click', close);
  modal.querySelector('#modal-cancel').addEventListener('click', close);
  modal.querySelector('#modal-confirm').addEventListener('click', () => {
    close();
    if (typeof onConfirm === 'function') onConfirm();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

