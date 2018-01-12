$(".pla-logo-box").append($("<button class=\"btn btn-success btn-block\" id='izy_btn'>Que tal los teachers?</button>"));

function calificar(){
    const resultados_materias = $(".pla-result-item>div:nth-child(1)>span:nth-child(3)");
    const resultados = $(".pla-result-item>div:nth-child(4)>span");
    console.log(resultados_materias);
    if(resultados.length > 0){
        $.each(resultados, function (indiceProfesor, elemento) {
            const $elemento = $(elemento);
            const consulta = $elemento.text().toLowerCase();
            chrome.runtime.sendMessage({consulta: consulta, query: "buscarProfesores"}, function (response) {
                if(response.data && response.data.length && response.data[1].options){
                    const opciones_t = response.data[1].options;
                    var indice_seleccionado = 0;
                    var coincidencia = 0;
                    if(opciones_t){
                        const setConsulta = consulta.split(" ");
                        $.each(opciones_t, function (indiceOpciones, elemento) {
                            const consultaElemento = elemento.nombre +" "+elemento.apellidos;
                            const setElemento = consultaElemento.toLowerCase().split(" ");
                            const interseccion = _.intersection(setConsulta, setElemento);
                            if(interseccion.length > coincidencia){
                                coincidencia = interseccion.length;
                                indice_seleccionado = indiceOpciones;
                            }
                        })
                    }
                    const info = response.data[1].options[indice_seleccionado];
                    chrome.runtime.sendMessage({universidad: info.idUniversidad,
                                                departamento: info.departamento_slug,
                                                profesor: info.slug,
                                                query:"obtenerCalificaciones"}, function (response) {
                        var mapaCalificaciones = {
                            total: {
                                id: "total",
                                nombre: "calificacionTotal",
                                sumDificultad: 0,
                                sumNota: 0,
                                sumGeneral: 0,
                                contador: 0
                            }
                        };
                        if(response.data && response.data.length)
                            $.each(response.data, function (indice, elemento) {
                                if(!mapaCalificaciones[elemento.materia.id]){
                                    mapaCalificaciones[elemento.materia.id] = {
                                        id: elemento.materia.id,
                                        nombre: elemento.materia.nombre,
                                        sumDificultad: elemento.dificultad,
                                        sumNota: elemento.nota,
                                        sumGeneral: elemento.general,
                                        contador: 1
                                    }
                                }else{
                                    var seleccionado = mapaCalificaciones[elemento.materia.id];
                                    seleccionado.sumDificultad = seleccionado.sumDificultad + elemento.dificultad;
                                    seleccionado.sumNota = seleccionado.sumNota + elemento.nota;
                                    seleccionado.sumGeneral = seleccionado.sumGeneral + elemento.general;
                                    seleccionado.contador = seleccionado.contador + 1;
                                }
                                var seleccionado = mapaCalificaciones["total"];
                                seleccionado.sumDificultad = seleccionado.sumDificultad + elemento.dificultad;
                                seleccionado.sumNota = seleccionado.sumNota + elemento.nota;
                                seleccionado.sumGeneral = seleccionado.sumGeneral + elemento.general;
                                seleccionado.contador = seleccionado.contador + 1;
                            });
                        mapaCalificaciones.total.contador = mapaCalificaciones.total.contador || 1;
                        var infoSpanDificultad = $("<span class='izy_info'></span>");
                        infoSpanDificultad.text("Dificultad: "+(mapaCalificaciones.total.sumDificultad/mapaCalificaciones.total.contador).toFixed(2));
                        var infoSpanNota = $("<span class='izy_info'></span>");
                        infoSpanNota.text(" Nota promedio: "+(mapaCalificaciones.total.sumNota/mapaCalificaciones.total.contador).toFixed(2));
                        var infoSpanGeneral = $("<span class='izy_info'></span>");
                        infoSpanGeneral.text(" Calificacion general: "+(mapaCalificaciones.total.sumGeneral/mapaCalificaciones.total.contador).toFixed(2));
                        $elemento.parent().append($("<div>")).append("<span class='izy_enunciado'>Calificación General:</span>");
                        $elemento.parent().append($("<div>")).append(infoSpanDificultad);
                        $elemento.parent().append($("<div>")).append(infoSpanNota);
                        $elemento.parent().append($("<div>")).append(infoSpanGeneral);
                    });
                }
            })
        })
    }else {
        alert("no hay teachers para calificar");
    }
}

$("#izy_btn").click(calificar);