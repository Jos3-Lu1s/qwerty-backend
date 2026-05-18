# Qwerty API

Un servicio backend profesional construido con [NestJS](http://nestjs.com/), TypeScript y PostgreSQL.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🚀 Resumen

**Qwerty** es una aplicación de servidor escalable y eficiente construida con el framework NestJS. Sigue las mejores prácticas de la industria para proporcionar una base sólida para APIs modernas.

## 🛠️ Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/) (v11+)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **Contenedores:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Primeros Pasos

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v20+ recomendado)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) y Docker Compose

### Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd qwerty
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   ```bash
   cp .env.template .env
   ```

   *Edita el archivo `.env` y proporciona las credenciales de la base de datos necesarias.*

---

## 🐳 Configuración de la Base de Datos

El proyecto utiliza Docker Compose para gestionar la base de datos PostgreSQL.

1. Inicia el contenedor de la base de datos:

   ```bash
   docker-compose up -d
   ```

2. La base de datos estará disponible en `localhost:6432`

---

## 🏃 Ejecución del Proyecto

```bash
# Modo desarrollo (con watch mode)
$ npm run start:dev

# Modo debug
$ npm run start:debug

# Modo producción
$ npm run start:prod
```

## 📦 Estructura del Proyecto

```text
src/
├── main.ts          # Punto de entrada de la aplicación
├── app.module.ts    # Módulo raíz
└── ...              # Módulos de dominio, controladores y servicios
```
