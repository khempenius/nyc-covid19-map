const map = L.map('map').setView([40.7128, -73.906], 11);
const layerGroup = new L.LayerGroup();
let data = L.geoJSON();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const drawMap = function (mode) {
    layerGroup.removeLayer(data);
    data = L.geoJSON(geoJson, {
        pointToLayer: function () {
            return null;
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties["postal-code"]) {
                const zip = parseInt(feature.properties["postal-code"]);
                const result = results[zip];
                const pop = population[zip] ? population[zip].pop : 0;
                const cases = result["Positive"];
                const per100K = cases * 100000 / pop;

                const metric = mode === 'absolute' ? cases : per100K;
                const max = mode === 'absolute' ? 500 : 1000;
                const rgbOffset = metric * 255 / max;
                const color = `rgba(${rgbOffset},${255 - rgbOffset},0)`
                layer.setStyle({ color: color });

                const headerStr = `<h1>${feature.properties.city}</h1>`;

                const areaStr = `<p><b>Zip code: </b>${zip}<br>` +
                    `<b>Population: </b>${Intl.NumberFormat().format(pop)}</p>`;

                const testsStr = `<p><b>Positive tests: </b>${result["Positive"]}<br>` +
                    `<b>Total tests: </b>${result["Total"]}</p>`;
                
                const incidenceStr = `<b>Cases / 100K people: </b><h2>${parseInt(per100K)}</h2>`;

                const popupText = [headerStr, areaStr, testsStr, incidenceStr].join("");
                layer.bindPopup(popupText);
            }
        }
    });
    layerGroup.addTo(map);
    layerGroup.addLayer(data);
};
drawMap('absolute');
