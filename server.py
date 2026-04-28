from flask import Flask, request, jsonify, send_from_directory, send_file
import pandas as pd
from io import BytesIO

app = Flask(__name__, static_folder="app", static_url_path="")

PRICING_DATA = []
LAST_RESULTS = []

@app.route("/")
def index():
    return send_from_directory("app", "index.html")

@app.route("/upload_pricing", methods=["POST"])
def upload_pricing():
    global PRICING_DATA
    file = request.files["file"]
    xls = pd.ExcelFile(file)

    data = []

    for sheet in xls.sheet_names:
        df = xls.parse(sheet)

        for i in range(2, len(df)):
            try:
                amd = str(df.iloc[i, 0]).strip()
                intel = str(df.iloc[i, 1]).strip()

                price_amd = float(df.iloc[i, 6])
                price_intel = float(df.iloc[i, 7])

                if amd == "nan" or intel == "nan":
                    continue

                data.append({
                    "cloud": sheet.lower(),
                    "amd": amd,
                    "intel": intel,
                    "price_amd": price_amd,
                    "price_intel": price_intel
                })
            except:
                continue

    PRICING_DATA = data
    return jsonify({"count": len(data)})

@app.route("/analyze", methods=["POST"])
def analyze():
    global LAST_RESULTS
    usage = request.json["usage"]

    results = []
    total_current = 0
    total_amd = 0

    for row in usage:
        inst = row["instance"]
        qty = row["qty"]

        match = next((x for x in PRICING_DATA if x["intel"] == inst), None)

        if not match:
            results.append({
                "instance": inst,
                "qty": qty,
                "amd": "N/A",
                "current": 0,
                "amd_cost": 0,
                "savings": 0,
                "savings_pct": 0
            })
            continue

        current = match["price_intel"] * 730 * qty
        amd = match["price_amd"] * 730 * qty
        savings = current - amd
        pct = (savings / current) if current else 0

        total_current += current
        total_amd += amd

        results.append({
            "instance": inst,
            "qty": qty,
            "amd": match["amd"],
            "current": round(current, 2),
            "amd_cost": round(amd, 2),
            "savings": round(savings, 2),
            "savings_pct": round(pct * 100, 2)
        })

    LAST_RESULTS = results

    return jsonify({
        "results": results,
        "total_current": round(total_current, 2),
        "total_amd": round(total_amd, 2),
        "savings": round(total_current - total_amd, 2)
    })

@app.route("/export")
def export():
    if not LAST_RESULTS:
        return "No data", 400

    df = pd.DataFrame(LAST_RESULTS)

    output = BytesIO()
    df.to_excel(output, index=False)

    output.seek(0)
    return send_file(output, download_name="amd_savings_report.xlsx", as_attachment=True)

if __name__ == "__main__":
    app.run(port=5000)