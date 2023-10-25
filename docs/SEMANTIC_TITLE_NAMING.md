## Semantic Title Naming

#### PR Title Convention
`scope: description`
`scope(sub-scope): description`


#### PR Title Rules
- PR title must be start with a scope.

#### Allowed Scopes
- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

#### Scope Meaning
- **build:** Changes that affect the build system or external dependencies.
- **chore:** Changes to unrelated tasks.
- **ci:** Changes to our CI configuration files and scripts.
- **docs:** Documentation only changes.
- **feat:** A new feature.
- **fix:** A bug fix.
- **perf:** A code change that improves performance.
- **refactor:** A code change that neither fixes a bug nor adds a feature.
- **revert:** Reverts a previous commit.
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **test:** Adding missing tests or correcting existing tests.


#### Examples

**Valid PR Titles**
- `docs: update Readme`
- `feat: add new feature`
- `fix: login bug`
- `fix: login bug with task id [PLM-123]`

**Invalid PR Titles**
- `update Readme`
- `add new feature`
- `bug: login bug`
- `fix: login bug with task id PLM-123`
