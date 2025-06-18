# ChewBooka

### API REST de una Red Social

# 🧠 ChewBooka - Red Social con Node.js, Express y MongoDB

ChewBooka es una red social básica desarrollada como proyecto backend, que permite a los usuarios registrarse, iniciar sesión, crear publicaciones con imágenes, dar likes, y comentar otros posts.

---

## 🚀 Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Multer (subida de imágenes)
- JWT (autenticación)
- Bcrypt (encriptación de contraseñas)
- Postman (pruebas de endpoints)

---

## 🛠️ Instalación y ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/alejandrogoscu/ChewBooka.git
cd chewbooka
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura tu archivo `.env`:
```env
PORT=8080
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
```

4. Crea las carpetas necesarias:
```bash
mkdir -p uploads/posts uploads/users uploads/comments
```

5. Ejecuta el proyecto:
```bash
npm run dev
```

---

## 🔐 Autenticación

Usa el endpoint `/users/login` para recibir un token JWT. Debes incluir este token en las rutas protegidas:

```
Authorization: Bearer <token>
```

---

## 📦 Endpoints principales

### 👤 Usuarios

- `POST /users/register`: Registro de nuevo usuario
- `POST /users/login`: Login y obtención de token
- `GET /users`: Listar todos los usuarios (solo admin)
- `Post'/follow/:_id'`: Darle follor a un seguidor
- `Put'/me'`: Actualizar imagen del usuario
- `Put'/resetPassword/:recoverToken'`: Resetear contraseña
- `Get'/confirm/:emailToken'`: Confirmar email
- `Get'/me'`: Conectar el usuario
- `Get'/username/:username'`: Traer el usuario por username
- `Get('/id/:_id'`: para Traer al usuario por Id
- `Get('/recoverPassword/:email'`: Recuperación de contraseña
- `Delete('/logout'`: Para hacer un Logout

### 📝 Posts

- `POST /posts`: Crear post (autenticado + imagen)
- `GET /posts`: Obtener todos los posts con paginación
- `GET /posts/id/:_id`: Obtener post por ID (con comentarios, likes y autor)
- `PUT /posts/id/:_id`: Actualizar un post
- `DELETE /posts/id/:_id`: Eliminar un post
- `PUT /posts/like/:id`: Dar o quitar like al post

### 💬 Comentarios

- `POST /comments/post/:postId`: Crear comentario sobre un post
- `GET /comments`: Ver todos los comentarios
- `GET /comments/post/:postId`: Ver comentarios de un post
- `PUT /comments/id/:_id`: Editar comentario (solo autor)
- `DELETE /comments/id/:_id`: Eliminar comentario (solo autor)

---

## 🖼️ Subida de imágenes

Las imágenes se guardan localmente en la carpeta `/uploads`, organizadas por:

- `/uploads/posts`
- `/uploads/users`
- `/uploads/comments`

---

## 📝 Documentación de la API

La documentación de la API del proyecto se encuentra detallada en el siguiente link:
https://documenter.getpostman.com/view/45240473/2sB2x6krp3

--

## ✨ Mejoras futuras

- Añadir reacciones personalizadas
- Notificaciones en tiempo real (socket.io)

---
