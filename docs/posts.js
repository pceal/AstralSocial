module.exports = {
  "/posts": {
    post: {
      summary: "Crear un nuevo post",
      tags: ["Posts"],
      security: [{ jwtAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Un día en Endor" },
                content: { type: "string", example: "Estuve explorando el bosque de Endor." },
                images: {
                  type: "array",
                  items: { type: "string", format: "binary" }
                }
              },
              required: ["title", "content"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "Post creado exitosamente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Post" }
            }
          }
        },
        400: { description: "Datos inválidos" },
        500: { description: "Error interno del servidor" }
      }
    },
    get: {
      summary: "Obtener todos los posts",
      tags: ["Posts"],
      responses: {
        200: {
          description: "Listado de posts",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Post" }
              }
            }
          }
        },
        500: { description: "Error interno del servidor" }
      }
    }
  },

  "/posts/id/{id}": {
    get: {
      summary: "Obtener un post por ID",
      tags: ["Posts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post"
        }
      ],
      responses: {
        200: {
          description: "Post encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Post" }
            }
          }
        },
        404: { description: "Post no encontrado" },
        500: { description: "Error interno del servidor" }
      }
    },
    delete: {
      summary: "Eliminar un post",
      tags: ["Posts"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post a eliminar"
        }
      ],
      responses: {
        200: { description: "Post eliminado exitosamente" },
        404: { description: "Post no encontrado" },
        500: { description: "Error interno del servidor" }
      }
    }
  },

  "/posts/like/{id}": {
    put: {
      summary: "Dar o quitar like a un post",
      tags: ["Posts"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post al que se le da o quita like"
        }
      ],
      responses: {
        200: {
          description: "Like actualizado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  totalLikes: { type: "integer" }
                }
              }
            }
          }
        },
        404: { description: "Post no encontrado" },
        500: { description: "Error al dar o quitar like" }
      }
    }
  }
};
