import os
import sys
import time
import asyncio
from datetime import datetime
from playwright.async_api import async_playwright

# Setup base url
BASE_URL = "http://localhost:3000"

async def run_test():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting UI Integration Tests on {BASE_URL}")
    
    # We generate a unique string using current microsecond timestamp to guarantee unique data
    uid = f"{int(time.time() * 100) % 10000000}"
    tutor_name = f"Tutor Test Uji {uid}"
    tutor_phone = f"0899{uid[:8]}"
    tutor_email = f"tutortest_{uid}@nurmancourse.com"
    tutor_password = "Password123!"

    print(f"Using Unique Test Data for Tentor:\n- Name: {tutor_name}\n- Phone: {tutor_phone}\n- Email: {tutor_email}")
    
    async with async_playwright() as p:
        # Launch browser
        print("Launching browser...")
        browser = await p.chromium.launch(
            headless=True,
            executable_path='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        page.set_default_timeout(30000)
        
        # 1. Login
        print("Navigating to login page...")
        await page.goto(f"{BASE_URL}/login")
        await page.wait_for_timeout(2000)
        
        print("Filling credentials for Admin...")
        await page.fill('input[type="text"], input[type="email"]', "admin@nurmancourse.com")
        await page.fill('input[type="password"]', "Password123!")
        
        print("Submitting login form...")
        await page.click('button[type="submit"]')
        
        print("Waiting for redirection to admin page...")
        await page.wait_for_url("**/app/admin", timeout=15000)
        print(f"Logged in successfully! Current URL: {page.url}")
        await page.screenshot(path="screenshots/01_logged_in.png")
        
        # =========================================================================
        # 2. TUTOR / TENTOR FLOW
        # =========================================================================
        print("\n=== TESTING TENTOR FLOW ===")
        print("Navigating to Tentor Management page...")
        await page.goto(f"{BASE_URL}/app/admin/tentor")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/02_tentor_page.png")
        
        # Click '+ Tambah' / Submit button inside right form
        print("Clicking '+ Tambah' / Submit button inside right form...")
        
        print(f"Filling Tutor Baru Form (Name: {tutor_name})...")
        await page.fill('label:has-text("Nama Lengkap") input', tutor_name)
        await page.fill('label:has-text("Nomor Hape") input', tutor_phone)
        await page.fill('label:has-text("Email") input', tutor_email)
        await page.fill('label:has-text("Password Sementara") input', tutor_password)
        await page.screenshot(path="screenshots/03_tentor_form_filled.png")
        
        print("Submitting tutor form...")
        await page.click('form button[type="submit"]')
        await page.wait_for_timeout(3000) # wait API & reload
        await page.screenshot(path="screenshots/04_tentor_added.png")
        
        # Verify tentor is added
        print("Verifying if the new tentor is in the list...")
        await page.fill('input[placeholder="Cari nama, email, atau nomor hape..."]', tutor_name)
        await page.wait_for_timeout(1500)
        await page.screenshot(path="screenshots/05_tentor_searched.png")
        
        tutor_card = page.locator(f'div:has-text("{tutor_name}")')
        if await tutor_card.count() > 0:
            print(f"SUCCESS: Tentor '{tutor_name}' successfully added and visible in list!")
        else:
            print(f"FAILED: Tentor '{tutor_name}' not found in cards!")
            sys.exit(1)
            
        # Edit Tentor
        print("Editing Tentor...")
        await page.locator(f'div:has-text("{tutor_name}")').locator('button:has-text("Edit")').click()
        await page.wait_for_timeout(1000)
        
        edited_tutor_name = f"{tutor_name} (Edited)"
        print(f"Updating Tentor Name to: {edited_tutor_name}...")
        await page.fill('label:has-text("Nama Lengkap") input', edited_tutor_name)
        
        print("Submitting updated form...")
        await page.click('form button[type="submit"]')
        await page.wait_for_timeout(3000)
        
        # Verify name update
        await page.fill('input[placeholder="Cari nama, email, atau nomor hape..."]', edited_tutor_name)
        await page.wait_for_timeout(1500)
        await page.screenshot(path="screenshots/06_tentor_edited.png")
        
        if await page.locator(f'div:has-text("{edited_tutor_name}")').count() > 0:
            print(f"SUCCESS: Tentor successfully edited to '{edited_tutor_name}'!")
        else:
            print(f"FAILED: Edited Tentor name not found in cards!")
            sys.exit(1)
            
        # =========================================================================
        # 3. MURID / WALI FLOW
        # =========================================================================
        print("\n=== TESTING MURID FLOW ===")
        print("Navigating to Murid Management page...")
        await page.goto(f"{BASE_URL}/app/admin/murid")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/07_murid_page.png")
        
        print("Clicking '+ Tambah' / Submit button inside right murid form...")
        
        uid_m = f"{int(time.time() * 100) % 10000000}"
        murid_name = f"Murid Test Uji {uid_m}"
        murid_school = "5 SD"
        murid_address = f"Purwokerto Kidul No. {uid_m[:3]}"
        wali_name = f"Wali Murid {uid_m}"
        wali_phone = f"0888{uid_m[:8]}"
        wali_email = f"walitest_{uid_m}@gmail.com"
        
        print(f"Filling Murid Baru Form (Name: {murid_name})...")
        await page.fill('label:has-text("Nama Lengkap Murid") input', murid_name)
        await page.fill('label:has-text("Kelas / Jenjang") input', murid_school)
        await page.fill('label:has-text("Alamat Rumah") textarea', murid_address)
        
        print("Filling Wali Murid Form...")
        await page.fill('label:has-text("Nama Lengkap Wali") input', wali_name)
        await page.fill('label:has-text("Nomor WhatsApp Wali") input', wali_phone)
        await page.fill('label:has-text("Email Wali (Opsional)") input', wali_email)
        await page.screenshot(path="screenshots/08_murid_form_filled.png")
        
        print("Submitting Murid Form...")
        await page.click('form button[type="submit"]')
        await page.wait_for_timeout(3000)
        await page.screenshot(path="screenshots/09_murid_added.png")
        
        # Verify Murid in List
        print("Searching for the added murid...")
        await page.fill('input[placeholder="Cari nama murid atau wali..."]', murid_name)
        await page.wait_for_timeout(1500)
        await page.screenshot(path="screenshots/10_murid_searched.png")
        
        if await page.locator(f'div:has-text("{murid_name}")').count() > 0:
            print(f"SUCCESS: Murid '{murid_name}' successfully added and visible in list!")
        else:
            print(f"FAILED: Murid '{murid_name}' not found in cards!")
            sys.exit(1)
            
        # Edit Murid
        print("Editing Murid...")
        await page.locator(f'div:has-text("{murid_name}")').locator('button:has-text("Edit")').click()
        await page.wait_for_timeout(1000)
        
        edited_murid_school = "6 SD"
        print(f"Updating Murid School Level to: {edited_murid_school}...")
        await page.fill('label:has-text("Kelas / Jenjang") input', edited_murid_school)
        
        print("Submitting updated Murid Form...")
        await page.click('form button[type="submit"]')
        await page.wait_for_timeout(3000)
        
        # Verify update
        await page.fill('input[placeholder="Cari nama murid atau wali..."]', murid_name)
        await page.wait_for_timeout(1500)
        await page.screenshot(path="screenshots/11_murid_edited.png")
        
        if await page.locator(f'div:has-text("{murid_name}"):has-text("{edited_murid_school}")').count() > 0:
            print(f"SUCCESS: Murid successfully edited to class '{edited_murid_school}'!")
        else:
            print(f"FAILED: Murid edits not visible in cards!")
            sys.exit(1)
            
        print("\nAll integration tests passed successfully! Closing browser...")
        await browser.close()

if __name__ == "__main__":
    os.makedirs("screenshots", exist_ok=True)
    asyncio.run(run_test())
