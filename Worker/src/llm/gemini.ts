import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs/promises";
import path from 'path';

// Text generation function
export async function gemini(txtFilePath: string, apiKey: string) {
  if (!apiKey) throw new Error("Missing API key");

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const subtitlesContent = await fs.readFile(txtFilePath, 'utf-8');
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
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
    });

    const prompt = `${subtitlesContent}`;
    const result = await model.generateContent(prompt);
    const output = result.response.text();
    return output;
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

// Audio to text generation function
export async function audioGemini(apiKey: string) {
  if (!apiKey) throw new Error("Missing API key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);

  try {
    // Upload audio
    const filePath = path.resolve(__dirname, "../../subtitles/audio.mp3");
    const audioFile = await fileManager.uploadFile(filePath, {
      mimeType: "audio/mp3",
    });

    const uploadedFile = audioFile.file;
    if (!uploadedFile || !uploadedFile.uri || !uploadedFile.mimeType) {
      throw new Error("Uploaded file does not contain necessary metadata.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadedFile.mimeType,
          fileUri: uploadedFile.uri,
        },
      },
      {
        text: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
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
    ]);

    console.log( result.response.text());

    const listFilesResponse = await fileManager.listFiles();
    if (listFilesResponse.files) {
      for (const file of listFilesResponse.files) {
        console.log(`name: ${file.name || "Unnamed file"} | display name: ${file.displayName || "No display name"}`);
      }
    }

    if (uploadedFile.name) {
      await fileManager.deleteFile(uploadedFile.name);
      console.log(`Deleted ${uploadedFile.displayName || "file"}`);
    } else {
      console.error("Unable to delete file: name property missing.");
    }

  } catch (error) {
    console.error("Error in audioGemini:", error);
  }
}

//____________________________________________________________________________________________
//@ts-ignore
//Test funciton
// export async function gemini(path: any, key: string) {
//   console.log(`Key in gemini function: ${key}`); // Check if `key` is passed correctly
//   console.log(`Path in gemini function: ${path}`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Log FROM GEMINI FN");
//       resolve("hi there I am from Gemini, you are working great.");
//     }, 3000);
//   });
// }