#!/bin/bash
echo "⚙️  Using npm install instead of npm ci"
rm -rf node_modules package-lock.json
npm install
