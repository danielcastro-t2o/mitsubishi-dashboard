# Referencia extraída del dashboard real (2026-07-23)

Fuente: `https://dash.distribuidoresamdim.mx` (sesión SuperAdmin, navegación solo en Distribuidora Demo).

## Esqueleto de página (Default.aspx)

```html
<div id="global-loader"></div>
<div class="page">
  <div class="page-main">
    <!-- WebForms mete los <link> de CSS aquí dentro; en el mockup van en <head> -->
    <div id="header" class="app-header1 header py-3 d-flex shadow">
      <div class="container-fluid">
        <div class="d-flex header-inner-row">
          <div class="menu-toggle-button">
            <a class="nav-link wave-effect waves-effect waves-button" href="javascript:void(0);" id="sidebarCollapse">
              <span class="fa fa-bars"></span>
            </a>
          </div>
          <a class="header-brand" href="/distribuidores/Default.aspx">
            <div class="logoMenu"><img src="../assets/images/brand/Logo.png"></div>
          </a>
          <div class="d-flex order-lg-2 ml-auto header-user-block">
            <div class="dropdown d-none d-md-flex mt-1"></div>
            <div class="dropdown d-none d-md-flex mt-1"></div>
            <div class="dropdown mt-1">
              <a href="#" class="nav-link pr-0 leading-none">
                <span class="avatar avatar-md brround" title="Mi Cuenta"><i class="fa fa-user-circle text-primary"></i></span>
                <div class="ml-3 text-light d-none d-sm-flex"><span id="Header_lblUser"></span></div>
              </a>
            </div>
          </div>
        </div>
        <div class="header-distributor-row">
          <div class="form-group">
            <span id="Header_lblEmail" class="small font-weight-bold text-color-blue-nufi">Distribuidora</span>
            <select id="Header_ddlDistribuidoras" class="form-control">…</select>
          <span class="material-input"></span></div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <nav id="sidebar" class="nav-sidebar">
        <ul class="list-unstyled components" id="accordion">
          <li><a href="…"><i class="fa fa-home mr-2"></i> Inicio</a></li>
          <!-- submenú acordeón: -->
          <li>
            <a href="#Submenu5" class="accordion-toggle wave-effect waves-effect waves-button" data-toggle="collapse" aria-expanded="false"><i class="fa fa-car mr-2"></i> Seminuevos</a>
            <ul class="collapse list-unstyled" id="Submenu5" data-parent="#accordion">
              <li><a href="…"> Mis Seminuevos</a></li>
            </ul>
          </li>
          <li><hr style="border-color: #ddd; margin: 8px 16px;"></li>
          <li><a id="Menu_LoginStatus2" title="cerrar sesión" class="wave-effect waves-effect waves-button" href="…">Cerrar sesión</a></li>
        </ul>
      </nav>
      <div class="content-area">
        <div class="page-header borderLeft">
          <div class="page-title">
            Dashboard t2ó MX
            <br>
            <div class="page-subtitle">Consulta de Leads LP</div>
          </div>
        </div>
        <div class="row"><div class="col-12"> …contenido… </div></div>
      </div>
    </div>
  </div>
</div>
<a href="#top" id="back-to-top"><i class="fa fa-angle-up"></i></a>
```

