import { NextResponse } from 'next/server'

/*
 * Payment feature disabled - Stripe checkout session
 * TODO: Re-enable if online payment is needed in the future
 */

export async function POST() {
  return NextResponse.json(
    { error: 'Payment feature is currently disabled' },
    { status: 503 }
  )
}