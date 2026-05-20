# Frontend SASISOPA IA — Starter Kit

## Ruta simple

1. Instala Node.js LTS.
2. Crea proyecto:

```bash
npx create-next-app@latest sasisopa-frontend
```

Responde:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
```

3. Copia los archivos de este paquete dentro del proyecto.
4. Instala dependencias:

```bash
npm install
```

5. Crea `.env.local` con:

```text
NEXT_PUBLIC_API_URL=http://localhost:4000
```

6. Ejecuta:

```bash
npm run dev
```

7. Abre:

```text
http://localhost:3000
```

## Cuando tengas backend en Render

En Vercel agrega esta variable:

```text
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

## Flujo correcto

Frontend en Vercel → Backend en Render → Airtable/Supabase → Drive → n8n → WhatsApp.
