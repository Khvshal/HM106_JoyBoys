def calculate_weighted_vote(user_score, vote):
    """
    vote = +1 (credible) or -1 (not credible)
    user_score = 0–100
    """

    weight = user_score / 100
    return vote * weight
