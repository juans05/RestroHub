#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 1024})

    try:
        print("Navigating to http://localhost:3000...")
        page.goto('http://localhost:3000', wait_until='networkidle', timeout=30000)
        print("Page loaded successfully!")

        # Take full page screenshot
        screenshot_path = 'd:\\Proyecto_juans_\\Restuarante\\homepage_redesign.png'
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to: {screenshot_path}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
