import axios from "axios";

let lastCall = 0;

const geminiResponse = async (command, assistantName, userName) => {

  if (Date.now() - lastCall < 2000) {
    return {
      type: "general",
      userInput: command,
      response: "Please speak slowly."
    };
  }

  lastCall = Date.now();

  try {

    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";


    const prompt = `
      You are a voice assistant.

      You must return ONLY valid JSON in this format:

      {
        "type":"general | google-search | youtube-search | youtube-play | get-time | get-date | get-day | get-month | calculator-open | instagram-open | facebook-open | weather-show",
        "userInput":"${command}",
        "response":"<natural short voice reply>"
      }

      Rules:
      - Assistant name is ${assistantName}
      - Creator is ${userName}
      - "response" must be a REAL short answer, not placeholder text
      - No extra text, no explanation, no markdown

      User Question: ${command}
      `;



    const result = await axios.post(apiUrl, {
      // model: "llama-3.1-8b-instant",
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const raw = result.data.choices[0].message.content;
    return JSON.parse(raw);

  } catch (err) {
    console.log("Groq Error:", err.response?.data || err.message);
    return {
      type: "general",
      userInput: command,
      response: "AI is busy, please try again."
    };
  }
};

export default geminiResponse;
