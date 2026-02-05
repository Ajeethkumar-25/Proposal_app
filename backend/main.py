from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Email configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")

def send_email(recipient_email: str, recipient_name: str, sender_name: str, letter_content: str):
    """Send love letter via email"""
    try:
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            logger.warning("Email credentials not configured. Logging letter instead.")
            logger.info(f"Love letter from {sender_name} to {recipient_name} ({recipient_email}):\n{letter_content}")
            return True
        
        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"💌 A Special Message from {sender_name}"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Create HTML version of email
        html = f"""
        <html>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #667eea; text-align: center;">Dear {recipient_name},</h2>
                        <div style="white-space: pre-wrap; font-size: 1.05rem; color: #555;">
{letter_content}
                        </div>
                        <p style="text-align: center; margin-top: 30px; color: #999; font-size: 0.9rem;">
                            ✨ Sent with love from proposal app ✨
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Plain text version
        text = f"Dear {recipient_name},\n\n{letter_content}\n\nSent with love from proposal app"
        
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

# API Routes
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/love-letter")
def save_and_send_love_letter(data: dict):
    """Save and send love letter via email"""
    try:
        recipient_name = data.get("recipient_name")
        recipient_email = data.get("recipient_email")
        sender_name = data.get("sender_name")
        sender_email = data.get("sender_email")
        template = data.get("template")
        letter_content = data.get("letter")
        
        if not all([recipient_name, recipient_email, sender_name, sender_email, letter_content]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Log the submission
        timestamp = datetime.now().isoformat()
        letter_log = {
            "timestamp": timestamp,
            "recipient_name": recipient_name,
            "recipient_email": recipient_email,
            "sender_name": sender_name,
            "sender_email": sender_email,
            "template": template,
            "letter_preview": letter_content[:100] + "..."
        }
        logger.info(f"Love letter submission: {letter_log}")
        
        # Send email
        email_sent = send_email(recipient_email, recipient_name, sender_name, letter_content)
        
        return {
            "status": "success",
            "message": "Love letter sent successfully!" if email_sent else "Love letter saved (email config not set)",
            "id": timestamp,
            "email_sent": email_sent
        }
    except Exception as e:
        logger.error(f"Error processing love letter: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error sending letter: {str(e)}")

@app.post("/api/respond")
def respond(response: dict):
    # Log the response (in a real app, save to DB)
    timestamp = datetime.now().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "response": response.get("response"),
    }
    print(f"User responded: {log_entry}")
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

