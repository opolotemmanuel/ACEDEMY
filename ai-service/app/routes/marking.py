from fastapi import APIRouter

from app.schemas.marking_schema import LongAnswerMarkingRequest, LongAnswerMarkingResponse
from app.services.long_answer_marker import mark_long_answer

router = APIRouter(prefix="/ai", tags=["marking"])


@router.post("/mark-long-answer", response_model=LongAnswerMarkingResponse)
def mark_long_answer_route(payload: LongAnswerMarkingRequest):
    return mark_long_answer(payload)
