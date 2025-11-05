# 🚀 Guía de Deployment - Waiter Now

Esta guía te ayudará a hacer deployment de tu aplicación **Waiter Now** de forma gratuita para que esté disponible desde cualquier red WiFi en el mundo.

## 📋 Resumen del Plan

- **Frontend**: Vercel (Gratis)
- **Backend**: Railway (Gratis hasta $5/mes)
- **Base de Datos**: PostgreSQL en Railway (Gratis)

## 🔑 Configurar GitHub Secrets (requerido para los Workflows)

Configura estos secrets en tu repositorio: `Settings` → `Secrets and variables` → `Actions`.

- Frontend (Vercel):
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `VITE_API_URL` (ej: `https://tu-backend.railway.app/api/v1`)
  - `VITE_GOOGLE_CLIENT_ID`
- Backend (Railway):
  - `RAILWAY_TOKEN`
  - `RAILWAY_PROJECT_ID`

Los workflows ya están preparados para usar estos secrets:
- `.github/workflows/deploy-web-vercel.yml`
- `.github/workflows/deploy-backend-railway.yml`

## 🎯 Paso 1: Deployment del Backend en Railway

### 1.1 Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub (recomendado)
3. Verifica tu cuenta

### 1.2 Crear nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub
4. Selecciona la carpeta `apps/backend`

### 1.3 Configurar Base de Datos
1. En tu proyecto Railway, click "New Service"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la base de datos

### 1.4 Configurar Variables de Entorno
En Railway Dashboard, ve a tu backend service → Variables:

```env
NODE_ENV=production
API_VERSION=v1
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_REFRESH_SECRET=tu_jwt_refresh_secret_super_seguro_aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CORS_ORIGINS=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
COOKIE_SECRET=tu_cookie_secret_super_seguro_aqui
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
LOG_LEVEL=info
```

**IMPORTANTE**: 
- `DATABASE_URL` y `PORT` se configuran automáticamente por Railway
- Cambia todos los secrets por valores seguros

### 1.5 Deploy
1. Railway detectará automáticamente el `railway.json`
2. El deployment iniciará automáticamente
3. Espera a que termine (5-10 minutos)
4. Copia la URL de tu backend (ej: `https://tu-backend.railway.app`)

## 🎯 Paso 2: Deployment del Frontend en Vercel

### 2.1 Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con GitHub
3. Verifica tu cuenta

### 2.2 Crear nuevo proyecto
1. Click en "New Project"
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Configurar Variables de Entorno
En Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://tu-backend.railway.app/api/v1
VITE_APP_NAME=Waiter Now
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**IMPORTANTE**: Reemplaza `https://tu-backend.railway.app` con la URL real de tu backend de Railway.

### 2.4 Deploy
1. Click "Deploy"
2. Espera a que termine (2-5 minutos)
3. Copia la URL de tu frontend (ej: `https://tu-app.vercel.app`)

## 🎯 Paso 3: Configuración Final

### 3.1 Actualizar CORS en Backend
1. Ve a Railway Dashboard → tu backend → Variables
2. Actualiza `CORS_ORIGINS` con la URL de tu frontend:
   ```
   CORS_ORIGINS=https://tu-app.vercel.app
   ```
3. Redeploy el backend

### 3.2 Verificar Funcionamiento
1. Abre tu aplicación en `https://tu-app.vercel.app`
2. Prueba el registro de usuarios
3. Verifica que no hay errores en la consola

## 🎉 ¡Listo!

Tu aplicación ya está disponible desde cualquier red WiFi en el mundo:
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.railway.app`

## 🔧 Comandos Útiles

### Para desarrollo local:
```bash
# Frontend
cd apps/web
npm run dev

# Backend
cd apps/backend
npm run dev
```

### Para build local:
```bash
# Frontend
cd apps/web
npm run build

# Backend
cd apps/backend
npm run build
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway/Vercel Dashboard
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que las URLs estén correctas

¡Tu aplicación Waiter Now ya está en la nube! 🚀