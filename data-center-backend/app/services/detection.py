import time
from app.services import telemetry, impact, reports
from app.models import model

incident = {
    "status": "normal",
    "deadline": None
}



def analyze():
    global incident

    cpu = list(telemetry.cpu_window)[-30:]
    net_in = list(telemetry.network_in_window)[-30:]
    net_out = list(telemetry.network_out_window)[-30:]

    if len(cpu) < 30:
        return

    prediction = model.predict(cpu, net_in, net_out)

    if prediction["anomaly"] and incident["status"] == "normal":
        now = int(time.time())
        incident = {
            "status": "active",
            "type": prediction["attack_type"],
            "confidence": prediction["confidence"],
            "reason": prediction["explanation"],
            "started_at": int(time.time()),
            "deadline": now + 45
        }

    if not prediction["anomaly"] and incident["status"] == "active":
        incident = {"status": "normal"}

def check_timeout():
    global incident
    import time

    if incident.get("status") != "active":
        return

    if time.time() >= incident["deadline"]:
        contain("auto_containment")


def contain(method: str):
    global incident
    import time
    from app.services import telemetry

    if incident["status"] != "active":
        return None

    duration = int(time.time()) - incident["started_at"]

    telemetry.stop_attack()

    metrics = impact.calculate(duration)

    report = {
        "timestamp": int(time.time()),
        "threat": incident.get("type", "unknown"),
        "duration": duration,
        "energy_loss": metrics["energy_wasted"],
        "action": method,
        "status": "Contained"
    }

    reports.add(report)

    incident = {
        "status": "contained",
        "method": method,
        "contained_at": int(time.time()),
        "duration": duration
    }

    return incident
