// src/app/api/send-verification/route.ts
// THIS FILE IS NO LONGER USED AND CAN BE DELETED.
// The new flow uses a webhook and does not send a link directly from an API.
// Keeping it to prevent build errors if something still references it,
// but it should be removed in a future cleanup.

import 'dotenv/config';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated.' },
    { status: 410 }
  );
}
