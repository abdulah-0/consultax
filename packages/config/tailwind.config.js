module.exports = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F2B7A',        // primary brand — header, nav, primary buttons, links
          dark: '#141C52',           // footer bg, dark sections, hero overlays
        },
        orange: '#E8622C',           // accent CTA only — "Request a Consultation", hover states
        charcoal: '#414042',         // body copy, form labels
        cloud: '#F4F5FA',            // section backgrounds, card fills
        success: '#2E7D32',          // form success state
        error: '#C0392B',            // form validation errors
        rule: '#D9DBE9',             // borders/dividers
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'Source Sans Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
