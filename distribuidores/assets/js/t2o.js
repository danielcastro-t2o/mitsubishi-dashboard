const maxSize = 1997152;
//const maxSize = 1073741824; 
$(document).ready(function () {
    try {
        if ($(".demo-accordion").length > 0) {
            $(".demo-accordion").accordionjs();
        }
    }
    catch (ex) {
        console.error("No se pudo ejecutar 'accordionjs'");
    }
});
function validate() {
    var upload = $('#UploadImages')[0];
    if (!upload || upload.files.length === 0) {
        return true;
    }
    var file_size = upload.files[0].size;
    if (file_size > maxSize) {
        return false;
    }
    return true;
}
$(':file').change(function () {
    const dt = new DataTransfer();
    const input = this;
    const { files } = input

    $("#txtFiles").html('');
    for (let i = 0; i < files.length; i++) {
        if (i < 10) {
            const file = files[i];
            if (file.size > maxSize)
                sweetAlert('Oops...', 'Revise el tamaño de la imagen "' + file.name + '", no debe ser mayor a 2 MB', 'error');
            else {
                dt.items.add(file);
                $("#txtFiles").append(file.name + '<br>');
            }
        }
        else {
            sweetAlert('Oops...', 'Solo se pueden cargar un máximo de 10 imágenes', 'error');
            break;
        }
    }
    input.files = dt.files;
});
$(document).on("change", "#ddlUtmTerm", function () {
    if ($(this).val() === "Por modelo") {
        $("#boxModelos").show();
    } else {
        $("#boxModelos").hide();
        $("#ddlModelos").val("0");
    }
});
$(document).on("change", "#utm_1", function () {
    var val = $(this).val();
    var idRol = $("#hdnIdRol").val();
    var esAdmin = (idRol === "1" || idRol === "14");

    if (esAdmin && val === "DIST") {
        $("#boxDist").show();
        $("#boxDestino").show();
    } else {
        $("#boxDist").hide();
        $("#boxDestino").hide();
        $("#ddlDist").val("0");
        $("#ddlDestino").val("cotizacion");
    }
});

