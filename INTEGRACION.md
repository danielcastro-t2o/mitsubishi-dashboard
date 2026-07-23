# Guía de integración — Módulo Bolsa de Trabajo

Documento para el desarrollador que va a integrar este mockup al dashboard
WebForms de producción (`dash.distribuidoresamdim.mx`). Aquí está TODO lo que
se construyó, cómo funciona, y los fixes de UX mobile que son aplicables al
resto del dashboard.

---

## 1. Qué es este proyecto

Mockup funcional del módulo **Bolsa de trabajo** para el dashboard de
distribuidores AMDIM. Las páginas son HTML estático con **el mismo markup que
genera WebForms** (mismo layout, clases y patrones), por lo que el contenido de
cada página se puede copiar casi directo a un `.aspx`.

- Los assets en `assets/` y `distribuidores/assets/` (excepto los archivos
  `bolsatrabajo.*`) son **copia 1:1 de producción** — no editarlos.
- Todo lo nuevo vive en 2 archivos:
  - `distribuidores/assets/css/bolsatrabajo.css`
  - `distribuidores/assets/js/bolsatrabajo.js`
- Los datos son demo y viven en `localStorage` (llaves `bt_vacantes_v1`,
  `bt_postulaciones_v1`, `bt_config_v1`). En producción se sustituyen por
  postbacks / servicios reales.

**Correr localmente:** `node server.js` → `http://localhost:8080/distribuidores/BolsaTrabajo/Vacantes.html`
(hace falta servidor porque los assets usan rutas absolutas `/assets/...`, igual
que producción; abrir el HTML con doble clic NO funciona).

## 2. Páginas del módulo

| Página | Equivalente producción | Qué hace |
|---|---|---|
| `distribuidores/BolsaTrabajo/Vacantes.html` | `/Distribuidores/BolsaTrabajo/Vacantes.aspx` | Lista de vacantes (DataTable), pausar/activar, borrar (SweetAlert), FAB "+" de alta |
| `distribuidores/BolsaTrabajo/Vacante.html` | `.../Vacante.aspx` | Alta (`sin querystring`) y edición (`?id=N`) |
| `distribuidores/BolsaTrabajo/Postulaciones.html` | `.../Postulaciones.aspx` | Filtros (fechas/vacante/estatus), DataTable, exportar CSV |
| `distribuidores/BolsaTrabajo/PostulacionDetalle.html` | `.../PostulacionDetalle.aspx?id=N` | Ficha del candidato, descarga CV, cambio de estatus |
| `distribuidores/Default.html` | `/distribuidores/Default.aspx` | Réplica del inicio (solo para navegar el mockup) |

**Sidebar:** el módulo se agrega como submenú acordeón `#Submenu8` (icono
`fa-briefcase`) entre "Prueba de Manejo" y "Distribuidores", con: Mis Vacantes,
Alta de Vacante y Postulaciones (con badge de nuevas). El bloque HTML está en
cualquier página del mockup — copiarlo al master page.

## 3. Modelo de datos sugerido

```
Vacante:      id, titulo, descripcion, vigencia (date, nullable),
              estatus ('activa'|'pausada'), fechaPublicacion, idDistribuidor
Postulacion:  id, idVacante, nombre, email, telefono, fecha,
              cv (archivo), estatus ('nueva'|'vista'|'contactada')
Config:       correosBolsaTrabajo (string, separados por ';', por distribuidor)
```

Reglas de negocio implementadas en el mockup (ver `bolsatrabajo.js`):
- **Vigencia opcional**: si tiene fecha y ya pasó, la vacante se muestra como
  "Vencida" y no se publicaría en el sitio público.
- **Correos receptores**: NO van por vacante — son configuración global del
  distribuidor. El campo solo aparece en el **alta** (no en edición),
  precargado con el último valor guardado; al guardar el alta se actualiza el
  default. Formato validado: correos separados por `;`.
- **Estatus de postulación**: al abrir el detalle, una postulación "nueva" pasa
  automáticamente a "vista". El badge del sidebar cuenta las "nuevas".
- Borrar vacante pide confirmación (SweetAlert `dangerMode`).

## 4. Decisiones de diseño (cliente ya validó)

- Paleta para elementos nuevos: **rojo `#e60012` / negro `#000` / gris
  `#828282`** (paleta Mitsubishi). NADA de azul marino en badges/botones nuevos.
- Badges de estatus: clases `.bt-badge` + `.bt-badge-{rojo,negro,gris}`
  (11px, pill). Vacantes: Activa=rojo, Pausada=negro, Vencida=gris.
  Postulaciones: Nueva=rojo, Vista=gris, Contactada=negro.
- Contador de postulaciones: chip circular rojo `.bt-contador`.
- Pausar/activar: `.btn-outline-negro`. Borrar: `btn-outline-danger`.
- Textos de SweetAlert: cortos, una línea.
- Subtítulos de página en sentence case ("Mis vacantes", "Alta de vacante").
- En Postulaciones el orden de columnas es: lupa, ID, **Nombre**, Fecha,
  Vacante, Email, Teléfono, CV, Estatus (Nombre adelante para mobile).

---

## 5. ⭐ Fix genérico de tablas en mobile — APLICABLE A TODO EL DASHBOARD

