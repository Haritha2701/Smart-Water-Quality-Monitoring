def predict_wqi(row):
    wqi = (
        row['ph'] * 0.2 +
        row['turbidity'] * 0.2 +
        row['tds'] * 0.2 +
        row['do'] * 0.2 +
        row['nitrate'] * 0.2
    )

    explanation = {
        "ph": round(row['ph'] * 0.2, 2),
        "turbidity": round(row['turbidity'] * 0.2, 2),
        "tds": round(row['tds'] * 0.2, 2),
        "do": round(row['do'] * 0.2, 2),
        "nitrate": round(row['nitrate'] * 0.2, 2)
    }

    return round(wqi, 2), explanation