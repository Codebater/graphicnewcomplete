import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  client?: string;
  services?: string;
  industries?: string;
  date?: string;
  tags?: string[];
  challenge?: {
    title?: string;
    subtitle?: string;
    content?: string;
  };
  solution?: {
    title?: string;
    content?: string;
    additionalContent?: string;
  };
  featuredImage?: string;
  galleryImages?: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  client: {
    type: String,
    trim: true,
    maxlength: 100
  },
  services: {
    type: String,
    trim: true,
    maxlength: 200
  },
  industries: {
    type: String,
    trim: true,
    maxlength: 200
  },
  date: {
    type: String,
    trim: true,
    maxlength: 50
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  challenge: {
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000
    }
  },
  solution: {
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    additionalContent: {
      type: String,
      trim: true,
      maxlength: 2000
    }
  },
  featuredImage: {
    type: String,
    trim: true
  },
  galleryImages: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
ProjectSchema.index({ title: 'text', description: 'text' });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ isPublished: 1 });
ProjectSchema.index({ sortOrder: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
