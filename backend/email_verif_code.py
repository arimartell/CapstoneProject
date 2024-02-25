import string
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def generate_verification_code():
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(6))

def send_verification_email(receiver_email, verification_code):
    sender_email = "emailauthcode@gmail.com"
    sender_password = "fkth eyfj tmwn wvww"

    subject = "Verification Code"
    body = f"""
    <html>
        <body>
            <h2>Verification Code</h2>
            <p>Your verification code is: <strong>{verification_code}</strong></p>
        </body>
    </html>
    """

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add HTML body to email
    message.attach(MIMEText(body, "html"))

   # Connect to Gmail's SMTP server and send email
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())