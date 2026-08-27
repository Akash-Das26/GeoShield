from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Optional
import os
import uuid
from app.database import get_db
from app.models import CitizenReport, RoadStatus, Village

router = APIRouter(prefix="/api", tags=["reports"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---- Citizen Reports ----

@router.post("/reports")
async def create_report(
    report_type: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    reporter_name: Optional[str] = Form(None),
    reporter_phone: Optional[str] = Form(None),
    reporter_language: str = Form("en"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    if image:
        ext = os.path.splitext(image.filename)[1] if image.filename else ".jpg"
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            content = await image.read()
            f.write(content)
        image_path = filename

    report = CitizenReport(
        report_type=report_type,
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_path=image_path,
        reporter_name=reporter_name,
        reporter_phone=reporter_phone,
        reporter_language=reporter_language,
        status="pending",
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "status": "success",
        "message": "Report submitted successfully. Thank you for your contribution!",
        "report_id": report.id,
    }


@router.get("/reports")
def get_reports(
    status: str = None,
    report_type: str = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(CitizenReport)
    if status:
        query = query.filter(CitizenReport.status == status)
    if report_type:
        query = query.filter(CitizenReport.report_type == report_type)

    reports = query.order_by(desc(CitizenReport.created_at)).limit(limit).all()

    return [{
        "id": r.id,
        "report_type": r.report_type,
        "description": r.description,
        "latitude": r.latitude,
        "longitude": r.longitude,
        "image_path": r.image_path,
        "reporter_name": r.reporter_name,
        "reporter_language": r.reporter_language,
        "status": r.status,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    } for r in reports]


@router.put("/reports/{report_id}/verify")
def verify_report(report_id: int, verified_by: str = "Admin", db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = "verified"
    report.verified_by = verified_by
    db.commit()
    return {"message": "Report verified", "id": report_id}


# ---- Road Status ----

@router.get("/roads")
def get_roads(db: Session = Depends(get_db)):
    roads = db.query(RoadStatus).all()
    return [{
        "id": r.id,
        "road_name": r.road_name,
        "road_type": r.road_type,
        "start_lat": r.start_lat,
        "start_lng": r.start_lng,
        "end_lat": r.end_lat,
        "end_lng": r.end_lng,
        "status": r.status,
        "blockage_reason": r.blockage_reason,
        "alternative_route": r.alternative_route,
        "updated_at": r.updated_at.isoformat() if r.updated_at else None,
    } for r in roads]


# ---- Villages ----

@router.get("/villages")
def get_villages(
    risk_zone: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Village)
    if risk_zone:
        query = query.filter(Village.risk_zone == risk_zone)

    villages = query.all()
    return [{
        "id": v.id,
        "name": v.name,
        "state": v.state,
        "district": v.district,
        "latitude": v.latitude,
        "longitude": v.longitude,
        "population": v.population,
        "risk_zone": v.risk_zone,
        "nearest_hospital_km": v.nearest_hospital_km,
        "nearest_police_km": v.nearest_police_km,
    } for v in villages]
