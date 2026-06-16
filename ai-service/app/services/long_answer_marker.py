from app.schemas.marking_schema import LongAnswerMarkingRequest, LongAnswerMarkingResponse


def mark_long_answer(payload: LongAnswerMarkingRequest) -> LongAnswerMarkingResponse:
    answer = payload.studentAnswer.lower()
    expected = [keyword.strip() for keyword in payload.expectedKeywords if keyword.strip()]
    matched = [keyword for keyword in expected if keyword.lower() in answer]
    missing = [keyword for keyword in expected if keyword.lower() not in answer]

    auto_score = round((len(matched) / len(expected)) * payload.maxMarks, 2) if expected else 0
    percentage = round((auto_score / payload.maxMarks) * 100, 2)
    recommendation = (
        "Strong keyword coverage. Instructor should still review context and quality before final grading."
        if percentage >= 70
        else "Keyword coverage is incomplete. Instructor should review manually and provide feedback."
    )

    return LongAnswerMarkingResponse(
        matchedKeywords=matched,
        missingKeywords=missing,
        autoScore=auto_score,
        percentage=percentage,
        recommendation=recommendation,
    )
