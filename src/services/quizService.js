/**
 * Airport English - Quiz Service
 * Generates and grades quiz questions across all 5 modes
 */
import { shuffleArray } from '../utils/helpers.js';

export const QUIZ_MODES = {
  EN_VI: {
    id: 'EN_VI',
    name: 'English → Tiếng Việt',
    description: 'Đọc thuật ngữ tiếng Anh, chọn nghĩa tiếng Việt chính xác'
  },
  VI_EN: {
    id: 'VI_EN',
    name: 'Tiếng Việt → English',
    description: 'Đọc nghĩa tiếng Việt chuyên ngành, chọn thuật ngữ tiếng Anh tương ứng'
  },
  ABBR_FULL: {
    id: 'ABBR_FULL',
    name: 'Từ viết tắt → Tên đầy đủ',
    description: 'Đọc chữ viết tắt (Abbreviation), chọn tên tiếng Anh đầy đủ (Full Name)'
  },
  FULL_ABBR: {
    id: 'FULL_ABBR',
    name: 'Tên đầy đủ → Từ viết tắt',
    description: 'Đọc tên tiếng Anh đầy đủ, chọn ký hiệu viết tắt chuẩn xác'
  },
  RANDOM: {
    id: 'RANDOM',
    name: 'Tổng hợp ngẫu nhiên',
    description: 'Trộn đều tất cả các dạng câu hỏi để tối đa phản xạ từ vựng'
  }
};

class QuizService {
  /**
   * Generate questions based on mode and limit
   */
  generateQuiz(vocabularyList, modeKey = 'RANDOM', limit = 10) {
    if (!vocabularyList || vocabularyList.length === 0) return [];

    const availablePool = shuffleArray(vocabularyList);
    const count = Math.min(limit, availablePool.length);
    const selectedWords = availablePool.slice(0, count);

    const questions = selectedWords.map((word, index) => {
      let actualMode = modeKey;
      if (modeKey === 'RANDOM') {
        const modes = ['EN_VI', 'VI_EN', 'ABBR_FULL', 'FULL_ABBR'];
        actualMode = modes[Math.floor(Math.random() * modes.length)];
      }

      return this.createQuestion(word, vocabularyList, actualMode, index + 1);
    });

    return questions;
  }

  /**
   * Create a single question object with 4 shuffled choices
   */
  createQuestion(targetWord, allWords, mode, questionNumber) {
    // Pick 3 random distractors distinct from targetWord
    const others = allWords.filter(w => w.id !== targetWord.id);
    const shuffledOthers = shuffleArray(others);
    const distractors = shuffledOthers.slice(0, 3);

    let prompt = '';
    let promptSubtitle = '';
    let correctAnswer = '';
    let wrongAnswers = [];
    let promptBadge = '';

    switch (mode) {
      case 'EN_VI':
        prompt = targetWord.fullName;
        promptSubtitle = targetWord.abbreviation ? `Ký hiệu: ${targetWord.abbreviation}` : '';
        promptBadge = 'English → Tiếng Việt';
        correctAnswer = targetWord.meaning;
        wrongAnswers = distractors.map(d => d.meaning);
        break;

      case 'VI_EN':
        prompt = targetWord.meaning;
        promptSubtitle = `Nhóm chuyên ngành: ${targetWord.category}`;
        promptBadge = 'Tiếng Việt → English';
        correctAnswer = `${targetWord.fullName} (${targetWord.abbreviation})`;
        wrongAnswers = distractors.map(d => `${d.fullName} (${d.abbreviation})`);
        break;

      case 'ABBR_FULL':
        prompt = targetWord.abbreviation;
        promptSubtitle = 'Chọn tên tiếng Anh đầy đủ của từ viết tắt trên:';
        promptBadge = 'Viết tắt → Tên đầy đủ';
        correctAnswer = targetWord.fullName;
        wrongAnswers = distractors.map(d => d.fullName);
        break;

      case 'FULL_ABBR':
        prompt = targetWord.fullName;
        promptSubtitle = 'Chọn ký hiệu viết tắt chuẩn xác:';
        promptBadge = 'Tên đầy đủ → Viết tắt';
        correctAnswer = targetWord.abbreviation;
        wrongAnswers = distractors.map(d => d.abbreviation);
        break;
    }

    // Combine and shuffle choices
    const options = shuffleArray([
      { text: correctAnswer, isCorrect: true },
      ...wrongAnswers.map(w => ({ text: w, isCorrect: false }))
    ]);

    return {
      id: `q_${questionNumber}_${targetWord.id}`,
      number: questionNumber,
      mode,
      badge: promptBadge,
      prompt,
      promptSubtitle,
      correctAnswer,
      targetWord,
      options,
      explanation: `**${targetWord.abbreviation}** (${targetWord.fullName}): ${targetWord.meaning}. Thuộc nhóm: ${targetWord.category}.`
    };
  }
}

export const quizService = new QuizService();
