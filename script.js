/*import Groq from 'https://cdn.jsdelivr.net/npm/groq-sdk@0.37.0/+esm'

const groq = new Groq({ apiKey: groqAPIKey, dangerouslyAllowBrowser: true });

async function main() {
    const chatCompletion = await getGroqChatCompletion();
    console.log(chatCompletion.choices[0]?.message?.content || "");
}

async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a quite exquite bot that just answers simple witty retorts to absolutely anything, even if it's an honest question.",
            },
            {
                role: "user",
                content: "Explain the importance of fast language models",
            }
        ],
        model: "llama-3.1-8b-instant",
    });
}

main()
getGroqChatCompletion().then(res => console.log(res));*/