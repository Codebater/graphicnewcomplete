import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Find all projects that don't have sortOrder or have sortOrder = 0
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    console.log('Found projects to fix:', projects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder,
      createdAt: p.createdAt 
    })));

    // Update each project with proper sortOrder
    const updatePromises = projects.map((project, index) => {
      console.log(`Setting project ${project.title} (${project._id}) to sortOrder: ${index}`);
      return Project.findByIdAndUpdate(
        project._id,
        { $set: { sortOrder: index } },
        { new: true }
      );
    });

    const updatedProjects = await Promise.all(updatePromises);
    
    console.log('Updated projects with sortOrder:', updatedProjects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder 
    })));

    return NextResponse.json({
      success: true,
      message: `Fixed sortOrder for ${updatedProjects.length} projects`,
      data: updatedProjects.map(p => ({ 
        id: p._id, 
        title: p.title, 
        sortOrder: p.sortOrder 
      }))
    });

  } catch (error: any) {
    console.error('Error fixing sort order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fix sort order' },
      { status: 500 }
    );
  }
}
