import pandas as pd
import numpy as np
import random
import time
from datetime import datetime, timedelta
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
import matplotlib.pyplot as plt
import requests

# ================= DATAFRAMES =================

metrics_df2 = pd.DataFrame(columns=[
    "timestamp","cpu","gpu","inbound","outbound","users","processes"
])

profile_df = pd.DataFrame(columns=[
    "hour","cpu","inbound","outbound","users"
])

incidents_df = pd.DataFrame(columns=[
    "id","start_time","status","action"
])

impact_df = pd.DataFrame(columns=[
    "incident_id","energy","carbon","cost","duration"
])

incident_counter = 1
attack_active = False
attack_start_time = None
current_attack_id = None

# ================= STORE LIVE DATA =================

def store_row2(timestamp,cpu,gpu,inb,outb,users,proc):

    global metrics_df2

    if len(metrics_df2) > 500:
      metrics_df2.drop(index=metrics_df2.index[0], inplace=True)

    metrics_df2.loc[len(metrics_df2)] = {
        "timestamp": pd.to_datetime(timestamp, errors="coerce"),
        "cpu":cpu,
        "gpu":gpu,
        "inbound":inb,
        "outbound":outb,
        "users":users,
        "processes":proc
    }

# ================= TRAIN MODEL =================

def train_model():

    X = metrics_df[["cpu","inbound","outbound","users"]]
    y = metrics_df["attack"]

    # split both X and y
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.3,
        random_state=42
    )

    # train only on normal data from training set
    X_train_normal = X_train[y_train == 0]

    model = IsolationForest(contamination=0.1, random_state=42)

    model.fit(X_train_normal)

    return model, X_test, y_test

# ================= ACCURACY =================

def calculate_accuracy(model, X_test, y_test):

    # model prediction on TEST DATA only
    y_pred = model.predict(X_test)

    # convert IsolationForest output
    # -1 = anomaly → 1
    #  1 = normal  → 0
    y_pred = [1 if p == -1 else 0 for p in y_pred]

    # true labels
    y_true = y_test.values

    # metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)

    print("\n===== MODEL PERFORMANCE (TEST DATA) =====")

    print("Accuracy :", round(accuracy*100,2), "%")
    print("Precision:", round(precision*100,2), "%")
    print("Recall   :", round(recall*100,2), "%")

# ================= DETECT INCIDENT =================

def detect_incident(row, model):

    global incidents_df, incident_counter
    global attack_active, attack_start_time
    global current_attack_id, current_attack_type

    features = pd.DataFrame([[
    row["cpu"],
    row["inbound"],
    row["outbound"],
    row["users"]
]], columns=["cpu","inbound","outbound","users"])

    y_pred = model.predict(features)

    # ---------- ATTACK ----------
    if y_pred[0] == -1:

        print(f"🚨 ATTACK → CPU:{row['cpu']:.1f}% | USERS:{row['users']}")

        if not attack_active:

            attack_active = True
            attack_start_time = row["timestamp"]
            current_attack_id = incident_counter

            print("⚠ ATTACK SESSION STARTED")

            incident = {
                "id":incident_counter,
                "start_time":attack_start_time,
                "status":"ongoing",
                "action":"monitoring"
            }

            incidents_df.loc[len(incidents_df)] = incident
            incident_counter += 1

    # ---------- NORMAL ----------
    else:
        if attack_active:
            end_attack(row["timestamp"])

# ================= END ATTACK =================

def end_attack(end_time):

    global attack_active, attack_start_time
    global current_attack_id, current_attack_type
    global incidents_df, impact_df

    duration = (end_time - attack_start_time).total_seconds() / 3600

    energy = duration * 0.2
    carbon = energy * 0.8
    cost = energy * 8

    print(f"✅ ATTACK ENDED ")
    print(f"Duration: {duration:.2f} hrs\n")

    incidents_df.loc[incidents_df["id"]==current_attack_id,"status"]="contained"
    incidents_df.loc[incidents_df["id"]==current_attack_id,"action"]="auto_stopped"

    report = {
        "incident_id":current_attack_id,
        "energy":energy,
        "carbon":carbon,
        "cost":cost,
        "duration":duration
    }

    impact_df.loc[len(impact_df)] = report

    attack_active = False
    attack_start_time = None
    current_attack_id = None
    current_attack_type = None

import matplotlib.dates as mdates

def plot_metrics_subplots(df, title="System Metrics Dashboard"):

    if df.empty:
        print("No data to plot.")
        return

    fig, axes = plt.subplots(4, 1, sharex=True, figsize=(12,9))
    fig.suptitle(title, fontsize=16, fontweight="bold")

    # CPU
    axes[0].plot(df["timestamp"], df["cpu"])
    axes[0].set_ylabel("CPU %")
    axes[0].set_title("CPU Usage")
    axes[0].grid(True)

    # GPU
    axes[1].plot(df["timestamp"], df["gpu"])
    axes[1].set_ylabel("GPU %")
    axes[1].set_title("GPU Usage")
    axes[1].grid(True)

    # Inbound
    axes[2].plot(df["timestamp"], df["inbound"])
    axes[2].set_ylabel("Inbound")
    axes[2].set_title("Inbound Traffic")
    axes[2].grid(True)

    # Outbound
    axes[3].plot(df["timestamp"], df["outbound"])
    axes[3].set_ylabel("Outbound")
    axes[3].set_title("Outbound Traffic")
    axes[3].grid(True)

    # ---------- CLEAN TIME AXIS ----------
    locator = mdates.AutoDateLocator()
    formatter = mdates.DateFormatter('%H:%M')

    axes[3].xaxis.set_major_locator(locator)
    axes[3].xaxis.set_major_formatter(formatter)

    plt.setp(axes[3].xaxis.get_majorticklabels(), rotation=0)

    # remove extra borders
    for ax in axes:
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)

    axes[3].set_xlabel("Time")

    plt.tight_layout(rect=[0,0,1,0.96])
    plt.show()

def collect_live(model):

    try:
        response = requests.get("http://127.0.0.1:8000/latest", timeout=2)

        if response.status_code != 200:
            print("API error")
            return

        data = response.json()

        if data is None:
            print("Waiting for API data...")
            return

        store_row2(
            data["timestamp"],
            data["cpu"],
            data["gpu"],
            data["inbound"],
            data["outbound"],
            data["users"],
            data["processes"]
        )

        detect_incident(metrics_df2.iloc[-1], model)

        print(f"Live CPU:{data['cpu']:.1f}% | Users:{data['users']}")

    except Exception as e:
        print("API not reachable:", e)

# ================= START SYSTEM =================

metrics_df = pd.read_csv("training_data.csv", parse_dates=["timestamp"])

print("\nSystem Starting...\n")
print("Detecting Attacks...\n")

model, X_test, y_test = train_model()
calculate_accuracy(model, X_test, y_test)

print("\nLive monitoring started...\n")

try:
    while True:
        collect_live(model)
        time.sleep(2)
except KeyboardInterrupt:
    print("\nStopped monitoring.")

# ================= REPORT =================

print("\n" + "="*110)
print("ATTACK HISTORY FOR THE DAY".center(110))
print("="*110)

if incidents_df.empty:
    print("No attacks detected today.\n")
else:
    print(incidents_df.to_string(index=False))

print("\n" + "="*110)
print("IMPACT HISTORY FOR THE DAY".center(110))
print("="*110)

if impact_df.empty:
    print("No impact recorded.\n")
else:
    print(impact_df.to_string(index=False))
plot_metrics_subplots(metrics_df2, "Live Monitoring Metrics")

