// Módulo Bolsa de Trabajo — datos demo (localStorage) + lógica del mockup.
// En producción esto se sustituye por postbacks/servicios del dashboard WebForms.
(function () {
    var LS_VACANTES = 'bt_vacantes_v1';
    var LS_POSTULACIONES = 'bt_postulaciones_v1';
    var LS_CONFIG = 'bt_config_v1';
    var CV_DEMO = '../assets/docs/cv-ejemplo.pdf';

    var seedVacantes = [
        {
            id: 1,
            titulo: 'Asesor de Ventas Digitales',
            descripcion: 'Atención a leads de medios digitales, seguimiento en CRM y cierre de ventas de unidades nuevas. Experiencia mínima de 2 años en el ramo automotriz.',
            vigencia: '2026-09-30',
            estatus: 'activa',
            fechaPublicacion: '2026-06-15'
        },
        {
            id: 2,
            titulo: 'Técnico Mecánico Certificado',
            descripcion: 'Realización de diagnósticos mecánicos, mantenimientos preventivos y correctivos bajo estándares de Mitsubishi Motors. Certificación técnica deseable.',
            vigencia: '',
            estatus: 'activa',
            fechaPublicacion: '2026-07-01'
        },
        {
            id: 3,
            titulo: 'Recepcionista de Servicio',
            descripcion: 'Recepción de clientes en el área de servicio, agenda de citas, seguimiento de órdenes y entrega de unidades.',
            vigencia: '2026-07-15',
            estatus: 'pausada',
            fechaPublicacion: '2026-05-20'
        }
    ];

    var seedPostulaciones = [
        { id: 101, idVacante: 1, nombre: 'María Fernanda López García', email: 'mafer.lopez@example.com', telefono: '55 1234 5678', fecha: '2026-07-21', cv: 'CV-MariaFernanda-Lopez.pdf', estatus: 'nueva' },
        { id: 102, idVacante: 1, nombre: 'Carlos Alberto Ramírez Soto', email: 'carlos.ramirez@example.com', telefono: '55 8765 4321', fecha: '2026-07-19', cv: 'CV-Carlos-Ramirez.pdf', estatus: 'nueva' },
        { id: 103, idVacante: 1, nombre: 'Ana Sofía Hernández Cruz', email: 'anasofia.hdz@example.com', telefono: '55 2468 1357', fecha: '2026-07-12', cv: 'CV-AnaSofia-Hernandez.pdf', estatus: 'vista' },
        { id: 104, idVacante: 1, nombre: 'Jorge Luis Mendoza Ávila', email: 'jl.mendoza@example.com', telefono: '55 9876 1234', fecha: '2026-07-05', cv: 'CV-JorgeLuis-Mendoza.pdf', estatus: 'contactada' },
        { id: 105, idVacante: 2, nombre: 'Luis Enrique Torres Vega', email: 'luis.torresv@example.com', telefono: '33 5555 0101', fecha: '2026-07-22', cv: 'CV-LuisEnrique-Torres.pdf', estatus: 'nueva' },
        { id: 106, idVacante: 2, nombre: 'Pedro Antonio Salinas Rojo', email: 'pedro.salinas@example.com', telefono: '33 4040 2020', fecha: '2026-07-10', cv: 'CV-Pedro-Salinas.pdf', estatus: 'contactada' },
        { id: 107, idVacante: 3, nombre: 'Gabriela Ruiz Manzano', email: 'gaby.ruiz@example.com', telefono: '55 3131 4242', fecha: '2026-07-08', cv: 'CV-Gabriela-Ruiz.pdf', estatus: 'vista' },
        { id: 108, idVacante: 3, nombre: 'Daniela Ortega Peña', email: 'dani.ortega@example.com', telefono: '55 7777 8888', fecha: '2026-06-30', cv: 'CV-Daniela-Ortega.pdf', estatus: 'contactada' }
    ];

    var seedConfig = { correos: 'rh@distribuidorademo.mx; gerencia@distribuidorademo.mx' };

    function load(key, seed) {
        try {
            var v = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(v) && v.length >= 0) return v;
        } catch (e) { /* seed */ }
        localStorage.setItem(key, JSON.stringify(seed));
        return JSON.parse(JSON.stringify(seed));
    }

    // Config idéntica a la de utils.js ($('.tblt2o').DataTable(...)) para re-inicializar tras filtrar.
    var dtLanguage = {
        "lengthMenu": "Mostrar _MENU_ registros por página",
        "zeroRecords": "No hay registros",
        "info": "Página _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros disponibles",
        "infoFiltered": "(filtered from _MAX_ total records)",
        "loadingRecords": "Cargando...",
        "search": "Buscar:",
        "paginate": { "first": "Primera", "last": "Última", "next": "Siguiente", "previous": "Anterior" }
    };

    var BT = {
        vacantes: load(LS_VACANTES, seedVacantes),
        postulaciones: load(LS_POSTULACIONES, seedPostulaciones),

        config: null,
        saveConfig: function () { localStorage.setItem(LS_CONFIG, JSON.stringify(BT.config)); },
        saveVacantes: function () { localStorage.setItem(LS_VACANTES, JSON.stringify(BT.vacantes)); },
        savePostulaciones: function () { localStorage.setItem(LS_POSTULACIONES, JSON.stringify(BT.postulaciones)); },

        getVacante: function (id) {
            return BT.vacantes.filter(function (v) { return v.id === Number(id); })[0] || null;
        },
        getPostulacion: function (id) {
            return BT.postulaciones.filter(function (p) { return p.id === Number(id); })[0] || null;
        },
        nextId: function (arr) {
            return arr.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1;
        },
        qs: function (name) {
            return new URLSearchParams(window.location.search).get(name);
        },
        hoy: function () {
            var d = new Date();
            return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        },
        fmtFecha: function (iso) {
            if (!iso) return '—';
            var p = iso.split('-');
            return p[2] + '/' + p[1] + '/' + p[0];
        },
        vencida: function (v) {
            return !!v.vigencia && v.vigencia < BT.hoy();
        },
        esc: function (s) {
            return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },

        badgeVacante: function (v) {
            if (BT.vencida(v)) return '<span class="badge bt-badge bt-badge-gris">Vencida</span>';
            if (v.estatus === 'activa') return '<span class="badge bt-badge bt-badge-rojo">Activa</span>';
            return '<span class="badge bt-badge bt-badge-negro">Pausada</span>';
        },
        badgePostulacion: function (p) {
            if (p.estatus === 'nueva') return '<span class="badge bt-badge bt-badge-rojo">Nueva</span>';
            if (p.estatus === 'vista') return '<span class="badge bt-badge bt-badge-gris">Vista</span>';
            return '<span class="badge bt-badge bt-badge-negro">Contactada</span>';
        },
        countPostulaciones: function (idVacante) {
            return BT.postulaciones.filter(function (p) { return p.idVacante === idVacante; }).length;
        },
        countNuevas: function () {
            return BT.postulaciones.filter(function (p) { return p.estatus === 'nueva'; }).length;
        },
        // Badge de postulaciones nuevas en el sidebar
        sidebarBadge: function () {
            var n = BT.countNuevas();
            var el = document.getElementById('btNuevasBadge');
            if (el) el.innerHTML = n > 0 ? '<span class="bt-contador">' + n + '</span>' : '';
        },

        // En mobile, el label del combo queda solo "Mostrar [25]"
        uiMovil: function () {
            if (!window.matchMedia('(max-width: 767.98px)').matches) return;
            $('.dataTables_length label').contents().each(function () {
                if (this.nodeType === 3 && /registros/.test(this.nodeValue)) this.parentNode.removeChild(this);
            });
        },

        // DataTables cachea las filas: hay que destruir ANTES de re-renderizar el tbody.
        reinitTabla: function ($tabla, render) {
            if ($.fn.DataTable.isDataTable($tabla[0])) {
                $tabla.DataTable().destroy();
            }
            render();
            $tabla.DataTable({ "language": dtLanguage, "pageLength": 25, "sorting": false });
            BT.uiMovil();
        },

        /* ============ Mis Vacantes ============ */
        renderVacantes: function () {
            var html = BT.vacantes.map(function (v) {
                var n = BT.countPostulaciones(v.id);
                var pausarIcon = v.estatus === 'activa' ? 'fa-pause' : 'fa-play';
                var pausarTitle = v.estatus === 'activa' ? 'Pausar vacante' : 'Activar vacante';
                return '<tr>' +
                    '<td><a href="Vacante.html?id=' + v.id + '"><button type="button" class="btn btn-outline-primary btn-sm mb-1" title="Ver / editar vacante"><i class="fa fa-search"></i></button></a></td>' +
                    '<td>' + v.id + '</td>' +
                    '<td>' + BT.esc(v.titulo) + '</td>' +
                    '<td class="strDate">' + BT.fmtFecha(v.fechaPublicacion) + '</td>' +
                    '<td>' + (v.vigencia ? BT.fmtFecha(v.vigencia) : 'Sin vigencia') + '</td>' +
                    '<td><a href="Postulaciones.html?vacante=' + v.id + '" class="bt-contador" title="Ver postulaciones">' + n + '</a></td>' +
                    '<td>' + BT.badgeVacante(v) + '</td>' +
                    '<td class="text-nowrap">' +
                        '<button type="button" class="btn btn-outline-negro btn-sm mb-1 mr-1 bt-pausar" data-id="' + v.id + '" title="' + pausarTitle + '"><i class="fa ' + pausarIcon + '"></i></button>' +
                        '<button type="button" class="btn btn-outline-danger btn-sm mb-1 bt-borrar" data-id="' + v.id + '" title="Borrar vacante"><i class="fa fa-trash"></i></button>' +
                    '</td>' +
                '</tr>';
            }).join('');
            document.querySelector('#tblVacantes tbody').innerHTML = html;
        },

        pageVacantes: function () {
            BT.renderVacantes();
            BT.sidebarBadge();

            $(document).on('click', '.bt-pausar', function () {
                var v = BT.getVacante($(this).data('id'));
                if (!v) return;
                var activar = v.estatus !== 'activa';
                swal({
                    title: activar ? 'Activar vacante' : 'Pausar vacante',
                    text: activar
                        ? 'La vacante volverá a publicarse en la bolsa de trabajo.'
                        : 'La vacante dejará de mostrarse en la bolsa de trabajo.',
                    icon: 'warning',
                    buttons: ['Cancelar', activar ? 'Sí, activar' : 'Sí, pausar']
                }).then(function (ok) {
                    if (!ok) return;
                    v.estatus = activar ? 'activa' : 'pausada';
                    BT.saveVacantes();
                    BT.reinitTabla($('#tblVacantes'), BT.renderVacantes);
                    swal('Listo', 'La vacante se ' + (activar ? 'activó' : 'pausó') + ' correctamente.', 'success');
                });
            });

            $(document).on('click', '.bt-borrar', function () {
                var v = BT.getVacante($(this).data('id'));
                if (!v) return;
                swal({
                    title: '¿Borrar vacante?',
                    text: 'Se eliminará "' + v.titulo + '". Esta acción no se puede deshacer.',
                    icon: 'warning',
                    buttons: ['Cancelar', 'Sí, borrar'],
                    dangerMode: true
                }).then(function (ok) {
                    if (!ok) return;
                    BT.vacantes = BT.vacantes.filter(function (x) { return x.id !== v.id; });
                    BT.saveVacantes();
                    BT.reinitTabla($('#tblVacantes'), BT.renderVacantes);
                    swal('Vacante eliminada', 'La vacante se eliminó correctamente.', 'success');
                });
            });
        },

        /* ============ Alta / edición de vacante ============ */
        pageVacante: function () {
            BT.sidebarBadge();
            var id = BT.qs('id');
            var v = id ? BT.getVacante(id) : null;

            if (!v) {
                // El correo receptor se configura una vez y queda precargado en cada alta
                document.getElementById('txtCorreos').value = BT.config.correos;
            }

            if (v) {
                document.getElementById('pageSubtitle').textContent = 'Detalles de la vacante';
                document.getElementById('rowCorreos').style.display = 'none';
                document.getElementById('txtTitulo').value = v.titulo;
                document.getElementById('txtDescripcion').value = v.descripcion;
                document.getElementById('txtVigencia').value = v.vigencia || '';
                document.getElementById('ddlEstatus').value = v.estatus;
            }

            $('.btGuardarVacante').on('click', function (e) {
                e.preventDefault();
                var titulo = $('#txtTitulo').val().trim();
                var descripcion = $('#txtDescripcion').val().trim();
                var vigencia = $('#txtVigencia').val();
                var estatus = $('#ddlEstatus').val();

                if (!titulo) { swal('Oops...', 'Debes capturar el título de la vacante', 'error'); return; }
                if (!descripcion) { swal('Oops...', 'Debes capturar la descripción de la vacante', 'error'); return; }

                if (!v) {
                    var correos = $('#txtCorreos').val().trim();
                    if (!correos) { swal('Oops...', 'Debes capturar al menos un correo para recibir las postulaciones', 'error'); return; }
                    var regex = /^[^\s@;]+@[^\s@;]+\.[^\s@;]+$/;
                    var invalidos = correos.split(';').map(function (c) { return c.trim(); }).filter(function (c) { return c && !regex.test(c); });
                    if (invalidos.length) { swal('Oops...', 'Revisa el formato de los correos: ' + invalidos.join(', '), 'error'); return; }
                    BT.config.correos = correos;
                    BT.saveConfig();
                }

                if (v) {
                    v.titulo = titulo; v.descripcion = descripcion;
                    v.vigencia = vigencia; v.estatus = estatus;
                } else {
                    BT.vacantes.push({
                        id: BT.nextId(BT.vacantes),
                        titulo: titulo,
                        descripcion: descripcion,
                        vigencia: vigencia,
                        estatus: estatus,
                        fechaPublicacion: BT.hoy()
                    });
                }
                BT.saveVacantes();
                swal('Vacante guardada', 'La vacante se guardó correctamente.', 'success').then(function () {
                    window.location.href = 'Vacantes.html';
                });
            });
        },

        /* ============ Postulaciones ============ */
        llenarFiltroVacantes: function () {
            var sel = document.getElementById('ddlVacante');
            BT.vacantes.forEach(function (v) {
                var o = document.createElement('option');
                o.value = v.id; o.textContent = v.titulo;
                sel.appendChild(o);
            });
            var pre = BT.qs('vacante');
            if (pre && BT.getVacante(pre)) sel.value = pre;
        },

        filtrarPostulaciones: function () {
            var desde = $('#tiempoDesde').val();
            var hasta = $('#tiempoHasta').val();
            var idVac = $('#ddlVacante').val();
            var est = $('#ddlEstatusPost').val();
            return BT.postulaciones.filter(function (p) {
                if (desde && p.fecha < desde) return false;
                if (hasta && p.fecha > hasta) return false;
                if (idVac !== '0' && p.idVacante !== Number(idVac)) return false;
                if (est !== '0' && p.estatus !== est) return false;
                return true;
            });
        },

        renderPostulaciones: function (lista) {
            var html = lista.map(function (p) {
                var v = BT.getVacante(p.idVacante);
                return '<tr>' +
                    '<td><a href="PostulacionDetalle.html?id=' + p.id + '"><button type="button" class="btn btn-outline-primary btn-sm mb-1" title="Ver detalle de la postulación"><i class="fa fa-search"></i></button></a></td>' +
                    '<td>' + p.id + '</td>' +
                    '<td>' + BT.esc(p.nombre) + '</td>' +
                    '<td class="strDate">' + BT.fmtFecha(p.fecha) + '</td>' +
                    '<td>' + BT.esc(v ? v.titulo : '—') + '</td>' +
                    '<td>' + BT.esc(p.email) + '</td>' +
                    '<td class="text-nowrap">' + BT.esc(p.telefono) + '</td>' +
                    '<td><a href="' + CV_DEMO + '" download="' + BT.esc(p.cv) + '"><button type="button" class="btn btn-outline-primary btn-sm mb-1" title="Descargar CV"><i class="fa fa-download"></i></button></a></td>' +
                    '<td>' + BT.badgePostulacion(p) + '</td>' +
                '</tr>';
            }).join('');
            document.querySelector('#tblPostulaciones tbody').innerHTML = html;
        },

        pagePostulaciones: function () {
            BT.llenarFiltroVacantes();
            BT.renderPostulaciones(BT.filtrarPostulaciones());
            BT.sidebarBadge();

            $('#btnBuscarPost').on('click', function (e) {
                e.preventDefault();
                var desde = $('#tiempoDesde').val();
                var hasta = $('#tiempoHasta').val();
                if (desde && hasta && hasta < desde) {
                    swal('Oops...', 'La fecha hasta no puede ser menor a la fecha desde', 'error');
                    return;
                }
                BT.reinitTabla($('#tblPostulaciones'), function () {
                    BT.renderPostulaciones(BT.filtrarPostulaciones());
                });
            });

            $('#btnExportarPost').on('click', function (e) {
                e.preventDefault();
                var lista = BT.filtrarPostulaciones();
                var filas = [['ID', 'Nombre', 'Fecha', 'Vacante', 'Email', 'Teléfono', 'CV', 'Estatus']];
                lista.forEach(function (p) {
                    var v = BT.getVacante(p.idVacante);
                    filas.push([p.id, p.nombre, BT.fmtFecha(p.fecha), (v ? v.titulo : ''), p.email, p.telefono, p.cv, p.estatus]);
                });
                var csv = filas.map(function (f) {
                    return f.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
                }).join('\r\n');
                var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'postulaciones.csv';
                a.click();
                URL.revokeObjectURL(a.href);
            });
        },

        /* ============ Detalle de postulación ============ */
        pagePostulacionDetalle: function () {
            var p = BT.getPostulacion(BT.qs('id'));
            if (!p) { window.location.href = 'Postulaciones.html'; return; }
            var v = BT.getVacante(p.idVacante);

            // Al abrir el detalle, una postulación nueva pasa a "vista" (como leídos de correo)
            if (p.estatus === 'nueva') {
                p.estatus = 'vista';
                BT.savePostulaciones();
            }

            document.getElementById('pageSubtitle').textContent = 'Detalles de la postulación ' + p.id;
            document.getElementById('dNombre').textContent = p.nombre;
            document.getElementById('dEmail').textContent = p.email;
            document.getElementById('dTelefono').textContent = p.telefono;
            document.getElementById('dFecha').textContent = BT.fmtFecha(p.fecha);
            document.getElementById('dVacante').textContent = v ? v.titulo : '—';
            document.getElementById('dBadge').innerHTML = BT.badgePostulacion(p);
            document.getElementById('dCvNombre').textContent = p.cv;
            document.getElementById('lnkCv').setAttribute('download', p.cv);
            document.getElementById('ddlEstatusDetalle').value = p.estatus;
            BT.sidebarBadge();

            $('#btnGuardarEstatus').on('click', function (e) {
                e.preventDefault();
                p.estatus = $('#ddlEstatusDetalle').val();
                BT.savePostulaciones();
                BT.sidebarBadge();
                document.getElementById('dBadge').innerHTML = BT.badgePostulacion(p);
                swal('Listo', 'El estatus de la postulación se actualizó correctamente.', 'success');
            });
        }
    };

    try {
        var cfg = JSON.parse(localStorage.getItem(LS_CONFIG));
        BT.config = (cfg && typeof cfg.correos === 'string') ? cfg : null;
    } catch (e) { BT.config = null; }
    if (!BT.config) {
        BT.config = JSON.parse(JSON.stringify(seedConfig));
        localStorage.setItem(LS_CONFIG, JSON.stringify(BT.config));
    }

    window.BT = BT;
})();
