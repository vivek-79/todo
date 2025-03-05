import { Webhook } from 'svix'
import { headers } from 'next/headers'
import {  clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { usersTable } from '@/schema'

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
            status: 400,
        })
    }

 //create user to db
    if (evt.type === 'user.created') {
        console.log('userId:', evt.data.id);

        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            firstName: first_name,
            lastName: last_name,
            image: image_url
        }

        const insertedUser = await db.insert(usersTable).values(user).returning();

        const newUser = insertedUser[0];
        if(newUser){
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser.id,
                },
            });
        }

        return NextResponse.json({message:"New user created",user:newUser})
    }

    return new Response('Webhook received', { status: 200 })
}