Sidebar real: Inicio (`fa-home`), Generar UTM (`fa-bullhorn`, /Distribuidores/Marketing/LandingsUrls.aspx),
Reporte Leads (`fa-bar-chart`, /Distribuidores/Reportes/ReporteLeads.aspx),
Seminuevos (`fa-car`, #Submenu5: Mis Seminuevos / Alta de Seminuevo / Parámetros),
Datos Distribuidor (`fa-cogs`, /Distribuidores/Configuracion/DatosDistribuidores.aspx),
Servicio (`fa-wrench`, #Submenu6: Mis Citas de Servicio / Parámetros),
Prueba de Manejo (`fa-id-card`, #Submenu7: Mis Prueba de Manejo / Parámetros),
Distribuidores (`fa-building`), Cerrar sesión.

Mobile: `#sidebarCollapse` (en custom.js) togglea la clase `active` en `#sidebar`
(fixed, 240px, z-index 1050, transición margin-left .3s, sombra `1px 0 20px rgba(0,0,0,.08)`).

## Card + filtros (ReporteLeads.aspx)

```html
<div class="card">
  <div class="card-header"><h3 class="card-title">Filtros</h3></div>
  <div class="card-body">
    <div class="row">
      <div class="form-group col-lg-3 is-empty">
        <label class="form-label">Desde</label>
        <input type="date" class="form-control">
      <span class="material-input"></span></div>
      …
      <button class="btn btn-primary ml-auto mt-5">Buscar</button>
    </div>
  </div>
</div>
```

Botón exportar (verde, aparece tras buscar): `btn` verde #4ecc48 con icono Excel.

## DataTable (patrón "Resultados encontrados")

```html
<div class="card">
  <div class="card-header"><h3 class="card-title">Resultados encontrados</h3></div>
  <div class="card-body">
    <table class="table table-striped table-bordered tblt2o" style="width:100%">…</table>
  </div>
</div>
```

Init JS produce: `.dataTables_wrapper.dt-bootstrap4` con
"Mostrar [10/25/50/100] registros por página", "Buscar:", paginación
`ul.pagination > li.paginate_button.page-item > a.page-link` (Anterior/Siguiente).
Idioma español custom. Botón de detalle por fila (patrón Leads):

```html
<a href="LeadDetails.aspx?orig=Dash&id=11335">
  <button type="button" class="btn btn-outline-primary btn-sm mb-1" title="…"><i class="fa fa-search"></i></button>
</a>
```

## Card de captura con Guardar (DatosDistribuidores.aspx)

```html
<div class="card-header">
  <h3 class="card-title"><i class="text-success fa fa-plus mr-2"></i>Datos</h3>
  <div class="col-lg-11 text-right">
    <input type="submit" value="Guardar" class="btn btn-success">
  </div>
</div>
```

Tabs internos: `.tab-menu-heading > .tabs-menu1 > ul.nav.panel-tabs > li > a[data-toggle=tab]` (+`.active`).

Multi-correo (patrón repetido en todo el dashboard):
```html
<div class="form-group col-lg-6">
  <label class="form-label">Email cotizaciones (separados por ;)</label>
  <input type="text" class="form-control">
<span class="material-input"></span></div>
```

## FAB de alta (SeminuevosLista.aspx)

```html
<a id="btn-alta-seminuevo" href="Seminuevo.aspx">+</a>
<!-- fixed abajo-derecha, 50px, círculo rojo #e60012 -->
```

## SweetAlert v2

`swal("Oops...", "Debes seleccionar la fecha desde", "error")` →
`.swal-overlay.swal-overlay--show-modal > .swal-modal`. Título azul marino,
texto gris, botón OK azul claro. Confirmaciones con `buttons: [cancel, confirm]`.

## Tokens

| Token | Valor |
|---|---|
| Azul marino títulos/labels | `#001a5e` |
| Rojo primario | `#e60012` |
| Verde guardar | `#4ecc48` |
| Teal secundario (Agregar Horario) | `#4ec2b1` aprox |
| Gris texto sidebar | `#828282` |
| Gris subtítulo | `#7e7e7e` |
| Gris texto input | `#898989` |
| Borde inputs/divisores | `#eaeaea` |
| Body bg | `#eeeeee` |
| Content-area bg | `#fafafa` |
| Sombra header | `0 8px 16px rgba(6,148,255,.15)` |
| Sombra cards | `0 8px 16px rgba(6,148,255,.10)` |
| Radio cards | `16px` |
| Radio inputs/botones | `3px` |
| Fuente | Poppins (100–900), body 16px |
