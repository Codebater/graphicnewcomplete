import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');

    const query = published === 'true' ? { isPublished: true } : {};
    
    const projects = await Project.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    console.log('Projects fetched with sortOrder:', projects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder || 0,
      isPublished: p.isPublished 
    })));

    const total = await Project.countDocuments(query);

    const response = NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Parse tags if they're a comma-separated string
    if (typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    }

    // Create challenge and solution objects
    const projectData = {
      ...body,
      challenge: {
        title: body.challengeTitle || '',
        subtitle: body.challengeSubtitle || '',
        content: body.challengeContent || ''
      },
      solution: {
        title: body.solutionTitle || '',
        content: body.solutionContent || '',
        additionalContent: body.solutionAdditionalContent || ''
      }
    };

    // Remove individual challenge/solution fields from top level
    delete projectData.challengeTitle;
    delete projectData.challengeSubtitle;
    delete projectData.challengeContent;
    delete projectData.solutionTitle;
    delete projectData.solutionContent;
    delete projectData.solutionAdditionalContent;

    const project = new Project(projectData);
    await project.save();

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
