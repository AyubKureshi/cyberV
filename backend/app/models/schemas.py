from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    risk: str
    summary: str
    issues: List[str]
    recommendations: List[str]


class InfoRequest(BaseModel):
    domain: str