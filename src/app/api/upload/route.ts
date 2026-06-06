import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Diagnostic (safe: logs presence/prefix and env-var NAMES only — never the
    // secret value). Helps confirm whether BLOB_READ_WRITE_TOKEN reaches the fn.
    const _tok = process.env.BLOB_READ_WRITE_TOKEN;
    console.error(
      '[upload-diagnostic] BLOB token present:', !!_tok,
      '| prefix:', _tok ? _tok.slice(0, 14) : 'NONE',
      '| blob-related env keys:',
      Object.keys(process.env).filter((k) => /BLOB|VERCEL_BLOB/i.test(k)).join(',') || 'none'
    );

    // Uploads go to Vercel Blob (persistent cloud storage). Writing to the
    // local filesystem does NOT work on Vercel — serverless functions run on a
    // read-only filesystem, which is why disk-based uploads failed in production.
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Image storage is not configured. Create a Blob store in Vercel (Storage → Blob) and connect it to this project, then redeploy. For local dev, set BLOB_READ_WRITE_TOKEN in .env.local.',
        },
        { status: 500 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.size) {
        continue;
      }

      // Unique, collision-safe object key
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
      const pathname = `uploads/${timestamp}-${randomString}.${extension}`;

      const blob = await put(pathname, file, {
        access: 'public',
        contentType: file.type || undefined,
        addRandomSuffix: false,
      });

      uploadedFiles.push({
        filename: file.name,
        url: blob.url, // permanent public CDN URL
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error: unknown) {
    console.error('Error uploading files:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload files';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
