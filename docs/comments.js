module.exports = {
  "/comments/post/{postId}": {
    post: {
      summary: "Crear un comentario en un post",
      tags: ["Comentarios"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post al que se le añade el comentario"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                comment: { type: "string", example: "Este lugar es impresionante." },
                image: { type: "string", format: "binary" }
              },
              required: ["comment"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "Comentario creado con éxito",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  comment: { type: "string" },
                  author: { type: "string" },
                  post: { type: "string" },
                  image: { type: "string" },
                  likes: {
                    type: "array",
                    items: { type: "string" }
                  },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        400: { description: "Comentario requerido" },
        500: { description: "Error al crear el comentario" }
      }
    },
    get: {
      summary: "Obtener comentarios por ID del post",
      tags: ["Comentarios"],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post"
        }
      ],
      responses: {
        200: {
          description: "Comentarios encontrados",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    comment: { type: "string" },
                    author: { type: "string" },
                    post: { type: "string" },
                    image: { type: "string" },
                    likes: {
                      type: "array",
                      items: { type: "string" }
                    },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        },
        500: { description: "Error al obtener los comentarios del post" }
      }
    }
  },

  "/comments": {
    get: {
      summary: "Obtener todos los comentarios",
      tags: ["Comentarios"],
      responses: {
        200: {
          description: "Listado de comentarios",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    comment: { type: "string" },
                    author: { type: "string" },
                    post: { type: "string" },
                    image: { type: "string" },
                    likes: {
                      type: "array",
                      items: { type: "string" }
                    },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        },
        500: { description: "Error interno del servidor" }
      }
    }
  },

  "/comments/id/{id}": {
    put: {
      summary: "Actualizar un comentario",
      tags: ["Comentarios"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del comentario"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                comment: { type: "string", example: "Actualización del comentario" },
                image: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Comentario actualizado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  comment: { type: "string" },
                  author: { type: "string" },
                  post: { type: "string" },
                  image: { type: "string" },
                  likes: {
                    type: "array",
                    items: { type: "string" }
                  },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        404: { description: "Comentario no encontrado" },
        500: { description: "Error al actualizar el comentario" }
      }
    },
    delete: {
      summary: "Eliminar un comentario",
      tags: ["Comentarios"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del comentario"
        }
      ],
      responses: {
        200: { description: "Comentario eliminado correctamente" },
        404: { description: "Comentario no encontrado" },
        500: { description: "Error al eliminar el comentario" }
      }
    }
  },

  "/comments/like/{id}": {
    put: {
      summary: "Dar o quitar like a un comentario",
      tags: ["Comentarios"],
      security: [{ jwtAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del comentario"
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
        404: { description: "Comentario no encontrado" },
        500: { description: "Error al dar o quitar like" }
      }
    }
  }
};
