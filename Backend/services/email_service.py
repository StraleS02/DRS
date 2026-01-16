# services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Za testiranje sa MailHog-om
SMTP_HOST = os.getenv("SMTP_HOST", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", 1025))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER if SMTP_USER else "noreply@example.com"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.ehlo()
        if SMTP_PORT == 587:  # TLS
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(msg["From"], to_email, msg.as_string())
        server.quit()
        print(f"Email poslat na {to_email}")
    except Exception as e:
        print(f"Greška pri slanju mejla: {e}")
