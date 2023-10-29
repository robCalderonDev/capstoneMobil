export const obtenerDataColegios = (colegios) => {//funcion para extraer el nombre del establecimiento y el rbd
    const resultados = [];

    for (let i = 0; i < colegios.length; i++) {
        const establecimiento = {
            RBD: colegios[i].RBD,
            "NOMBRE ESTABLECIMIENTO": colegios[i]["NOMBRE ESTABLECIMIENTO"]
        };
        resultados.push(establecimiento);
    }

    return resultados;
}