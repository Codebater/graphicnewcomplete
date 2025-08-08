'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description: string;
  client?: string;
  services?: string;
  industries?: string;
  date?: string;
  tags?: string[];
  featuredImage?: string;
  galleryImages?: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const DynamicPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter
      const timestamp = Date.now();
      const response = await fetch(`/api/projects?published=true&_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const result = await response.json();
      
      if (result.success) {
        // Projects are already sorted by sortOrder from the API
        console.log('Fetched projects in order:', result.data.map((p: Project, i: number) => ({
          index: i + 1,
          title: p.title,
          sortOrder: p.sortOrder,
          id: p._id
        })));
        setProjects(result.data);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Error loading projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectTags = (project: Project) => {
    // Combine available tags from different sources
    const allTags = [];
    
    if (project.tags && project.tags.length > 0) {
      allTags.push(...project.tags);
    }
    
    if (project.services) {
      allTags.push(project.services);
    }
    
    if (project.industries) {
      allTags.push(project.industries);
    }
    
    // Return first 3 unique tags
    return [...new Set(allTags)].slice(0, 3);
  };

  const extractPreviewText = (description: string, maxLength: number = 60) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="row g-0 mxd-projects-masonry__gallery">
        {/* Title section */}
        <div className="col-12 col-xl-6 mxd-projects-masonry__title headline-title">
          <div className="mxd-block__inner-headline">
            <h1 className="inner-headline__title headline-img-before headline-img-07">
              Projects<br/>to explore
            </h1>
          </div>
        </div>
        
        {/* Loading state */}
        <div className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item">
          <div className="mxd-project-item__media masonry-media" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <p>Loading projects...</p>
            </div>
          </div>
        </div>
        
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
  }

  if (error) {
    return (
      <div className="row g-0 mxd-projects-masonry__gallery">
        {/* Title section */}
        <div className="col-12 col-xl-6 mxd-projects-masonry__title headline-title">
          <div className="mxd-block__inner-headline">
            <h1 className="inner-headline__title headline-img-before headline-img-07">
              Projects<br/>to explore
            </h1>
          </div>
        </div>
        
        {/* Error state */}
        <div className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item">
          <div className="mxd-project-item__media masonry-media" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'rgba(239, 68, 68, 0.8)',
              textAlign: 'center',
            }}>
              <p>❌ {error}</p>
              <button 
                onClick={fetchProjects}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="row g-0 mxd-projects-masonry__gallery">
        {/* Title section */}
        <div className="col-12 col-xl-6 mxd-projects-masonry__title headline-title">
          <div className="mxd-block__inner-headline">
            <h1 className="inner-headline__title headline-img-before headline-img-07">
              Projects<br/>to explore
            </h1>
          </div>
        </div>
        
        {/* Empty state */}
        <div className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item">
          <div className="mxd-project-item__media masonry-media" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
            }}>
              <p>📂 No published projects yet</p>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>
                Projects will appear here once they are published
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-0 mxd-projects-masonry__gallery" data-masonry='{"percentPosition": true }'>
      {/* Portfolio gallery title */}
      <div className="col-12 col-xl-6 mxd-projects-masonry__title headline-title">
        <div className="mxd-block__inner-headline">
          <h1 className="inner-headline__title headline-img-before headline-img-07">
            Projects<br/>to explore
          </h1>
        </div>
      </div>
      
      {/* Dynamic project items */}
      {projects.map((project, index) => {
        const tags = getProjectTags(project);
        const previewClasses = [
          'preview-image-1',
          'preview-image-2', 
          'preview-image-3',
          'preview-image-4',
          'preview-image-5',
          'preview-image-6'
        ];
        const previewClass = previewClasses[index % previewClasses.length];
        
        return (
          <div key={project._id} className="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item">
            <Link className="mxd-project-item__media masonry-media" href={`/project-details/${project._id}`}>
              <div className={`mxd-project-item__preview masonry-preview ${previewClass} parallax-img-small`}>
                {project.featuredImage ? (
                  <img 
                    src={project.featuredImage} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                  }}>
                    📁
                  </div>
                )}
              </div>
              <div className="mxd-project-item__tags">
                {tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="tag tag-default tag-permanent">
                    {tag}
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="tag tag-default tag-permanent">Project</span>
                )}
              </div>
            </Link>
            <div className="mxd-project-item__promo masonry-promo">
              <div className="mxd-project-item__name">
                <Link href={`/project-details/${project._id}`}>
                  <span>{project.title}</span> {project.description && extractPreviewText(project.description)}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicPortfolio;
