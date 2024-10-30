import InitialData from '../models/initialData'; // Import InitialData model
import Video from '../models/videoCard'; // Import VideoCard model

// Helper function to extract JSON from LLM response string
function extractJSONFromResponse(response: string): any {
  // Use regex to find and extract JSON object from the string
  const jsonMatch = response.match(/\{(?:[^{}]|(?:))*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]); // Parse the matched JSON string
    } catch (error) {
      throw new Error('Failed to parse JSON from LLM response.');
    }
  } else {
    throw new Error('No JSON found in LLM response.');
  }
}

// Function to process LLM response and update DB
async function processLLMResponse(videoId: string, response: string) {
  try {
    // Step 1: Extract JSON from LLM response
    const llmData = extractJSONFromResponse(response);

    if (!llmData.words || !Array.isArray(llmData.words)) {
      throw new Error('Invalid LLM data: No "words" array found.');
    }

    // Step 2: Insert word-meaning pairs into InitialData collection
    const initialDataDocs = await InitialData.insertMany(
      //@ts-ignore
      llmData.words.map(item => ({
        word: item.word,
        meaning: item.meaning
      }))
    );

    // Step 3: Extract IDs of the inserted documents
    const initialDataIds = initialDataDocs.map(doc => doc._id);

    // Step 4: Update the corresponding VideoCard with initialData references
    const updatedVideoCard = await Video.findByIdAndUpdate(
      videoId,
      { $push: { initialData: { $each: initialDataIds } } },
      { new: true } 
    );

    if (!updatedVideoCard) {
      throw new Error('Failed to find and update VideoCard with given videoId.');
    }

    console.log('LLM response processed and VideoCard updated successfully.');
  } catch (error) {
    //@ts-ignore
    console.error('Error processing LLM response:', error.message);
  }
}

// Call the function when the user selects a video and clicks process
const videoId = 'your-video-id'; // Replace with the actual video ID
const llmResponse = 'Here is the JSON object containing important words...'; // Your LLM response string

processLLMResponse(videoId, llmResponse);
