# Data Center Leak Detector

An intelligent backend system that monitors data center metrics in real-time and detects potential crypto-mining and resource-misuse attacks using Machine Learning and FastAPI.

---

## Overview

Data centers consume massive computational power and energy. Unauthorized processes such as crypto-mining malware can silently exploit system resources, leading to:

* Increased CPU and GPU usage
* Abnormal outbound network traffic
* Energy waste and carbon emissions
* Financial losses

This project detects such anomalies in real-time, generates incident reports, and estimates environmental and financial impact.

---

## Key Features

* Real-time system metrics monitoring
* Machine Learning based anomaly detection (Isolation Forest)
* FastAPI backend with REST endpoints
* Incident detection and automatic containment
* Energy, carbon, and cost impact estimation
* Historical incident reporting
* Live metrics ingestion via API

---

## Tech Stack

**Backend Framework**

* FastAPI

**Machine Learning**

* Scikit-learn (Isolation Forest)

**Data Processing**

* Pandas
* NumPy

**Visualization**

* Matplotlib

**Other Tools**

* Python
* REST API
* GitHub

---

## Project Structure

```
data-center-leak-detector/

app/
│
├── main.py
│
├── models/
│   ├── model.py
│   └── isolation_model.py
│
├── routers/
│   ├── system.py
│   ├── incident.py
│   └── reports.py
│
├── services/
│   ├── telemetry.py
│   ├── detection.py
│   ├── impact.py
│   └── reports.py
│
├── api/
│   └── metrics_receiver.py
│
scripts/
│   └── send_metrics.py

data/
│   └── training_data.csv

requirements.txt
README.md
```

---

## How It Works

1. System metrics are received via API or simulated using telemetry.

2. Metrics include:

   * CPU usage
   * GPU usage
   * Network inbound traffic
   * Network outbound traffic
   * Active users
   * Running processes

3. Machine Learning model analyzes metrics.

4. If anomaly is detected:

   * Incident is created
   * Impact is calculated
   * Report is stored

5. Frontend or API can access live status and reports.

---

## API Endpoints

### Receive Metrics

POST `/metrics`

---

### Get Latest Metric

GET `/latest`

---

### Get Incident Status

GET `/api/incident`

---

### Get Reports

GET `/api/reports`

---

## Machine Learning Model

Isolation Forest is used for anomaly detection.

Features used:

* CPU usage
* Network inbound traffic
* Network outbound traffic
* Number of users

Model is trained on normal system behavior and detects deviations.

---

## Impact Calculation

The system estimates:

* Energy wasted (kWh)
* Carbon emissions (kg CO₂)
* Financial cost (₹)

---

## How to Run

### Step 1: Install dependencies

```
pip install -r requirements.txt
```

---

### Step 2: Start FastAPI server

```
uvicorn app.main:app --reload
```

---

### Step 3: Send test metrics

```
python scripts/send_metrics.py
```

---

## Sample Use Case

Crypto-mining malware increases CPU usage and outbound traffic.

System detects anomaly and generates:

* Incident alert
* Impact report
* Containment action

---

## Future Improvements

* Real production deployment
* Frontend dashboard integration
* Real hardware metrics integration
* Advanced ML models

---

## Author

Backend and Machine Learning Implementation

---

## License

This project is developed for academic and educational purposes.

---

## Status

Active Development
