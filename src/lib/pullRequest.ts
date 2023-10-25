import * as github from '@actions/github';
import * as core from '@actions/core';

import { useOctokit, useInputs } from '@app/hooks';
import { COMMIT_KEYS, PULL_REQUEST } from '@app/constants';

async function getPRInfo() {
  const octokit = useOctokit();

  const issue = await octokit.rest.issues.get({
    ...github.context.repo,
    issue_number: github.context.issue.number
  });

  const PR = await octokit.rest.pulls.get({
    ...github.context.repo,
    pull_number: github.context.issue.number
  });

  return {
    title: issue?.data?.title ?? '',
    isDraft: issue?.data?.draft ?? false,
    isClosed: issue?.data?.state === 'closed',
    isAssigned: !!issue?.data?.assignee,
    hasReviewers: !!PR?.data?.requested_reviewers?.length,
    PROwner: PR?.data?.user?.login ?? '',
    branchName: PR?.data?.head?.ref ?? '',
    isMerged: PR?.data?.merged_at !== null
  };
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

async function missingAssignees() {
  const { isAssigneeRequired } = useInputs();

  if (!isAssigneeRequired) {
    return false;
  }

  const { isAssigned } = await getPRInfo();

  return !isAssigned;
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
  const { hasReviewers } = await getPRInfo();

  if (!isReviewerRequired) {
    return false;
  }

  return !hasReviewers;
}

async function missingSemanticBranchName() {
  const { isSemanticBranchNameRequired } = useInputs();
  const { branchName } = await getPRInfo();

  if (!isSemanticBranchNameRequired) {
    return false;
  }

  return isInvalidBranchName(branchName);
}

function isInvalidBranchName(title: string) {
  if (!PULL_REQUEST.PREFIXES.some(prefix => title.startsWith(`${prefix}/`))) {
    return true;
  }

  const titleRegex = /^[a-z]+(?:\/[a-z-]+)+$/;

  if (!titleRegex.test(title)) {
    return true;
  }

  return false;
}

export default {
  getPRInfo,
  hasSemanticTitle,
  hasTaskNumber,
  missingAssignees,
  missingSemanticTitle,
  missingReviewers,
  missingSemanticBranchName
};
