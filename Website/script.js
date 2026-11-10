document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Leaflet Map centered globally
    const map = L.map('climate-map', {
        zoomControl: true,
        fadeAnimation: true
    }).setView([20, 0], 3);

    // Add standard OpenStreetMap tiles with safe error handling
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; OpenStreetMap contributors',
        errorTileUrl: '' 
    }).addTo(map);

    // Fetch live RainViewer radar overlay timestamp dynamically
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

    // 2. Interactive Category Filter Logic for Community Projects
    const filterPills = document.querySelectorAll('.filter-pills .pill');
    const projectCards = document.querySelectorAll('.project-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            filterPills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            pill.classList.add('active');

            const selectedFilter = pill.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (selectedFilter === 'all' || category === selectedFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});