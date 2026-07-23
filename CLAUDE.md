# Dashboard AMDIM — Módulo Bolsa de Trabajo (mockup)

Mockup funcional del módulo **Bolsa de trabajo** para el dashboard de distribuidores
Mitsubishi Motors México (AMDIM), replicando **exactamente** el design system del
dashboard en producción (`https://dash.distribuidoresamdim.mx`).

## Contexto

- El sitio público de la asociación tiene una bolsa de trabajo: vacantes con
  título, distribuidor, descripción y modal de postulación (nombre, correo,
  teléfono, CV en PDF/DOC/DOCX máx. 5 MB). La postulación llega por correo al
  distribuidor.
- Este mockup muestra al cliente cómo administraría cada distribuidor sus
  vacantes y postulaciones dentro del dashboard existente.
- Solo el módulo Bolsa de trabajo es funcional (datos demo en `localStorage`);
  el resto del sidebar es visual, para coherencia.
- El selector "Distribuidora" del header queda fijo en "Distribuidora Demo".

## Stack del dashboard real (replicado aquí)

- **ASP.NET WebForms** (.aspx, `__doPostBack`, `__VIEWSTATE`) — el mockup son
  páginas HTML estáticas con el mismo markup que produce WebForms, listas para
  copiar a un `.aspx`/`.master`.
- **Bootstrap 4.0.0** + **jQuery 3.2.1**
- **Poppins** (Google Fonts), Font Awesome 4.7, iconos themify/material
- Plugins: **DataTables** (bootstrap4, español), **SweetAlert v2** (`swal`),
  **Dropify** (upload), Select2, waves, slimscroll, timepicker, spectrum
- CSS propios: `assets/css/dashboard.css` (tema base), `assets/css/menu.css`,
  `distribuidores/assets/css/t2o.css` (overrides de la agencia t2ó)

Todos los assets en `assets/` y `distribuidores/assets/` son copia 1:1 de
producción. **No editarlos**; los estilos/JS nuevos van en
`distribuidores/assets/css/bolsatrabajo.css` y
`distribuidores/assets/js/bolsatrabajo.js`.

## Design system (tokens extraídos de producción)

- Azul marino (títulos, labels): `#001a5e` (`text-color-blue-nufi`)
- Rojo primario (btn-primary, acentos, FAB): `#e60012`
- Verde éxito (Guardar): `#4ecc48` (`btn-success`)
- Texto sidebar: `#828282`, 14.4px, padding `10px 35px 10px 20px`
- Body: Poppins 16px, fondo `#eeeeee`; `.content-area` fondo `#fafafa`,
  padding `0 30px 10px`
- Header: blanco, `py-3`, sombra `0 8px 16px rgba(6,148,255,.15)`
- Sidebar: 240px blanco; mobile = drawer `position:fixed` + clase `.active`
  (toggle en `assets/js/custom.js` vía `#sidebarCollapse`)
- Cards: blanco, radio **16px**, sombra `0 8px 16px rgba(6,148,255,.10)`,
  `margin-bottom:24px`; header `padding 8px 24px` + `h3.card-title` 16px
- Page header: `.page-header.borderLeft` (barra izq. 4px roja) +
  `.page-title` 32px/700 azul + `.page-subtitle` 20px gris `#7e7e7e`
- Inputs: `.form-control` 40px, borde `#eaeaea`, radio 3px, texto 15px `#898989`;
  label `.form-label` 14px/500 azul marino
- Botones: radio 3px, 13px/500, padding `6px 12px`
- Tablas: `table table-striped table-bordered tblt2o` dentro de
  `dataTables_wrapper dt-bootstrap4` (Mostrar N registros / Buscar / paginación
  Anterior-Siguiente)
- Tabs: `.tab-menu-heading > .tabs-menu1 > ul.nav.panel-tabs > li > a[data-toggle=tab]`
- Alta rápida: FAB rojo fijo abajo-derecha (patrón `#btn-alta-seminuevo`)
- Multi-correo: un input de texto, label "… (separados por ;)"

## Estructura

- `distribuidores/Default.html` — Inicio (réplica de bienvenida)
- `distribuidores/BolsaTrabajo/Vacantes.html` — Mis vacantes (lista + acciones)
- `distribuidores/BolsaTrabajo/Vacante.html` — Alta/edición de vacante (`?id=N` edita)
- `distribuidores/BolsaTrabajo/Postulaciones.html` — filtros + tabla de postulaciones
- `distribuidores/BolsaTrabajo/PostulacionDetalle.html` — ficha del candidato + CV

