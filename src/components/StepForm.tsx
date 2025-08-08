'use client';

import { useState, useEffect } from 'react';
import { submitToFormspree, getSuccessMessage, getErrorMessage } from '@/lib/formspree';

interface FormData {
  service: string;
  date: string;
  time: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  budget: string;
}

const services = [
  {
    id: 'consultation',
    title: 'Design Consultation',
    description: 'Strategic design guidance and planning',
    duration: '30 min',
    icon: '🎨'
  },
  {
    id: 'web-design',
    title: 'Web Design',
    description: 'Custom website design and development',
    duration: '60 min',
    icon: '💻'
  },
  {
    id: 'branding',
    title: 'Brand Identity',
    description: 'Logo design and brand development',
    duration: '45 min',
    icon: '🏷️'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'User interface and experience design',
    duration: '60 min',
    icon: '📱'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const budgetRanges = [
  '< $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000+'
];

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    service: '',
    date: '',
    time: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 20) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit to Formspree using utility function
      await submitToFormspree(
        {
          service: formData.service,
          date: formData.date,
          time: formData.time,
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          budget: formData.budget,
        },
        {
          subject: `New consultation request from ${formData.name}`,
          replyTo: formData.email,
        }
      );

      setShowSuccess(true);
      // Reset form data
      setFormData({
        service: '',
        date: '',
        time: '',
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
        budget: ''
      });
      setCurrentStep(1); // Reset to first step
    } catch (error) {
      console.error('Form submission error:', error);
      alert(getErrorMessage());
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.service !== '';
      case 2:
        return formData.date !== '' && formData.time !== '';
      case 3:
        return formData.name !== '' && formData.email !== '' && formData.message !== '';
      default:
        return true;
    }
  };

  if (showSuccess) {
    return (
      <div className="step-form-success text-center">
        <div className="success-icon">
          <i className="ph-fill ph-check-circle" style={{ fontSize: '4rem', color: '#22c55e' }}></i>
        </div>
        <h3 className="success-title">Booking Confirmed!</h3>
        <p className="success-message">
          Thank you for scheduling a {services.find(s => s.id === formData.service)?.title} session.
          <br />
          We&apos;ll send you a confirmation email shortly with meeting details.
        </p>
        <div className="booking-details">
          <div className="detail-item">
            <strong>Date:</strong> {formatDate(new Date(formData.date))}
          </div>
          <div className="detail-item">
            <strong>Time:</strong> {formData.time}
          </div>
          <div className="detail-item">
            <strong>Duration:</strong> {services.find(s => s.id === formData.service)?.duration}
          </div>
        </div>
        <button 
          className="btn btn-default btn-large"
          onClick={() => {
            setShowSuccess(false);
            setCurrentStep(1);
            setFormData({
              service: '',
              date: '',
              time: '',
              name: '',
              company: '',
              email: '',
              phone: '',
              message: '',
              budget: ''
            });
          }}
        >
          Book Another Meeting
        </button>
      </div>
    );
  }

  return (
    <div className="step-form-container">
      {/* Progress Bar */}
      <div className="step-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="step-indicators">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`step-indicator ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-content">
        {currentStep === 1 && (
          <div className="step step-service">
            <h2 className="step-title">What service do you need?</h2>
            <p className="step-subtitle">Select the type of consultation or project you&apos;d like to discuss.</p>
            
            <div className="service-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${formData.service === service.id ? 'selected' : ''}`}
                  onClick={() => updateFormData('service', service.id)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <span className="service-duration">{service.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step step-datetime">
            <h2 className="step-title">When would you like to meet?</h2>
            <p className="step-subtitle">Choose your preferred date and time for the {services.find(s => s.id === formData.service)?.title} session.</p>
            
            <div className="datetime-container">
              <div className="date-selection">
                <h3>Select Date</h3>
                <div className="date-grid">
                  {availableDates.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    return (
                      <div
                        key={index}
                        className={`date-card ${formData.date === dateString ? 'selected' : ''}`}
                        onClick={() => updateFormData('date', dateString)}
                      >
                        <div className="date-day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="date-number">{date.getDate()}</div>
                        <div className="date-month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {formData.date && (
                <div className="time-selection">
                  <h3>Select Time</h3>
                  <div className="time-grid">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className={`time-card ${formData.time === time ? 'selected' : ''}`}
                        onClick={() => updateFormData('time', time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step step-details">
            <h2 className="step-title">Tell us about yourself</h2>
            <p className="step-subtitle">Please provide your contact information and project details.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group full-width">
                <label>Project Budget</label>
                <select
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Project Details *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step step-confirmation">
            <h2 className="step-title">Confirm your booking</h2>
            <p className="step-subtitle">Please review your meeting details before confirming.</p>
            
            <div className="confirmation-details">
              <div className="detail-section">
                <h3>Service</h3>
                <div className="service-summary">
                  <span className="service-emoji">{services.find(s => s.id === formData.service)?.icon}</span>
                  <div>
                    <strong>{services.find(s => s.id === formData.service)?.title}</strong>
                    <p>{services.find(s => s.id === formData.service)?.description}</p>
                    <span className="duration">Duration: {services.find(s => s.id === formData.service)?.duration}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Date & Time</h3>
                <p><strong>{formatDate(new Date(formData.date))}</strong></p>
                <p>at {formData.time}</p>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <p><strong>{formData.name}</strong></p>
                {formData.company && <p>{formData.company}</p>}
                <p>{formData.email}</p>
                {formData.phone && <p>{formData.phone}</p>}
              </div>

              {formData.budget && (
                <div className="detail-section">
                  <h3>Budget Range</h3>
                  <p>{formData.budget}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Project Details</h3>
                <p>{formData.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="step-navigation">
        {currentStep > 1 && (
          <button
            className="btn btn-outline"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            <i className="ph ph-arrow-left"></i>
            Back
          </button>
        )}

        <div className="nav-spacer"></div>

        {currentStep < 4 ? (
          <button
            className="btn btn-default"
            onClick={nextStep}
            disabled={!isStepValid()}
          >
            Continue
            <i className="ph ph-arrow-right"></i>
          </button>
        ) : (
          <button
            className="btn btn-default"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="ph ph-spinner ph-spin"></i>
                Confirming...
              </>
            ) : (
              <>
                Confirm Booking
                <i className="ph ph-check"></i>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}