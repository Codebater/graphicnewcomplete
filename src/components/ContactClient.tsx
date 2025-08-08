'use client';

import { useEffect, useState } from 'react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Handle form submission
    const handleFormSubmit = async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      setIsSubmitting(true);
      
      try {
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        setShowSuccess(true);
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Add form event listener
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Update success message visibility
    const successElement = document.getElementById('contact-success');
    if (successElement) {
      if (showSuccess) {
        successElement.style.display = 'block';
      } else {
        successElement.style.display = 'none';
      }
    }

    // Cleanup
    return () => {
      if (contactForm) {
        contactForm.removeEventListener('submit', handleFormSubmit);
      }
    };
  }, [showSuccess]);

  return null; // This component doesn't render anything
}