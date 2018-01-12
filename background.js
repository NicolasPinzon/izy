chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.query){
            case 'buscarProfesores':
                $.ajax({
                    url:"https://api.losestudiantes.co/universidades/universidad-de-los-andes/administracion/buscar/" + request.consulta
                }).done(function(data) {
                    console.log(data);
                    console.log("done");
                    sendResponse({data:data});
                }).fail(function(data) {
                    console.log("fail");
                    sendResponse({data:data});
                });
                break;
            case 'obtenerCalificaciones':
                $.ajax({
                    url:"https://api.losestudiantes.co/universidades/"+request.universidad+"/"+request.departamento+"/profesores/"+request.profesor+"/posts/"
                }).done(function (data) {
                    console.log("done");
                    sendResponse({data:data});
                }).fail(function (data) {
                    console.log("fail");
                    sendResponse({data:data});
                });
                break;
        }
        return true;
    }
);