import requests, random

url = "http://127.0.0.1:8000/metrics"

for _ in range(100): 
    requests.post(url, json={
        "cpu": random.uniform(10,100),
        "gpu": random.uniform(5,50),
        "inbound": random.uniform(50,200),
        "outbound": random.uniform(50,800),
        "users": random.randint(80,200),
        "processes": random.randint(100,300)
    })

print("Finished sending 100 records")
