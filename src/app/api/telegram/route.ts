// src/app/api/telegram/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AppFile } from '@/types';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Helper to get file info from Telegram
async function getFileInfo(fileId: string) {
    const response = await fetch(`${API_BASE_URL}/getFile?file_id=${fileId}`);
    const result = await response.json();
    if (!result.ok) {
        throw new Error(`Failed to get file info: ${result.description}`);
    }
    return result.result;
}

export async function POST(request: NextRequest) {
    if (!BOT_TOKEN || !CHAT_ID) {
        return NextResponse.json({ error: 'Telegram bot not configured.' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        const uploadFormData = new FormData();
        uploadFormData.append('chat_id', CHAT_ID);
        uploadFormData.append('document', file);

        const response = await fetch(`${API_BASE_URL}/sendDocument`, {
            method: 'POST',
            body: uploadFormData,
        });

        const result = await response.json();

        if (!result.ok || !result.result.document) {
            console.error('Telegram API Error:', result);
            return NextResponse.json({ error: 'Failed to upload file to Telegram.' }, { status: 500 });
        }

        const doc = result.result.document;
        const newFile: AppFile = {
            id: doc.file_id,
            name: doc.file_name || 'Untitled',
            size: doc.file_size,
            type: doc.mime_type,
            uploadDate: new Date(result.result.date * 1000),
            url: '#', // URL will be generated on download request
            progress: 'complete',
            telegramMessageId: result.result.message_id,
        };

        return NextResponse.json(newFile, { status: 201 });

    } catch (error) {
        console.error('Upload Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    if (!BOT_TOKEN || !CHAT_ID) {
        return NextResponse.json({ error: 'Telegram bot not configured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
        return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    try {
        const fileInfo = await getFileInfo(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
        
        // Redirect to the actual file URL
        return NextResponse.redirect(fileUrl);
    } catch (error) {
        console.error('Download Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Could not get file download link', details: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!BOT_TOKEN || !CHAT_ID) {
        return NextResponse.json({ error: 'Telegram bot not configured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
        return NextResponse.json({ error: 'Message ID is required for deletion' }, { status: 400 });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/deleteMessage?chat_id=${CHAT_ID}&message_id=${messageId}`);
        const result = await response.json();

        if (!result.ok) {
            // Note: Telegram might not be able to delete old messages.
            console.warn('Could not delete message from Telegram:', result.description);
            // We can still return success to allow deletion from the UI.
        }

        return NextResponse.json({ message: 'Delete request sent' }, { status: 200 });

    } catch (error) {
        console.error('Delete Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
}
