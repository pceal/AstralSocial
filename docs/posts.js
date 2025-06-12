module.exports = {
  "/posts": {
    get: {
      summary: "Obtener todos los posts",
      tags: ["Posts"],
      parameters: [
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          description: "Número de página para paginación"
        }
      ],
      responses: {
        200: {
          description: "Lista de posts paginada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PostListResponse"
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Crear un nuevo post",
      tags: ["Posts"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                images: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary"
                  }
                }
              },
              required: ["title", "content"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "Post creado correctamente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Post" }
            }
          }
        }
      }
    }
  },
  "/posts/id/{_id}": {
    get: {
      summary: "Obtener un post por ID",
      tags: ["Posts"],
      parameters: [
        {
          name: "_id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: {
          description: "Post obtenido",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Post" }
            }
          }
        },
        404: { description: "Post no encontrado" }
      }
    },
    put: {
      summary: "Actualizar un post por ID",
      tags: ["Posts"],
      parameters: [
        {
          name: "_id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                images: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Post actualizado" }
      }
    },
    delete: {
      summary: "Eliminar un post",
      tags: ["Posts"],
      parameters: [
        {
          name: "_id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "Post eliminado correctamente" }
      }
    }
  },
  "/posts/like/{id}": {
    put: {
      summary: "Añadir o quitar like a un post",
      tags: ["Posts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
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
        }
      }
    }
  },
  "/posts/search": {
    get: {
      summary: "Buscar posts por título",
      tags: ["Posts"],
      parameters: [
        {
          name: "title",
          in: "query",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: {
          description: "Posts encontrados",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Post" }
              }
            }
          }
        }
      }
    }
  }
};