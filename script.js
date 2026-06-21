

async function evaluateAnswer() {

    const answer = document.getElementById("answer").value.trim();
    const question = document.getElementById("question").value.trim();
    const resultDiv = document.getElementById("result");

    if (answer === "") {
        resultDiv.innerHTML = `
        <h3>Result</h3>
        <p>Score: 0</p>
        <p>No response provided.</p>
        `;
        return;
    }

    if (answer.length < 15) {
        resultDiv.innerHTML = `
        <h3>Result</h3>
        <p>Score: 2</p>
        <p>Answer is too short to evaluate properly.</p>
        `;
        return;
    }

    resultDiv.innerHTML = "Evaluating...";

    const prompt = `
You are an interview evaluator.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON in this format:

{
  "score": 8,
  "strengths": ["point1","point2"],
  "weaknesses": ["point1","point2"],
  "feedback": "feedback text"
}
`;

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer your key",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        const text =
            data.choices[0].message.content;

        const result =
            JSON.parse(
                text.replace(/```json/g, "")
                    .replace(/```/g, "")
            );

        resultDiv.innerHTML = `
            <h3>Evaluation Result</h3>

            <p><strong>Score:</strong>
            ${result.score}/10</p>

            <p><strong>Strengths:</strong></p>
            <ul>
                ${result.strengths.map(s => `<li>${s}</li>`).join("")}
            </ul>

            <p><strong>Weaknesses:</strong></p>
            <ul>
                ${result.weaknesses.map(w => `<li>${w}</li>`).join("")}
            </ul>

            <p><strong>Feedback:</strong></p>
            <p>${result.feedback}</p>
        `;

    } catch (error) {

        console.error(error);

        resultDiv.innerHTML = `
        <h3>Error</h3>
        <p>${error.message}</p>
        `;
    }
}