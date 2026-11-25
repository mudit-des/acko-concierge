#!/usr/bin/env bash
# Build locally and publish dist/ to the gh-pages branch of the "mudit-des" remote.
# Built locally because the @acko/* packages come from an internal registry that CI cannot reach.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL=$(git remote get-url mudit-des)

npm run build
cp dist/index.html dist/404.html   # SPA fallback: unknown paths load the app, which routes them
touch dist/.nojekyll

cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f "$REMOTE_URL" gh-pages
rm -rf .git
echo "Published to gh-pages"
