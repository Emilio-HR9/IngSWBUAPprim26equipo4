from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from bs4 import BeautifulSoup
import os

app = Flask(__name__)
CORS(app)

@app.route('/upload-asistencia', methods=['POST'])
def upload_asistencia():
    file = request.files['file']
    # Lectura automática de HTML (Citas/Asistencias)
    tablas = pd.read_html(file)
    datos = tablas[0].to_dict(orient='records')
    return jsonify({"status": "Integrado", "datos": datos})

@app.route('/upload-evaluacion', methods=['POST'])
def upload_evaluacion():
    file = request.files['file']
    # Lectura automática de Excel (Biometría/Progreso)
    df = pd.read_excel(file)
    datos = df.to_dict(orient='records')
    return jsonify({"status": "Integrado", "datos": datos})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
