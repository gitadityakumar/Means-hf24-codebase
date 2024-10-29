import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.NOTION_REDIRECT_URI;
  const searchParams = request.nextUrl.searchParams;
  const returnUrl = searchParams.get('returnUrl');

  if (!clientId || !redirectUri) {
    console.error('Missing Notion OAuth configuration:', { clientId: !!clientId, redirectUri: !!redirectUri });
    return NextResponse.json({ error: 'Notion OAuth configuration is missing' }, { status: 500 });
  }

  const state = returnUrl ? encodeURIComponent(JSON.stringify({ returnUrl })) : '';

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  
  return NextResponse.json({ url: notionAuthUrl });
}