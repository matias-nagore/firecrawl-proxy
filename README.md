# Firecrawl Proxy - Backend para Generador de Descripciones

Backend serverless que actúa como proxy entre tu app y Firecrawl API para evitar problemas de CORS.

## 🚀 Deploy en Vercel (5 minutos)

### Opción A: Deploy con GitHub (RECOMENDADO)

1. **Crear repositorio en GitHub:**
   - Andá a github.com y creá un nuevo repositorio (ej: `firecrawl-proxy`)
   - Subí estos archivos:
  
/api/scrape.js
 vercel.json
 README.md

 2. **Conectar con Vercel:**
   - Andá a [vercel.com](https://vercel.com) y registrate (gratis, con GitHub)
   - Click en "Add New Project"
   - Importá tu repositorio de GitHub
   - Click en "Deploy" (sin cambiar nada)
   - ¡Listo! En 30 segundos tenés la URL

3. **Obtener tu URL:**
   - Vercel te va a dar una URL tipo: `https://tu-proyecto.vercel.app`
   - Tu endpoint de scraping va a ser: `https://tu-proyecto.vercel.app/api/scrape`

## 📊 Límites del plan gratuito de Vercel

- ✅ 100GB bandwidth/mes
- ✅ 100 GB-hours compute/mes
- ✅ Más que suficiente para 1000+ scrapes/mes

## 💰 Costos

**Vercel:** Gratis (hasta 100GB bandwidth/mes)
**Firecrawl:** $0/mes (plan gratuito 500 créditos) o $20/mes (3000 créditos)