El cliente quiere este comportamiento en **todas** las tablas del dashboard
(Reporte Leads, Seminuevos, etc.), no solo en Bolsa de Trabajo. El fix es
genérico: apunta a `.dataTables_wrapper` / `.tblt2o`, que ya usan todas las
tablas de producción. Para portarlo:

### 5a. CSS (copiar el bloque completo de tablas de `bolsatrabajo.css`)

Está al final del archivo, marcado con `===== Tablas =====` y
`===== Ajustes mobile para tablas =====`. Qué hace cada pieza:

1. **Solo la tabla scrollea** (los controles Mostrar/Buscar/paginado quedan
   fijos). En producción hoy scrollea TODO el bloque porque el wrapper de
   DataTables queda dentro del contenedor con overflow:
   ```css
   .dataTables_wrapper > .row > .col-sm-12:only-child {
       overflow-x: auto;
       -webkit-overflow-scrolling: touch;
   }
   ```
   El `:only-child` selecciona la fila del medio del wrapper (la que solo trae
   la tabla). ⚠️ Si la página envuelve la tabla en `.table-responsive`,
   QUITARLO — ese wrapper es el que hace scrollear todo el bloque.

2. **Mobile (`@media (max-width: 767.98px)`)**:
   - Buscador full width.
   - Se oculta "Página X de Y" (`.dataTables_info`) y los números de página;
     queda solo Anterior/Siguiente centrado.
   - `padding-left/right: 0` en el contenedor de scroll (con el gutter de
     Bootstrap, el contenido se asoma por debajo de la columna fija).
   - `border-collapse: separate` en la tabla — ⚠️ imprescindible: con
     `collapse`, las celdas sticky dejan fugas de 1-2px al scrollear.
   - **Columna fija: SOLO la primera** (la lupa/acción de detalle), con fondo
     sólido, sombra al corte y ancho fijo de 48px. Se probó fijar también ID y
     título y el cliente lo rechazó (tapaba demasiado en pantallas chicas).
   - Fondo sólido `#f2f2f2` para la columna fija en filas cebreadas (el
     `rgba(0,0,0,.05)` de Bootstrap se transparenta sobre celdas sticky).

   ⚠️ El fix de columna fija asume que la **primera columna es la de
   acción/detalle** (angosta). En tablas donde la primera columna sea ancha,
   ajustar el `width/min-width/max-width: 48px`.

### 5b. JS — compactar "Mostrar 25 registros por página" → "Mostrar 25"

En `bolsatrabajo.js` está `BT.uiMovil()`. Para producción, agregar a un JS
global (p. ej. `utils.js`, DESPUÉS del init de DataTables):

```js
function compactarTablasMovil() {
    if (!window.matchMedia('(max-width: 767.98px)').matches) return;
    $('.dataTables_length label').contents().each(function () {
        if (this.nodeType === 3 && /registros/.test(this.nodeValue)) this.parentNode.removeChild(this);
    });
}
$(function () { compactarTablasMovil(); });
// y volver a llamarla si se re-inicializa una DataTable dinámicamente
```

---

## 6. ⭐ Fix de botones Guardar en mobile — APLICABLE A TODO EL DASHBOARD

En producción, el botón Guardar vive en el `card-header` (p. ej. Datos
Distribuidor) y en mobile queda encimado/feo junto al título. El patrón que el
cliente aprobó: **desktop = header, mobile = botón full width al final del
formulario**. Cómo replicarlo (ver `Vacante.html`):

```html
<!-- En el card-header (visible solo en desktop): -->
<input type="submit" value="Guardar" class="btn btn-success miAccionGuardar bt-solo-escritorio">

<!-- Al final del card-body (visible solo en mobile): -->
<div class="row bt-solo-movil">
    <div class="col-12">
        <input type="submit" value="Guardar" class="btn btn-success btn-block miAccionGuardar bt-solo-movil">
    </div>
</div>
```

y en JS enlazar por **clase** (no por id, hay dos botones):
`$('.miAccionGuardar').on('click', ...)`.

Las clases de visibilidad están en `bolsatrabajo.css`:

```css
.bt-solo-movil { display: none; }

@media (max-width: 767.98px) {
    .bt-solo-escritorio,
    input[type="submit"].btn.bt-solo-escritorio { display: none !important; }

    .bt-solo-movil { display: block; width: 100%; }
}
```

### ⚠️ Gotchas del tema (importantes)

1. El build de Bootstrap de `dashboard.css` **NO incluye** las utilidades
   responsivas `d-none d-md-*` — no existen, no las uses; usa
   `.bt-solo-escritorio` / `.bt-solo-movil`.
2. `t2o.css` declara `input[type=submit].btn { display: block !important }` —
   cualquier regla que quiera ocultar un submit debe ganarle en especificidad
   (por eso el selector `input[type="submit"].btn.bt-solo-escritorio`).
3. Si la página tiene FAB (botón "+" fijo), dejarlo en `bottom: 115px` para no
   encimarse con `#back-to-top` (vive en `bottom: 50px` y mide 50px).
4. DataTables cachea filas: para re-renderizar una tabla hay que
   `destroy()` ANTES de tocar el `tbody` y re-inicializar después (ver
   `BT.reinitTabla`).

---

## 7. Referencia del design system

En `_capturas/design-system.md` está el inventario completo extraído de
producción: esqueleto del layout, patrones de cards/filtros/DataTables/tabs,
SweetAlert, FAB, y la tabla de tokens (colores, sombras, radios, tipografía).
