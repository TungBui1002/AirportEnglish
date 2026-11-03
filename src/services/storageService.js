/**
 * Airport English - Storage Service
 * Manages all persistent learning data via localStorage
 */

const STORAGE_KEY = 'airport_pbb_learning_v1';

class StorageService {
  constructor() {
    this.data = this.load();
  }

  getDefaultData() {
    return {
      wordsStatus: {}, // wordId: 'unknown' | 'learning' | 'mastered'
      favorites: [],   // [wordId, ...]
      quizHistory: [], // [{ id, date, mode, total, score, percentage, wrongCount }, ...]
      recentActivities: [
        {
          id: 'welcome-init',
          timestamp: Date.now(),
          type: 'system',
          title: 'Bắt đầu hành trình',
          description: 'Chào mừng bạn đến với Airport English - PBB Learning!'
        }
      ],
      sentenceProgress: {
        completedIds: [], // [sentenceId, ...]
        quizHistory: []
      }
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultData();
      const parsed = JSON.parse(raw);
      return { ...this.getDefaultData(), ...parsed };
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return this.getDefaultData();
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  // Word Status
  getWordStatus(wordId) {
    return this.data.wordsStatus[wordId] || 'unknown';
  }

  setWordStatus(wordId, status) {
    this.data.wordsStatus[wordId] = status;
    this.save();
  }

  // Favorites
  isFavorite(wordId) {
    return this.data.favorites.includes(Number(wordId));
  }

  toggleFavorite(wordId) {
    const id = Number(wordId);
    const index = this.data.favorites.indexOf(id);
    let isFav = false;
    if (index > -1) {
      this.data.favorites.splice(index, 1);
      isFav = false;
    } else {
      this.data.favorites.push(id);
      isFav = true;
    }
    this.save();
    return isFav;
  }

  getFavorites() {
    return [...this.data.favorites];
  }

  // Quiz History
  saveQuizResult({ mode, total, score, wrongQuestions = [] }) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const resultItem = {
      id: 'quiz_' + Date.now(),
      timestamp: Date.now(),
      mode,
      total,
      score,
      percentage,
      wrongQuestions
    };

    this.data.quizHistory.unshift(resultItem);
    if (this.data.quizHistory.length > 50) {
      this.data.quizHistory = this.data.quizHistory.slice(0, 50);
    }

    // Add activity
    this.addActivity({
      type: 'quiz',
      title: `Hoàn thành bài Quiz (${mode})`,
      description: `Đạt ${score}/${total} điểm (${percentage}%)`
    });

    this.save();
    return resultItem;
  }

  getQuizHistory() {
    return this.data.quizHistory || [];
  }

  // Activities
  addActivity({ type, title, description }) {
    const activity = {
      id: 'act_' + Date.now() + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      type,
      title,
      description
    };

    this.data.recentActivities.unshift(activity);
    if (this.data.recentActivities.length > 20) {
      this.data.recentActivities = this.data.recentActivities.slice(0, 20);
    }
    this.save();
    return activity;
  }

  getRecentActivities() {
    return this.data.recentActivities || [];
  }

  // Sentences
  markSentenceCompleted(sentenceId) {
    const id = Number(sentenceId);
    if (!this.data.sentenceProgress.completedIds.includes(id)) {
      this.data.sentenceProgress.completedIds.push(id);
      this.addActivity({
        type: 'sentence',
        title: 'Thực hành mẫu câu',
        description: `Đã hoàn thành mẫu câu vận hành #${id}`
      });
      this.save();
    }
  }

  isSentenceCompleted(sentenceId) {
    return this.data.sentenceProgress?.completedIds?.includes(Number(sentenceId)) || false;
  }

  saveSentenceQuizResult({ score, total, mode }) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    this.addActivity({
      type: 'sentence',
      title: `Sentence Quiz: ${mode}`,
      description: `Đạt ${score}/${total} điểm (${percentage}%)`
    });
    this.save();
  }

  // Global Statistics
  getSummaryStats(totalWordsInDb = 57) {
    const statuses = Object.values(this.data.wordsStatus);
    const wordsMastered = statuses.filter(s => s === 'mastered').length;
    const wordsLearning = statuses.filter(s => s === 'learning').length;
    const wordsLearned = wordsMastered + wordsLearning;
    const wordsNeedPractice = wordsLearning; // words in progress needing more drills

    const quizzes = this.data.quizHistory || [];
    const totalQuizCompleted = quizzes.length;

    let avgScore = 0;
    let bestScore = 0;
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;

    if (quizzes.length > 0) {
      const totalPct = quizzes.reduce((sum, q) => sum + q.percentage, 0);
      avgScore = Math.round(totalPct / quizzes.length);
      bestScore = Math.max(...quizzes.map(q => q.percentage));

      quizzes.forEach(q => {
        totalQuestionsAnswered += (q.total || 0);
        totalCorrectAnswers += (q.score || 0);
      });
    }

    const accuracyRate = totalQuestionsAnswered > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
      : 0;

    const progressPercentage = totalWordsInDb > 0
      ? Math.min(100, Math.round((wordsLearned / totalWordsInDb) * 100))
      : 0;

    return {
      totalWords: totalWordsInDb,
      wordsLearned,
      wordsMastered,
      wordsNeedPractice,
      progressPercentage,
      totalQuizCompleted,
      avgScore,
      bestScore,
      accuracyRate,
      favoritesCount: this.data.favorites.length
    };
  }

  // Reset
  resetAllProgress() {
    this.data = this.getDefaultData();
    this.save();
  }
}

export const storageService = new StorageService();

