def predict(cpu_window, net_in_window, net_out_window):
    """
    Fake ML model.
    Input: time series windows
    Output: classification + confidence
    """

    avg_cpu = sum(cpu_window) / len(cpu_window)
    avg_in = sum(net_in_window) / len(net_in_window)
    avg_out = sum(net_out_window) / len(net_out_window)

    # feature engineering
    outbound_ratio = avg_out / (avg_in + 0.01)

    # pretend ML decision boundary
    if avg_cpu > 70 and outbound_ratio > 2:
        return {
            "anomaly": True,
            "attack_type": "crypto_mining",
            "confidence": 0.92,
            "explanation": "High sustained CPU with outbound dominant traffic"
        }

    return {
        "anomaly": False
    }
