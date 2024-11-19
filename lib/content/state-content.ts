import { states } from '@/prisma/seed/dmv-content/states';
import { ContentValidator } from './validator';
import { StateVariationManager } from './state-variations';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class StateContentManager {
  static async populateContent() {
    try {
      for (const [stateCode, stateData] of Object.entries(states)) {
        // Validate content before population
        if (!ContentValidator.validateStateContent(stateCode, stateData.content)) {
          logger.error(`Invalid content for state: ${stateCode}`);
          continue;
        }

        // Generate state-specific variations
        const variations = await StateVariationManager.generateStateVariations(
          stateData.content,
          stateCode
        );

        // Save content to database
        await this.saveStateContent(stateCode, variations);

        logger.info(`Content populated for state: ${stateCode}`);
      }
    } catch (error) {
      logger.error('Failed to populate content:', error);
      throw error;
    }
  }

  private static async saveStateContent(stateCode: string, content: any) {
    const { stories, questions, rules } = content;

    await prisma.$transaction(async (tx) => {
      // Save stories
      for (const story of stories) {
        await tx.story.upsert({
          where: {
            state_title: {
              state: stateCode,
              title: story.title,
            },
          },
          update: {
            content: story.content,
            description: story.description,
            sections: story.sections,
            visualAids: story.visualAids,
            difficulty: story.difficulty,
            category: story.category,
            updatedAt: new Date(),
          },
          create: {
            state: stateCode,
            title: story.title,
            content: story.content,
            description: story.description,
            sections: story.sections,
            visualAids: story.visualAids,
            difficulty: story.difficulty,
            category: story.category,
            published: false,
          },
        });
      }

      // Save questions
      for (const question of questions) {
        await tx.question.upsert({
          where: {
            state_id: {
              state: stateCode,
              id: question.id,
            },
          },
          update: {
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            category: question.category,
            difficulty: question.difficulty,
            type: question.type,
            points: question.points,
            updatedAt: new Date(),
          },
          create: {
            id: question.id,
            state: stateCode,
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            category: question.category,
            difficulty: question.difficulty,
            type: question.type,
            points: question.points,
          },
        });
      }

      // Save state-specific rules
      await tx.stateRule.upsert({
        where: { state: stateCode },
        update: { rules },
        create: {
          state: stateCode,
          rules,
        },
      });

      // Update content version
      await tx.contentVersion.create({
        data: {
          state: stateCode,
          version: new Date().toISOString(),
          changeLog: `Updated content for ${stateCode}`,
        },
      });
    });
  }

  static async getStateContent(stateCode: string) {
    return prisma.story.findMany({
      where: {
        state: stateCode,
        published: true,
      },
      include: {
        questions: true,
        rules: true,
      },
    });
  }

  static async updateContent(stateCode: string, updates: any) {
    const { stories, questions, rules } = updates;

    await prisma.$transaction(async (tx) => {
      if (stories) {
        for (const story of stories) {
          await tx.story.update({
            where: {
              id: story.id,
            },
            data: story,
          });
        }
      }

      if (questions) {
        for (const question of questions) {
          await tx.question.update({
            where: {
              id: question.id,
            },
            data: question,
          });
        }
      }

      if (rules) {
        await tx.stateRule.update({
          where: { state: stateCode },
          data: { rules },
        });
      }

      // Create new version
      await tx.contentVersion.create({
        data: {
          state: stateCode,
          version: new Date().toISOString(),
          changeLog: `Updated content for ${stateCode}`,
        },
      });
    });
  }
}