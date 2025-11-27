# Sistema de Inventario Fullstack

Proyecto fullstack con **React (Vite)**, **Express/TypeScript** y **MySQL**, ahora completamente containerizado con **Docker**.

## 🚀 Requisitos

- Docker Desktop (incluye Docker Compose)
- Git

## ⚙️ Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanAngelZz/inventory-management
cd inventory-management
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en el ejemplo:

```bash
cp .env.example .env
```

Asegúrate de configurar tu `GOOGLE_GEN_AI_KEY` en el archivo `.env` para que funcione el asistente de IA.

### 3. Levantar la aplicación con Docker

Ejecuta el siguiente comando para construir y levantar todos los servicios (Frontend, Backend y Base de Datos):

```bash
docker-compose up -d --build
```

Esto iniciará:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:4000](http://localhost:4000)
- **Base de Datos (MySQL):** Puerto 3307

### 4. Inicializar la Base de Datos

Una vez que los contenedores estén corriendo, puedes inicializar la base de datos visitando los siguientes endpoints en tu navegador o usando curl:

1. **Crear tablas:** [http://localhost:4000/api/migrate](http://localhost:4000/api/migrate)
2. **Poblar datos (Opcional):** [http://localhost:4000/api/seed](http://localhost:4000/api/seed)

## 👤 Usuario de prueba

- **Usuario:** admin
- **Contraseña:** admin123

## 🛠 Comandos útiles

```bash
# Ver logs de los contenedores
docker-compose logs -f

# Detener los contenedores
docker-compose down

# Reiniciar un servicio específico (ej. server)
docker-compose restart server
```

## 📁 Estructura del Proyecto

- `/client`: Frontend (React + Vite)
- `/server`: Backend (Express + TypeScript)
- `docker-compose.yml`: Orquestación de contenedores
- `Dockerfile.server`: Configuración Docker del Backend
- `client/Dockerfile`: Configuración Docker del Frontend (Nginx)
