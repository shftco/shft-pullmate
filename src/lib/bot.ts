import * as github from '@actions/github';
import * as core from '@actions/core';

import { useOctokit } from '@app/hooks';
import { checklist } from '@app/lib';

async function removeOldPRComments() {
  const octokit = useOctokit();

  const oldBotComments = await octokit.rest.issues.listComments({
    ...github.context.repo,
    issue_number: github.context.issue.number
  });

  oldBotComments.data.forEach(comment => {
    if (!comment.body?.includes('BOT MESSAGE')) {
      return;
    }

    octokit.rest.issues.deleteComment({
      ...github.context.repo,
      comment_id: comment.id
    });
  });
}

async function commentErrors(errors: string[]) {
  await removeOldPRComments();

  const octokit = useOctokit();
  const checklistErrors = checklist.extractErrorMessages();
  const errorsBody = errors
    .map((item: string) => `- :red_circle: **${item}**`)
    .join('\n');
  const checklistErrorsBody = checklistErrors
    .map((item: string) => `- ${item}`)
    .join('\n');

  const hasErrors = errors.length > 0 || checklistErrors.length > 0;

  if (hasErrors) {
    core.setFailed('Some requirements are not met');
  }

  const messageBody = hasErrors
    ? `BOT MESSAGE :robot:\n\n\n${errorsBody}\n${checklistErrorsBody}`
    : 'All good for checklist :green_circle:';

  await octokit.rest.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.issue.number,
    body: messageBody
  });
}

export default { commentErrors };
