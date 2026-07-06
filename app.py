from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator
from deep_translator.exceptions import LanguageNotSupportedException

app = Flask(__name__)

# ------------------------------------------------------------------
# Supported languages shown in the two dropdowns: display name -> code
# ------------------------------------------------------------------
LANGUAGES = {
    "Auto Detect": "auto",
    "English": "en",
    "Urdu": "ur",
    "Arabic": "ar",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Chinese (Simplified)": "zh-CN",
    "Hindi": "hi",
    "Japanese": "ja",
    "Korean": "ko",
    "Russian": "ru",
    "Portuguese": "pt",
    "Italian": "it",
    "Turkish": "tr",
    "Persian": "fa",
    "Bengali": "bn",
    "Dutch": "nl",
    "Greek": "el",
    "Hebrew": "iw",
    "Indonesian": "id",
    "Punjabi": "pa",
    "Pashto": "ps",
    "Swahili": "sw",
    "Thai": "th",
    "Vietnamese": "vi",
}

MAX_CHARS = 5000


@app.route("/")
def index():
    """Render the translator page."""
    return render_template("index.html", languages=LANGUAGES)


@app.route("/api/translate", methods=["POST"])
def api_translate():
    """
    JSON API used by the front-end.

    Expects: { "text": str, "source": "<lang code>", "target": "<lang code>" }
    Returns: { "translated": str }  or  { "error": str }
    """
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    source = data.get("source") or "auto"
    target = data.get("target") or "en"

    if not text:
        return jsonify({"error": "Please enter some text to translate."}), 400

    if len(text) > MAX_CHARS:
        return jsonify({"error": f"Text is too long (max {MAX_CHARS} characters)."}), 400

    if source == target and source != "auto":
        return jsonify({"translated": text})

    try:
        translated = GoogleTranslator(source=source, target=target).translate(text)
        if translated is None:
            raise ValueError("Empty response from translation service.")
        return jsonify({"translated": translated})

    except LanguageNotSupportedException:
        return jsonify({"error": "One of the selected languages isn't supported."}), 400
    except Exception as exc:
        return jsonify({
            "error": "Translation failed. Please check your internet connection and try again."
        }), 502


if __name__ == "__main__":
    app.run(debug=True)
