from fastapi import APIRouter
from app.services import detection

router = APIRouter(prefix="/api/incident", tags=["Incident"])


@router.get("")
def get_incident():
    return detection.incident


@router.post("/kill")
def kill_process():
    result = detection.contain("kill_process")
    return result or {"message": "no active incident"}


@router.post("/quarantine")
def quarantine():
    result = detection.contain("quarantine")
    return result or {"message": "no active incident"}