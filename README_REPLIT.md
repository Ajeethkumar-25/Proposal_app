Replit deployment

1. Go to https://replit.com and sign in.
2. Create a new Repl and choose "Import from GitHub" (or import this repository directly).
3. Replit will detect `replit.nix` and `.replit` and run `bash start.sh`.
4. The `start.sh` script will:
   - install frontend npm deps and build the Vite app,
   - copy `frontend/dist` into `backend/static`,
   - install Python deps, and
   - start Uvicorn serving the FastAPI app.

Notes:
- Replit provides a public URL; the app may sleep after inactivity on the free tier.
- If build fails due to peer deps, edit `start.sh` to adjust npm commands.
- You can also deploy elsewhere (Render, Railway) using the existing Dockerfile.
