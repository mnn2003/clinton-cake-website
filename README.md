# Sweet Delights - Cake Showcase Website

A beautiful, responsive cake showcase website built with React, TypeScript, and Firebase.

## Features

- **Public Website**: Browse cake categories, view detailed cake information
- **Admin Panel**: Manage cakes, slideshow images, and customer enquiries
- **Email Notifications**: Automatic email alerts for new enquiries
- **Responsive Design**: Optimized for all device sizes
- **Firebase Integration**: Real-time database and authentication

## Email Setup Instructions

To enable email notifications for enquiries, you have two options:

### Option 1: EmailJS (Client-side)

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new email service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `{{to_email}}`
   - `{{from_name}}`
   - `{{customer_name}}`
   - `{{customer_email}}`
   - `{{customer_phone}}`
   - `{{cake_name}}`
   - `{{event_date}}`
   - `{{cake_size}}`
   - `{{message}}`
   - `{{enquiry_date}}`
   - `{{reply_to}}`

4. Update the configuration in `src/lib/emailService.ts`:
   ```typescript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

### Option 2: Server-side API (Recommended for production)

Create a serverless function or API endpoint at `/api/send-enquiry-email` that:
1. Accepts POST requests with enquiry data
2. Uses a service like SendGrid, Mailgun, or Nodemailer
3. Sends formatted HTML emails to logicaman20@gmail.com

### Email Template Example

The system will send beautifully formatted HTML emails containing:
- Customer contact information
- Cake preferences and event details
- Custom message from the customer
- Enquiry timestamp and source
- Call-to-action for timely response

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase (see Firebase setup section)
4. Configure email service (see Email setup section above)
5. Run development server: `npm run dev`

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Update Firebase configuration in `src/lib/firebase.ts`
4. Set up authentication for admin access

## Admin Access

- Navigate to `/admin/login`
- Use your configured Firebase admin credentials
- Manage cakes, slideshow, and enquiries

## Deployment

The application is configured for deployment on Netlify with automatic builds.

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Firebase for backend services
- Framer Motion for animations
- React Hook Form for form handling
- EmailJS for email notifications
- React Router for navigation

## Support

For technical support or questions, contact the development team.