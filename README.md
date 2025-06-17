# Sistema de Inventario Fullstack

Proyecto fullstack con **React (Vite)** + **Express/TypeScript** y **MySQL**. Este README te guía para levantar y correr la app fácilmente.

## 🚀 Requisitos

- Node.js v16+
- Docker + Docker Compose
- Git

## ⚙️ Instalación rápida

### 1. Clonar y configurar entornos

```bash
git clone https://github.com/JuanAngelZz/inventory-management
cd inventory-management
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 2. Levantar base de datos

```bash
docker compose up -d
# Crea las tablas + usuario admin
docker exec -i mysql-ims mysql -uroot -pclave123 ims_upt < create_tables.sql
```

### 3. Iniciar el backend

En la carpeta raíz del proyecto:

```bash
npm install
npm run dev
```

### 4. Iniciar el frontend

```bash
cd client
npm install
npm run dev
```

## 🔑 Variables de Entorno

### server/.env

```env
PORT=5000
SECRET=tu_clave
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=clave123
DB_NAME=ims_upt
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

## 👤 Usuario de prueba

- **Usuario:** admin
- **Contraseña:** admin123

## 🛠 Scripts útiles

### Backend

```bash
npm run dev     # desarrollo
npm run build   # producción
```

### Frontend

```bash
npm run dev     # desarrollo
npm run build   # producción
```
