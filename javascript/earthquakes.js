const mymap = L.map('map').setView([25, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const tiles = L.tileLayer(tileUrl,{attribution,minZoom: 1.5});
tiles.addTo(mymap);





async function getData() {
  const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
  const data = await response.json();
  for(var i = 0; i < data.features.length; i++){
    //console.log(data.features[i].geometry.coordinates[0]);
    var mag = data.features[i].properties.mag;
    mag = Math.pow(mag,10);
    mag=Math.sqrt(mag)
    var circle = L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.8,
      radius: mag*100
    }).addTo(mymap);
    var title = data.features[i].properties.title;
    const dateObject = new Date(data.features[i].properties.time)
    const humanDateFormat = dateObject.toLocaleString()
    circle.bindPopup("<h4>"+title+"</h4><h4>"+humanDateFormat+"</h4>");
    circle.on('mouseover', function (e) {
        this.openPopup();
    });
    circle.on('mouseout', function (e) {
        this.closePopup();
    });
    
  }
  console.log(data)
  setTimeout(getData, 60000);
}
getData();