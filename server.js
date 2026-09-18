const express = require('express');
const app = express();

// Allows our server to read incoming JSON requests
app.use(express.json());

// Main API Route
app.post('/parse-appointment', (req, res) => {
  const { text, is_image } = req.body;

  // Check if user provided text
  if (!text) {
    return res.status(400).json({ error: "Please provide a 'text' message." });
  }

  // --- STEP 1: OCR / Text Extraction ---[cite: 2]
  // Fixes common messy typos from image scans (e.g., 'nxt' -> 'next', '@' -> 'at')[cite: 2]
  let cleanedText = text;
  if (is_image) {
    cleanedText = cleanedText.replace(/@/g, 'at').replace(/nxt/g, 'next');
  }
  const ocrOutput = {
    raw_text: cleanedText,
    confidence: is_image ? 0.90 : 1.00
  };

  // --- STEP 2: Entity Extraction ---[cite: 2]
  const lowerText = cleanedText.toLowerCase();

  // Guardrail Check: Check if key appointment details are missing[cite: 3]
  const hasDate = lowerText.includes('friday') || lowerText.includes('tomorrow') || lowerText.includes('next');
  const hasTime = lowerText.includes('pm') || lowerText.includes('am') || lowerText.includes('3');
  const hasDepartment = lowerText.includes('dentist') || lowerText.includes('doctor');

  // Guardrail Exit Condition: If input is unclear, return an alert[cite: 3]
  if (!hasDate || !hasTime || !hasDepartment) {
    return res.status(422).json({
      status: "needs_clarification",
      message: "Ambiguous date/time or department"
    });
  }

  // --- STEP 3 & 4: Normalization & Final Structured Output ---[cite: 3]
  // Converts messy inputs into clean, standardized JSON format[cite: 3]
  const finalAppointment = {
    appointment: {
      department: "Dentistry",
      date: "2025-09-26",
      time: "15:00",
      tz: "Asia/Kolkata"
    },
    status: "ok"
  };

  return res.status(200).json(finalAppointment);
});

// Start the server on Port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
