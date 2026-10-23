#!/bin/zsh
# preview.sh "<label>" — оновлює превью з mockup-v2 (HANDOFF §2) і чекає збірку Pages
S=$(cd ~/projects/iskcon-v2 && git rev-parse --short HEAD)
cd /private/tmp/claude-501/-Users-sergiyshakola-projects-iskcon-v2-s1/preview || exit 1
git pull -q origin main && git rm -rq --cached . ; find . -mindepth 1 -maxdepth 1 ! -name .git ! -name robots.txt -exec rm -rf {} +
(cd ~/projects/iskcon-v2 && git archive mockup-v2 index.html courses.html courses food.html food donation.html donation 404.html assets favicon.ico) | tar -x -C .
git add -A && git commit -qm "Preview: update to mockup-v2 @$S ($1)"
grep -rl '<base href="/iskcon-cv-ua/">' --include='*.html' . | xargs sed -i '' 's#<base href="/iskcon-cv-ua/">#<base href="/iskcon-mockup-v2-preview/">#'
git add -A && git commit -qm "Preview only: point <base> to /iskcon-mockup-v2-preview/" && git push -q origin main
H=$(git rev-parse --short HEAD); for i in $(seq 1 40); do s=$(gh api repos/VycheslavUkraincev/iskcon-mockup-v2-preview/pages/builds/latest --jq '.status+" "+.commit[0:7]'); case "$s" in "built $H"*) echo "preview $s (mockup-v2 @$S)"; exit 0;; esac; sleep 15; done; echo "preview build not confirmed: $s"
