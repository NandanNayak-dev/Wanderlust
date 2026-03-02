(() => {
  const initMap = () => {
  const mapEl = document.querySelector("[data-osm-map]");
  if (!mapEl) return;
  const statusEl = document.querySelector("[data-map-status]");

  if (typeof L === "undefined") {
    if (statusEl) statusEl.textContent = "Map library failed to load. Refresh the page or check internet/CDN access.";
    return;
  }

  const map = L.map(mapEl).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let marker;
  const hoverSelector = mapEl.dataset.hoverSelector || "[data-map-hover]";

  const setStatus = (message) => {
    if (statusEl) statusEl.textContent = message;
  };

  const placeMarker = (lat, lon, label) => {
    if (marker) {
      marker.setLatLng([lat, lon]).setPopupContent(label);
    } else {
      marker = L.marker([lat, lon]).addTo(map).bindPopup(label);
    }
    map.setView([lat, lon], 13);
  };

  const bindHoverPopups = () => {
    const hoverTargets = document.querySelectorAll(hoverSelector);
    if (!hoverTargets.length) return;

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        if (!marker) return;
        marker.openPopup();
      });

      target.addEventListener("mouseleave", () => {
        if (!marker) return;
        marker.closePopup();
      });
    });
  };

  const lookupAndRender = async (query, title) => {
    if (!query || !query.trim()) {
      setStatus("Enter a location to preview it on map.");
      return;
    }

    setStatus("Searching location...");
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setStatus("Location not found. Try a more specific place.");
        return;
      }

      const result = data[0];
      const lat = Number(result.lat);
      const lon = Number(result.lon);
      const label = title || result.display_name || query;

      placeMarker(lat, lon, label);
      setStatus(`Showing: ${result.display_name}`);
    } catch (err) {
      setStatus("Map lookup failed. Check internet connection and try again.");
    }
  };

  const locationSelector = mapEl.dataset.locationInput;
  const countrySelector = mapEl.dataset.countryInput;
  const mapTitle = mapEl.dataset.title || "Selected Location";

  if (locationSelector && countrySelector) {
    const locationInput = document.querySelector(locationSelector);
    const countryInput = document.querySelector(countrySelector);
    if (!locationInput || !countryInput) return;

    let timeoutId;
    const handleInput = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const query = `${locationInput.value}, ${countryInput.value}`.trim();
        lookupAndRender(query, mapTitle);
      }, 450);
    };

    locationInput.addEventListener("input", handleInput);
    countryInput.addEventListener("input", handleInput);
    handleInput();
    return;
  }

  const initialLocation = mapEl.dataset.location || "";
  bindHoverPopups();
  lookupAndRender(initialLocation, mapTitle);
  };

  if (document.readyState === "complete" && typeof L !== "undefined") {
    initMap();
    return;
  }

  window.addEventListener("load", initMap, { once: true });
})();
