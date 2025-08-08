import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Use raw MongoDB operations to set the desired order
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not available');
    const collection = db.collection('projects');
    
    // Set Steffie de Leeuw to sortOrder 0 (first)
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId('68953ea8b90958ab219c3ac5') },
      { $set: { sortOrder: 0 } }
    );
    
    // Set Fabbrica to sortOrder 1 (second)
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId('689542c5b90958ab219c3b89') },
      { $set: { sortOrder: 1 } }
    );
    
    // Set Stash to sortOrder 2 (third)
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId('68954388b90958ab219c3b9c') },
      { $set: { sortOrder: 2 } }
    );
    
    // Verify the updates
    const updatedProjects = await collection.find({}).sort({ sortOrder: 1 }).toArray();
    
    console.log('Set order - Updated projects:', updatedProjects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      sortOrder: p.sortOrder 
    })));

    return NextResponse.json({
      success: true,
      message: 'Order set successfully',
      data: updatedProjects.map(p => ({ 
        id: p._id.toString(), 
        title: p.title, 
        sortOrder: p.sortOrder 
      }))
    });

  } catch (error: any) {
    console.error('Error setting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set order' },
      { status: 500 }
    );
  }
}
