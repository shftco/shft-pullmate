import * as core from '@actions/core';

import { pullRequest, bot, markdownParser } from '@app/lib';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const errors = [];

  try {
    if (await pullRequest.missingAssignees()) {
      errors.push('Pull request must have at least one assignee.');
    }

    if (await markdownParser.missingImageOrVideo()) {
      errors.push('Pull request must have at least one image or video.');
    }

    if (await markdownParser.missingTaskId()) {
      errors.push('Pull request must have a task number in the title.');
    }

    if (await markdownParser.missingChecklist()) {
      errors.push('Pull request must have a checklist.');
    }

    if (await pullRequest.missingSemanticTitle()) {
      errors.push(
        'Pull request must have a semantic title. See the [Semantic Title Documentation](https://github.com/shftco/shft-pullmate/blob/main/docs/SEMANTIC_TITLE_NAMING.md) for more information.'
      );
    }

    if (await pullRequest.missingReviewers()) {
      errors.push('Pull request must have at least one reviewer.');
    }

    await bot.commentErrors(errors);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
