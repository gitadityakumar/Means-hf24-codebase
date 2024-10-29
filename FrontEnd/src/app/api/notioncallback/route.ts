import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  let returnUrl = '/';
  if (state) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      returnUrl = stateData.returnUrl || '/';
    } catch (e) {
      console.error('Error parsing state:', e);
    }
  }

  if (error) {
    console.error('Error returned from Notion:', error);
    return NextResponse.redirect(new URL(`${returnUrl}?error=notion_auth_failed`, request.url));
  }

  if (!code) {
    console.error('No code received from Notion');
    return NextResponse.redirect(new URL(`${returnUrl}?error=no_code_received`, request.url));
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Notion OAuth configuration');
    return NextResponse.redirect(new URL(`${returnUrl}?error=missing_config`, request.url));
  }

  try {
    const response = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    const { access_token } = response.data;
    
    // Create a response to set the cookie and redirect
    const redirectUrl = new URL(`${returnUrl}?notion_auth_success=true`, request.url);
    const res = NextResponse.redirect(redirectUrl);
    
    // Set the token in a httpOnly cookie
    res.cookies.set('notion_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(new URL(`${returnUrl}?error=token_exchange_failed`, request.url));
  }
}