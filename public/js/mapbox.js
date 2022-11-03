export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicXZoYSIsImEiOiJjbDl4OGhlcTMwN29nM3drOGF0bHp5dGNjIn0.RELUxH3-4TnFARyeN1g87w";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/qvha/cl9xahm9900gg15mgwjp3t7jr",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 40,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
