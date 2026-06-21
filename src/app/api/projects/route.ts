import { NextRequest, NextResponse } from 'next/server';
import { supabase, rowToProject } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/projects - list projects (optionally only published)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('projects').select('*', { count: 'exact' });
    if (published === 'true') query = query.eq('is_published', true);
    query = query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const projects = (data || []).map(rowToProject);
    const total = count ?? projects.length;

    const response = NextResponse.json({
      success: true,
      data: projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - create a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let tags = body.tags;
    if (typeof tags === 'string') {
      tags = tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
    }

    const row = {
      title: body.title,
      description: body.description ?? '',
      client: body.client ?? null,
      services: body.services ?? null,
      industries: body.industries ?? null,
      date: body.date ?? null,
      tags: tags ?? [],
      challenge: {
        title: body.challengeTitle || '',
        subtitle: body.challengeSubtitle || '',
        content: body.challengeContent || '',
      },
      solution: {
        title: body.solutionTitle || '',
        content: body.solutionContent || '',
        additionalContent: body.solutionAdditionalContent || '',
      },
      featured_image: body.featuredImage ?? null,
      featured_video: body.featuredVideo ?? null,
      gallery_images: body.galleryImages ?? [],
      is_published: body.isPublished ?? false,
      sort_order: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    };

    if (!row.title || !row.description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from('projects').insert(row).select('*').single();
    if (error) throw error;

    return NextResponse.json(
      { success: true, data: rowToProject(data), message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
