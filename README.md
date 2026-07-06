# CodeAlpha_LanguageTranslator

**Task 1 — Language Translation Tool (Flask web app)**
Artificial Intelligence Internship @ [CodeAlpha](https://www.codealpha.tech)

## 📌 Overview
A web-based translator built with **Flask**. It sends text to the **Google
Translate** engine (via the `deep-translator` library) and returns the
translated result over a small JSON API. The interface is a single page
styled as a split airmail postcard — your message on the left, the
translation on the right.

| Task requirement | Implemented as |
|---|---|
| UI to enter text + choose source/target language | HTML page with a textarea and two `<select>` dropdowns |
| Use a translation API | `deep-translator`'s `GoogleTranslator`, called from the Flask backend |
| Send text to API, get translated response | `POST /api/translate` route |
| Display translated text clearly | Right-hand panel of the postcard |
| (Optional) Copy button | "📋 Copy" — uses the browser Clipboard API |
| (Optional) Text-to-speech | "🔊 Listen" — uses the browser's native Web Speech API |

## 🛠️ Tech Stack
- **Backend:** Python 3.9+, Flask
- **Translation:** `deep-translator` (Google Translate)
- **Frontend:** vanilla HTML/CSS/JS — no build step, no frameworks
- **Text-to-speech & clipboard:** native browser APIs (no server round-trip)

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/CodeAlpha_LanguageTranslator.git
cd CodeAlpha_LanguageTranslator

# 2. (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

> **Note:** An internet connection is required — translation calls Google's
> translation service, and text-to-speech uses your browser's built-in voices.

## 🚀 How to Use
1. Type or paste text into the left panel.
2. Choose **From** (or leave on Auto Detect) and **To** languages.
3. Click the round **Translate** stamp (or press `Ctrl/Cmd + Enter`).
4. Read the result in the right panel.
5. Optionally **Copy** it or click **Listen** to hear it read aloud.
6. Use the **⇄** button to swap languages (and swap the two texts, if there's already a translation).

## 📂 Project Structure
```
CodeAlpha_LanguageTranslator/
├── app.py                  # Flask app + /api/translate endpoint
├── templates/
│   └── index.html          # Page markup (Jinja renders the language lists)
├── static/
│   ├── css/style.css       # Design system (postcard / airmail theme)
│   └── js/script.js        # Fetch calls, swap, copy, speech synthesis
├── requirements.txt
└── README.md
```

## 🔌 API Reference
`POST /api/translate`

```json
// Request
{ "text": "Good morning", "source": "en", "target": "fr" }

// Response
{ "translated": "Bonjour" }

// Error response
{ "error": "Please enter some text to translate." }
```

## 🎥 Demo
_Add your LinkedIn video walkthrough link here once recorded, as required by
the internship submission guidelines._

## 🙌 Acknowledgment
Built as part of the **Artificial Intelligence Internship** at
[CodeAlpha](https://www.codealpha.tech).
