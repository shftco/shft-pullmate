import * as github from '@actions/github';
import * as core from '@actions/core';

import { repository, pullRequest } from '@app/lib';
import { CHECKLIST_KEYS, QUESTIONS } from '@app/constants';
import { useInputs } from '@app/hooks';

function extractChecklistContent() {
  const rawContent = github.context.payload.pull_request?.body ?? '';
  const checklistStart = rawContent.indexOf(CHECKLIST_KEYS.START);
  const checklistEnd = rawContent.indexOf(CHECKLIST_KEYS.END);
  const checklistContent = rawContent
    .substring(checklistStart + 25, checklistEnd)
    .trim();
  return checklistContent;
}

function hasChecklist() {
  const rawContent = github.context.payload.pull_request?.body ?? '';

  if (
    !rawContent.includes(CHECKLIST_KEYS.START) ||
    !rawContent.includes(CHECKLIST_KEYS.END)
  ) {
    return false;
  }

  return true;
}

function clearQuestionLine(questionLine: string) {
  return questionLine
    .replace(/- \[[x ]\] /g, '')
    .replace(/(\(\*\))/g, '')
    .trim();
}

function parseContentAsJSON(): CheckListNodeType[] {
  const parsedContent = extractChecklistContent();
  const lines = parsedContent.split('\n');

  const tree: CheckListNodeType[] = [];
  const stack: CheckListNodeType[] = [];

  for (const line of lines) {
    const childSpaces = line.substring(0, line.indexOf('- [')).length;
    const childLevel = childSpaces / 2;

    const node = {
      children: [],
      isRequired: line.includes('(\\*)'),
      isChecked: line.includes('[x]'),
      q: clearQuestionLine(line)
    };

    if (childLevel === 0) {
      tree.push(node);
      stack.length = 0;
    } else {
      const parent = stack[childLevel - 1];
      parent.children.push(node);
    }

    stack[childLevel] = node;
  }

  return tree;
}

function checkedTaskId() {
  const parsed = parseContentAsJSON();

  const taskQuestion = parsed.find(
    item => item.q.trim() === QUESTIONS.HAVE_TASK_ID.trim()
  );

  return taskQuestion?.isChecked ?? false;
}

function checkedImageOrVideo() {
  const parsed = parseContentAsJSON();

  const UIQuestion = parsed.find(
    item => item.q.trim() === QUESTIONS.UI_CHANGED.trim()
  );

  if (UIQuestion?.isChecked) {
    return true;
  }

  return false;
}

async function hasAnyImageOrVideo() {
  const rawContent = github.context.payload.pull_request?.body ?? '';
  const { repo, owner } = await repository.getRepositoryInfo();

  return rawContent.includes('https://github.com/user-attachments');
}

async function missingImageOrVideo() {
  if (!checkedImageOrVideo()) {
    return false;
  }

  return !(await hasAnyImageOrVideo());
}

async function missingTaskId() {
  const isValid = await pullRequest.hasTaskNumber();
  const isChecked = checkedTaskId();

  if (isChecked) {
    return !isValid;
  }

  return false;
}

async function missingChecklist() {
  const { isChecklistRequired } = useInputs();

  if (!isChecklistRequired) {
    return false;
  }

  return !hasChecklist();
}

export default {
  extractChecklistContent,
  hasChecklist,
  parseContentAsJSON,
  checkedImageOrVideo,
  checkedTaskId,
  hasAnyImageOrVideo,
  missingImageOrVideo,
  missingTaskId,
  missingChecklist
};
