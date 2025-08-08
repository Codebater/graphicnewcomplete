import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Use raw MongoDB operations to ensure the field is properly updated
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not available');
    const collection = db.collection('projects');
    
    // Get all projects sorted by creation date
    const projects = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    console.log('Found projects:', projects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder,
      createdAt: p.createdAt 
    })));

    // Update each project with proper sortOrder using raw MongoDB operations
    const updateOps = projects.map((project, index) => {
      console.log(`Force setting project ${project.title} to sortOrder: ${index}`);
      return collection.updateOne(
        { _id: project._id },
        { $set: { sortOrder: index } }
      );
    });

    const results = await Promise.all(updateOps);
    console.log('Update results:', results.map(r => r.modifiedCount));

    // Verify the updates
    const updatedProjects = await collection.find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray();
    
    console.log('Verification - Updated projects:', updatedProjects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder 
    })));

    return NextResponse.json({
      success: true,
      message: `Force updated sortOrder for ${results.length} projects`,
      data: updatedProjects.map(p => ({ 
        id: p._id.toString(), 
        title: p.title, 
        sortOrder: p.sortOrder 
      }))
    });

  } catch (error: any) {
    console.error('Error force fixing sort order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to force fix sort order' },
      { status: 500 }
    );
  }
}
