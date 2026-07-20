import React from 'react';

export default function JsonLd() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'CONSULTax Associates',
    'image': 'https://consultax.com/logo.png',
    'url': 'https://consultax.com',
    'telephone': '+923345371105',
    'email': contactEmail,
    'description': 'CONSULTax Associates is a professional tax consultancy, management accounting, and corporate compliance firm committed to providing reliable, practical, and result-oriented financial solutions.',
    'sameAs': [
      'https://facebook.com/consultax.pak',
      'https://instagram.com/consultax.pk',
      'https://threads.net/@consultax.pk',
      'https://x.com/consul_tax',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
