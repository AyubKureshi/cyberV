from fastapi import APIRouter
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.ai_analyzer import analyze_website

router = APIRouter()

@router.post("/")
async def analyze(req: AnalyzeRequest):
    result = analyze_website(req.url)
    return result