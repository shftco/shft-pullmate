import * as github from '@actions/github';

import { useOctokit } from '@app/hooks';

async function getRepositoryInfo() {
  const octokit = useOctokit();

  const reposity = await octokit.rest.repos.get({
    ...github.context.repo
  });

  return {
    owner: reposity.data.owner.login,
    repo: reposity.data.name
  };
}

export default { getRepositoryInfo };
