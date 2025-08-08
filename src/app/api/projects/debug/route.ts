import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({
      success: true,
      count: projects.length,
      projects: projects.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        sortOrder: p.sortOrder,
        isPublished: p.isPublished,
        createdAt: p.createdAt
      }))
    });

  } catch (error: any) {
    console.error('Error debugging projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to debug projects' },
      { status: 500 }
    );
  }
}
