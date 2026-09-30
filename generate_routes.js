const fs = require('fs');
const path = require('path');

const endpoints = [
  "/api/v1/attendance/check-in",
  "/api/v1/attendance/check-out",
  "/api/v1/attendance/events",
  "/api/v1/attendance/offline-sync",
  "/api/v1/attendance/sessions",
  "/api/v1/attendance/status/current",
  "/api/v1/attendance/today",
  "/api/v1/auth/login",
  "/api/v1/auth/logout",
  "/api/v1/auth/me",
  "/api/v1/auth/mfa/verify",
  "/api/v1/auth/sessions",
  "/api/v1/departments",
  "/api/v1/divisions",
  "/api/v1/employees",
  "/api/v1/employees/import",
  "/api/v1/offices",
  "/api/v1/organization-tree",
  "/api/v1/organizations",
  "/api/v1/police-stations",
  "/api/v1/sites",
  "/api/v1/units",
  "/api/v1/wards",
  "/api/v1/zones",
  "/api/v1/roles",
  "/api/v1/permissions",
  "/api/v1/geofences",
  "/api/v1/locations",
  "/api/v1/integrations",
  "/api/v1/notifications",
  "/api/v1/reports",
  "/api/v1/retention"
];

for (const ep of endpoints) {
  // Strip starting /api
  const routePath = ep.replace(/^\/api/, '');
  const dirPath = path.join(__dirname, 'src', 'app', 'api', routePath);
  
  fs.mkdirSync(dirPath, { recursive: true });
  
  const content = `import { NextResponse } from 'next/server';

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
`;
  
  fs.writeFileSync(path.join(dirPath, 'route.ts'), content);
}

console.log("Mock API routes generated successfully!");
