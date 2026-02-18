from fastapi import FastAPI
from app.routers import system,incident,reports
from app.services import telemetry
from app.services import detection

import asyncio

app = FastAPI(title="DataCenter Leak Detector API")

app.include_router(system.router)
app.include_router(incident.router)
app.include_router(reports.router)
# https://github.com/mohatamegha/data-center-leak-detector



@app.on_event("startup")
async def start_background_tasks():
    async def telemetry_loop():
        while True:
            telemetry.tick()
            await asyncio.sleep(2)

    async def detection_loop():
        while True:
            detection.analyze()
            detection.check_timeout()
            await asyncio.sleep(1)

    asyncio.create_task(telemetry_loop())
    asyncio.create_task(detection_loop())



@app.get("/")
def root():
    return {"message": "Backend running"}
