import 'dotenv/config';

// There is now only ONE API_KEY line in this entire file:
const API_KEY = process.env.OPENROUTER_API_KEY; 

async function testOpenRouter() {
  console.log("Sending transmission to OpenRouter...\n");
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

        /*
===================================================================
OPENROUTER MODEL ID CHEAT SHEET
===================================================================

--- THE HEAVY HITTERS (CODING & ARCHITECTURE) ---
"anthropic/claude-3.7-sonnet"   // The King of Coding. Use for complex app logic.
"anthropic/claude-3.7-sonnet:thinking" // Deep reasoning for debugging complex errors.
"openai/gpt-4o"                 // Great all-rounder for general business planning.

--- THE ANALYSTS (ROI, FINANCIALS & LARGE DATA) ---
"openai/o3-mini"                // High-speed reasoning. Best for complex ROI calculations.
"google/gemini-2.0-pro-exp-02-05" // Massive memory. Best for reading long lease PDFs or manuals.

--- FAST & CHEAP (QUICK TESTS & BULK TEXT) ---
"google/gemini-2.0-flash-001"   // Lightning fast. Use for quick formatting or simple logic.
"openai/gpt-4o-mini"            // Low cost, high speed for repetitive text tasks.

===================================================================
*/
        model: "google/gemini-2.5-pro", 
        messages: [{ role: "user", content: "Test." }]
      })
    });
    const data = await response.json();
    console.log("Response received:", data.choices[0].message.content);
  } catch (error) {
    console.error("Transmission failed:", error);
  }
}

testOpenRouter();