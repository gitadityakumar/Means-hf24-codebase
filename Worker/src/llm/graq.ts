// import Groq from "groq-sdk";
// import * as dotenv from "dotenv";
// import fs from "fs/promises";
// // import path from "path";

// dotenv.config();

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// //@ts-ignore
// export async function main(txtFilePath) {
//   try {
//     const subtitlesContent = await fs.readFile(txtFilePath, 'utf-8');

//     // Create the chat completion request with subtitles content
//     const completion = await groq.chat.completions
//       .create({
//         messages: [
//           {
//             "role": "system",
//             "content": `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
// {
//   "words": [
//     {
//       "word": "example",
//       "meaning": "a representative instance of a particular category"
//     },
//     {
//       "word": "technology",
//       "meaning": "the application of scientific knowledge for practical purposes"
//     },
//     {
//       "word": "company",
//       "meaning": "a commercial business or enterprise"
//     },
//     {
//       "word": "predatory",
//       "meaning": "seeking to exploit or oppress others, often in a ruthless or aggressive manner"
//     }
//   ]
// }
// do not give me anyting except having a json object containing all words and their meaning.`
//           },
//           {
//             "role": "user",
//             "content": `${subtitlesContent}`,
//           },
//         ],
//         model: "llama3-70b-8192",
//         temperature: 1,
//         max_tokens: 8192,
//         top_p: 1,
//         stream: false,
//         stop: null
//       });

//     // Log the response content
//     const result = completion.choices[0]?.message?.content || "";
//     // console.log(completion.choices[0]?.message?.content || "");
//     return result;

//   } catch (error) {
//     console.error("Error during processing:", error);
//   }
// }


// Test funciton 
// export async function main(filepath:any,apiKey:string) {
//   console.log(filepath, apiKey);
  
// }


//_______________________________________________________________________

import Groq from "groq-sdk";
import fs from "fs/promises";

// Update the main function to accept an apiKey parameter
export async function main(txtFilePath: string, apiKey: string) {
  try {
    // Initialize the Groq instance with the provided API key
    const groq = new Groq({ apiKey });

    const subtitlesContent = await fs.readFile(txtFilePath, 'utf-8');

    // Create the chat completion request with subtitles content
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
          {
            "words": [
              {
                "word": "example",
                "meaning": "a representative instance of a particular category"
              },
              {
                "word": "technology",
                "meaning": "the application of scientific knowledge for practical purposes"
              },
              {
                "word": "company",
                "meaning": "a commercial business or enterprise"
              },
              {
                "word": "predatory",
                "meaning": "seeking to exploit or oppress others, often in a ruthless or aggressive manner"
              }
            ]
          }
          do not give me anything except a JSON object containing all words and their meaning.`,
        },
        {
          role: "user",
          content: `${subtitlesContent}`,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 1,
      max_tokens: 8192,
      top_p: 1,
      stream: false,
      stop: null,
    });

    // Extract the response content
    const result = completion.choices[0]?.message?.content || "";
    return result;

  } catch (error) {
    console.error("Error during processing:", error);
    throw error;  // Optionally rethrow to handle it higher up
  }
}
