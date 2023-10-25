## Semantic Branch Naming

#### Branch Naming Convention
`scope/your-branch-name`

#### Branch Naming Rules
- Branch names must be lowercase.
- Branch names must be kebab-case.
- Branch names must be prefixed with a scope. List of allowed scopes below.
- Branch names must be prefixed with a scope and a slash.
- Branch names must not contain numbers.

#### Allowed Scopes
- build
- chore
- ci
- docs
- feature
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
- **feature:** A new feature.
- **fix:** A bug fix.
- **perf:** A code change that improves performance.
- **refactor:** A code change that neither fixes a bug nor adds a feature.
- **revert:** Reverts a previous commit.
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **test:** Adding missing tests or correcting existing tests.


#### Examples

**Valid Branch Names**
- `docs/update-readme`
- `feature/add-new-feature`
- `fix/login-bug`

**Invalid Branch Names**
- `docs/Update-Readme`
- `feature/add_new_feature`
- `fix/123-login-bug`
- `fix/login.bug`
