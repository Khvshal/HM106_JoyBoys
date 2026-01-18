def calculate_factual_score(factual_sentences):
    count = len(factual_sentences)

    if count == 0:
        return 0
    elif count <= 2:
        return 40
    else:
        return 70


def calculate_hype_penalty(hype_sentences):
    count = len(hype_sentences)

    if count == 0:
        return 0
    elif count == 1:
        return 30
    else:
        return 60


def final_credibility_score(ml_score, factual_sentences, hype_sentences):
    factual_score = calculate_factual_score(factual_sentences)
    hype_penalty = calculate_hype_penalty(hype_sentences)

    final_score = (
        (ml_score * 0.6)
        + (factual_score * 0.25)
        - (hype_penalty * 0.15)
    )

    # clamp between 0–100
    final_score = max(0, min(100, round(final_score, 2)))

    return final_score
