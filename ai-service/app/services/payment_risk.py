from typing import Any, Dict, List


def pending_payments(payments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        payment
        for payment in payments
        if payment.get("status") not in {"FULLY_PAID", "Completed", "paid"}
    ]
