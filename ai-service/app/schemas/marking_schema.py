from typing import List

from pydantic import BaseModel, Field


class LongAnswerMarkingRequest(BaseModel):
    question: str = Field(min_length=1)
    studentAnswer: str = Field(min_length=1)
    expectedKeywords: List[str] = Field(min_length=1)
    maxMarks: float = Field(gt=0)


class LongAnswerMarkingResponse(BaseModel):
    matchedKeywords: List[str]
    missingKeywords: List[str]
    autoScore: float
    percentage: float
    recommendation: str
    advisoryOnly: bool = True
