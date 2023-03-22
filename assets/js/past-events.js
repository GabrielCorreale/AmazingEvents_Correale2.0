async function fetchCards() {
  const urlApi = "https://mindhub-xj03.onrender.com/api/amazing";
  const cardEvents = document.getElementById("cardEvents");

  const renderCards = (eventsArray) => {
    const currentDate = new Date();
    cardEvents.innerHTML = eventsArray
      .filter((event) => event.date && new Date(event.date) < currentDate)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        (event) => `
          <div class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem; height: 32rem;">
            <img src="${event.image}" style="height: 8.5rem" class="card-img-top" alt="${event.name}">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <h5 class="card-title">${event.name}</h5>
                <ul><li class="badge text-bg-secondary mb-3 p-2">${event.category}</li></ul>
              </div>
              <ul><li>${event.description}</li></ul>
            </div>
            <div class="d-flex p-2 justify-content-between">
              <p class="card-text">Price: $ ${event.price}</p>
              <a href="./details.html?id=${event._id}" class="btn btn-primary ms-4">Details</a>
            </div>
          </div>`
      ).join("");
  };


  try {
    const response = await fetch(urlApi);
    const { events } = await response.json();

    renderCards(events);

    const categories = [...new Set(events.map((evento) => evento.category))].sort();
    const checkboxContainer = document.querySelector("#inlineCheckbox");

    const updateResults = () => {
      const checkedCategories = [...checkboxes].filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value.toLowerCase());
      const searchTerm = searchInput.value.toLowerCase();
      const filteredEvents = events.filter((event) => {
        return (
          event.name.toLowerCase().includes(searchTerm) &&
          (checkedCategories.length === 0 || checkedCategories.includes(event.category.toLowerCase()))
        );
      });
    
      if (filteredEvents.length > 0) {
        renderCards(filteredEvents);
      } else {
        const noMatchesMessage = document.createElement("div");
        noMatchesMessage.classList.add("alert", "alert-warning");
        noMatchesMessage.textContent = "No matches found.";
        cardEvents.innerHTML = "";
        cardEvents.appendChild(noMatchesMessage);
      }
    };

    categories.forEach((category) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = category;
      checkbox.value = category;
      checkbox.classList.add("form-check-input");
      checkbox.addEventListener("change", updateResults);

      const label = document.createElement("label");
      label.htmlFor = category;
      label.textContent = category;
      label.classList.add("form-check-label", "blockquote");

      const div = document.createElement("div");
      div.classList.add("form-check", "form-check-inline");
      div.appendChild(checkbox);
      div.appendChild(label);

      checkboxContainer.appendChild(div);
    });

    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    const searchInput = document.querySelector("input[type=search]");

    checkboxes.forEach((checkbox) => checkbox.addEventListener("change", updateResults));
    searchInput.addEventListener("input", updateResults);
  } catch (error) {
    console.error("Error al recuperar los datos de la API:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchCards);