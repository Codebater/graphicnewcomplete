import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

// Get project data from MongoDB
const getProjectData = async (id: string) => {
  try {
    await connectDB();
    
    // Try to fetch from database first
    const project = await Project.findById(id).lean() as any;
    
    if (project) {
      // Fetch adjacent projects for navigation
      let prevProject = null;
      let nextProject = null;
      
      try {
        // Get previous project (older)
        const prevProjectData = await Project.findOne({
          createdAt: { $lt: project.createdAt },
          isPublished: true
        }).sort({ createdAt: -1 }).lean() as any;
        
        if (prevProjectData) {
          prevProject = {
            id: prevProjectData._id.toString(),
            title: prevProjectData.title
          };
        }
        
        // Get next project (newer)
        const nextProjectData = await Project.findOne({
          createdAt: { $gt: project.createdAt },
          isPublished: true
        }).sort({ createdAt: 1 }).lean() as any;
        
        if (nextProjectData) {
          nextProject = {
            id: nextProjectData._id.toString(),
            title: nextProjectData.title
          };
        }
      } catch (error) {
        console.error('Error fetching adjacent projects:', error);
      }
      
      // Transform database project to match expected format
      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        client: project.client || 'Graphiq.Art',
        services: project.services || 'Creative Development',
        industries: project.industries || 'Digital',
        date: project.date || new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        tags: project.tags || ['Design', 'Development'],
        challenge: {
          title: project.challenge?.title || 'Challenge',
          subtitle: project.challenge?.subtitle || 'Creative challenges require innovative solutions.',
          content: project.challenge?.content || 'This project presented unique challenges that required creative problem-solving and innovative approaches to deliver exceptional results.'
        },
        solution: {
          title: project.solution?.title || 'Solution',
          content: project.solution?.content || 'We developed a comprehensive solution that addresses all project requirements.',
          additionalContent: project.solution?.additionalContent || 'The implementation exceeded expectations and delivered outstanding results.'
        },
        feedback: {
          title: "Client's feedback",
          content: 'Amazing work! The team delivered exceptional results that exceeded our expectations.',
          clientName: project.client || 'Satisfied Client',
          clientPosition: 'Project Manager at',
          clientCompany: 'Amazing Company'
        },
        images: (project.galleryImages || [
          'https://dummyimage.com/1400x1000/2d2d2d/838383',
          'https://dummyimage.com/1200x1200/4d4d4d/838383',
          'https://dummyimage.com/1400x1000/2d2d2d/838383',
          'https://dummyimage.com/1200x1200/4d4d4d/838383'
        ]).slice(0, 4),
        prevProject,
        nextProject
      };
    }
  } catch (error) {
    console.error('Error fetching project from database:', error);
  }
  
  // Fallback to mock data if database fetch fails
  const mockProjects = {
    '1': {
      id: '1',
      title: 'Studio template',
      description: 'Inspiring ideas, creative insights, and the latest in design and tech. Fueling innovation for your digital journey.',
      client: 'Mix Design',
      services: 'Web development',
      industries: 'HTML template',
      date: 'January 2025',
      tags: ['Web design', 'UI/UX design', 'Development', 'Branding'],
      challenge: {
        title: 'Challenge',
        subtitle: 'Donec maximus lorem quam, a aliquam erat aliquam quis. Sed accumsan sagittis condimentum. Proin eu nulla.',
        content: 'Nunc vel ligula tincidunt, fermentum velit ac, sodales eros. Vivamus ac leo in arcu accumsan condimentum. Nullam ac est quis dolor scelerisque interdum in at risus. Pellentesque mattis est vel maximus posuere. Integer tristique ipsum velit, vitae gravida purus laoreet.'
      },
      solution: {
        title: 'Solution',
        content: 'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque ut arcu pulvinar, rhoncus libero id, lobortis metus. Morbi tristique dolor sit amet turpis faucibus malesuada.',
        additionalContent: 'Morbi non ipsum vel risus scelerisque sagittis nec a ipsum. Nulla odio neque, feugiat a arcu et, tristique cursus diam. Duis consectetur massa nibh, ut rhoncus nibh vestibulum in. Sed imperdiet metus sed arcu efficitur posuere.'
      },
      feedback: {
        title: "Client's feedback",
        content: 'Working with Rayo team was an absolute pleasure! They took the time to understand our business needs and translated them into a beautifully designed, user-friendly website. The team\'s attention to detail, creativity, and technical expertise exceeded our expectations. We\'ve received so much positive feedback from our customers already.',
        clientName: 'Lea Tomato',
        clientPosition: 'Senior designer in',
        clientCompany: 'The Way'
      },
      images: [
        'https://dummyimage.com/1400x1000/2d2d2d/838383',
        'https://dummyimage.com/1200x1200/4d4d4d/838383',
        'https://dummyimage.com/1400x1000/3d3d3d/838383',
        'https://dummyimage.com/1200x1200/5d5d5d/838383'
      ],
      prevProject: {
        id: '2',
        title: 'Mobile app design'
      },
      nextProject: {
        id: '3',
        title: 'AI experiments'
      }
    },
    '2': {
      id: '2',
      title: 'Mobile app design',
      description: 'Cross-platform mobile application design with modern UI/UX principles.',
      client: 'Tech Startup',
      services: 'Mobile development',
      industries: 'Mobile app',
      date: 'February 2025',
      tags: ['Mobile', 'UI/UX', 'React Native', 'Design'],
      challenge: {
        title: 'Challenge',
        subtitle: 'Creating a seamless mobile experience across multiple platforms.',
        content: 'The challenge was to design a mobile application that works consistently across iOS and Android platforms while maintaining a native feel and performance.'
      },
      solution: {
        title: 'Solution',
        content: 'Implemented React Native with custom components and animations.',
        additionalContent: 'Used platform-specific design patterns and optimized performance for both platforms.'
      },
      feedback: {
        title: "Client's feedback",
        content: 'The mobile app exceeded our expectations. The design is intuitive and the performance is outstanding.',
        clientName: 'John Smith',
        clientPosition: 'Product Manager at',
        clientCompany: 'TechCorp'
      },
      images: [
        'https://dummyimage.com/1400x1000/2d2d2d/838383',
        'https://dummyimage.com/1200x1200/4d4d4d/838383',
        'https://dummyimage.com/1400x1000/3d3d3d/838383',
        'https://dummyimage.com/1200x1200/5d5d5d/838383'
      ],
      prevProject: {
        id: '1',
        title: 'Studio template'
      },
      nextProject: {
        id: '3',
        title: 'AI experiments'
      }
    },
    '3': {
      id: '3',
      title: 'AI experiments',
      description: 'Exploring the intersection of artificial intelligence and creative design.',
      client: 'AI Research Lab',
      services: 'AI development',
      industries: 'Technology',
      date: 'March 2025',
      tags: ['AI', 'Machine Learning', 'Creative', 'Innovation'],
      challenge: {
        title: 'Challenge',
        subtitle: 'Integrating AI capabilities into creative design workflows.',
        content: 'The challenge was to develop AI-powered tools that enhance creative processes while maintaining human artistic control.'
      },
      solution: {
        title: 'Solution',
        content: 'Built custom AI models for design generation and optimization.',
        additionalContent: 'Created an intuitive interface that allows designers to collaborate with AI systems effectively.'
      },
      feedback: {
        title: "Client's feedback",
        content: 'The AI integration has revolutionized our design process. We can now explore ideas faster than ever.',
        clientName: 'Dr. Sarah Chen',
        clientPosition: 'Research Director at',
        clientCompany: 'AI Lab'
      },
      images: [
        'https://dummyimage.com/1400x1000/2d2d2d/838383',
        'https://dummyimage.com/1200x1200/4d4d4d/838383',
        'https://dummyimage.com/1400x1000/3d3d3d/838383',
        'https://dummyimage.com/1200x1200/5d5d5d/838383'
      ],
      prevProject: {
        id: '2',
        title: 'Mobile app design'
      },
      nextProject: {
        id: '1',
        title: 'Studio template'
      }
    }
  };

  return mockProjects[id as keyof typeof mockProjects] || mockProjects['1'];
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectData(id);
  
  return {
    title: `${project.title} - Project Details - Graphiq.art`,
    description: project.description,
    keywords: project.tags.join(', '),
    openGraph: {
      title: `${project.title} - Project Details`,
      description: project.description,
      url: `/project-details/${id}`,
      siteName: 'Graphiq.art',
      type: 'website',
    },
  };
}

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectData(id);

  return (
    <>
      {/* Loader */}
      <div id="loader" className="loader">
        <div className="loader__wrapper">
          <div className="loader__content">
            <div className="loader__count">
              <span className="count__text">0</span>
              <span className="count__percent">%</span>
            </div>
          </div>
        </div>
      </div>

      <Header />

      {/* Page Content */}
      <main id="mxd-page-content" className="mxd-page-content inner-page-content">

        {/* Section - Inner Page Headline */}
        <div className="mxd-section mxd-section-inner-headline padding-default">
          <div className="mxd-container grid-container">
          
            {/* Block - Inner Page Headline */}
            <div className="mxd-block loading-wrap">
              <div className="container-fluid px-0">
                <div className="row gx-0">

                  {/* Inner Headline Name */}
                  <div className="col-12 col-xl-2 mxd-grid-item no-margin">
                    <div className="mxd-block__name name-project-link loading__fade">
                      <Link className="btn btn-anim btn-line-small btn-muted slide-right-up" href="/portfolio">
                        <span className="btn-caption">Project Page</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>

                  {/* Inner Headline Content */}
                  <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__inner-headline loading__item">
                        <h1 className="inner-headline__title">{project.title}</h1>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="row g-0">
                  <div className="col-12 col-xl-2"></div>

                  {/* Inner Headline Paragraph & Data */}
                  <div className="col-12 col-xl-6 mxd-grid-item no-margin">

                    <div className="inner-headline__paragraph loading__item">
                      <p>{project.description}</p>
                    </div>

                    <div className="inner-headline__data">
                      <div className="mxd-data-list">
                        <div className="container-fluid p-0">
                          <div className="row g-0">
                            <div className="col-12 col-md-6 col-xl-5 mxd-data-list__column loading__item">
                              <div className="mxd-data-list__item">
                                <p className="mxd-data-list__name">Client</p>
                                <p className="mxd-data-list__content">{project.client}</p>
                              </div>
                              <div className="mxd-data-list__item">
                                <p className="mxd-data-list__name">Services</p>
                                <p className="mxd-data-list__content">{project.services}</p>
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-5 mxd-data-list__column loading__item">
                              <div className="mxd-data-list__item">
                                <p className="mxd-data-list__name">Industries</p>
                                <p className="mxd-data-list__content">{project.industries}</p>
                              </div>
                              <div className="mxd-data-list__item">
                                <p className="mxd-data-list__name">Date</p>
                                <p className="mxd-data-list__content">{project.date}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* Inner Headline Tags */}
                  <div className="col-12 col-xl-4 mxd-grid-item no-margin">
                    <div className="inner-headline__tags loading__fade">
                      {project.tags.map((tag: string, index: number) => (
                        <span key={index} className="tag tag-default tag-outline-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>


        {/* Section - Project Details */}
        <div className="mxd-section mxd-project overflow-hidden">
          <div className="mxd-container grid-container">
          
            {/* Project Block - Challenge Description */}
            <div className="mxd-project__block pre-grid">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                    <div className="mxd-project__subtitle">
                      <h2 className="reveal-type anim-uni-in-up">{project.challenge.title}</h2>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                    <div className="mxd-project__content">
                      <div className="mxd-project__paragraph">
                        <p className="t-large t-bright anim-uni-in-up">{project.challenge.subtitle}</p>
                        <p className="anim-uni-in-up">{project.challenge.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Block - Images Cards */}
            <div className="mxd-project__block no-margin">
              <div className="mxd-project-cards">
                <div className="container-fluid px-0">
                  <div className="row gx-0">
                    {project.images.map((image: string, index: number) => (
                      <div key={index} className={`col-12 col-xl-${index % 2 === 0 ? '5' : '7'} mxd-project-cards__item mxd-grid-item ${index % 2 === 0 ? 'anim-uni-scale-in-right' : 'anim-uni-scale-in-left'}`}>
                        <div className={`mxd-project-cards__inner align-end ${index === 0 ? 'bg-accent' : 'bg-base-tint'} radius-m`}>
                          <img src={image} alt={`Project Preview ${index + 1}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Block - Solution Description */}
            <div className="mxd-project__block">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                    <div className="mxd-project__subtitle">
                      <h2 className="reveal-type anim-uni-in-up">{project.solution.title}</h2>
                    </div>
                  </div> 
                  <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                    <div className="mxd-project__content">
                      <div className="mxd-project__paragraph medium-text">
                        <p className="anim-uni-in-up">{project.solution.content}</p>
                        <p className="anim-uni-in-up">{project.solution.additionalContent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Block - Parallax Fullwidth Image */}
            <div className="mxd-project__block mxd-grid-item no-margin">
              
            </div>

        

            {/* Project Block - Project Navigation */}
            <div className="mxd-project__block no-margin">
              <div className="mxd-project__nav">
                <div className="mxd-project__divider anim-uni-in-up"></div>
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    {project.prevProject ? (
                      <div className="col-6 mxd-project__navitem left mxd-grid-item no-margin anim-uni-in-up">
                        <Link className="btn btn-anim btn-line-small btn-muted anim-no-delay slide-left" href={`/project-details/${project.prevProject.id}`}>
                          <i className="ph ph-arrow-left"></i>
                          <span className="btn-caption">Prev</span>
                        </Link>
                        <Link className="mxd-project__link anim-uni-in-up" href={`/project-details/${project.prevProject.id}`}>
                          <span>{project.prevProject.title}</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="col-6 mxd-project__navitem left mxd-grid-item no-margin anim-uni-in-up">
                        <Link className="btn btn-anim btn-line-small btn-muted anim-no-delay slide-left" href="/portfolio">
                          <i className="ph ph-arrow-left"></i>
                          <span className="btn-caption">Back to Portfolio</span>
                        </Link>
                      </div>
                    )}
                    
                    {project.nextProject ? (
                      <div className="col-6 mxd-project__navitem right mxd-grid-item no-margin anim-uni-in-up">
                        <Link className="btn btn-anim btn-line-small btn-muted anim-no-delay slide-right" href={`/project-details/${project.nextProject.id}`}>
                          <span className="btn-caption">Next</span>
                          <i className="ph ph-arrow-right"></i>
                        </Link>
                        <Link className="mxd-project__link anim-uni-in-up" href={`/project-details/${project.nextProject.id}`}>
                          <span>{project.nextProject.title}</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="col-6 mxd-project__navitem right mxd-grid-item no-margin anim-uni-in-up">
                        <Link className="btn btn-anim btn-line-small btn-muted anim-no-delay slide-right" href="/portfolio">
                          <span className="btn-caption">View All Projects</span>
                          <i className="ph ph-arrow-right"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
 
        {/* Section - CTA */}
        <div className="mxd-section overflow-hidden">
          <div className="mxd-container">
            <div className="mxd-block">
              <div className="mxd-promo">
                <div className="mxd-promo__inner anim-zoom-out-container">
                  <div className="mxd-promo__content">
                    <p className="mxd-promo__title anim-uni-in-up">
                      {/* <span className="mxd-promo__icon">
                        <Image src="/emoji.png" alt="Icon" width={60} height={60} />
                      </span> */}
                      <span className="mxd-promo__caption reveal-type">Let&apos;s talk about your project!</span>
                    </p>
                    {/* <div className="mxd-promo__controls anim-uni-in-up">
                      <Link className="btn btn-anim btn-default btn-large btn-additional slide-right-up" href="/contact">
                        <span className="btn-caption">Contact Us</span>
                        <i className="ph-bold ph-arrow-up-right"></i>
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />

      {/* To Top Button */}
      <Link href="#0" id="to-top" className="btn btn-to-top slide-up anim-no-delay">
        <i className="ph ph-arrow-up"></i>
      </Link>
    </>
  );
} 