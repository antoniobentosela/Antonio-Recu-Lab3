window.addEventListener("load", CargarElementos);

function $(id) {
    return document.getElementById(id);
}


function CargarElementos() {
    var peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function () {

        if (peticion.status == 200 && peticion.readyState == 4) {
            $("divSpinner").hidden = true;
            var personas = JSON.parse(peticion.responseText);

            for (let index = 0; index < personas.length; index++) {
                crearFila(personas[index]);

            }
        }
    }

    peticion.open("GET", "http://localhost:3000/materias", true);
    peticion.send();
    $("divSpinner").hidden = false;
}

function crearFila(persona) {
    var fila = document.createElement("tr");
    
    var tdId = document.createElement("td");
    var tdNombre = document.createElement("td");
    var tdCuatrimestre = document.createElement("td");
    var tdFechaFinal = document.createElement("td");
    var tdTurno = document.createElement("td");

   var txtId = document.createTextNode(persona.id);
    var txtNombre = document.createTextNode(persona.nombre);
    var txtCuatrimestre = document.createTextNode(persona.cuatrimestre);
    var txtFechaFinal = document.createTextNode(persona.fechaFinal);
    var txtTurno = document.createTextNode(persona.turno);

    fila.appendChild(tdId);
    tdId.appendChild(txtId);

    fila.appendChild(tdNombre);
    tdNombre.appendChild(txtNombre);

    fila.appendChild(tdCuatrimestre);
    tdCuatrimestre.appendChild(txtCuatrimestre);

    fila.appendChild(tdFechaFinal);
    tdFechaFinal.appendChild(txtFechaFinal);

    fila.appendChild(tdTurno);
    tdTurno.appendChild(txtTurno);

    fila.addEventListener("dblclick", desplegarFormFila);

    $("tabla").appendChild(fila);
}

//form hidden

function desplegarFormFila(event) {
    var divPersona = $("divFormPersonas");
    divPersona.hidden = false;

    $("btnEliminar").onclick = function () {
        var jsonIdMateria = { "id": id }

        var peticion = new XMLHttpRequest();
        peticion.onreadystatechange = function () {
            if (peticion.status == 200 && peticion.readyState == 4) {
                $("divSpinner").hidden = true;
                tabla.removeChild(fila);
            }
        }
        peticion.open("POST", "http://localhost:3000/eliminar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonIdMateria));
        $("divSpinner").hidden = false;


    }

    $("btnCerrar").onclick = function () {
        $("divFormMateria").hidden = true;
    }
    $("btnCerrar").onclick = function () {
        divPersona.hidden = true;
    }

    $("btnModificar").onclick = function () {
       
        
        if ($("txtNombre").value.length < 6) {
            $("txtNombre").style.borderColor = "red";
        } else {
            $("txtNombre").style.borderColor = "black";
            flagNombre = true;
        }

        if($("mañana").checked == false && $("noche").checked == false)
        {
            flagTurno = false;
        }else
        {
            flagTurno = true;
        }

        if (flagNombre == true && flagTurno == true) {
            
            var nombreInput = $("txtNombre").value;
            var cuatrimestreInput = $("selectCuatrimestre").value;
            var fechaFinalInput = $("date").value;
            var turnoInput = fila.childNodes[4].childNodes[0].nodeValue;

            var jsonMateria = { "id": id, "nombre": nombreInput, "cuatrimestre": cuatrimestreInput, "fechaFinal": fechaFinalInput, "turno": turnoInput };
            console.log(jsonMateria);
            var peticion = new XMLHttpRequest();
            peticion.onreadystatechange = function () {
                if (peticion.status == 200 && peticion.readyState == 4) {

                    $("divSpinner").hidden = true;
                    
                    fila.childNodes[3].childNodes[0].nodeValue = fechaFinalInput;

                    if ($("mañana").checked == true) {
                        fila.childNodes[4].childNodes[0].nodeValue = $("mañana").value;

                    } else if ($("noche").checked == true) {
                        fila.childNodes[4].childNodes[0].nodeValue = $("noche").value;
                    }

                    fila.childNodes[1].childNodes[0].nodeValue = nombreInput;

                }
            }
            peticion.open("POST", "http://localhost:3000/editar");
            peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            peticion.send(JSON.stringify(jsonMateria));

            $("divSpinner").hidden = false;
        }

    }

    var tabla = $("tabla");
    var fila = event.target.parentNode;
    var id = fila.childNodes[0].childNodes[0].nodeValue;
    var nombre = fila.childNodes[1].childNodes[0].nodeValue;
    var cuatrimestre = fila.childNodes[2].childNodes[0].nodeValue;
    var fechaFinal = fila.childNodes[3].childNodes[0].nodeValue;
   
    
    var flagNombre = false;
    var flagTurno = true;

    $("txtNombre").value = nombre;
    $("selectCuatrimestre").value = cuatrimestre;
    $("date").value = convertDateFormat(fechaFinal);
}


function convertDateFormat(string) {
    var info = string.split('/').reverse().join('-');
    return info;
}

