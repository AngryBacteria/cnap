#!/bin/sh
# Start backend in the background
cd server && npm run start &

# Start frontend in the foreground
cd client && serve -p 4173 -s dist