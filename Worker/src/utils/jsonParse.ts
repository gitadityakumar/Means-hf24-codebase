interface ParsedLLMData {
  word: string;
  meaning: string;
}

class JSONParseError extends Error {
  constructor(message: string, public originalError?: Error, public responseSnippet?: string) {
    super(message);
    this.name = 'JSONParseError';
    if (originalError) {
      this.stack = originalError.stack; // Preserve the original error's stack trace
    }
    if (responseSnippet) {
      console.error(`Snippet of problematic response: ${responseSnippet}`);
    }
  }
}

/**
 * Parses the LLM response to extract a valid JSON object or array.
 * The function removes any extra text outside of the JSON object.
 *
 * @param llmResponse - The raw response from the LLM
 * @returns - A valid array of ParsedLLMData, otherwise throws an error
 */
export function parseLLMResponse(llmResponse: string): ParsedLLMData[] {
  const responseSnippet = llmResponse.slice(0, 500); // Log a snippet of the response to help debugging

  try {
    // First, attempt a straightforward JSON parse
    const parsedData = JSON.parse(llmResponse);

    // Check if the parsed data is an object with a "words" property
    if (parsedData && parsedData.words && Array.isArray(parsedData.words)) {
      return parsedData.words; // Return the words array if it's present
    }

    // If it's already an array, return as-is
    if (Array.isArray(parsedData)) {
      return parsedData;
    }

    // If we get an object but no 'words' array, throw an error
    throw new Error('Parsed data does not contain a "words" array or valid structure.');
  } catch (initialError) {
    console.warn("Initial JSON parsing failed, attempting regex-based extraction...");

    // Regex to capture JSON objects or arrays
    const jsonRegex = /({[\s\S]*}|\[[\s\S]*\])/; // Matches the first JSON object or array in the response
    const match = llmResponse.match(jsonRegex);

    if (match) {
      try {
        // Parse the extracted JSON
        const extractedData = JSON.parse(match[0]);

        // Check if extracted data contains a "words" array
        if (extractedData && extractedData.words && Array.isArray(extractedData.words)) {
          return extractedData.words;
        }

        // If it's an array, return it directly
        if (Array.isArray(extractedData)) {
          return extractedData;
        }

        throw new Error('Extracted data does not contain a valid "words" array or structure.');
      } catch (jsonError) {
        throw new JSONParseError("Failed to parse extracted JSON.", jsonError as Error, responseSnippet);
      }
    }

    // If no match is found, throw an error
    throw new JSONParseError("No valid JSON found in LLM response.", initialError as Error, responseSnippet);
  }
}
