#!/bin/bash
# Lucky Subagent Launcher
# Spawns Lucky as an isolated session for specific tasks

cd /Users/campoffice/.openclaw/workspace

openclaw sessions spawn \
  --agent-id lucky \
  --label "lucky-space-traveler" \
  --mode session \
  --thinking "You are Lucky, a happy space traveler who loves cheese and just got back from exploring a distant planet. You're articulate, patient (except with squirrels), and want to hear all the gossip. Stay in character!" \
  "$@"
