from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
from app.services.report_generator import generate_report

router = APIRouter()

# Define the expected request body
class ReportRequest(BaseModel):
    scan_data: Any

@router.post("/generate-report")
async def create_report(req: ReportRequest):
    try:
        # Pass the scan data to your AI service
        report_text = generate_report(req.scan_data)
        
        if report_text == "Failed to generate report":
            raise HTTPException(status_code=500, detail="AI generation failed")
            
        return {"report": report_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))