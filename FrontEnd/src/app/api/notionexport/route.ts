import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

function parseEntries(content: string): { word: string; definition: string }[] {
  // Split content by line breaks and filter out empty lines
  return content.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [word, ...definitionParts] = line.split(':');
      return {
        word: word.trim(),
        definition: definitionParts.join(':').trim()
      };
    })
    .filter(entry => entry.word && entry.definition); // Filter out invalid entries
}

function createStructuredBlocks(title: string, content: string) {
  const entries = parseEntries(content);
  const blocks = [];

  // Add title block
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [{
        type: 'text',
        text: { content: title || 'Dictionary Entries' }
      }]
    }
  } as const);

  // Add divider after title
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {}
  } as const);

  // Add table header
  blocks.push({
    object: 'block',
    type: 'table',
    table: {
      table_width: 2,
      has_column_header: true,
      has_row_header: false,
      children: [
        {
          type: 'table_row',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Word' } }],
              [{ type: 'text', text: { content: 'Definition' } }]
            ]
          }
        },
        ...entries.map(entry => ({
          type: 'table_row',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: entry.word } }],
              [{ type: 'text', text: { content: entry.definition } }]
            ]
          }
        }))
      ]
    }
  } as const);

  return blocks;
}

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();
    console.log(content+"++++++++"+title)
    const notionToken = request.cookies.get('notion_token')?.value;

    if (!notionToken) {
      return NextResponse.json({ error: 'Not authenticated with Notion' }, { status: 401 });
    }

    // Validate required fields
    if (!content) {
      return NextResponse.json({ 
        error: 'Content is required' 
      }, { status: 400 });
    }

    const notion = new Client({ auth: notionToken });

    // Search for pages that the user has access to
    const response = await notion.search({
      filter: {
        value: 'page',
        property: 'object'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });

    // Find the first page that doesn't have a parent
    const rootPage = response.results.find((page: any) => !page.parent.page_id);

    if (!rootPage) {
      return NextResponse.json({ error: 'No root page found in the workspace' }, { status: 404 });
    }

    // Create structured blocks
    const contentBlocks = createStructuredBlocks(title, content);

    // Create the new page
    const pageParams: CreatePageParameters = {
      parent: { page_id: rootPage.id },
      properties: {
        title: {
          type: 'title',
          title: [{
            type: 'text',
            text: { content: title || 'Dictionary Entries' }
          }]
        }
      },
      //@ts-ignore
      children: contentBlocks
    };

    const newPage = await notion.pages.create(pageParams);

    return NextResponse.json({ 
      message: 'Content exported to Notion successfully', 
      pageId: newPage.id 
    });
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to export content to Notion', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to export content to Notion' 
    }, { status: 500 });
  }
}