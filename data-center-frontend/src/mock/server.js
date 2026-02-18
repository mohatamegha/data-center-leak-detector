let startTime = Date.now();

function rand(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function isAttackTime() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const cycle = elapsed % 180; // 3 min cycle
  return cycle >= 120 && cycle <= 165; // attack lasts 45 sec
}

export async function getLiveMetrics() {
  const attack = isAttackTime();

  return {
    timestamp: Date.now(),
    cpu: attack ? rand(75, 98) : rand(5, 40),
    gpu: rand(0, 20),
    memory: rand(20, 70),
    network_in: attack ? rand(5, 20) : rand(20, 60),
    network_out: attack ? rand(60, 120) : rand(20, 60),
    processes: attack
      ? [
          { pid: 1042, name: "nginx_worker", cpu: 2.1, mem: 128 },
          { pid: 1187, name: "postgres_db", cpu: 4.3, mem: 512 },
          { pid: 6666, name: "xmrig_miner", cpu: 88, mem: 2100 }
        ]
      : [
          { pid: 1042, name: "nginx_worker", cpu: 2.1, mem: 128 },
          { pid: 1187, name: "postgres_db", cpu: 4.3, mem: 512 }
        ]
  };
}

export async function getIncident() {
  const attack = isAttackTime();

  if (!attack) return { status: "normal" };

  const elapsed = Math.floor((Date.now() - startTime) / 1000) % 180;
  const remaining = 165 - elapsed;

  return {
    status: "active",
    type: "crypto_mining",
    confidence: 0.92,
    reason: "Sustained high CPU & outbound traffic",
    auto_containment_in: remaining
  };
}
