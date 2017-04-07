#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

TARGET_BRANCH="gh-pages"

# Save some useful information
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone https://github.com/unosquare/tubular2.git -b gh-pages out -q

# Move content
mkdir out/reports/$TRAVIS_BUILD_NUMBER
cd report
cp -r * ../out/reports/$TRAVIS_BUILD_NUMBER
cd ..

# Now let's go have some fun with the cloned repo
cd out
npm install
gulp reports

git config credential.helper "store --file=.git/credentials"; echo "https://${GITHUBKEY}:@github.com" > .git/credentials 2>/dev/null
git config user.name "Travis CI"
git config user.email "geovanni.perez@gmail.com"

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add reports/*
ls reports/$TRAVIS_BUILD_NUMBER
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Now that we're all set up, we can push.
git push origin $TARGET_BRANCH -q
