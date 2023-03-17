async function fetchCards() {
  try {
    let urlApi = "https://mh.up.railway.app/api/amazing-events";
    let response = await fetch(urlApi).then((res) => res.json());
    let printEvents = (cardId, eventsArray) => {
      let card = document.getElementById(cardId);
      let cardsDelEvento = eventsArray
        .filter((event) => event.date)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          (event) => `
        <div class="card col-10 col-md-4 col-lg-3 col-xl-2 m-2" style="">
              <img src="${event.image}" class="card-img-top" style="height: 10rem;" alt="...">
                <div class="card-body h-100 shadow ">
                  <h5 class="card-title">${event.name}</h5>
                  <ul class="">
                    <li class="badge text-bg-primary mb-3 p-2">
                    ${event.category}
                    </li>
                    <li>
                     ${event.description}
                    </li>
                  </ul>
                </div>
                <div class="d-flex p-2 justify-content-between h- ">
                  <p class="card-text">Price$ ${event.price}</p>
                  <a href="./details.html?id=${event.id} " class="btn btn-primary ms-4">Details</a>
                </div>
        </div>`
        );
      card.innerHTML = cardsDelEvento.join("");
    };

    printEvents("cardEvents", response.events);

    let categorias = [
      ...new Set(response.events.map((evento) => evento.category)),
    ];
    categorias = categorias.sort();
    let checkboxContainer = document.querySelector("#inlineCheckbox");
    let updateResults = async () => {
      try {
        let response = await fetch(urlApi).then((res) => res.json());
        let events = response.events.filter((event) => event.date);
        let checkedCategories = [...checkboxes]
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value.toLowerCase());
        let searchTerm = searchInput.value.toLowerCase();
        let filteredEvents = events.filter((event) => {
          return (
            event.name.toLowerCase().includes(searchTerm) &&
            (checkedCategories.length === 0 ||
              checkedCategories.includes(event.category.toLowerCase()))
          );
        });
        if (filteredEvents.length > 0) {
          printEvents("cardEvents", filteredEvents);
        } else {
          swal("No matches found", "", "warning");
          searchInput.value = "";
          setTimeout(() => location.reload(), 2000);
        }
      } catch (error) {
        console.error("Error al recuperar los datos de la API:", error);
      }
    };

    categorias.forEach((categoria) => {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = categoria;
      checkbox.value = categoria;
      checkbox.classList.add("form-check-input");
      checkbox.addEventListener("change", updateResults);

      let label = document.createElement("label");
      label.htmlFor = categoria;
      label.textContent = categoria;
      label.classList.add("form-check-label", "blockquote");

      let div = document.createElement("div");
      div.classList.add("form-check", "form-check-inline");
      div.appendChild(checkbox);
      div.appendChild(label);

      checkboxContainer.appendChild(div);
    });

    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    let searchInput = document.querySelector("input[type=search]");

    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", updateResults)
    );
    searchInput.addEventListener("input", updateResults);
  } catch (error) {
    console.error("Error al recuperar los datos de la API:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchCards);
