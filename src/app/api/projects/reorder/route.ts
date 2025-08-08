import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { projectIds } = await request.json();
    
    if (!projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project IDs array' },
        { status: 400 }
      );
    }

    console.log('🔄 REORDER API - Received projectIds:', projectIds);

    // Use raw MongoDB operations for more reliable updates
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not available');
    const collection = db.collection('projects');

    // Update sort order for each project
    const updatePromises = projectIds.map((projectId: string, index: number) => {
      console.log(`📝 Setting project ${projectId} sortOrder to ${index}`);
      return collection.updateOne(
        { _id: new mongoose.Types.ObjectId(projectId) },
        { $set: { sortOrder: index } }
      );
    });

    const updateResults = await Promise.all(updatePromises);
    console.log('📊 Update results:', updateResults.map((r, i) => ({
      projectId: projectIds[i],
      sortOrder: i,
      matched: r.matchedCount,
      modified: r.modifiedCount
    })));

    // Verify the updates by fetching the projects
    const updatedProjects = await collection.find({
      _id: { $in: projectIds.map(id => new mongoose.Types.ObjectId(id)) }
    }).sort({ sortOrder: 1 }).toArray();
    
    console.log('✅ Verification - Updated projects in database:', updatedProjects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder 
    })));

    return NextResponse.json({
      success: true,
      message: 'Project order updated successfully',
      updatedProjects: updatedProjects.map(p => ({ 
        id: p._id.toString(), 
        title: p.title, 
        sortOrder: p.sortOrder 
      }))
    });

  } catch (error: any) {
    console.error('❌ Error reordering projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}