Decisiones de las rondas de feedback (2026-07-23):
- SIN página de Parámetros (existió y se descartó — el usuario no quiso campos extra).
  El correo receptor va SOLO en el alta de vacante: se precarga con el último
  guardado (config en localStorage), es editable ahí, y al editar una vacante
  existente el campo NO se muestra. El correo es global, no por vacante.
- Badges de estatus con paleta Mitsubishi vía clases propias `.bt-badge-{rojo,negro,gris}`
  (11px, pill): vacantes Activa=rojo / Pausada=negro / Vencida=gris; postulaciones
  Nueva=rojo / Vista=gris / Contactada=negro. OJO: la paleta Mitsubishi es
  rojo/negro/gris — NADA de azul marino en elementos nuevos (feedback explícito).
- Contador de postulaciones: chip circular rojo pequeño (`.bt-contador`).
- Pausar/activar usa `.btn-outline-negro` (#000); borrar sigue `btn-outline-danger`.
- Textos de los SweetAlert cortos (una línea).
- Notas introductorias de formularios con `.bt-nota` (gris #6e6e6e + margen inferior).
- Botón "Volver" del detalle de postulación va en el card-header de "Datos del candidato".
- Subtítulos de página en sentence case ("Mis vacantes").
- UX mobile de tablas (genérico en bolsatrabajo.css, aplicable a TODAS las tablas
  del dashboard si el dev lo quiere llevar a producción): NO se ocultan columnas
  (el usuario lo rechazó explícitamente); solo la fila de la tabla scrollea (los
  controles de DataTables quedan fijos); label del combo compactado a "Mostrar
  [25]" (BT.uiMovil recorta el text node); buscador full width; sin "Página 1 de
  1" y paginado centrado solo Anterior/Siguiente; columna sticky en mobile:
  SOLO la lupa (se probó lupa+ID+título y se descartó: en pantallas chicas la
  zona fija no dejaba leer el resto). En Postulaciones "Nombre" quedó como 3a
  columna (orden: lupa, ID, Nombre, Fecha, Vacante, Email, Teléfono, CV,
  Estatus). El contenedor de scroll pierde su gutter en mobile (el padding
  dejaba ver contenido bajo la columna fija) y la tabla usa
  `border-collapse: separate` en mobile (con collapse, las celdas sticky
  dejan fugas de 1-2px al scrollear).
- El build de Bootstrap del tema NO trae utilidades d-md-*: usar
  `.bt-solo-escritorio` / `.bt-solo-movil` (ojo: t2o.css pone
  `input[type=submit].btn { display:block !important }`, hay que ganarle en
  especificidad).
- Guardar de vacante: desktop en el card-header; mobile botón full width al
  final del formulario (ambos con clase `.btGuardarVacante`).
- FAB de alta en `bottom: 115px` para no encimarse con #back-to-top (que vive
  en bottom:50px y mide 50px).
- `distribuidores/assets/js/bolsatrabajo.js` — datos demo (localStorage) + lógica
- `_capturas/` — referencia extraída del dashboard real (no se sirve)

En producción las rutas equivalentes serían
`/Distribuidores/BolsaTrabajo/<Pagina>.aspx`; el sidebar del mockup agrega el
módulo "Bolsa de trabajo" (icono `fa-briefcase`, submenú acordeón `#Submenu8`:
Mis Vacantes / Alta de Vacante / Postulaciones) entre "Prueba de Manejo" y
"Distribuidores".

## Cómo correr

Las rutas son RELATIVAS (se convirtieron de absolutas para poder publicar la
demo en GitHub Pages bajo /repo/; todas las páginas llevan meta robots
noindex). Servir la carpeta raíz: `node server.js` y abrir
`http://localhost:8080/distribuidores/BolsaTrabajo/Vacantes.html`.
Hay config en `.claude/launch.json` para el preview del navegador.

## Documentación para el desarrollador

`INTEGRACION.md` es la guía de handoff: páginas, modelo de datos, decisiones
validadas por el cliente, y los fixes mobile genéricos (tablas + botones
Guardar) para portar al resto del dashboard. Mantenerla al día si algo cambia.

## Reglas para futuras sesiones

- Fidelidad ante todo: cualquier componente nuevo debe reutilizar clases y
  patrones existentes del dashboard (ver `_capturas/design-system.md`).
- No inventar estilos nuevos si existe un patrón equivalente en producción.
- Textos de UI en español de México, mismo tono que el dashboard.
