# SHFT PullMate

![CI](https://github.com/shftco/shft-pullmate/actions/workflows/ci.yml/badge.svg)

This GitHub Action reviews the content of opened Pull Requests based on provided inputs. The Pull Request contains a checklist that is used to determine if specific requirements are met. If the PR does not meet the requirements, it comments on the PR with a list of missing requirements.

## Installation
Go to the [documentation](https://github.com/shftco/shft-config/tree/main/pullmate) to learn more.

## Usage

The belowing YAML code outlines the configuration for using the "SHFT PullMate" GitHub Action. In this setup, the action is triggered whenever a pull request event occurs. This includes events such as when a pull request is opened, closed, labeled, or when changes are made to it. The action is designed to operate concurrently with other actions, ensuring that multiple pull requests can be processed simultaneously.

Within the shft-pullmate job, the following steps are performed:

Checkout: This step checks out the code repository.

Next step utilizes the "SHFT PullMate" action (shftco/shft-pullmate@v1.0.1). It accepts several parameters to define the requirements for a pull request. These include specifying if at least one reviewer and assignee are required, whether a checklist in the pull request body is mandatory, and if a semantic title following the conventional commits specification is needed. Additionally, a personal access token (SECRET_TOKEN) with the necessary repository scope is used for authentication.

This configuration allows the "SHFT PullMate" action to automatically review pull requests based on the defined criteria. It's important to note that you'll need to replace `secrets.SECRET_TOKEN` with an actual secret or personal access token with the required permissions.

```yaml
name: SHFT PullMate

on:
  pull_request:
    types:
      [
        assigned,
        unassigned,
        labeled,
        unlabeled,
        opened,
        edited,
        closed,
        reopened,
        synchronize,
        converted_to_draft,
        ready_for_review,
        locked,
        unlocked,
        review_requested,
        review_request_removed,
        auto_merge_enabled,
        auto_merge_disabled
      ]

concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: true

jobs:
  shft-pullmate:
    name: SHFT PullMate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: SHFT PullMate
        uses: shftco/shft-pullmate@v1.0.1
        with:
          reviewerRequired: true # If true, the PR must have at least one reviewer
          assigneeRequired: true # If true, the PR must have at least one assignee
          checklistRequired: true # If true, the PR must have a checklist on the PR body
          semanticTitleRequired: true # If true, the PR must have a semantic title. The title must follow the conventional commits specification
          semanticBranchNameRequired: true # If true, the PR must have a semantic branch name
          repoToken: ${{ secrets.SECRET_TOKEN }} # Personal Access Token with repo scope
```
