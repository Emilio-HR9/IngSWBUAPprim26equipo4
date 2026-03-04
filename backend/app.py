from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "API de Terapia de Rehabilitación funcionando"}

@app.route("/ejercicio")
def ejercicio():
    return {
        "nombre": "Elevación de pierna",
        "series": 3,
        "repeticiones": 10,
        "descanso": 30
    }

if __name__ == "__main__":
    app.run(debug=True)
