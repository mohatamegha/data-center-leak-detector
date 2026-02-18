import random
import time
from collections import deque

# stores last 120 readings (~4 minutes if 2s interval)
cpu_window = deque(maxlen=120)
network_in_window = deque(maxlen=120)
network_out_window = deque(maxlen=120)
process_window = deque(maxlen=120)

latest_metrics = {}

attack_mode = False
attack_started_at = None


NORMAL_PROCESSES = [
    "nginx_worker",
    "postgres_db",
    "redis_cache",
    "node_app",
    "backup_service",
    "metrics_collector",
    "ssh_session",
]

SUSPICIOUS_PROCESSES = [
    "xmrig_miner",
    "crypto_pool_worker",
    "unknown_binary",
]


def random_normal_processes():
    count = random.randint(3, 6)
    procs = []
    for _ in range(count):
        name = random.choice(NORMAL_PROCESSES)
        procs.append({
            "pid": random.randint(1000, 5000),
            "name": name,
            "cpu": round(random.uniform(0.1, 6), 2),
            "mem": random.randint(50, 400)
        })
    return procs


def random_attack_processes():
    procs = random_normal_processes()

    # persistent malicious process
    procs.append({
        "pid": 6666,
        "name": random.choice(SUSPICIOUS_PROCESSES),
        "cpu": round(random.uniform(60, 85), 2),
        "mem": random.randint(1500, 3000)
    })

    return procs



def generate_normal_metrics():
    return {
        "cpu": round(random.uniform(10, 30), 2),
        "network_in": round(random.uniform(20, 60), 2),
        "network_out": round(random.uniform(20, 60), 2),
        "processes": random_normal_processes()
    }


def generate_attack_metrics():
    return {
        "cpu": round(random.uniform(75, 95), 2),
        "network_in": round(random.uniform(2, 10), 2),
        "network_out": round(random.uniform(60, 120), 2),
        "processes": random_attack_processes()
    }


def tick():
    global latest_metrics, attack_mode

    # randomly trigger attack every ~40 ticks
    if not attack_mode and random.random() < 0.02:
        attack_mode = True

    if attack_mode:
        metrics = generate_attack_metrics()
    else:
        metrics = generate_normal_metrics()

    latest_metrics = metrics

    cpu_window.append(metrics["cpu"])
    network_in_window.append(metrics["network_in"])
    network_out_window.append(metrics["network_out"])
    process_window.append(len(metrics["processes"]))


def get_live_metrics():
    return latest_metrics


def get_history(seconds: int):
    points = min(seconds // 2, len(cpu_window))
    return {
        "cpu": list(cpu_window)[-points:],
        "network": list(network_out_window)[-points:]
    }

def stop_attack():
    global attack_mode
    attack_mode = False

