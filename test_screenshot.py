#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time
import sys

# Wait for server to be ready
time.sleep(3)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})

    try:
        page.goto('http://localhost:3000', wait_until='networkidle', timeout=10000)
        page.wait_for_load_state('networkidle')

        # Take screenshot
        screenshot_path = 'd:\\Proyecto_juans_\\Restuarante\\screenshot_updated.png'
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to: {screenshot_path}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
