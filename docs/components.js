module.exports = {
  components: {
    securitySchemes: {
      jwtAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
        description: 'Token JWT (sin Bearer)',
      },
    },
  },
};
