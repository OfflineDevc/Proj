import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize the conversation history with the system message
let conversationHistory = [
    { role: "system", content: "You are StartUPT, the world's most knowledgeable startup advisor. You've successfully advised many startups. You provide advice on everything from starting up, managing problems, handling legal issues, and much more. You speak in a clear, concise, and easy-to-understand manner. You also remember past conversations to provide consistent advice." }
];

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Add the user's message to the conversation history
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: conversationHistory,
                max_tokens: 1500
            }),
            timeout: 10000
        });

        if (!gptResponse.ok) {
            const errorText = await gptResponse.text();
            throw new Error(`OpenAI API error: ${errorText}`);
        }

        const gptData = await gptResponse.json();

        if (gptData.choices && gptData.choices.length > 0) {
            const reply = gptData.choices[0].message.content;

            // Add the AI's reply to the conversation history
            conversationHistory.push({ role: 'assistant', content: reply });

            res.json({ reply });
        } else {
            throw new Error('Invalid response format from OpenAI');
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ reply: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