$("#btnGenerarUTMs").click(function () {
    $("#btnGenerarUTMs").addClass("btn-loading");
    $("#btnGenerarUTMs").prop("disabled", true);

    $('#tblt2o').DataTable().clear();

    $("#listUrls").html("");
    var utms = "";
    $('.txtUtm').each(function (i, obj) {
        var _source = $("#" + obj.id).val();

        if ($("#" + obj.id).data("id") == "utm_source") {
            var arr = $("#" + obj.id).val().split('|');
            if (arr.length == 1) {
                _source = arr[0];
            }
            else if (arr.length == 2) {
                if (arr[1] == "") {
                    _source = arr[0];
                }
            }
            var arr2 = $("#" + obj.id).val().split('-');
            if (arr2.length == 1) {
                _source = arr[0];
            }
            else if (arr2.length == 2) {
                if (arr2[1] == "") {
                    _source = arr[0];
                }
            }
            var sufijo = $("#hdnSourceSufijo").val();
            if (sufijo && sufijo !== "") {
                _source = _source + "_" + sufijo;
            }
        }

        utms += $("#" + obj.id).data("id") + "=" + _source + "&";
        //console.log(obj.id);
    });

    var utmTermVal = $("#ddlUtmTerm").val();
    if (utmTermVal === "Por modelo") {
        var modeloPart = $("#ddlModelos option:selected").text().split('| ')[1];
        if (modeloPart) {
            utms += "utm_term=" + modeloPart.replace(" - ", "_");
        }
    } else if (utmTermVal === "Brand") {
        utms += "utm_term=Brand";
    }

    var sourceVal = $("#utm_1").val();
    var idRol = $("#hdnIdRol").val();
    var esAdmin = (idRol === "1" || idRol === "14");
    var isAmdim = sourceVal === "AMDIM";
    var isDist = esAdmin && sourceVal === "DIST";

    if (isDist && ($("#ddlDist").val() === "0" || $("#ddlDist").val() === "")) {
        sweetAlert('Oops...', 'Debes seleccionar una distribuidora.', 'warning');
        $("#btnGenerarUTMs").removeClass("btn-loading");
        $("#btnGenerarUTMs").prop("disabled", false);
        return;
    }

    var idPla = isAmdim ? "-1" : (isDist ? $("#ddlDist").val() : $("#Header_hdnIdPla").val());
    var idDis = (isAmdim || isDist) ? "" : $("#Header_hdnIdDis").val();
    var destino = isDist ? $("#ddlDestino").val() : "cotizacion";

    $.ajax({
        type: 'POST',
        url: "../info/Default.aspx",
        async: true,
        data: {
            r: "getUrlLandings",
            clave_t2o: $("#ddlModelos").val(),
            idDis: idDis,
            idPla: idPla,
            destino: destino,
            termType: utmTermVal,
            modelo: $("#ddlModelos option:selected").text().split('| ')[1] == undefined ? "Todos los modelos" : $("#ddlModelos option:selected").text().split('| ')[1].split(' - ')[0],
            utms: utms,
            x: Math.random()
        },
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            sweetAlert('Oops...', errorThrown, 'error');
        },
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    var obj = data;
                    $.each(obj, function (arrayID, JSONobj) {

                        $('#tblt2o').DataTable().row.add([
                            '<button type="button" tittle="Copiar URL" onclick="return copyText(' + JSONobj.id + ');" class="btn btn-icon btn-primary"><i class="fe fe-copy"></i></button>', '<label class="form-label">' + JSONobj.marca + '</label>', '<label class="form-label">' + JSONobj.modelo + '</label>', '<label class="form-label">' + JSONobj.anio + '</label>', '<label id="labelCopy_' + JSONobj.id + '" class="form-label">' + JSONobj.url.toLowerCase() + '</label>'
                        ]).draw();
                    });                    
                }
                else {
                    sweetAlert('OK', 'No se encontraron URLs disponibles.', 'success');
                }
                $("#btnGenerarUTMs").removeClass("btn-loading");
                $("#btnGenerarUTMs").prop("disabled", false);
            }
            else {
                sweetAlert('Oops...', 'No se generaron las URLs', 'info');
            }
        }
    });

})
$("#btnGenerarUTMServicio").click(function () {
    $("#btnGenerarUTMServicio").addClass("btn-loading");
    $("#btnGenerarUTMServicio").prop("disabled", true);

    $('#tblt2o').DataTable().clear();

    $("#listUrls").html("");
    var utms = "";
    $('.txtUtm').each(function (i, obj) {
        var _source = $("#" + obj.id).val();

        if ($("#" + obj.id).data("id") == "utm_source") {
            var arr = $("#" + obj.id).val().split('|');
            if (arr.length == 1) {
                _source = arr[0] + "|1171";
            }
            else if (arr.length == 2) {
                if (arr[1] == "") {
                    _source = arr[0] + "|1171";
                }
            }
        }

        utms += $("#" + obj.id).data("id") + "=" + _source + "&";
        //console.log(obj.id);
    });

    $.ajax({
        type: 'POST',
        url: "../info/Default.aspx",
        async: true,
        data: {
            r: "getUrlLandingsServicio",
            idPla: $("#Header_hdnIdPla").val(),
            idDis: $("#Header_hdnIdDis").val(),
            utms: utms,
            x: Math.random()
        },
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            sweetAlert('Oops...', errorThrown, 'error');
        },
        success: function (data) {
            if (data != null) {
                if (data.length > 0) {
                    var obj = data;
                    $.each(obj, function (arrayID, JSONobj) {

                        $('#tblt2o').DataTable().row.add([
                            '<button type="button" tittle="Copiar URL" onclick="return copyText(' + JSONobj.id + ');" class="btn btn-icon btn-primary"><i class="fe fe-copy"></i></button>', '<label id="labelCopy_' + JSONobj.id + '" class="form-label">' + JSONobj.url + '</label>'
                        ]).draw();
                    });
                }
                else {
                    sweetAlert('OK', 'No se encontraron URLs disponibles.', 'success');
                }
                $("#btnGenerarUTMServicio").removeClass("btn-loading");
                $("#btnGenerarUTMServicio").prop("disabled", false);
            }
            else {
                sweetAlert('Oops...', 'No se generaron las URLs', 'info');
            }
        }
    });

})
$("#ddlLead").change(function () {
    $("#hdnLead").val($(this).val());
    console.log($(this).val());
});

function ValidateDist(ddl) {
    if ($(ddl).val() == "0") {
        sweetAlert('Oops...', 'Debe seleccionar una Distribuidora.', 'info');
        return false;
    }
    __doPostBack(ddl, '');
    return true;
}
function ValidaFecha() {
    if ($("#hdnDesde").val() == "" || $("#hdnHasta").val() == "") {
        sweetAlert('Oops...', 'Debe seleccionar un rango de fechas.', 'info');
        return false;
    }
}
function copyText(id) {
    var $bridge = $("<input>")
    $("body").append($bridge);
    $bridge.val($("#labelCopy_" + id).text()).select();
    document.execCommand("copy");
    $bridge.remove();
}



