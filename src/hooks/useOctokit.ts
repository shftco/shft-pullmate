import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

import { useInputs } from '@app/hooks';

export default function useOctokit(): InstanceType<typeof GitHub> {
  const { repoToken } = useInputs();

  return github.getOctokit(repoToken);
}
