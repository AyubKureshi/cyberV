from fastapi import APIRouter
from app.models.schemas import InfoRequest
from app.services.info_gathering import gather_info

router = APIRouter()

@router.post("/")
async def info(req: InfoRequest):
    return gather_info(req.domain)