from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Allow CORS for local frontend development and production
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/respond")
def respond(response: dict):
    # Log the response (in a real app, save to DB)
    print(f"User responded: {response}")
    return {"status": "success", "message": "Proposal accepted!"}

# Serve Static Files (Frontend) using a specific path logic to allow SPA
# We expect the 'dist' folder to be renamed/moved to 'static' in the Docker container
# or we just point to 'static' and ensure the build puts files there.

# Check if static directory exists (Production mode)
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    # You might have other top-level files like favicon.ico, tenor.gif etc. 
    # It's safer to mount the root last or handle specific files.
    
    # Serve specific potential root files if they exist in static
    @app.get("/{fname:path}")
    async def serve_static_file(fname: str):
        file_path = os.path.join("static", fname)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to index.html for SPA routing
        return FileResponse("static/index.html")

    @app.get("/")
    async def serve_index():
        return FileResponse("static/index.html")
else:
    # Development mode or static files not ready
    @app.get("/")
    def read_root():
        return {"message": "Proposal Backend is running! (Static files not found, run via Docker for full app)"}

