import { states } from '@/prisma/seed/dmv-content/states';
import { logger } from '@/lib/logger';

export class ContentValidator {
  static validateStateContent(state: string, content: any) {
    const requiredSections = [
      'basicRules',
      'trafficSigns',
      'rightOfWay',
      'parking',
      'safetyGuidelines',
      'stateSpecificLaws',
      'weatherConditions',
      'emergencyProcedures'
    ];

    const missingContent = requiredSections.filter(
      section => !content[section] || Object.keys(content[section]).length === 0
    );

    if (missingContent.length > 0) {
      logger.warn(`Missing content sections for ${state}:`, missingContent);
      return false;
    }

    // Validate story structure
    if (!this.validateStories(content.stories)) {
      logger.warn(`Invalid story structure in ${state} content`);
      return false;
    }

    // Validate questions
    if (!this.validateQuestions(content.questions)) {
      logger.warn(`Invalid questions in ${state} content`);
      return false;
    }

    return true;
  }

  private static validateStories(stories: any[]) {
    return stories.every(story => {
      return (
        story.title &&
        story.description &&
        Array.isArray(story.sections) &&
        story.sections.length >= 3 && // Minimum sections requirement
        story.sections.every(this.validateStorySection)
      );
    });
  }

  private static validateStorySection(section: any) {
    switch (section.type) {
      case 'text':
        return typeof section.content === 'string' && section.content.length >= 100;
      case 'rule':
        return (
          section.title &&
          section.content &&
          (!section.visualAid || section.visualAid.startsWith('/images/'))
        );
      case 'question':
        return (
          section.text &&
          Array.isArray(section.options) &&
          section.options.length >= 3 &&
          typeof section.correctAnswer === 'number' &&
          section.explanation
        );
      default:
        return false;
    }
  }

  private static validateQuestions(questions: any[]) {
    return questions.every(question => {
      return (
        question.id &&
        question.type &&
        question.text &&
        Array.isArray(question.options) &&
        question.options.length >= 3 &&
        typeof question.correctAnswer !== 'undefined' &&
        question.explanation &&
        question.category &&
        question.difficulty
      );
    });
  }
}