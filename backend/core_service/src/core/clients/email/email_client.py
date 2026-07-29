import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from core.config import cfg_obj
from core.logger import get_logger


class EmailClient:
    def __init__(self):
        self.__sender_email = cfg_obj.EMAIL_SENDER
        self.__app_password = cfg_obj.SMTP_SECRET_CODE
        self.logger = get_logger("EmailClient")

    def send_email(self, receiver: str, msg: str, subject: str) -> None:
        message = MIMEMultipart()

        message["From"] = self.__sender_email
        message["To"] = receiver
        message["Subject"] = subject

        message.attach(MIMEText(msg, "plain"))

        try:
            # Подключение к серверу через SSL на 465 порту
            with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
                server.login(self.__sender_email, self.__app_password)
                server.sendmail(self.__sender_email, receiver, message.as_string())
            self.logger.info(f"Sending email to: {receiver}")
        except Exception as e:
            self.logger.error(f"Sending email error: {e} - {type(e)}")
