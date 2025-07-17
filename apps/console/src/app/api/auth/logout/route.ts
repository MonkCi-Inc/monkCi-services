import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the authentication token
  response.cookies.delete('monkci_token');
  
  return response;
} 