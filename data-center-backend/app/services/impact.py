# simple constants (approx datacenter numbers)
CPU_WATT_PER_PERCENT = 2.5      # watts per % cpu
CARBON_PER_KWH = 0.475          # kg CO2 per kWh
COST_PER_KWH = 8                # ₹ per kWh


def calculate(duration_seconds, avg_cpu=85):
    hours = duration_seconds / 3600

    power_watts = avg_cpu * CPU_WATT_PER_PERCENT
    energy_kwh = (power_watts * hours) / 1000

    carbon = energy_kwh * CARBON_PER_KWH
    cost = energy_kwh * COST_PER_KWH

    return {
        "energy_wasted": round(energy_kwh, 2),
        "carbon_emitted": round(carbon, 2),
        "cost_leakage": round(cost, 2),
    }
