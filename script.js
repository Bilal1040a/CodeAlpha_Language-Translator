/* ==========================================================================
   CodeAlpha Language Translation Tool — front-end behaviour
   ========================================================================== */

(function () {
  "use strict";

  const inputText   = document.getElementById("input-text");
  const outputText  = document.getElementById("output-text");
  const sourceLang  = document.getElementById("source-lang");
  const targetLang  = document.getElementById("target-lang");
  const charCount   = document.getElementById("char-count");
  const statusMsg   = document.getElementById("status-msg");

  const translateBtn = document.getElementById("translate-btn");
  const clearBtn      = document.getElementById("clear-btn");
  const swapBtn        = document.getElementById("swap-btn");
  const copyBtn        = document.getElementById("copy-btn");
  const speakBtn       = document.getElementById("speak-btn");

  const MAX_CHARS = 5000;

  // ------------------------------------------------------------------
  // Character counter
  // ------------------------------------------------------------------
  function updateCharCount() {
    const len = inputText.value.length;
    charCount.textContent = `${len} / ${MAX_CHARS}`;
    charCount.style.color = len > MAX_CHARS ? "var(--error)" : "var(--slate)";
  }
  inputText.addEventListener("input", updateCharCount);
  updateCharCount();

  // ------------------------------------------------------------------
  // Status helper
  // ------------------------------------------------------------------
  function setStatus(message, kind) {
    statusMsg.textContent = message || "";
    statusMsg.classList.remove("is-error", "is-success");
    if (kind === "error") statusMsg.classList.add("is-error");
    if (kind === "success") statusMsg.classList.add("is-success");
  }

  // ------------------------------------------------------------------
  // Translate
  // ------------------------------------------------------------------
  async function translate() {
    const text = inputText.value.trim();

    if (!text) {
      setStatus("Type something to translate first.", "error");
      inputText.focus();
      return;
    }

    translateBtn.classList.add("is-loading");
    translateBtn.disabled = true;
    setStatus("Sending across the border…");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          source: sourceLang.value,
          target: targetLang.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed.");
      }

      outputText.textContent = data.translated;
      setStatus("Delivered ✔", "success");
    } catch (err) {
      setStatus(err.message || "Something went wrong.", "error");
    } finally {
      translateBtn.classList.remove("is-loading");
      translateBtn.disabled = false;
    }
  }

  translateBtn.addEventListener("click", translate);

  // Ctrl/Cmd + Enter to translate from the textarea
  inputText.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      translate();
    }
  });

  // ------------------------------------------------------------------
  // Clear
  // ------------------------------------------------------------------
  clearBtn.addEventListener("click", () => {
    inputText.value = "";
    outputText.textContent = "";
    updateCharCount();
    setStatus("");
    inputText.focus();
  });

  // ------------------------------------------------------------------
  // Swap languages (and their text, if there's a translation already)
  // ------------------------------------------------------------------
  swapBtn.addEventListener("click", () => {
    if (sourceLang.value === "auto") {
      setStatus("Pick a specific \u201cFrom\u201d language before swapping.", "error");
      return;
    }

    const srcVal = sourceLang.value;
    const tgtVal = targetLang.value;
    sourceLang.value = tgtVal;
    targetLang.value = srcVal;

    const outputHasText = outputText.textContent.trim().length > 0;
    if (outputHasText) {
      const tmp = inputText.value;
      inputText.value = outputText.textContent;
      outputText.textContent = tmp;
      updateCharCount();
    }
    setStatus("");
  });

  // ------------------------------------------------------------------
  // Copy translation to clipboard
  // ------------------------------------------------------------------
  copyBtn.addEventListener("click", async () => {
    const text = outputText.textContent.trim();
    if (!text) {
      setStatus("Nothing to copy yet — translate something first.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard ✔", "success");
    } catch {
      setStatus("Couldn't access the clipboard in this browser.", "error");
    }
  });

  // ------------------------------------------------------------------
  // Text-to-speech via the browser's native Web Speech API
  // ------------------------------------------------------------------
  speakBtn.addEventListener("click", () => {
    const text = outputText.textContent.trim();
    if (!text) {
      setStatus("Nothing to read aloud yet — translate something first.", "error");
      return;
    }
    if (!("speechSynthesis" in window)) {
      setStatus("Text-to-speech isn't supported in this browser.", "error");
      return;
    }

    window.speechSynthesis.cancel(); // stop anything currently playing
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang.value;
    utterance.onstart = () => setStatus("Reading aloud \uD83D\uDD0A");
    utterance.onend = () => setStatus("");
    utterance.onerror = () => setStatus("Couldn't play audio for this language.", "error");
    window.speechSynthesis.speak(utterance);
  });

})();
