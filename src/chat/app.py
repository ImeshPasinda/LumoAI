import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from llm_integration import ChatbotQA

# Load environment variables
load_dotenv()

# Configuration from env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CTSE_PDF_PATH = 'data/CTSE_LEC_2_PART_1.pdf'
IUP_PDF_PATH = 'data/IUP_LEC_5.pdf'

# Flask app
app = Flask(__name__)
CORS(app)

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    query = data.get("question", "").strip()
    module = data.get("module", "CTSE")
    history = data.get("history", [])

    if not query:
        return jsonify({"error": "Question cannot be empty"}), 400

    try:
        if module == "CTSE":
            qa_system = ChatbotQA(pdf_path=CTSE_PDF_PATH, openai_api_key=OPENAI_API_KEY)
        elif module == "IUP":
            qa_system = ChatbotQA(pdf_path=IUP_PDF_PATH, openai_api_key=OPENAI_API_KEY)
        else:
            return jsonify({"error": "Invalid module selected"}), 400

        answer = qa_system.ask_question(query, history=history)  # <-- Pass history here
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
