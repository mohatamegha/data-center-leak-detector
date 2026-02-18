from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from collections import deque

# ================= CREATE APP =================

app = FastAPI(title="Metrics Receiver API")

# ================= DATA MODEL =================

class Metrics(BaseModel):
    cpu: float
    gpu: float
    inbound: float
    outbound: float
    users: int
    processes: int

# ================= QUEUE STORAGE =================

# stores last 1000 incoming metrics
metrics_queue = deque(maxlen=1000)

# ================= POST ENDPOINT =================

@app.post("/metrics")
def receive_metrics(data: Metrics):

    metric = {
        "timestamp": datetime.now().isoformat(),
        "cpu": data.cpu,
        "gpu": data.gpu,
        "inbound": data.inbound,
        "outbound": data.outbound,
        "users": data.users,
        "processes": data.processes
    }

    metrics_queue.append(metric)

    return {
        "status": "received",
        "queue_size": len(metrics_queue)
    }

# ================= GET NEXT METRIC =================

@app.get("/latest")
def get_latest():

    if metrics_queue:
        return metrics_queue.popleft()  # returns oldest unprocessed metric
    else:
        return None

# ================= STATUS ENDPOINT =================

@app.get("/")
def root():
    return {
        "message": "Metrics API Running",
        "queue_size": len(metrics_queue)
    }
