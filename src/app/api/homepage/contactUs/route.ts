import { NextRequest, NextResponse } from 'next/server';
import { sendContactUsEmail } from '../../../../utils/email/contactUsEmail';
import { companyInfo } from '../../../../libs/config/companyInfo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required',
          errors: {
            name: !name ? 'Name is required' : undefined,
            email: !email ? 'Email is required' : undefined,
            subject: !subject ? 'Subject is required' : undefined,
            message: !message ? 'Message is required' : undefined,
          }
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format',
          errors: {
            email: 'Please enter a valid email address'
          }
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Message is too short',
          errors: {
            message: 'Message must be at least 10 characters long'
          }
        },
        { status: 400 }
      );
    }

    // Send email
    const emailSent = await sendContactUsEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    if (!emailSent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email. Please try again later.' 
        },
        { status: 500 }
      );
    }

    // Log successful submission
    console.log(`✅ Contact form submitted successfully from ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error processing contact form submission:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
