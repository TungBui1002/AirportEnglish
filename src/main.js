/**
 * Airport English - PBB Learning
 * Main Application Controller & Router
 */
import vocabularyData from './data/vocabulary.json';
import sentencesData from './data/sentences.json';
import { storageService } from './services/storageService.js';

import { renderDashboard } from './pages/Dashboard.js';
import { renderVocabulary } from './pages/Vocabulary.js';
import { renderFlashcard } from './pages/Flashcard.js';
import { renderQuiz } from './pages/Quiz.js';
import { renderSentencePractice } from './pages/SentencePractice.js';
import { renderSentenceQuiz } from './pages/SentenceQuiz.js';
import { renderProgress } from './pages/Progress.js';

class App {
  constructor() {
    this.vocabulary = vocabularyData;
    this.sentences = sentencesData;
    this.currentPage = 'dashboard';
    this.pageContentEl = document.getElementById('page-content');
    this.headerTitleEl = document.getElementById('header-page-title');
    this.sidebarEl = document.getElementById('app-sidebar');

    this.routes = {
      dashboard: {
        title: 'Tổng quan (Dashboard)',
        render: renderDashboard
      },
      vocabulary: {
        title: 'Từ vựng & Thuật ngữ PBB',
        render: renderVocabulary
      },
      flashcard: {
        title: 'Thẻ ghi nhớ Flashcard',
        render: renderFlashcard
      },
      quiz: {
        title: 'Trắc nghiệm Chuyên sâu',
        render: renderQuiz
      },
      'sentence-practice': {
        title: 'Mẫu câu Tác nghiệp PBB',
        render: renderSentencePractice
      },
      'sentence-quiz': {
        title: 'Luyện tập Ghép câu',
        render: renderSentenceQuiz
      },
      progress: {
        title: 'Tiến độ & Thống kê Học tập',
        render: renderProgress
      }
    };

    this.init();
  }

  init() {
    // Set vocabulary count in sidebar badge
    const vocabBadge = document.getElementById('sidebar-vocab-count');
    if (vocabBadge) vocabBadge.textContent = this.vocabulary.length;

    // Mobile sidebar toggle
    const menuToggle = document.getElementById('btn-mobile-menu');
    if (menuToggle && this.sidebarEl) {
      menuToggle.addEventListener('click', () => {
        this.sidebarEl.classList.toggle('open');
      });
    }

    // Close mobile sidebar when clicking on a link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992 && this.sidebarEl) {
          this.sidebarEl.classList.remove('open');
        }
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 992 &&
        this.sidebarEl &&
        this.sidebarEl.classList.contains('open') &&
        !this.sidebarEl.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        this.sidebarEl.classList.remove('open');
      }
    });

    // Hash navigation listener
    window.addEventListener('hashchange', () => this.handleRouting());

    // Initial load
    this.handleRouting();
    this.updateHeaderStats();
  }

  navigateTo(pageKey) {
    window.location.hash = '#' + pageKey;
  }

  handleRouting() {
    const rawHash = window.location.hash.replace(/^#/, '').trim();
    const targetPage = this.routes[rawHash] ? rawHash : 'dashboard';
    this.currentPage = targetPage;

    // Update active nav links
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
      const page = el.dataset.page;
      el.classList.toggle('active', page === targetPage);
    });

    // Update page title
    const route = this.routes[targetPage];
    if (this.headerTitleEl) {
      this.headerTitleEl.textContent = route.title;
    }
    document.title = `${route.title} | Airport English – PBB Learning`;

    // Render page
    if (this.pageContentEl && route.render) {
      window.scrollTo(0, 0);
      route.render(this.pageContentEl, {
        vocabulary: this.vocabulary,
        sentences: this.sentences,
        navigateTo: (page) => this.navigateTo(page)
      });
    }

    this.updateHeaderStats();
  }

  updateHeaderStats() {
    const stats = storageService.getSummaryStats(this.vocabulary.length);

    const pillMastered = document.getElementById('pill-mastered-count');
    const pillFav = document.getElementById('pill-fav-count');
    const pillQuiz = document.getElementById('pill-quiz-count');

    if (pillMastered) pillMastered.textContent = `${stats.wordsMastered} thuộc`;
    if (pillFav) pillFav.textContent = `${stats.favoritesCount} yêu thích`;
    if (pillQuiz) pillQuiz.textContent = `${stats.totalQuizCompleted} quiz`;
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

