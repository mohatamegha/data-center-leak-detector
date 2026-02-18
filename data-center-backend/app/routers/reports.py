from fastapi import APIRouter
from app.services import reports

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("")
def get_reports():
    return reports.get_all()
