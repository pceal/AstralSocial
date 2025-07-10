const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define la carpeta base para las subidas
const UPLOADS_BASE_DIR = path.join(__dirname, '../uploads');

// Función para asegurar que un directorio existe
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    console.log(`Multer Debug: Creando directorio: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer Debug: Entrando a destination function.");
    console.log("Multer Debug: req.baseUrl:", req.baseUrl);
    console.log("Multer Debug: file.fieldname:", file.fieldname); // Debería ser 'images'
    console.log("Multer Debug: file.originalname:", file.originalname);

    let type = 'misc'; 
    if (req.baseUrl.includes('users')) {
      type = 'users';
    } else if (req.baseUrl.includes('comments')) {
      type = 'comments';
    } else if (req.baseUrl.includes('posts')) {
      type = 'posts';
    }
    
    const destinationPath = path.join(UPLOADS_BASE_DIR, type);
    
    try {
      ensureDirectoryExists(destinationPath);
      console.log("Multer Debug: Destino final:", destinationPath);
      cb(null, destinationPath);
    } catch (error) {
      console.error(`Multer Debug: ERROR al asegurar el directorio ${destinationPath}:`, error);
      cb(error); // Pasa el error a Multer
    }
  },
  filename: function (req, file, cb) {
    console.log("Multer Debug: Entrando a filename function.");
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    console.log("Multer Debug: Nombre de archivo generado:", uniqueName + ext);
    cb(null, uniqueName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Multer Debug: Entrando a fileFilter.");
  console.log("Multer Debug: file.mimetype:", file.mimetype);
  if (file.mimetype.startsWith('image/')) {
    console.log("Multer Debug: Tipo de archivo aceptado.");
    cb(null, true);
  } else {
    console.log("Multer Debug: Tipo de archivo RECHAZADO:", file.mimetype);
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter, // Asegúrate de que este filtro esté activo
  limits: {
    fileSize: 1024 * 1024 * 5 // Límite de 5MB
  }
});

module.exports = upload;
