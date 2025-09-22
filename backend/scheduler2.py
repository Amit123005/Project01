import schedule
import time
from threading import Thread
from models import Production
from icecream import ic
import traceback

# Static email addresses
USER_EMAIL = 'industrialit@ppapco.com'
SENIOR_EMAIL = 'ankit@ppapco.com'

# Create a local scheduler instance
scheduler = schedule.Scheduler()

def downtime_track():
    ic("Starting the Downtime Function")
    try:
        maint_downt = Production.maint_downtime()
        ic("🔧 Maintenance Downtime Result:", maint_downt)
    except Exception as e:
        ic("❌ Error in Maintenance Downtime:", str(e))
    try:
        auto_downt = Production.check_auto_downtime()
        ic("🤖 Auto Downtime Result:", auto_downt)
    except Exception as e:
        ic("❌ Error in Auto Downtime:", str(e))

    ic("✅ Downtime Function Completed")

def co_track():
    ic("⚙️ CO Function Started")
    try:
        co_data = Production.co_track()
        # ic("🔧 Maintenance Downtime Result:", co_data)
    except Exception as e:
        ic("❌ Error in Maintenance Downtime:", str(e))
    ic("⚙️ CO Function Ended")

def run_scheduler2():
    def runner():
        while True:
            try:
                scheduler.run_pending()
            except Exception as e:
                print(f"[Scheduler1 Error] {e}")
            time.sleep(1)
    Thread(target=runner, daemon=True).start()

def start_scheduler2():
    def safe_downtime_track():
        try:
            downtime_track()
        except Exception as e:
            print(f"[Downtime Track Error] {e}")
            traceback.print_exc()

    scheduler.every(20).seconds.do(safe_downtime_track)
    scheduler.every(10).seconds.do(co_track)
    run_scheduler2()
