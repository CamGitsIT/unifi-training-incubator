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