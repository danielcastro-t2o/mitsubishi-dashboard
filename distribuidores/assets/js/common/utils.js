function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function validaUrl(url) {
	return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
}

function formatMoney(amount) {
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});
}

function ValidarCampo(campo) {
	if (campo && campo != "" && campo != 0) return true;
	else return false;
}

function ValidarTexto(texto) {
	let regex = new RegExp(
		"^(([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ][a-zA-Z'-sáéíóúñÑÁÉÍÓÚüÜ .]+[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])|([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ]{2}))$"
	);

	if (regex.test(texto.toUpperCase()) && texto.length <= 500) return true;
	else return false;
}

function ValidarCorreo(correo) {
	let email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

	if (email.test(correo.toUpperCase())) return true;
	else return false;
}

function validaPass(valor) {
	if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(valor))) {
		return false;
	}
	else if (/\s/.test(valor))
		return false;

	return true;
	//var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
}

function validaNumero(strRangoAdc) {
	if (!(event.keyCode >= 48 && event.keyCode <= 57))
		if (validaNumero.arguments.length > 0) {
			if (strRangoAdc.indexOf(String.fromCharCode(event.keyCode)) == -1)
				event.returnValue = false;
			else
				if (event.srcElement.value.indexOf(String.fromCharCode(event.keyCode)) >= 0)
					event.returnValue = false;
		}
		else
			event.returnValue = false;
}

function soloLetras(e) {
	var key = e.keyCode || e.which,
		tecla = String.fromCharCode(key).toLowerCase(),
		letras = " áéíóúabcdefghijklmnñopqrstuvwxyz",
		especiales = [8, 39],
		tecla_especial = false;

	for (var i in especiales) {
		if (key == especiales[i]) {
			tecla_especial = true;
			break;
		}
	}

	if (letras.indexOf(tecla) == -1 && !tecla_especial) {
		return false;
	}
}

function ValidarNumero(num) {
	let regex = new RegExp("^([0-9]){10}$");

	if (regex.test(num)) return true;
	else return false;
}

function ValidarSoloNumeros(num) {
	let regex = new RegExp("^[0-9]+$");

	if (regex.test(num)) return true;
	else return false;
}

function ValidarCP(num) {
	let regex = new RegExp("^([0-9]){5}$");

	if (regex.test(num)) return true;
	else return false;
}

function ValidarCaracter(num) {
	let regex = new RegExp("^(([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ][a-zA-Z'-sáéíóúñÑÁÉÍÓÚüÜ .]+[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])|([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ]))$");

	if (regex.test(num)) return true;
	else return false;
}

function ValidarImagen(img) {
	let idxFile = img.lastIndexOf(".") + 1;
	let extFile = img.substr(idxFile, img.length).toLowerCase();

	if (extFile == "jpg" || extFile == "jpeg" || extFile == "png")
		return true;
	else
		return false;
}

function validarFormatoFecha(campo) {
	let regex = new RegExp("^\d{4}\/\d{2}\/\d{2}$");

	if (regex.test(campo)) return true;
	else return false;
}

function setDateToday() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	return yyyy + '-' + mm + '-' + dd;
} 

function copyToClipBoard(elem) {
	var codigoACopiar = document.getElementById(elem);
	var seleccion = document.createRange();
	seleccion.selectNodeContents(codigoACopiar);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(seleccion);
	var res = document.execCommand('copy');
	window.getSelection().removeRange(seleccion);
}

function ddlClear(origen) {
	if (origen == "anios") {
		$("#ddlMarcas option").remove();
		var m = document.getElementById('ddlMarcas');
		m.options[m.options.length] = new Option('Elija una marca*', '0');
		$("#ddlModelos option").remove();
		var m = document.getElementById('ddlModelos');
		m.options[m.options.length] = new Option('Elija un modelo*', '0');
		$("#ddlVersiones option").remove();
		var v = document.getElementById('ddlVersiones');
		v.options[v.options.length] = new Option('Todas las versiones', '0');
	}
	if (origen == "marcas") {
		$("#ddlModelos option").remove();
		var m = document.getElementById('ddlModelos');
		m.options[m.options.length] = new Option('Elija un modelo*', '0');
		$("#ddlVersiones option").remove();
		var v = document.getElementById('ddlVersiones');
		v.options[v.options.length] = new Option('Todas las versiones', '0');
	}
	if (origen == "modelos") {
		$("#ddlVersiones option").remove();
		var v = document.getElementById('ddlVersiones');
		v.options[v.options.length] = new Option('Todas las versiones', '0');
	}
}


$(function (e) {
	$('.tblt2o').DataTable({
		"language": {
			"lengthMenu": "Mostrar _MENU_ registros por p&aacute;gina",
			"zeroRecords": "No hay registros",
			"info": "P&aacute;gina _PAGE_ de _PAGES_",
			"infoEmpty": "No hay registros disponibles",
			"infoFiltered": "(filtered from _MAX_ total records)",
			"loadingRecords": "Cargando...",
			"search": "Buscar:",
			"paginate": {
				"first": "Primera",
				"last": "&Uacute;ltima",
				"next": "Siguiente",
				"previous": "Anterior"
			},
		},
		"pageLength": 25,
		"sorting": false,
	});

	$("#tiempoDesde").change(function () {
		$("#hdnDesde").val($(this).val());
	});
	$("#tiempoHasta").change(function () {
		$("#hdnHasta").val($(this).val());
	});
});


