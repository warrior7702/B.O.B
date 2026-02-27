#!/bin/bash
pkill -9 -f "next"
pkill -9 -f "node"
sleep 2
echo "Killed all node processes"