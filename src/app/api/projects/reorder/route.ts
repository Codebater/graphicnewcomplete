import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// PUT /api/projects/reorder - set sort_order for each project by its position
export async function PUT(request: NextRequest) {
  try {
    const { projectIds } = await request.json();

    if (!projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project IDs array' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      projectIds.map((projectId: string, index: number) =>
        supabase.from('projects').update({ sort_order: index }).eq('id', projectId)
      )
    );

    const firstError = results.find((r) => r.error)?.error;
    if (firstError) throw firstError;

    return NextResponse.json({
      success: true,
      message: 'Project order updated successfully',
      updatedProjects: projectIds.map((id: string, index: number) => ({ id, sortOrder: index })),
    });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}
