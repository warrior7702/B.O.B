#!/usr/bin/env python3
# Test scrapling HTTP mode (no browser)

import sys
sys.path.insert(0, '/Users/campoffice/Library/Python/3.9/lib/python/site-packages')

try:
    from scrapling import Fetcher
    print("✓ Scrapling imported successfully")
    
    # Test basic fetch
    fetcher = Fetcher()
    page = fetcher.get('https://example.com')
    
    print(f"✓ Fetched example.com")
    print(f"  Status: {page.status}")
    print(f"  Title: {page.title}")
    print(f"  First paragraph: {page.text[:100]}...")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
