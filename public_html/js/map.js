let map;

async function initMap() {

    const position = { lat: 40.324125740459316, lng: -3.7534295250752985 };

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "indexMap"
    });

    const markerImage = document.createElement('img');
    markerImage.src = './img/logo.svg';
    markerImage.style.width = '50px'; // Ajusta el ancho del marcador
    markerImage.style.height = '50px'; // Ajusta la altura del marcador

    const marker = new AdvancedMarkerView({
        map: map,
        position: position,
        content: markerImage,
        title: "Localización de Productos Baratos Madrid"
    });

    //const mapDiv = document.getElementById('map');

    // Añade un listener para el evento de clic en el marcador
    marker.addEventListener('click', function () {
        console.log('Click')
        // Redirige al usuario a Google Maps con la ubicación del marcador
        window.open('https://www.google.com/maps/search/?api=1&query=' + position.lat + ',' + position.lng);
    });

    marker.addEventListener("mouseenter", function () {
        this.style.cursor = "pointer"; // Cambiar el color de fondo al pasar el mouse
    });

    marker.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "default"; // Restaurar el color de fondo al salir el mouse
    });

    // Hace zoom al marcador y centra el mapa en su posición
    map.setZoom(15); // Establece el nivel de zoom deseado
    map.panTo(position); // Centra el mapa en la posición del marcador
}

document.addEventListener('DOMContentLoaded', () => {
    initMap()
})