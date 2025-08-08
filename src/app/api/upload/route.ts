import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.size) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Save to public/uploads directory
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const filepath = join(uploadDir, filename);

      try {
        await writeFile(filepath, buffer);
        
        // Return the public URL
        const publicUrl = `/uploads/${filename}`;
        uploadedFiles.push({
          filename: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        });
      } catch (writeError) {
        console.error('Error writing file:', writeError);
        // Create uploads directory if it doesn't exist
        const { mkdir } = await import('fs/promises');
        try {
          await mkdir(uploadDir, { recursive: true });
          await writeFile(filepath, buffer);
          
          const publicUrl = `/uploads/${filename}`;
          uploadedFiles.push({
            filename: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type
          });
        } catch (retryError) {
          console.error('Error creating directory or writing file:', retryError);
          return NextResponse.json(
            { success: false, error: 'Failed to save file' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    });
  } catch (error: any) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
