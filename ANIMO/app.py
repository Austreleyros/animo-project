from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)

# temporary in-memory lists
temp_journals = []
temp_quizzes = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/journal', methods=['POST'])
def save_journal():
    data = request.json
    temp_journals.append({
        "username": data.get('username', 'Anonymous'),
        "text": data.get('text'),
        "image": data.get('image'), # stores the drawing
        "date": datetime.now().strftime("%B %d, %Y - %I:%M %p")
    })
    return jsonify({"status": "success", "message": "Journal received securely."}), 201

@app.route('/api/journal', methods=['GET'])
def get_journals():
    username = request.args.get('username', 'Anonymous User')
    user_journals = [j for j in temp_journals if j['username'] == username]
    return jsonify(user_journals), 200

@app.route('/api/quiz', methods=['POST'])
def save_quiz():
    data = request.json
    temp_quizzes.append({
        "username": data.get('username', 'Anonymous'),
        "score": data.get('score'),
        "recommendation": data.get('recommendation')
    })
    return jsonify({"status": "success", "message": "Quiz compiled."}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
