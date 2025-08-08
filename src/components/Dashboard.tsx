'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    services: '',
    industries: '',
    date: '',
    tags: '',
    challengeTitle: '',
    challengeSubtitle: '',
    challengeContent: '',
    solutionTitle: '',
    solutionContent: '',
    solutionAdditionalContent: '',
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [focusedField, setFocusedField] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch projects when switching to projects tab
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        // Sort projects by sortOrder (ascending), then by createdAt (descending) as fallback
        const sortedProjects = result.data.sort((a: any, b: any) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setProjects(sortedProjects);
      } else {
        console.error('Failed to fetch projects:', result.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch projects when projects tab is activated
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'projects') {
      fetchProjects();
    }
  };

  // Handle drag and drop reordering
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject === targetProjectId) {
      setDraggedProject(null);
      return;
    }

    // Create new order array
    const draggedIndex = projects.findIndex(p => p._id === draggedProject);
    const targetIndex = projects.findIndex(p => p._id === targetProjectId);
    
    const newProjects = [...projects];
    const [draggedItem] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, draggedItem);
    
    // Update local state immediately for visual feedback
    setProjects(newProjects);
    setDraggedProject(null);
    
    console.log('Drag & drop reorder - new visual order:', newProjects.map((p, i) => ({
      position: i + 1,
      title: p.title,
      id: p._id
    })));
    
    // Show success message indicating the visual change
    setSuccess('Projects reordered! Click "Update Order" to apply this sequence to your portfolio.');
  };

  // Handle manual order update
  const handleUpdateOrder = async () => {
    if (projects.length === 0) return;
    
    setUpdatingOrder(true);
    setError('');
    setSuccess('');
    
    try {
      // Get current order from the dashboard state (exactly as visually arranged)
      const projectIds = projects.map(p => p._id);
      
      console.log('🔄 UPDATING ORDER - Current dashboard visual sequence:');
      console.log(projects.map((p, i) => ({
        position: i + 1,
        title: p.title,
        id: p._id
      })));
      console.log('📤 Sending projectIds array:', projectIds);
      
      const response = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectIds }),
      });
      
      const result = await response.json();
      console.log('📥 API Response:', result);
      
      if (result.success) {
        setSuccess('✅ Order applied successfully! Your portfolio now shows this sequence. Changes are live.');
        
        // Don't refresh immediately - keep the visual order
        console.log('✅ Order update successful - not refreshing to preserve visual order');
        
        // Optional: Refresh after a longer delay to sync with database
        setTimeout(() => {
          console.log('🔄 Refreshing to sync with database...');
          fetchProjects();
        }, 2000);
      } else {
        setError('Failed to update project order: ' + (result.error || 'Unknown error'));
        console.error('❌ API Error:', result);
      }
    } catch (error) {
      console.error('❌ Network/Request Error:', error);
      setError('Failed to update project order: Network error');
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Handle editing functions
  const startEditing = (project: any) => {
    setEditingProject(project._id);
    setEditFormData({
      title: project.title,
      description: project.description,
      client: project.client || '',
      services: project.services || '',
      industries: project.industries || '',
      date: project.date || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      featuredImage: project.featuredImage || '',
    });
    setEditImageFile(null);
    setEditImagePreview(project.featuredImage || null);
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditFormData({});
    setEditImageFile(null);
    setEditImagePreview(null);
    setUploadingImage(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File input changed');
    const file = e.target.files?.[0];
    console.log('📁 Selected file:', file);
    if (file) {
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('📁 File read success, preview set');
        setEditImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('📁 No file selected');
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditFormData((prev: any) => ({
      ...prev,
      featuredImage: ''
    }));
  };

  const saveProject = async (projectId: string) => {
    try {
      console.log('🔄 Starting save project for ID:', projectId);
      console.log('📝 Edit form data:', editFormData);
      console.log('🖼️ Edit image file:', editImageFile);
      
      setError('');
      setSuccess('');
      setUploadingImage(true);

      let featuredImageUrl = editFormData.featuredImage;

      // Upload new image if selected
      if (editImageFile) {
        console.log('📤 Uploading new image...');
        console.log('📤 File object:', editImageFile);
        
        const formData = new FormData();
        formData.append('files', editImageFile); // Changed from 'file' to 'files'
        
        // Debug FormData contents
        console.log('📤 FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`📤 ${key}:`, value);
        }

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        console.log('📤 Upload result:', uploadResult);
        
        if (uploadResult.success) {
          // The API returns an array of uploaded files, get the first one's URL
          featuredImageUrl = uploadResult.data[0]?.url;
          console.log('✅ Image uploaded successfully:', featuredImageUrl);
        } else {
          console.error('❌ Image upload failed:', uploadResult);
          throw new Error('Failed to upload image: ' + (uploadResult.error || 'Unknown error'));
        }
      } else {
        console.log('📷 No new image to upload, using existing:', featuredImageUrl);
      }

      // Process tags
      const tags = editFormData.tags ? 
        editFormData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];

      const updateData = {
        ...editFormData,
        featuredImage: featuredImageUrl,
        tags
      };

      console.log('💾 Sending update data:', updateData);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      console.log('💾 Update result:', result);
      
      if (result.success) {
        console.log('✅ Project updated successfully!');
        setSuccess('✅ Project updated successfully!');
        setEditingProject(null);
        setEditFormData({});
        setEditImageFile(null);
        setEditImagePreview(null);
        // Refresh projects list
        fetchProjects();
      } else {
        console.error('❌ Update failed:', result);
        setError('Failed to update project: ' + (result.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      setError('Failed to update project: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Calculate form progress
      const requiredFields = ['title', 'description'];
      const optionalFields = ['client', 'services', 'industries', 'date', 'tags', 'challengeTitle', 'challengeSubtitle', 'challengeContent', 'solutionTitle', 'solutionContent', 'solutionAdditionalContent'];
      const allFields = [...requiredFields, ...optionalFields];
      
      const filledFields = allFields.filter(field => newData[field as keyof typeof newData].trim() !== '').length;
      const imageProgress = featuredImage ? 1 : 0;
      const galleryProgress = galleryImages.length > 0 ? 1 : 0;
      
      const totalProgress = ((filledFields + imageProgress + galleryProgress) / (allFields.length + 2)) * 100;
      setFormProgress(Math.round(totalProgress));
      
      return newData;
    });
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(prev => [...prev, ...files]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !featuredImage) {
        setError('Please fill in required fields (title, description, featured image)');
        setIsLoading(false);
        return;
      }

      // Upload images first
      let featuredImageUrl = '';
      let galleryImageUrls: string[] = [];

      // Upload featured image
      if (featuredImage) {
        const featuredFormData = new FormData();
        featuredFormData.append('files', featuredImage);

        const featuredResponse = await fetch('/api/upload', {
          method: 'POST',
          body: featuredFormData,
        });

        const featuredResult = await featuredResponse.json();
        if (featuredResult.success && featuredResult.data.length > 0) {
          featuredImageUrl = featuredResult.data[0].url;
        } else {
          throw new Error('Failed to upload featured image');
        }
      }

      // Upload gallery images
      if (galleryImages.length > 0) {
        const galleryFormData = new FormData();
        galleryImages.forEach(file => {
          galleryFormData.append('files', file);
        });

        const galleryResponse = await fetch('/api/upload', {
          method: 'POST',
          body: galleryFormData,
        });

        const galleryResult = await galleryResponse.json();
        if (galleryResult.success && galleryResult.data.length > 0) {
          galleryImageUrls = galleryResult.data.map((file: any) => file.url);
        }
      }

      // Create project data
      const projectData = {
        ...formData,
        featuredImage: featuredImageUrl,
        galleryImages: galleryImageUrls,
        isPublished: false, // Default to draft
        sortOrder: projects.length, // Add to end by default
      };

      // Save project to database
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const projectResult = await projectResponse.json();

      if (projectResult.success) {
        setSuccess('Project uploaded successfully to database!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          client: '',
          services: '',
          industries: '',
          date: '',
          tags: '',
          challengeTitle: '',
          challengeSubtitle: '',
          challengeContent: '',
          solutionTitle: '',
          solutionContent: '',
          solutionAdditionalContent: '',
        });
        setFeaturedImage(null);
        setGalleryImages([]);
        setFormProgress(0);
      } else {
        throw new Error(projectResult.error || 'Failed to save project');
      }
    } catch (error: any) {
      console.error('Error submitting project:', error);
      setError(error.message || 'Failed to upload project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'rgb(3, 7, 18)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
  };

  const headerStyle = {
    backgroundColor: 'rgb(17, 24, 39)',
    borderBottom: '1px solid rgb(55, 65, 81)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const mainStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 80px)',
  };

  const sidebarStyle = {
    width: '280px',
    backgroundColor: 'rgb(17, 24, 39)',
    borderRight: '1px solid rgb(55, 65, 81)',
    padding: '2rem 0',
  };

  const contentStyle = {
    flex: 1,
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: 'rgb(17, 24, 39)',
    borderRadius: '12px',
    border: '1px solid rgb(55, 65, 81)',
    padding: '2rem',
    marginBottom: '2rem',
  };

  const getInputStyle = (fieldName: string) => ({
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgb(31, 41, 55)',
    border: `1px solid ${focusedField === fieldName ? 'rgb(59, 130, 246)' : 'rgb(55, 65, 81)'}`,
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    marginBottom: '1rem',
    transform: focusedField === fieldName ? 'scale(1.01)' : 'scale(1)',
  });

  const getTextareaStyle = (fieldName: string) => ({
    ...getInputStyle(fieldName),
    minHeight: '120px',
    resize: 'vertical' as const,
  });

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '12px 24px',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const tabButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? 'white' : 'transparent',
    color: isActive ? 'black' : 'rgb(156, 163, 175)',
    border: '1px solid rgb(55, 65, 81)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 16px',
    margin: '0 1rem 1rem 1rem',
    display: 'block',
    width: 'calc(100% - 2rem)',
    textAlign: 'left' as const,
    transition: 'all 0.2s',
  });

  const fileInputStyle = {
    display: 'none',
  };

  const fileButtonStyle = {
    backgroundColor: 'rgb(31, 41, 55)',
    color: 'rgb(209, 213, 219)',
    border: '1px solid rgb(55, 65, 81)',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '12px 16px',
    display: 'inline-block',
    transition: 'background-color 0.2s',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'rgb(3, 7, 18)',
              borderRadius: '4px',
            }} />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: '600',
            margin: 0,
          }}>
            Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <div style={{ 
              color: 'rgb(156, 163, 175)', 
              fontSize: '14px',
              textAlign: 'right' as const,
            }}>
              <div>Welcome back,</div>
              <div style={{ color: 'white', fontWeight: '500' }}>{user.name}</div>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: 'rgb(248, 113, 113)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={mainStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <button
            style={tabButtonStyle(activeTab === 'upload')}
            onClick={() => handleTabChange('upload')}
          >
            📁 Upload Project
          </button>
          <button
            style={tabButtonStyle(activeTab === 'projects')}
            onClick={() => handleTabChange('projects')}
          >
            📋 My Projects
          </button>
          <button
            style={tabButtonStyle(activeTab === 'settings')}
            onClick={() => handleTabChange('settings')}
          >
            ⚙️ Settings
          </button>
        </aside>

        {/* Content Area */}
        <main style={contentStyle}>
          {activeTab === 'upload' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '24px', 
                  fontWeight: '600',
                  margin: 0,
                }}>
                  Upload New Project
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'rgb(156, 163, 175)', fontSize: '14px' }}>
                    {formProgress}% Complete
                  </span>
                  <div style={{
                    width: '120px',
                    height: '8px',
                    backgroundColor: 'rgb(55, 65, 81)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${formProgress}%`,
                      height: '100%',
                      backgroundColor: formProgress < 30 ? 'rgb(239, 68, 68)' : formProgress < 70 ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)',
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                </div>
              </div>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(185, 28, 28, 0.2)',
                  border: '1px solid rgba(185, 28, 28, 0.5)',
                  color: 'rgb(248, 113, 113)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '2rem',
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  color: 'rgb(74, 222, 128)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '2rem',
                }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgb(59, 130, 246)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}>
                      1
                    </div>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      margin: 0,
                    }}>
                      Basic Information
                    </h3>
                    <span style={{ 
                      color: 'rgb(156, 163, 175)', 
                      fontSize: '14px',
                      fontWeight: '400',
                    }}>
                      • Essential project details
                    </span>
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Project Title *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., E-commerce Website Redesign"
                      value={formData.title}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField('')}
                      style={getInputStyle('title')}
                      required
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        cursor: 'pointer',
                        color: 'rgb(156, 163, 175)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={() => setShowTooltip('title')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      ℹ️
                    </div>
                    {showTooltip === 'title' && (
                      <div style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '0',
                        backgroundColor: 'rgb(31, 41, 55)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid rgb(55, 65, 81)',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                      }}>
                        Give your project a catchy, descriptive title
                      </div>
                    )}
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Description *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      name="description"
                      placeholder="Briefly describe what this project is about, its main goals, and what makes it special..."
                      value={formData.description}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField('')}
                      style={getTextareaStyle('description')}
                      required
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        cursor: 'pointer',
                        color: 'rgb(156, 163, 175)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={() => setShowTooltip('description')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      ℹ️
                    </div>
                    {showTooltip === 'description' && (
                      <div style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '0',
                        backgroundColor: 'rgb(31, 41, 55)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid rgb(55, 65, 81)',
                        zIndex: 10,
                        maxWidth: '200px',
                        whiteSpace: 'normal',
                      }}>
                        Write a compelling overview that highlights the project&apos;s purpose and impact
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ 
                        display: 'block',
                        color: 'rgb(229, 231, 235)', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                      }}>
                        Client
                      </label>
                      <input
                        type="text"
                        name="client"
                        placeholder="e.g., Apple, Startup Inc, John Smith"
                        value={formData.client}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('client')}
                        onBlur={() => setFocusedField('')}
                        style={getInputStyle('client')}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ 
                        display: 'block',
                        color: 'rgb(229, 231, 235)', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                      }}>
                        Date
                      </label>
                      <input
                        type="text"
                        name="date"
                        placeholder="e.g., January 2025, Q1 2024, 2023"
                        value={formData.date}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField('')}
                        style={getInputStyle('date')}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ 
                        display: 'block',
                        color: 'rgb(229, 231, 235)', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                      }}>
                        Services
                      </label>
                      <input
                        type="text"
                        name="services"
                        placeholder="e.g., Web Development, UI/UX Design, Branding"
                        value={formData.services}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('services')}
                        onBlur={() => setFocusedField('')}
                        style={getInputStyle('services')}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ 
                        display: 'block',
                        color: 'rgb(229, 231, 235)', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                      }}>
                        Industries
                      </label>
                      <input
                        type="text"
                        name="industries"
                        placeholder="e.g., Technology, Healthcare, E-commerce, Finance"
                        value={formData.industries}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('industries')}
                        onBlur={() => setFocusedField('')}
                        style={getInputStyle('industries')}
                      />
                    </div>
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Tags (comma separated)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="tags"
                      placeholder="e.g., Web design, UI/UX, Development, React, Mobile"
                      value={formData.tags}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('tags')}
                      onBlur={() => setFocusedField('')}
                      style={getInputStyle('tags')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        cursor: 'pointer',
                        color: 'rgb(156, 163, 175)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={() => setShowTooltip('tags')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      ℹ️
                    </div>
                    {showTooltip === 'tags' && (
                      <div style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '0',
                        backgroundColor: 'rgb(31, 41, 55)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid rgb(55, 65, 81)',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                      }}>
                        Separate tags with commas for better categorization
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgb(34, 197, 94)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}>
                      2
                    </div>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      margin: 0,
                    }}>
                      Images
                    </h3>
                    <span style={{ 
                      color: 'rgb(156, 163, 175)', 
                      fontSize: '14px',
                      fontWeight: '400',
                    }}>
                      • Visual content for your project
                    </span>
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Featured Image *
                  </label>
                  <input
                    type="file"
                    id="featured-image"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    style={fileInputStyle}
                  />
                  <label
                    htmlFor="featured-image"
                    style={{
                      ...fileButtonStyle,
                      backgroundColor: featuredImage ? 'rgba(34, 197, 94, 0.2)' : 'rgb(31, 41, 55)',
                      borderColor: featuredImage ? 'rgba(34, 197, 94, 0.5)' : 'rgb(55, 65, 81)',
                      color: featuredImage ? 'rgb(74, 222, 128)' : 'rgb(209, 213, 219)',
                    }}
                  >
                    {featuredImage ? '✓ Featured Image Selected' : '📁 Choose Featured Image *'}
                  </label>
                  {featuredImage && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      marginTop: '0.5rem',
                    }}>
                      <span style={{ color: 'rgb(74, 222, 128)', fontSize: '14px' }}>
                        📷 {featuredImage.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFeaturedImage(null)}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'rgb(74, 222, 128)',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '2px 6px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    marginTop: '1rem',
                  }}>
                    Gallery Images
                  </label>
                  <input
                    type="file"
                    id="gallery-images"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    style={fileInputStyle}
                  />
                  <label
                    htmlFor="gallery-images"
                    style={{
                      ...fileButtonStyle,
                      backgroundColor: galleryImages.length > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgb(31, 41, 55)',
                      borderColor: galleryImages.length > 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgb(55, 65, 81)',
                      color: galleryImages.length > 0 ? 'rgb(147, 197, 253)' : 'rgb(209, 213, 219)',
                    }}
                  >
                    {galleryImages.length > 0 ? `🖼️ ${galleryImages.length} Gallery Images` : '🖼️ Add Gallery Images'}
                  </label>

                  {galleryImages.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ color: 'rgb(229, 231, 235)', fontSize: '14px', marginBottom: '0.5rem' }}>
                        Gallery Images ({galleryImages.length}):
                      </p>
                      {galleryImages.map((file, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '0.5rem',
                          backgroundColor: 'rgb(31, 41, 55)',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                        }}>
                          <span style={{ color: 'white', fontSize: '14px' }}>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            style={{
                              backgroundColor: 'rgb(239, 68, 68)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              fontSize: '12px',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Challenge */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgb(245, 158, 11)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      color: 'black',
                    }}>
                      3
                    </div>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      margin: 0,
                    }}>
                      Challenge
                    </h3>
                    <span style={{ 
                      color: 'rgb(156, 163, 175)', 
                      fontSize: '14px',
                      fontWeight: '400',
                    }}>
                      • Problems you faced (optional)
                    </span>
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    name="challengeTitle"
                    placeholder="e.g., The Challenge, Problem Statement, Key Issues"
                    value={formData.challengeTitle}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('challengeTitle')}
                    onBlur={() => setFocusedField('')}
                    style={getInputStyle('challengeTitle')}
                  />

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Challenge Subtitle
                  </label>
                  <input
                    type="text"
                    name="challengeSubtitle"
                    placeholder="A brief, compelling subtitle that summarizes the main challenge"
                    value={formData.challengeSubtitle}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('challengeSubtitle')}
                    onBlur={() => setFocusedField('')}
                    style={getInputStyle('challengeSubtitle')}
                  />

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Challenge Content
                  </label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      name="challengeContent"
                      placeholder="What obstacles did you face? What problems needed solving? Describe the context and constraints..."
                      value={formData.challengeContent}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('challengeContent')}
                      onBlur={() => setFocusedField('')}
                      style={getTextareaStyle('challengeContent')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        cursor: 'pointer',
                        color: 'rgb(156, 163, 175)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={() => setShowTooltip('challengeContent')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      ℹ️
                    </div>
                    {showTooltip === 'challengeContent' && (
                      <div style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '0',
                        backgroundColor: 'rgb(31, 41, 55)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid rgb(55, 65, 81)',
                        zIndex: 10,
                        maxWidth: '200px',
                        whiteSpace: 'normal',
                      }}>
                        Explain the problems, constraints, and difficulties that made this project challenging
                      </div>
                    )}
                  </div>
                </div>

                {/* Solution */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgb(168, 85, 247)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}>
                      4
                    </div>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      margin: 0,
                    }}>
                      Solution
                    </h3>
                    <span style={{ 
                      color: 'rgb(156, 163, 175)', 
                      fontSize: '14px',
                      fontWeight: '400',
                    }}>
                      • How you solved it (optional)
                    </span>
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Solution Title
                  </label>
                  <input
                    type="text"
                    name="solutionTitle"
                    placeholder="e.g., Our Solution, The Approach, How We Solved It"
                    value={formData.solutionTitle}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('solutionTitle')}
                    onBlur={() => setFocusedField('')}
                    style={getInputStyle('solutionTitle')}
                  />

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Solution Content
                  </label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      name="solutionContent"
                      placeholder="How did you solve the challenges? What approach did you take? What technologies or methods were used?"
                      value={formData.solutionContent}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('solutionContent')}
                      onBlur={() => setFocusedField('')}
                      style={getTextareaStyle('solutionContent')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        cursor: 'pointer',
                        color: 'rgb(156, 163, 175)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={() => setShowTooltip('solutionContent')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      ℹ️
                    </div>
                    {showTooltip === 'solutionContent' && (
                      <div style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '0',
                        backgroundColor: 'rgb(31, 41, 55)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid rgb(55, 65, 81)',
                        zIndex: 10,
                        maxWidth: '200px',
                        whiteSpace: 'normal',
                      }}>
                        Describe your methodology, tools, and key decisions that led to success
                      </div>
                    )}
                  </div>

                  <label style={{ 
                    display: 'block',
                    color: 'rgb(229, 231, 235)', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    Additional Solution Content
                  </label>
                  <textarea
                    name="solutionAdditionalContent"
                    placeholder="Any additional implementation details, results achieved, or technical insights worth sharing..."
                    value={formData.solutionAdditionalContent}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('solutionAdditionalContent')}
                    onBlur={() => setFocusedField('')}
                    style={getTextareaStyle('solutionAdditionalContent')}
                  />
                </div>



                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...buttonStyle,
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgb(107, 114, 128)',
                        borderTop: '2px solid black',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }} />
                      Uploading Project...
                    </>
                  ) : (
                    <>
                      📤 Upload Project
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'white', 
                  fontSize: '24px', 
                  fontWeight: '600',
                  margin: 0,
                }}>
                  My Projects ({projects.length})
                </h2>
                {projects.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgb(156, 163, 175)',
                      fontSize: '14px',
                    }}>
                      {updatingOrder ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgb(55, 65, 81)',
                            borderTop: '2px solid rgb(156, 163, 175)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }} />
                          Updating...
                        </>
                      ) : (
                        <>
                          ↕️ Drag to reorder
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={handleUpdateOrder}
                      disabled={updatingOrder || loadingProjects}
                      style={{
                        backgroundColor: updatingOrder ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)',
                        color: updatingOrder ? 'rgb(107, 114, 128)' : 'rgb(147, 197, 253)',
                        border: `1px solid ${updatingOrder ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.5)'}`,
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: updatingOrder ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!updatingOrder) {
                          (e.target as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!updatingOrder) {
                          (e.target as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                        }
                      }}
                    >
                      {updatingOrder ? (
                        <>
                          <div style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid rgb(55, 65, 81)',
                            borderTop: '2px solid rgb(147, 197, 253)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }} />
                          Updating...
                        </>
                      ) : (
                        <>
                          🔄 Update Order
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {projects.length > 1 && (
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '14px',
                  color: 'rgb(147, 197, 253)',
                }}>
                  💡 <strong>How to reorder:</strong> 
                  <br />1. Drag projects up/down to rearrange them visually
                  <br />2. Click &quot;Update Order&quot; to save this sequence to your portfolio
                  <br />3. Your portfolio will immediately show the new order
                </div>
              )}
              
              {loadingProjects ? (
                <div style={cardStyle}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '2rem',
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgb(55, 65, 81)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    <span style={{ color: 'rgb(156, 163, 175)' }}>Loading projects...</span>
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div style={cardStyle}>
                  <p style={{ color: 'rgb(156, 163, 175)', textAlign: 'center', margin: 0 }}>
                    No projects uploaded yet. Start by uploading your first project!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {projects.map((project, index) => (
                    <div 
                      key={project._id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, project._id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, project._id)}
                      style={{
                        ...cardStyle,
                        marginBottom: 0,
                        cursor: 'grab',
                        opacity: draggedProject === project._id ? 0.5 : 1,
                        transform: draggedProject === project._id ? 'rotate(2deg)' : 'none',
                        transition: 'all 0.2s ease',
                        border: `1px solid ${draggedProject === project._id ? 'rgb(59, 130, 246)' : 'rgb(55, 65, 81)'}`,
                        position: 'relative',
                      }}
                      onMouseDown={(e) => {
                        (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget as HTMLElement).style.cursor = 'grab';
                      }}
                    >
                      {/* Order indicator */}
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-8px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'rgb(59, 130, 246)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '2px solid rgb(17, 24, 39)',
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {/* Project Image */}
                        {project.featuredImage && (
                          <div style={{
                            width: '120px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: 'rgb(31, 41, 55)',
                          }}>
                            <img
                              src={project.featuredImage}
                              alt={project.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Project Details */}
                        <div style={{ flex: 1 }}>
                          {editingProject === project._id ? (
                            // Edit Mode
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {/* Title Input */}
                              <input
                                type="text"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditInputChange}
                                style={{
                                  backgroundColor: 'rgb(31, 41, 55)',
                                  border: '1px solid rgb(59, 130, 246)',
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  padding: '6px 8px',
                                  outline: 'none',
                                }}
                                placeholder="Project title"
                              />
                              
                              {/* Description Textarea */}
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditInputChange}
                                style={{
                                  backgroundColor: 'rgb(31, 41, 55)',
                                  border: '1px solid rgb(59, 130, 246)',
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '14px',
                                  padding: '6px 8px',
                                  outline: 'none',
                                  minHeight: '60px',
                                  resize: 'vertical' as const,
                                }}
                                placeholder="Project description"
                              />
                              
                              {/* Client and Date Row */}
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                  type="text"
                                  name="client"
                                  value={editFormData.client}
                                  onChange={handleEditInputChange}
                                  style={{
                                    flex: 1,
                                    backgroundColor: 'rgb(31, 41, 55)',
                                    border: '1px solid rgb(55, 65, 81)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '4px 6px',
                                    outline: 'none',
                                  }}
                                  placeholder="Client"
                                />
                                <input
                                  type="text"
                                  name="date"
                                  value={editFormData.date}
                                  onChange={handleEditInputChange}
                                  style={{
                                    flex: 1,
                                    backgroundColor: 'rgb(31, 41, 55)',
                                    border: '1px solid rgb(55, 65, 81)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '4px 6px',
                                    outline: 'none',
                                  }}
                                  placeholder="Date"
                                />
                              </div>
                              
                              {/* Services and Industries Row */}
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                  type="text"
                                  name="services"
                                  value={editFormData.services}
                                  onChange={handleEditInputChange}
                                  style={{
                                    flex: 1,
                                    backgroundColor: 'rgb(31, 41, 55)',
                                    border: '1px solid rgb(55, 65, 81)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '4px 6px',
                                    outline: 'none',
                                  }}
                                  placeholder="Services"
                                />
                                <input
                                  type="text"
                                  name="industries"
                                  value={editFormData.industries}
                                  onChange={handleEditInputChange}
                                  style={{
                                    flex: 1,
                                    backgroundColor: 'rgb(31, 41, 55)',
                                    border: '1px solid rgb(55, 65, 81)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '4px 6px',
                                    outline: 'none',
                                  }}
                                  placeholder="Industries"
                                />
                              </div>
                              
                              {/* Tags Input */}
                              <input
                                type="text"
                                name="tags"
                                value={editFormData.tags}
                                onChange={handleEditInputChange}
                                style={{
                                  backgroundColor: 'rgb(31, 41, 55)',
                                  border: '1px solid rgb(55, 65, 81)',
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '12px',
                                  padding: '4px 6px',
                                  outline: 'none',
                                }}
                                placeholder="Tags (comma separated)"
                              />
                              
                              {/* Featured Image Section */}
                              <div style={{ 
                                border: '1px solid rgb(55, 65, 81)', 
                                borderRadius: '4px', 
                                padding: '8px',
                                backgroundColor: 'rgb(31, 41, 55)'
                              }}>
                                <div style={{ 
                                  fontSize: '12px', 
                                  color: 'rgb(156, 163, 175)', 
                                  marginBottom: '6px',
                                  fontWeight: '500'
                                }}>
                                  Featured Image:
                                </div>
                                
                                {editImagePreview ? (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    marginBottom: '6px'
                                  }}>
                                    <img 
                                      src={editImagePreview} 
                                      alt="Preview" 
                                      style={{
                                        width: '60px',
                                        height: '40px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        border: '1px solid rgb(55, 65, 81)'
                                      }} 
                                    />
                                    <button
                                      type="button"
                                      onClick={removeEditImage}
                                      style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                        color: 'rgb(248, 113, 113)',
                                        border: '1px solid rgba(239, 68, 68, 0.5)',
                                        borderRadius: '4px',
                                        padding: '2px 6px',
                                        fontSize: '10px',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ 
                                    color: 'rgb(107, 114, 128)', 
                                    fontSize: '11px',
                                    marginBottom: '6px'
                                  }}>
                                    No image selected
                                  </div>
                                )}
                                
                                <div style={{ position: 'relative' }}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    style={{
                                      position: 'absolute',
                                      opacity: 0,
                                      width: '100%',
                                      height: '100%',
                                      cursor: 'pointer',
                                    }}
                                    id={`file-input-${project._id}`}
                                  />
                                  <label
                                    htmlFor={`file-input-${project._id}`}
                                    style={{
                                      display: 'inline-block',
                                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                      color: 'rgb(147, 197, 253)',
                                      border: '1px solid rgba(59, 130, 246, 0.5)',
                                      borderRadius: '4px',
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      cursor: 'pointer',
                                      fontWeight: '500',
                                      width: '100%',
                                      textAlign: 'center' as const,
                                      boxSizing: 'border-box' as const,
                                    }}
                                  >
                                    📁 Choose Image File
                                  </label>
                                </div>
                              </div>
                              
                              {/* Edit Action Buttons */}
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                  onClick={() => saveProject(project._id)}
                                  disabled={uploadingImage}
                                  style={{
                                    backgroundColor: uploadingImage ? 'rgba(107, 114, 128, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                    color: uploadingImage ? 'rgb(107, 114, 128)' : 'rgb(74, 222, 128)',
                                    border: `1px solid ${uploadingImage ? 'rgba(107, 114, 128, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                    fontWeight: '500',
                                    opacity: uploadingImage ? 0.7 : 1,
                                  }}
                                >
                                  {uploadingImage ? '⏳ Saving...' : '✓ Save'}
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  style={{
                                    backgroundColor: 'rgba(156, 163, 175, 0.2)',
                                    color: 'rgb(156, 163, 175)',
                                    border: '1px solid rgba(156, 163, 175, 0.5)',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                  }}
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{
                                  color: 'white',
                                  fontSize: '18px',
                                  fontWeight: '600',
                                  margin: 0,
                                }}>
                                  {project.title}
                                </h3>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: project.isPublished ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                                  color: project.isPublished ? 'rgb(74, 222, 128)' : 'rgb(156, 163, 175)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}>
                                  {project.isPublished ? '✓ Published' : '⊝ Draft'}
                                </div>
                              </div>
                              
                              <p style={{
                                color: 'rgb(156, 163, 175)',
                                fontSize: '14px',
                                margin: '0 0 0.5rem 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {project.description}
                              </p>
                              
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: 'rgb(107, 114, 128)' }}>
                                {project.client && (
                                  <span>Client: {project.client}</span>
                                )}
                                {project.date && (
                                  <span>Date: {project.date}</span>
                                )}
                                {project.galleryImages && project.galleryImages.length > 0 && (
                                  <span>Gallery: {project.galleryImages.length} images</span>
                                )}
                              </div>
                              
                              {project.tags && project.tags.length > 0 && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  {project.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      style={{
                                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                        color: 'rgb(147, 197, 253)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {project.tags.length > 3 && (
                                    <span style={{
                                      color: 'rgb(107, 114, 128)',
                                      fontSize: '10px',
                                      padding: '2px 6px',
                                    }}>
                                      +{project.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Drag Handle */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          color: 'rgb(107, 114, 128)',
                          fontSize: '16px',
                          cursor: 'grab',
                        }}>
                          ⋮⋮
                        </div>
                        
                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button
                            style={{
                              backgroundColor: 'rgba(245, 158, 11, 0.2)',
                              color: 'rgb(251, 191, 36)',
                              border: '1px solid rgba(245, 158, 11, 0.5)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            onClick={() => startEditing(project)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            style={{
                              backgroundColor: project.isPublished ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                              color: project.isPublished ? 'rgb(248, 113, 113)' : 'rgb(74, 222, 128)',
                              border: `1px solid ${project.isPublished ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/projects/${project._id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    isPublished: !project.isPublished
                                  }),
                                });
                                const result = await response.json();
                                if (result.success) {
                                  fetchProjects(); // Refresh the list
                                } else {
                                  alert('Failed to update project status');
                                }
                              } catch (error) {
                                console.error('Error updating project:', error);
                                alert('Failed to update project status');
                              }
                            }}
                          >
                            {project.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: 'rgb(147, 197, 253)',
                              border: '1px solid rgba(59, 130, 246, 0.5)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              window.open(`/project-details/${project._id}`, '_blank');
                            }}
                          >
                            View
                          </button>
                          <button
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: 'rgb(248, 113, 113)',
                              border: '1px solid rgba(239, 68, 68, 0.5)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this project?')) {
                                try {
                                  const response = await fetch(`/api/projects/${project._id}`, {
                                    method: 'DELETE',
                                  });
                                  const result = await response.json();
                                  if (result.success) {
                                    fetchProjects(); // Refresh the list
                                  } else {
                                    alert('Failed to delete project');
                                  }
                                } catch (error) {
                                  console.error('Error deleting project:', error);
                                  alert('Failed to delete project');
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '600',
                marginBottom: '2rem',
                margin: '0 0 2rem 0',
              }}>
                Settings
              </h2>
              <div style={cardStyle}>
                <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
                  Settings panel coming soon...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default Dashboard;
