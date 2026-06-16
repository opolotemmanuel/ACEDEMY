from fastapi import APIRouter

from app.schemas.insight_schema import PlatformSnapshot

router = APIRouter(prefix="/ai", tags=["analytics"])


@router.post("/analytics/overview")
def analytics_overview(payload: PlatformSnapshot):
    return {
        "userCount": len(payload.users),
        "courseCount": len(payload.courses),
        "progressRecordCount": len(payload.studentProgress),
        "paymentRecordCount": len(payload.payments),
        "certificateRecordCount": len(payload.certificates),
        "advisoryOnly": True,
    }
