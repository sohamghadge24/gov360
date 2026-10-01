import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.includes('demo-access-token')) {
    return NextResponse.json({
      id: 'admin-1',
      email: 'admin@gov.in',
      name: 'System Administrator',
      roles: ['admin', 'supervisor'],
      employee_id: 'EMP-001'
    });
  }
  
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
