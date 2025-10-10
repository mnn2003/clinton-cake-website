import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_sadln2d'; // You'll need to replace this
const EMAILJS_TEMPLATE_ID = 'template_1gd6vnk'; // You'll need to replace this
const EMAILJS_PUBLIC_KEY = 'rYXzxtKcg-jA1Kfiz'; // You'll need to replace this

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cakeName?: string;
  eventDate?: string;
  cakeSize?: string;
  message: string;
  enquiryDate: string;
}

export const sendEnquiryEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'logicaman20@gmail.com',
      from_name: 'Sweet Delights Website',
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      cake_name: data.cakeName || 'General Enquiry',
      event_date: data.eventDate || 'Not specified',
      cake_size: data.cakeSize || 'Not specified',
      message: data.message,
      enquiry_date: data.enquiryDate,
      reply_to: data.customerEmail,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Alternative: Send email using a serverless function (more reliable)
export const sendEnquiryEmailViaAPI = async (data: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-enquiry-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'logicaman20@gmail.com',
        subject: `New Cake Enquiry from ${data.customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
              New Cake Enquiry - Sweet Delights
            </h2>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a></p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Cake Details</h3>
              <p><strong>Cake Interest:</strong> ${data.cakeName || 'General Enquiry'}</p>
              <p><strong>Event Date:</strong> ${data.eventDate || 'Not specified'}</p>
              <p><strong>Cake Size:</strong> ${data.cakeSize || 'Not specified'}</p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap;">${data.message || 'No additional message provided.'}</p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                <strong>Enquiry Date:</strong> ${data.enquiryDate}<br>
                <strong>Source:</strong> Sweet Delights Website
              </p>
            </div>
            
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="color: #dc2626; font-size: 14px; margin: 0;">
                <strong>Action Required:</strong> Please respond to this enquiry within 24 hours for the best customer experience.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully via API');
      return true;
    } else {
      console.error('Failed to send email via API');
      return false;
    }
  } catch (error) {
    console.error('Error sending email via API:', error);
    return false;
  }
};