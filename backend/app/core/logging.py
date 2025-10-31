import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Configure the root logger
logging.basicConfig(
    level=logging.INFO,  # or DEBUG in dev
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        RotatingFileHandler(f"{LOG_DIR}/app.log", maxBytes=5_000_000, backupCount=5),
        logging.StreamHandler()  # Output to console too
    ]
)

# Create a logger for the app
logger = logging.getLogger("coverletter_app")
