export const obtenerDataColegios = (colegios) => {//funcion para extraer el nombre del establecimiento,latitud,longitud y el rbd
    const resultados = [];

    for (let i = 0; i < colegios.length; i++) {
        const establecimiento = {
            RBD: colegios[i].RBD,
            "NOMBRE ESTABLECIMIENTO": colegios[i]["NOMBRE ESTABLECIMIENTO"],
            "LATITUD": colegios[i]["LATITUD"],
            "LONGITUD": colegios[i]["LONGITUD"],
        };
        resultados.push(establecimiento);
    }

    return resultados;
}