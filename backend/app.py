from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import random
from datetime import datetime, timedelta
from model import predict_wqi
from blockchain import Blockchain

app = Flask(__name__)
CORS(app)

blockchain = Blockchain()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data')
def get_data():
    df = pd.read_csv('data.csv')

    results = []
    safe_count = 0
    moderate_count = 0
    danger_count = 0

    for _, row in df.iterrows():

        prediction, _ = predict_wqi(row)

        block = blockchain.add_block({
            "data": row.to_dict(),
            "prediction": prediction
        })

        # Alert levels
        if prediction < 60:
            alert = "Safe Water ✅"
            safe_count += 1
        elif prediction < 80:
            alert = "Moderate ⚠️"
            moderate_count += 1
        else:
            alert = "Highly Polluted ❌"
            danger_count += 1

        # 7-day prediction
        future = []
        for i in range(7):
            future.append({
                "day": (datetime.now() + timedelta(days=i)).strftime("%A"),
                "value": round(prediction + random.uniform(-5, 5), 2)
            })

        results.append({
            "village": row["village"],
            "district": row["district"],
            "prediction": prediction,
            "alert": alert,
            "block_id": f"WQ-{block['index']}",
            "future": future
        })

    summary = {
        "total": len(results),
        "safe": safe_count,
        "moderate": moderate_count,
        "danger": danger_count
    }

    return jsonify({"data": results, "summary": summary})

if __name__ == '__main__':
    app.run(debug=True)