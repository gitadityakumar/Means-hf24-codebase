"use server"

export async function handleExportToNotion(content: string, title: string = 'Exported Content') {
  try {
    const response = await fetch("http://localhost:3000/api/notionexport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, title }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to export content to Notion');
    }

    const result = await response.json();
    
    console.log("Content exported to Notion successfully!");
    console.log("New page ID:", result.pageId);

    return { success: true, pageId: result.pageId };
  } catch (error) {
    console.error("Error exporting to Notion:", error);

    if (error instanceof Error) {
      if (error.message.includes('Not authenticated with Notion')) {
        console.log("Authentication Error: Please reconnect your Notion account.");
      } else {
        console.log("Error:", error.message || "Failed to export to Notion. Please try again.");
      }
    } else {
      console.log("An unexpected error occurred. Please try again.");
    }

    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}