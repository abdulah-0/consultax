import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';

// Simple in-memory rate limiter: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  let requests = rateLimitMap.get(ip) || [];
  // Filter out expired timestamps
  requests = requests.filter((timestamp) => now - timestamp < limitWindow);

  if (requests.length >= maxRequests) {
    return false;
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);
  return true;
}

// Basic validation regexes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Supports standard Pakistani formats: +923xxxxxxxxx, 03xxxxxxxxx, 03xx-xxxxxxx, etc.
const PHONE_REGEX = /^(\+92|92|0)?3[0-9]{2}[ -]?[0-9]{7}$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 10 minutes.' },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { fullName, phone, email, serviceInterest, message, sourcePage } = body;

    // 3. Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid Pakistani phone number (e.g., 0334-5371105).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Message is required only on the Contact Us general page
    const isContactPage = sourcePage && sourcePage.toLowerCase().includes('contact');
    if (isContactPage && (!message || typeof message !== 'string' || message.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Message is required on the Contact page.' },
        { status: 400 }
      );
    }

    if (!sourcePage || typeof sourcePage !== 'string') {
      return NextResponse.json(
        { error: 'Source page information is missing.' },
        { status: 400 }
      );
    }

    // 4. Save to Database
    const newLead = await prisma.lead.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceInterest: serviceInterest ? serviceInterest.trim() : 'General Inquiry',
        message: message ? message.trim() : null,
        sourcePage: sourcePage.trim(),
        status: 'NEW',
      },
    });

    // 5. Send Transactional Confirmation Email (Simulation / Resend Stub)
    const emailApiKey = process.env.EMAIL_API_KEY;
    const supportEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

    const emailSubject = `We've received your request — CONSULTax Associates`;
    const emailBody = `
      Hello ${fullName.trim()},
      
      Thank you for reaching out to CONSULTax Associates.
      
      We have received your inquiry regarding: "${serviceInterest || 'General Inquiry'}".
      
      A member of our professional tax consultancy team will review your request and get back to you within 24 hours.
      
      If you need immediate assistance, feel free to contact us directly on WhatsApp:
      https://wa.me/923345371105
      
      Best regards,
      Abdullah Khalid
      CONSULTax Associates
      Professional Tax Consultancy • Management Accounting • Corporate Compliance
    `;

    if (emailApiKey) {
      // Stub for external mailing integrations like Resend / SendGrid
      console.log(`[EMAIL-SERVICE] Send real email to ${email.trim()} using API key.`);
      // actual execution code would go here
    } else {
      console.log('--------------------------------------------------');
      console.log(`[EMAIL SIMULATION] Sending Email...`);
      console.log(`To: ${email.trim()}`);
      console.log(`From: ${supportEmail}`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`Body: ${emailBody}`);
      console.log('--------------------------------------------------');
    }

    return NextResponse.json(
      { id: newLead.id, status: newLead.status },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error handling lead submission:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while submitting your request.' },
      { status: 500 }
    );
  }
}
