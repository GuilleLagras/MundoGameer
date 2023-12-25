
  //formulario
  const filterForm = document.getElementById("filter-form");
  const categorySelect = document.getElementById("category");
  const availabilitySelect = document.getElementById("availability");
  const sortSelect = document.getElementById("sort");

  // Escuchar cambios en el formulario
  filterForm.addEventListener("change", function () {
    const query = categorySelect.value;
    const availability = availabilitySelect.value;
    const sort = sortSelect.value;

    const url = `/api/products?query=${query}&availability=${availability}&sort=${sort}`;

    // Actualiza sin recargar
    history.pushState({}, "", url);
  });

  // parametros de la URL actual
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("query")) {
    categorySelect.value = urlParams.get("query");
  }
  if (urlParams.has("availability")) {
    availabilitySelect.value = urlParams.get("availability");
  }
  if (urlParams.has("sort")) {
    sortSelect.value = urlParams.get("sort");
  }
