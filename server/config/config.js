// ========================
//  Puerto
// ========================

process.env.PORT = process.env.PORT || 3000;

// ========================
//  Entorno
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
//  Vencimiento del token
// ========================

process.env.CADUCIDAD_TOKEN = '48h';

// ========================
//  SEED de autenticacion
// ========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================
// base de datos
// ========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:juniorliban1998@ds255332.mlab.com:55332/cafe'
}

process.env.URLDB = urlDB;

// ========================
// Google Client ID
// ========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '32210099089-premlstco9lfqtkpso6msjraff6g3sv8.apps.googleusercontent.com'