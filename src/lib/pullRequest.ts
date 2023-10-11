import * as github from '@actions/github';

import { useOctokit, useInputs } from '@app/hooks';
import { COMMIT_KEYS } from '@app/constants';

async function getPRInfo() {
  const octokit = useOctokit();

  const PR = await octokit.rest.issues.get({
    ...github.context.repo,
    issue_number: github.context.issue.number
  });

  return {
    title: PR?.data?.title ?? ''
  };
}

async function getAssigneesCount() {
  const octokit = useOctokit();

  const assignees = await octokit.rest.issues.listAssignees({
    ...github.context.repo,
    issue_number: github.context.issue.number
  });

  return assignees.data.length;
}

async function hasSemanticTitle() {
  const { title } = await getPRInfo();

  if (!COMMIT_KEYS.some(key => title.startsWith(key))) {
    return false;
  }

  return true;
}

async function hasTaskNumber() {
  const { title } = await getPRInfo();
  const regex = /\[(.*?)\]/g;
  const taskNumber = title.match(regex);

  if (!taskNumber) {
    return false;
  }

  return true;
}

async function hasAssignees() {
  const count = await getAssigneesCount();

  return count > 0;
}

async function missingAssignees() {
  const { isAsigneeRequired } = useInputs();

  if (!isAsigneeRequired) {
    return false;
  }

  return !(await hasAssignees());
}

async function missingSemanticTitle() {
  const { isSemanticTitleRequired } = useInputs();

  if (!isSemanticTitleRequired) {
    return false;
  }

  return !(await hasSemanticTitle());
}

async function missingReviewers() {
  const { isReviewerRequired } = useInputs();
  const reviewers = github.context.payload.pull_request?.requested_reviewers;

  if (!isReviewerRequired) {
    return false;
  }

  return !reviewers;
}

export default {
  getPRInfo,
  hasSemanticTitle,
  hasTaskNumber,
  getAssigneesCount,
  hasAssignees,
  missingAssignees,
  missingSemanticTitle,
  missingReviewers
};
