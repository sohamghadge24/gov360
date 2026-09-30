import { NextResponse } from 'next/server';

// Generic Mock Data
const mockData = [
  { id: '1', name: 'Mock Record 1', status: 'Active', title: 'Mock Title', location: 'HQ' },
  { id: '2', name: 'Mock Record 2', status: 'Pending', title: 'Mock Title', location: 'Branch' },
];

export async function GET(request: Request) {
  // Check for specific endpoints to provide better mocks
  const url = new URL(request.url);
  
  if (url.pathname.includes('/auth/me')) {
    return NextResponse.json({
      id: 'usr_1',
      name: 'Admin User',
      email: 'admin@govtrack360.local',
      roles: ['System Administrator'],
      employee_id: 'GT-001'
    });
  }
  
  if (url.pathname.includes('/auth/sessions')) {
    return NextResponse.json([
      { id: '1', device: 'MacBook Pro / Safari', location: 'Current session', current: true, lastActive: 'Now' }
    ]);
  }

  return NextResponse.json(mockData);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  
  if (url.pathname.includes('/auth/login')) {
    return NextResponse.json({
      access_token: 'mock_token_123',
      refresh_token: 'mock_refresh_123'
    });
  }
  
  if (url.pathname.includes('/auth/logout')) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true, id: 'mock_created_id' });
}

export async function PUT(request: Request) {
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true });
}
