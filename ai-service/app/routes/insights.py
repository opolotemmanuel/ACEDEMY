from fastapi import APIRouter

from app.schemas.insight_schema import Insight, InsightResponse, PlatformSnapshot, SummaryResponse
from app.services.course_performance import likely_difficult_module
from app.services.payment_risk import pending_payments
from app.services.student_risk import risky_students

router = APIRouter(prefix="/ai", tags=["insights"])


def build_insights(payload: PlatformSnapshot) -> list[Insight]:
    payments = pending_payments(payload.payments)
    risky = risky_students(payload.studentProgress)
    difficult_module = likely_difficult_module(payload.courses)
    pass_mark = 60
    if payload.courses:
        pass_mark = payload.courses[0].get("minimumCertificatePassMark", pass_mark)
    certificate_ready = [
        record
        for record in payload.studentProgress
        if float(record.get("progressPercent") or 0) >= 100
        and float(record.get("finalGrade") or 0) >= pass_mark
    ]
    pending_certificates = [
        certificate for certificate in payload.certificates if certificate.get("status") == "PENDING"
    ]

    return [
        Insight(
            id="ai_system_summary",
            insightType="SYSTEM_SUMMARY",
            title="Daily System Summary",
            summary=f"{len(payload.users)} users, {len(payload.studentProgress)} progress records, {len(payments)} payment issue, and {len(pending_certificates)} pending certificate approval.",
            recommendation="Review high-priority queues manually before taking any administrative action.",
            priority="HIGH" if payments or risky else "MEDIUM",
            source="users, studentProgress, payments, certificates",
        ),
        Insight(
            id="ai_student_risk",
            insightType="STUDENT_RISK",
            title="Student Risk Pattern",
            summary=f"{len(risky)} enrolled learner record is below 30% progress.",
            recommendation="Instructor should review learner progress and contact students manually where appropriate.",
            priority="HIGH" if risky else "LOW",
            source="studentProgress.progressPercent",
        ),
        Insight(
            id="ai_course_performance",
            insightType="COURSE_PERFORMANCE",
            title="Course Performance Pattern",
            summary=f"{(difficult_module or {}).get('title', 'Module review')} is a likely complexity point for learners.",
            recommendation="Consider adding simpler notes or a short explainer video for difficult concepts.",
            priority="MEDIUM",
            source="courses.modules",
        ),
        Insight(
            id="ai_payment_risk",
            insightType="PAYMENT_RISK",
            title="Payment Risk",
            summary=f"{len(payments)} payment record may block course or certificate access.",
            recommendation="Admin should review pending balances and send manual reminders if appropriate.",
            priority="HIGH" if payments else "LOW",
            source="payments.status",
        ),
        Insight(
            id="ai_certificate_readiness",
            insightType="CERTIFICATE_READINESS",
            title="Certificate Readiness",
            summary=f"{len(certificate_ready)} learner progress record meets completion and grade rules.",
            recommendation="Review certificate eligibility manually. Do not issue certificates automatically.",
            priority="HIGH" if certificate_ready else "LOW",
            source="studentProgress.progressPercent, studentProgress.finalGrade, courses.minimumCertificatePassMark",
        ),
        Insight(
            id="ai_instructor_activity",
            insightType="INSTRUCTOR_ACTIVITY",
            title="Instructor Activity",
            summary=f"{len(payload.submissions)} submission record is available for review analytics.",
            recommendation="Use instructor reports to manually confirm review time and content updates.",
            priority="MEDIUM",
            source="submissions, lessons, announcements",
        ),
    ]


@router.post("/system-summary", response_model=SummaryResponse)
def system_summary(payload: PlatformSnapshot):
    insights = build_insights(payload)
    summary = next((insight for insight in insights if insight.insightType == "SYSTEM_SUMMARY"), None)
    return {"summary": summary, "counts": {"total": len(insights), "new": len(insights)}}


@router.post("/student-risk", response_model=InsightResponse)
def student_risk(payload: PlatformSnapshot):
    return {"insights": [insight for insight in build_insights(payload) if insight.insightType == "STUDENT_RISK"]}


@router.post("/course-performance", response_model=InsightResponse)
def course_performance(payload: PlatformSnapshot):
    return {"insights": [insight for insight in build_insights(payload) if insight.insightType == "COURSE_PERFORMANCE"]}


@router.post("/payment-risk", response_model=InsightResponse)
def payment_risk(payload: PlatformSnapshot):
    return {"insights": [insight for insight in build_insights(payload) if insight.insightType == "PAYMENT_RISK"]}


@router.post("/certificate-readiness", response_model=InsightResponse)
def certificate_readiness(payload: PlatformSnapshot):
    return {"insights": [insight for insight in build_insights(payload) if insight.insightType == "CERTIFICATE_READINESS"]}


@router.post("/insights", response_model=InsightResponse)
def all_insights(payload: PlatformSnapshot):
    return {"insights": build_insights(payload)}
