# Formspree Integration

This document explains how the contact forms are integrated with Formspree for form submission handling.

## Overview

All contact forms in the application now submit to Formspree endpoint: `https://formspree.io/f/xkgzpdjn`

## Components Updated

### 1. StepForm Component (`src/components/StepForm.tsx`)
- **Purpose**: Multi-step consultation booking form on the contact page
- **Data Collected**: Service type, preferred date/time, contact details, budget
- **Features**: 
  - Form validation at each step
  - Progress indicator
  - Success message display
  - Form reset after successful submission

### 2. ContactClient Component (`src/components/ContactClient.tsx`)
- **Purpose**: Handles client-side contact form interactions
- **Features**: Loading states, success/error handling

### 3. AppInitializer Component (`src/components/AppInitializer.tsx`)
- **Purpose**: Initializes jQuery-based contact forms
- **Features**: Handles traditional HTML form submissions

## Utility Functions (`src/lib/formspree.ts`)

### `submitToFormspree(data, options)`
- Submits form data object to Formspree
- Adds automatic subject line and reply-to fields
- Returns Promise<boolean>

### `submitFormDataToFormspree(formData, options)`
- Submits HTML FormData object to Formspree
- Converts FormData to plain object before submission

### `getSuccessMessage(name?)` & `getErrorMessage()`
- Provides consistent success/error messaging

## Formspree Configuration

The forms send the following data to Formspree:

### Step Form Data:
- `service`: Selected service type
- `date`: Preferred consultation date
- `time`: Preferred consultation time
- `name`: Client name
- `company`: Company name
- `email`: Client email
- `phone`: Client phone number
- `message`: Additional message
- `budget`: Project budget range
- `_subject`: Email subject line
- `_replyto`: Reply-to email address

### Regular Contact Form Data:
- `name`: Contact name
- `email`: Contact email
- `message`: Message content
- `_subject`: Email subject line
- `_replyto`: Reply-to email address

## Error Handling

- Network errors are caught and displayed to users
- Failed submissions show user-friendly error messages
- Console logging for debugging purposes

## Success Handling

- Success messages are displayed to users
- Forms are reset after successful submission
- Step form returns to first step after submission

## Testing

To test the form integration:

1. Fill out the contact form on `/contact`
2. Submit the form
3. Check your Formspree dashboard for submissions
4. Verify email notifications are sent

## Customization

To modify the Formspree endpoint:
1. Update `FORMSPREE_ENDPOINT` in `src/lib/formspree.ts`
2. Update any direct references in components if necessary

To customize form fields:
1. Add new fields to the form components
2. Include them in the submission data object
3. Update TypeScript interfaces if using typed data
