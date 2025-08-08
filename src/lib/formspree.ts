/**
 * Formspree integration utility
 * Handles form submissions to Formspree endpoint
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgzpdjn';

interface FormSubmissionData {
  [key: string]: any;
}

interface FormspreeSubmissionOptions {
  subject?: string;
  replyTo?: string;
}

/**
 * Submit form data to Formspree
 * @param data - Form data object
 * @param options - Additional options for the submission
 * @returns Promise<boolean> - Success status
 */
export async function submitToFormspree(
  data: FormSubmissionData, 
  options: FormspreeSubmissionOptions = {}
): Promise<boolean> {
  try {
    // Prepare submission data
    const submissionData = {
      ...data,
      _subject: options.subject || `New form submission from ${data.name || 'website'}`,
      _replyto: options.replyTo || data.email,
    };

    // Submit to Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error(`Formspree submission failed: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Formspree submission error:', error);
    throw error;
  }
}

/**
 * Submit FormData object to Formspree
 * @param formData - FormData from HTML form
 * @param options - Additional options for the submission
 * @returns Promise<boolean> - Success status
 */
export async function submitFormDataToFormspree(
  formData: FormData, 
  options: FormspreeSubmissionOptions = {}
): Promise<boolean> {
  // Convert FormData to plain object
  const data: FormSubmissionData = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  return submitToFormspree(data, options);
}

/**
 * Get success message for form submission
 */
export function getSuccessMessage(name?: string): string {
  return name 
    ? `Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon.`
    : 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
}

/**
 * Get error message for form submission
 */
export function getErrorMessage(): string {
  return 'There was an error submitting your form. Please try again or contact us directly.';
}
