const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'ChewBooka API',
    version: '1.0.0',
    description: 'Documentación de la API de ChewBooka',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
  ],
  tags: [{ name: 'Usuarios' }, { name: 'Posts' }, { name: 'Comentarios' }],
  paths: {
    ...userRoutes,
    ...postRoutes,
    ...commentRoutes,
  },
  components: {
    securitySchemes: {
      jwtAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
        description: 'Token JWT (sin Bearer)',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          bio: { type: 'string' },
          image: { type: 'string' },
          role: { type: 'string' },
          followers: {
            type: 'array',
            items: { type: 'string' },
          },
          following: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      UserWithFollowers: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: {
              followers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          images: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
