"""Pytest configuration.

Puts the backend directory on ``sys.path`` so tests can import ``app.*`` without
an editable install, and keeps the settings cache from leaking between tests.
"""

from __future__ import annotations

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
