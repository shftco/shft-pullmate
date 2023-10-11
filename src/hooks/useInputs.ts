import * as core from '@actions/core';

import { INPUT_KEYS } from '@app/constants';

type UseInputsReturnTypes = {
  isReviewerRequired: boolean;
  isAsigneeRequired: boolean;
  isChecklistRequired: boolean;
  isSemanticTitleRequired: boolean;
  repoToken: string;
};

export default function useInputs(): UseInputsReturnTypes {
  const isReviewerRequired = Boolean(
    core.getInput(INPUT_KEYS.REVIEWER_REQUIRED, { required: true })
  );

  const isAsigneeRequired = Boolean(
    core.getInput(INPUT_KEYS.ASSIGNEE_REQUIRED, { required: true })
  );

  const isChecklistRequired = Boolean(
    core.getInput(INPUT_KEYS.CHECKLIST_REQUIRED, { required: true })
  );

  const isSemanticTitleRequired = Boolean(
    core.getInput(INPUT_KEYS.SEMANTIC_TITLE_REQUIRED, { required: true })
  );

  const repoToken = core.getInput(INPUT_KEYS.REPO_TOKEN, { required: true });

  return {
    isReviewerRequired,
    isAsigneeRequired,
    isChecklistRequired,
    isSemanticTitleRequired,
    repoToken
  };
}
