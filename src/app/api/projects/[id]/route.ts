import { NextRequest, NextResponse } from 'next/server';
import { supabase, rowToProject } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/projects/[id] - single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rowToProject(data) });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.client !== undefined) update.client = body.client;
    if (body.services !== undefined) update.services = body.services;
    if (body.industries !== undefined) update.industries = body.industries;
    if (body.date !== undefined) update.date = body.date;
    if (body.featuredImage !== undefined) update.featured_image = body.featuredImage;
    if (body.featuredVideo !== undefined) update.featured_video = body.featuredVideo;
    if (body.galleryImages !== undefined) update.gallery_images = body.galleryImages;
    if (body.isPublished !== undefined) update.is_published = body.isPublished;
    if (body.sortOrder !== undefined) update.sort_order = body.sortOrder;

    if (body.tags !== undefined) {
      update.tags =
        typeof body.tags === 'string'
          ? body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
          : body.tags;
    }

    if (body.challengeTitle || body.challengeSubtitle || body.challengeContent || body.challenge) {
      update.challenge = body.challenge ?? {
        title: body.challengeTitle || '',
        subtitle: body.challengeSubtitle || '',
        content: body.challengeContent || '',
      };
    }
    if (body.solutionTitle || body.solutionContent || body.solutionAdditionalContent || body.solution) {
      update.solution = body.solution ?? {
        title: body.solutionTitle || '',
        content: body.solutionContent || '',
        additionalContent: body.solutionAdditionalContent || '',
      };
    }

    const { data, error } = await supabase
      .from('projects')
      .update(update)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: rowToProject(data),
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

// DELETE /api/projects/[id] - delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
