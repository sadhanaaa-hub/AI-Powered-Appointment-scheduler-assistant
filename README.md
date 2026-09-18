# AI-Powered-Appointment-scheduler-assistant

Summarized solution - This backend service converts messy natural language text or OCR image inputs into structured appointment JSON data.

> Converts messy, real-world text or photos of handwritten notes (like *"book dentist nxt Friday @ 3 pm"*) into structured JSON data ready for calendar APIs — and clearly asks for clarification when information is missing.

### The Problem
When humans request appointments, they write in messy, natural language:
> *"book dentist nxt Friday 8 3 pm"*

A standard computer calendar API cannot understand *"nxt Friday"* or a stray typo like *"8"*. It requires clean, standardized data: a strict date (`2025-09-26`), a time (`15:00`), a valid timezone (`Asia/Kolkata`), and an exact department name (`Dentistry`).

Normally, a receptionist has to manually read these messages and type them into a database.

### Solution
This backend service acts as an intelligent processing pipeline. It takes messy text or image scans, cleans up OCR typos, extracts key details, normalizes relative dates into real calendar days, and outputs standardized JSON. 

If the input is too ambiguous (e.g., missing a time or department), the system **stops and asks for clarification** instead of guessing incorrectly.

---

## How It Works: The 4-Step Pipeline

Our service processes incoming requests through four distinct steps:
1. **Step 1 — OCR & Text Cleanup**: Fixes common OCR/typing glitches (like `@` read as `8`, or `nxt` for `next`) and tracks a confidence score.
2. **Step 2 — Entity Extraction**: Uses regex rules (or optional LLM fallback) to find date phrases, time phrases, and department names.
3. **Step 3 — Normalization**: Converts relative phrases (*"next Friday"*) into actual ISO calendar dates (`2025-09-26`) using standard timezones (`Asia/Kolkata`).
4. **Step 4 — Guardrails**: Evaluates confidence levels. If any required field is missing or ambiguous, it safely halts and returns a polite request for clarification.

---
