#!/bin/sh
# Stamps src/legacy/version.js with the next version: <number>.<YYYYMMDD>.<HHMM>
# <number> is this commit's position on main (existing commits + 1); date and time are UTC+8.
# Run it right before each commit, then commit with the printed version at the start of the message.
set -e
cd "$(dirname "$0")/.."
n=$(( $(git rev-list --count HEAD 2>/dev/null || echo 0) + 1 ))
v="$n.$(TZ=Etc/GMT-8 date +%Y%m%d.%H%M)"
printf '/* Build version: <commit number>.<YYYYMMDD>.<HHMM> (UTC+8). Written by scripts/bump-version.sh; do not edit by hand. */\nGW.version = "%s";\n' "$v" > src/legacy/version.js
echo "$v"
