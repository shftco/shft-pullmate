import * as github from '@actions/github';

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
  const octokit = useOctokit();
  const errorsBody = errors
    .map((item: string) => `- :red_circle: **${item}**`)
    .join('\n');
  const checklistErrorsBody = checklist
    .extractErrorMessages()
    .map((item: string) => `- ${item}`)
    .join('\n');

  const hasErrors = errors.length > 0 || checklistErrorsBody.length > 0;
  const messageBody = hasErrors
    ? `BOT MESSAGE :robot:\n\n\n${errorsBody}\n${checklistErrorsBody}`
    : 'All good for checklist :green_circle:';

  await octokit.rest.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.issue.number,
    body: messageBody
  });
  await removeOldPRComments();
}

export default { commentErrors };
