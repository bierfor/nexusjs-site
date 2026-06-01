export default {
  server: {
    port: 3000,
  },
  security: {
    hardened: true,
    shieldLite: true,
    csp: {
      additionalScriptSrc: ['https://cdnjs.cloudflare.com'],
      additionalStyleSrc: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com', // if needed for some
      ],
      additionalFontSrc: ['https://fonts.gstatic.com'],
      additionalConnectSrc: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ],
    },
  },
};
