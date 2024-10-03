release_type=$1
version=""

if [ -z "$release_type" ]; then
  release_type="--patch"
fi

if [ "$release_type" = "--major" ]; then
  release_type="major"
elif [ "$release_type" = "--minor" ]; then
  release_type="minor"
elif [ "$release_type" = "--patch" ]; then
  release_type="patch"
else
  if [[ $release_type == v* ]]; then
    version=$release_type
  else
    echo "Invalid release type"
    exit 1
  fi
fi

function git_installed() {
  command -v git >/dev/null 2>&1
}

function inside_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

function tag_list() {
  git tag --list
}

function latest_tag() {
  local list=$(tag_list)
  echo "$list" | sort -V | tail -n 1
}

function new_tag() {
  if [ -z "$(tag_list)" ]; then
    echo "v1.0.0"
  else
    local release_type=$1
    local latest_tag=$(latest_tag)
    
    local major=$(echo $latest_tag | cut -d. -f1 | sed 's/v//')
    local minor=$(echo $latest_tag | cut -d. -f2)
    local patch=$(echo $latest_tag | cut -d. -f3)

    if [ -z "$release_type" ]; then
      release_type="patch"
    fi

    if [ "$release_type" = "major" ]; then
      major=$((major + 1))
      minor=0
      patch=0
    elif [ "$release_type" = "minor" ]; then
      minor=$((minor + 1))
      patch=0
    elif [ "$release_type" = "patch" ]; then
      patch=$((patch + 1))
    fi

    echo "v$major.$minor.$patch"
  fi
}

function gh_cli_installed() {
  command -v gh >/dev/null 2>&1
}

function gh_cli_logined() {
  gh auth status --show-token >/dev/null 2>&1
}

function create_tag_if_not_exists() {
  local tag=$1
  local list=$(tag_list)

  if ! echo "$list" | grep -q "^$tag$"; then
    git tag $tag
    echo "Tag $tag created successfully"
  else
    echo "Tag $tag already exists"
  fi
}

function create_release_if_not_exists() {
  local tag=$1
  if ! gh release view $tag >/dev/null 2>&1; then
    gh release create $tag --title $version --generate-notes
    echo "Release $tag created successfully"
  else
    echo "Release $tag already exists"
  fi
}

if git_installed; then
  if inside_git_repo; then
    if gh_cli_installed; then
      if ! gh_cli_logined; then
        echo "You are not logged in to GitHub CLI. Please login using 'gh auth login'"
        exit 1
      fi

      if [ -z "$version" ]; then
        version=$(new_tag $release_type)
      fi

      echo "New tag: $version"
      read -p "Do you want to create this tag? (y/n) " -n 1 -r
      echo ""

      if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_tag_if_not_exists $version

        git push origin $version
        echo "Tag pushed successfully"

        create_release_if_not_exists $version
      else
        echo "Tag creation aborted"
      fi
    else
      echo "GitHub CLI is not installed. Please install it from https://cli.github.com"
    fi
  else
    echo "Not inside a git repo"
  fi
else
  echo "Git is not installed"
fi
