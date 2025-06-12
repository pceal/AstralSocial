module.exports = {
  '/users/': {
    post: {
      summary: 'Registro de nuevo usuario',
      tags: ['Usuarios'],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string', example: 'miusuario' },
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', format: 'password' },
                bio: { type: 'string', example: 'Mi biografía' },
                image: { type: 'string', format: 'binary' },
              },
              required: ['username', 'email', 'password'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuario creado y correo de confirmación enviado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  msg: { type: 'string', example: 'Te hemos enviado un correo para confirmar tu registro' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        400: { description: 'Datos inválidos o contraseña faltante' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/confirm/{emailToken}': {
    get: {
      summary: 'Confirmar correo electrónico del usuario',
      tags: ['Usuarios'],
      parameters: [
        {
          name: 'emailToken',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Token enviado por correo para confirmar el registro',
        },
      ],
      responses: {
        201: { description: 'Usuario confirmado con éxito' },
        500: { description: 'Error al confirmar usuario' },
      },
    },
  },
  '/users/login': {
    post: {
      summary: 'Login de usuario',
      tags: ['Usuarios'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', format: 'password' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login exitoso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  msg: { type: 'string', example: 'Bienvenid@ miusuario' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        400: { description: 'Credenciales inválidas o usuario no confirmado' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/logout': {
    delete: {
      summary: 'Cerrar sesión del usuario conectado',
      tags: ['Usuarios'],
      security: [{ jwtAuth: [] }],
      responses: {
        200: { description: 'Desconexión exitosa' },
        400: { description: 'Token no proporcionado' },
        401: { description: 'No autorizado' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/me': {
    get: {
      summary: 'Obtener perfil del usuario conectado',
      tags: ['Usuarios'],
      security: [{ jwtAuth: [] }],
      responses: {
        200: {
          description: 'Datos del usuario con sus posts y seguidores',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/UserWithFollowers' },
                  posts: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Post' },
                  },
                },
              },
            },
          },
        },
        401: { description: 'No autorizado' },
        500: { description: 'Error interno del servidor' },
      },
    },
    put: {
      summary: 'Actualizar datos del usuario conectado',
      tags: ['Usuarios'],
      security: [{ jwtAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                bio: { type: 'string' },
                password: { type: 'string', format: 'password' },
                image: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Usuario actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        400: { description: 'Datos inválidos' },
        401: { description: 'No autorizado' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/id/{_id}': {
    get: {
      summary: 'Obtener usuario por ID',
      tags: ['Usuarios'],
      parameters: [
        {
          name: '_id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del usuario',
        },
      ],
      security: [{ jwtAuth: [] }],
      responses: {
        200: {
          description: 'Datos del usuario',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        404: { description: 'Usuario no encontrado' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/username/{username}': {
    get: {
      summary: 'Buscar usuario(s) por nombre de usuario',
      tags: ['Usuarios'],
      parameters: [
        {
          name: 'username',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Nombre de usuario (busca similar con regex)',
        },
      ],
      security: [{ jwtAuth: [] }],
      responses: {
        200: {
          description: 'Usuarios encontrados',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/follow/{_id}': {
    post: {
      summary: 'Seguir o dejar de seguir a un usuario',
      tags: ['Usuarios'],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: '_id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del usuario a seguir o dejar de seguir',
        },
      ],
      responses: {
        200: {
          description: 'Estado actualizado de seguimiento',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  followersCount: { type: 'integer' },
                },
              },
            },
          },
        },
        400: { description: 'No puedes seguirte a ti mismo' },
        404: { description: 'Usuario no encontrado' },
        500: { description: 'Error con los followers' },
      },
    },
  },
  '/users/recoverPassword/{email}': {
    get: {
      summary: 'Enviar correo para recuperación de contraseña',
      tags: ['Usuarios'],
      parameters: [
        {
          name: 'email',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'email' },
          description: 'Email del usuario para recuperación',
        },
      ],
      responses: {
        200: { description: 'Correo de recuperación enviado' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
  '/users/resetPassword/{recoverToken}': {
    post: {
      summary: 'Restablecer contraseña con token',
      tags: ['Usuarios'],
      parameters: [
        {
          name: 'recoverToken',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Token para restablecer contraseña',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                password: { type: 'string', format: 'password' },
              },
              required: ['password'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Contraseña cambiada con éxito' },
        400: { description: 'Datos inválidos' },
        500: { description: 'Error interno del servidor' },
      },
    },
  },
};
