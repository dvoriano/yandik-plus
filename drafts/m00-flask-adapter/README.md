M00-G6 | Flask DEMO boundary, CODE ONLY, UNTESTED.

adapter.py builds a read-only Flask Blueprint but never registers it. The host must explicitly register and enable YANDIK_M00_G6_DEMO_ROUTES_ENABLED. Default returns 404. GET list/detail only; no client-selected role/territory/source, no write, no personal data, no official case confirmation. Pure Python validation uses synthetic fixtures and rejects unknown fields. Host callbacks MUST originate from an authenticated server context in any future system; this code does NOT authenticate them. Flask version and production compatibility not verified.

25 QA in tests/test_adapter.py written, 0 executed. No live Flask app or external data accessed. See docs/M00_G6_FLASK_ADAPTER_DEMO_2026_2030.md.
