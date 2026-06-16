from typing import Any, Dict, List, Optional


def likely_difficult_module(courses: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not courses:
        return None
    modules = courses[0].get("modules") or []
    if len(modules) >= 3:
        return modules[2]
    return modules[0] if modules else None
