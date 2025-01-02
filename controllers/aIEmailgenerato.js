const express = require('express');
const Groq = require('groq-sdk');

// Initialize Groq SDK with API key and Express
const groq = new Groq({ apiKey: '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' });
const app = express();
const PORT = 3000;

// Define the Groq function that interacts with the Groq API
async function getGroqResponse() {
  try {
    // Provide at least one message in the 'messages' array
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",  // Specify the role
          "content": "who are  the founders of lingopal.ai"  // Example question
        }
      ],
      "model": "llama3-70b-8192", 
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": true,
      "stop": null
    });

    let fullResponse = '';

    // Stream and collect the response
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);  // Print response to the console
      fullResponse += content;        // Append content to the full response
    }

    return fullResponse;  // Return the full response

  } catch (error) {
    console.error('Error fetching Groq response:', error);
    return 'Error fetching Groq response';  // Return an error message
  }
}

// Define the route to call the Groq function
app.get('/groq-response', async (req, res) => {
  const response = await getGroqResponse();  // Get the response from Groq
  res.send(response);                        // Send the response back to the client
});

// Start the server and log the Groq response when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  getGroqResponse().then(response => {
    console.log("Groq API response:", response);  // Log the Groq response when the server starts
  }).catch(error => {
    console.error('Error during Groq response:', error);
  });
});
