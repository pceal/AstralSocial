module.exports = {
  "/comments": {
    get: {
      summary: "Obtener todos los comentarios",
      tags: ["Comentarios"],
      responses: {
        200: { description: "Lista de comentarios obtenida correctamente" },
        500: { description: "Error interno del servidor" }
      }
    }
  },
  "/comments/post/{postId}": {
    post: {
      summary: "Crear comentario en un post",
      tags: ["Comentarios"],
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
                comment: { type: "string" },
                image: { type: "string", format: "binary" }
              },
              required: ["comment"]
            }
          }
        }
      },
      responses: {
        201: { description: "Comentario creado correctamente" },
        400: { description: "Falta el contenido del comentario" },
        500: { description: "Error interno del servidor" }
      }
    },
    get: {
      summary: "Obtener comentarios de un post por ID",
      tags: ["Comentarios"],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del post del que se desean obtener los comentarios"
        }
      ],
      responses: {
        200: { description: "Comentarios obtenidos correctamente" },
        500: { description: "Error interno del servidor" }
      }
    }
  },
  "/comments/id/{_id}": {
    put: {
      summary: "Actualizar un comentario por ID",
      tags: ["Comentarios"],
      parameters: [
        {
          name: "_id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del comentario a actualizar"
        }
      ],
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                comment: { type: "string" },
                image: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Comentario actualizado correctamente" },
        404: { description: "Comentario no encontrado" },
        500: { description: "Error interno del servidor" }
      }
    },
    delete: {
      summary: "Eliminar un comentario por ID",
      tags: ["Comentarios"],
      parameters: [
        {
          name: "_id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del comentario a eliminar"
        }
      ],
      responses: {
        200: { description: "Comentario eliminado correctamente" },
        404: { description: "Comentario no encontrado" },
        500: { description: "Error interno del servidor" }
      }
    }
  },
  "/comments/like/{id}": {
    put: {
      summary: "Dar o quitar like a un comentario",
      tags: ["Comentarios"],
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
        200: { description: "Like actualizado correctamente" },
        404: { description: "Comentario no encontrado" },
        500: { description: "Error al actualizar los likes" }
      }
    }
  }
};