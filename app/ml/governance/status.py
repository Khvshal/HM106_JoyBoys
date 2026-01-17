def determine_status(final_score, spike_detected=False):
    """
    Determines credibility state of an article.
    """

    if spike_detected:
        return "Under Review"

    if final_score >= 70:
        return "Widely Corroborated"
    elif final_score < 40:
        return "High Risk / Contested"
    else:
        return "Under Review"
