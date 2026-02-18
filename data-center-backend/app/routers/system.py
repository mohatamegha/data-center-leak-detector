from fastapi import APIRouter
from app.services import telemetry

router = APIRouter(prefix="/api/system", tags=["System"])


@router.get("/live")
def get_live_metrics():
    return telemetry.get_live_metrics()


@router.get("/history")
def get_history(seconds: int = 60):
    return telemetry.get_history(seconds)
