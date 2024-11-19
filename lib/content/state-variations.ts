import { prisma } from '@/lib/prisma';
import { states } from '@/prisma/seed/dmv-content/states';
import { logger } from '@/lib/logger';

export class StateVariationManager {
  static async generateStateVariations(baseContent: any, targetState: string) {
    try {
      const stateData = states[targetState as keyof typeof states];
      if (!stateData) {
        throw new Error(`No data found for state: ${targetState}`);
      }

      const variations = {
        stories: this.generateStoryVariations(baseContent.stories, stateData),
        questions: this.generateQuestionVariations(baseContent.questions, stateData),
        rules: this.generateRuleVariations(baseContent.rules, stateData)
      };

      await this.saveStateVariations(targetState, variations);
      return variations;
    } catch (error) {
      logger.error('Failed to generate state variations:', error);
      throw error;
    }
  }

  private static generateStoryVariations(stories: any[], stateData: any) {
    return stories.map(story => {
      const stateSpecific = {
        ...story,
        content: this.replaceStateSpecificContent(story.content, stateData),
        examples: this.generateStateSpecificExamples(story.topic, stateData),
        visualAids: this.updateVisualAids(story.visualAids, stateData.name)
      };

      // Add state-specific scenarios
      if (stateData.scenarios?.[story.topic]) {
        stateSpecific.scenarios = stateData.scenarios[story.topic];
      }

      return stateSpecific;
    });
  }

  private static generateQuestionVariations(questions: any[], stateData: any) {
    return questions.map(question => {
      return {
        ...question,
        text: this.replaceStateSpecificContent(question.text, stateData),
        options: question.options.map((option: string) =>
          this.replaceStateSpecificContent(option, stateData)
        ),
        explanation: this.replaceStateSpecificContent(question.explanation, stateData),
        stateSpecificRules: stateData.rules[question.topic] || []
      };
    });
  }

  private static generateRuleVariations(rules: any[], stateData: any) {
    return rules.map(rule => {
      const stateRule = stateData.rules[rule.topic];
      if (stateRule) {
        return {
          ...rule,
          content: stateRule.content,
          exceptions: stateRule.exceptions || [],
          penalties: stateRule.penalties || {},
          references: stateRule.references || []
        };
      }
      return rule;
    });
  }

  private static replaceStateSpecificContent(content: string, stateData: any) {
    let modified = content;
    
    // Replace generic terms with state-specific terms
    Object.entries(stateData.terminology || {}).forEach(([generic, specific]) => {
      const regex = new RegExp(`\\b${generic}\\b`, 'gi');
      modified = modified.replace(regex, specific as string);
    });

    // Update speed limits and other numerical values
    Object.entries(stateData.limits || {}).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b[^.]*(\\d+)`, 'gi');
      modified = modified.replace(regex, (match) => 
        match.replace(/\d+/, value as string)
      );
    });

    return modified;
  }

  private static generateStateSpecificExamples(topic: string, stateData: any) {
    return stateData.examples?.[topic] || [];
  }

  private static updateVisualAids(visualAids: string[], stateName: string) {
    return visualAids.map(aid => 
      aid.replace('/images/common/', `/images/${stateName.toLowerCase()}/`)
    );
  }

  private static async saveStateVariations(state: string, variations: any) {
    await prisma.$transaction([
      // Save story variations
      ...variations.stories.map((story: any) =>
        prisma.story.upsert({
          where: {
            state_title: {
              state,
              title: story.title
            }
          },
          update: { content: story },
          create: {
            state,
            title: story.title,
            content: story,
            published: false
          }
        })
      ),

      // Save question variations
      ...variations.questions.map((question: any) =>
        prisma.question.upsert({
          where: {
            state_id: {
              state,
              id: question.id
            }
          },
          update: question,
          create: {
            ...question,
            state
          }
        })
      )
    ]);
  }
}