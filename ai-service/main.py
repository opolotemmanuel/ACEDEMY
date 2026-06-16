from fastapi import FastAPI

from app.routes.analytics import router as analytics_router
from app.routes.insights import router as insights_router
from app.routes.marking import router as marking_router

app = FastAPI(
    title="AQODH Academy AI Service",
    version="1.0.0",
    description="Advisory-only AI and analytics service for AQODH Academy.",
)


@app.get("/health")
def health():
    return {"ok": True, "service": "aqodh-ai-service"}


app.include_router(insights_router)
app.include_router(marking_router)
app.include_router(analytics_router)
