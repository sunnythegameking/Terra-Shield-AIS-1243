document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('climate-map');
    if (!mapContainer) return;

    // Ensure container has explicit height in case CSS hasn't painted yet
    mapContainer.style.height = '450px';
    mapContainer.style.width = '100%';

    // Initialize map centered globally
    const map = L.map('climate-map', {
        zoomControl: true,
        fadeAnimation: true
    }).setView([20, 0], 3);

    // Standard OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; OpenStreetMap contributors',
        errorTileUrl: ''
    }).addTo(map);

    // Fetch active radar overlay timestamp dynamically
    fetch('https://api.rainviewer.com/public/weather-maps.json')
        .then(res => res.json())
        .then(data => {
            if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
                const latestFrame = data.radar.past[data.radar.past.length - 1];
                const liveRadarLayer = L.tileLayer(`https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/2/1_1.png`, {
                    maxZoom: 19,
                    minZoom: 1,
                    attribution: '© RainViewer',
                    opacity: 0.65,
                    errorTileUrl: ''
                }).addTo(map);

                L.control.layers(null, { "Live Weather & Radar": liveRadarLayer }).addTo(map);
            }
        })
        .catch(err => {
            console.warn("Radar tile layer skipped:", err);
        });

    // CRITICAL: Force Leaflet to recalculate size after DOM paint to remove white boxes
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
});