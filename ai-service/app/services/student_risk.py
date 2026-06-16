from typing import Any, Dict, List


def risky_students(progress_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        record
        for record in progress_records
        if float(record.get("progressPercent") or record.get("progress") or 0) < 30
    ]
