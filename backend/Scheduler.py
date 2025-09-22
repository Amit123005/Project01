import schedule
import threading
import time
from datetime import datetime
from icecream import ic
from models import Production

# Define your jobs
def funct1():
    ic("Starting Scheduler")

def job_get_pqcr_report():
    ic("Running scheduled PQCR report at", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    pqcr_files = Production.get_pqcr_report()
    ic(pqcr_files)
    Production.send_pqcr_email(pqcr_files)
    ic("Ended Scheduler")

# Create a scheduler instance
scheduler = schedule.Scheduler()
scheduler.every().day.at("05:58:00").do(job_get_pqcr_report)  
scheduler.every().day.at("13:58:00").do(job_get_pqcr_report) 
scheduler.every().day.at("21:58:00").do(job_get_pqcr_report) 
# scheduler.every().day.at("17:46:10").do(job_get_pqcr_report)
# scheduler.every(5).seconds.do(Production.test)

# Run the scheduler in a background thread
def run_scheduler():
    while True:
        scheduler.run_pending()
        time.sleep(1)

def start_scheduler():
    thread = threading.Thread(target=run_scheduler)
    thread.daemon = True
    thread.start()
