# Dashboard AMDIM — Mockup Bolsa de Trabajo

Propuesta funcional del módulo **Bolsa de trabajo** para el dashboard de
distribuidores Mitsubishi Motors México, replicando 1:1 el design system del
dashboard en producción.

## Cómo verlo

Los assets usan rutas absolutas (`/assets/...`), igual que producción, así que
hay que servir la carpeta raíz:

```bash
python3 -m http.server 8080
```

Abrir: <http://localhost:8080/distribuidores/BolsaTrabajo/Vacantes.html>

## Qué es funcional

- **Mis Vacantes** — listado con estatus, contador de postulaciones y acciones
  (editar, pausar/activar, borrar con confirmación).
- **Alta de Vacante** — crear y editar (título, descripción, correos separados
  por `;`, vigencia opcional, estatus).
- **Postulaciones** — filtros por fecha/vacante/estatus, tabla estilo Reporte
  Leads, exportar CSV, descarga de CV.
- **Detalle de postulación** — ficha del candidato + cambio de estatus
  (nueva / vista / contactada).

Los datos son demo y viven en `localStorage` (se resiembran si se borra el
storage). El resto del dashboard (sidebar, header) es visual, como en
producción, con el selector fijo en "Distribuidora Demo".

## Estructura

```
assets/                  → copia 1:1 de producción (no tocar)
distribuidores/
  assets/css/t2o.css     → copia de producción (no tocar)
  assets/css/bolsatrabajo.css  → estilos nuevos del módulo (mínimos)
  assets/js/bolsatrabajo.js    → datos demo + lógica del módulo
  Default.html           → Inicio (réplica)
  BolsaTrabajo/          → páginas del módulo
_capturas/               → referencia del design system extraído
CLAUDE.md                → memoria del proyecto
```

## Integración a producción

**Ver [INTEGRACION.md](INTEGRACION.md)** — guía completa para el desarrollador:
qué se construyó, modelo de datos, decisiones validadas con el cliente, y los
fixes de UX mobile (tablas y botones Guardar) portables al resto del dashboard.

## GitHub y demo para el cliente

Subir la carpeta completa tal cual (el `.gitignore` ya excluye `.DS_Store`).
Las rutas son **relativas**, así que el mockup funciona en GitHub Pages y en
cualquier hosting estático, además de local con `node server.js`.

**Publicar la demo temporal para revisión del cliente (GitHub Pages):**

1. Crear el repo y subir todo (público mientras dure la revisión).
2. En el repo: Settings → Pages → "Deploy from a branch" → rama `main`,
   carpeta `/ (root)` → Save.
3. En 1-2 minutos la liga queda en:
   `https://<usuario>.github.io/<repo>/distribuidores/BolsaTrabajo/Vacantes.html`
4. Al terminar la revisión: borrar el repo (o hacerlo privado) — la liga muere
   al instante. Las páginas llevan `<meta name="robots" content="noindex">`
   para que los buscadores no las indexen mientras estén publicadas.

Después de la revisión, mantener el repo **privado** para el handoff al
desarrollador: los assets y el design system son propiedad del cliente/agencia
y la documentación describe la estructura interna del dashboard de producción.
