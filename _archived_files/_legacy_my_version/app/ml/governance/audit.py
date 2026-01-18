def generate_audit_log(ml_score, factual_count, hype_count):
    """
    Generates human-readable credibility change log.
    """

    logs = []

    logs.append(f"+{round(ml_score * 0.6, 1)} points from ML confidence")

    if factual_count > 0:
        logs.append(f"+{factual_count * 5} points from factual indicators")

    if hype_count > 0:
        logs.append(f"-{hype_count * 7} points due to emotional language")

    return logs
