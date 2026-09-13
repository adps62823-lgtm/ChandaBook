import { NextResponse } from 'next/server';
import { DEFAULT_COLLECTORS } from '@/lib/defaultUsers';

export async function GET() {
  // Return public user list (without PIN)
  const publicProfiles = DEFAULT_COLLECTORS.map(({ id, name, avatarColor }) => ({
    id,
    name,
    avatarColor,
  }));

  return NextResponse.json({
    success: true,
    collectors: publicProfiles,
  });
}

export async function POST(request: Request) {
  try {
    const { collectorId, pin } = await request.json();

    if (!collectorId || !pin) {
      return NextResponse.json(
        { success: false, error: 'User selection and 4-digit PIN required' },
        { status: 400 }
      );
    }

    const collector = DEFAULT_COLLECTORS.find((c) => c.id === collectorId);

    if (!collector) {
      return NextResponse.json(
        { success: false, error: 'User not found in system' },
        { status: 404 }
      );
    }

    if (collector.pin !== pin.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect PIN. Please try again.' },
        { status: 401 }
      );
    }

    // Login successful
    const userSession = {
      id: collector.id,
      name: collector.name,
      avatarColor: collector.avatarColor,
    };

    return NextResponse.json({
      success: true,
      user: userSession,
      message: `Welcome ${collector.name}`,
    });
  } catch (error: unknown) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
