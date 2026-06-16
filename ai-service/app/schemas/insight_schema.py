from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


InsightType = Literal[
    "SYSTEM_SUMMARY",
    "STUDENT_RISK",
    "COURSE_PERFORMANCE",
    "PAYMENT_RISK",
    "CERTIFICATE_READINESS",
    "INSTRUCTOR_ACTIVITY",
    "CONTENT_GAP",
    "SECURITY_ALERT",
]

Priority = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class Insight(BaseModel):
    id: str
    insightType: InsightType
    title: str
    summary: str
    recommendation: str
    priority: Priority
    status: str = "NEW"
    generatedBy: str = "PYTHON_RULES_V1"
    source: str


class PlatformSnapshot(BaseModel):
    users: List[Dict[str, Any]] = Field(default_factory=list)
    courses: List[Dict[str, Any]] = Field(default_factory=list)
    studentProgress: List[Dict[str, Any]] = Field(default_factory=list)
    payments: List[Dict[str, Any]] = Field(default_factory=list)
    certificates: List[Dict[str, Any]] = Field(default_factory=list)
    submissions: List[Dict[str, Any]] = Field(default_factory=list)


class InsightResponse(BaseModel):
    insights: List[Insight]


class SummaryResponse(BaseModel):
    summary: Optional[Insight]
    counts: Dict[str, int]
