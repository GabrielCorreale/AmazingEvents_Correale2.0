// var texto = ""
// var checkBoxSelector = [];
// let arrayEventos = data.eventos
// var id = 1
// arrayEventos.map(evento => evento.id = id++)

// let unArray = data.eventos
// let eventos = data.fechaActual

// console.log(eventos)
// console.log(unArray)

// let contenedorTarjetas = document.getElementById('contenedorTarjetas');
// console.log(contenedorTarjetas)

// var templateTarjeta = "";
// function mostrarTarjetas(unArray) {

//   templateTarjeta = "";
//   if (unArray.length > 0) {
//     for (let i = 0; i < unArray.length; i++) {
//       if (unArray[i].date < data.fechaActual) {
//         templateTarjeta += `
//       <div class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem; height: 24rem;">
//       <img src= "${unArray[i].image}" style="height: 8rem"  class="card-img-top" alt="Cinema">
//       <div class="card-body ">
//         <h5 class="card-title">${unArray[i].name}</h5>
//         <p class="card-text">${unArray[i].description}</p>
//       <div class="vermas d-flex justify-content-evenly">
//          <p class="mb-0 m-1">Price: $${unArray[i].price}</p>
//          <a href="./details.html?id=${unArray[i].id}" class="btn btn-primary">Details</a>
//       </div>
//       </div>
//       </div>`


//         contenedorTarjetas.innerHTML = templateTarjeta;
//       }
//     }
//   }
//   else {
//     contenedorTarjetas.innerHTML = `<img src="../assets/img/no-search-found.png" alt="sinResultados">`;
//     console.log(contenedorTarjetas);
//   }

// }


// //Checkbox---------------------------------


// function imprimir() {
//   var checks = document.getElementById("checks")
//   var checkbox = data.eventos.map(eventos => eventos.category)
//   var noRepetidas = new Set(checkbox);
//   var categorias = [...noRepetidas]
//   var imprimirCheckbox = "";
//   categorias.forEach(categorias => {
//     imprimirCheckbox += `<div class="form-check form-check-inline  flex-lg-row flex-md flex-sm">
//     <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="${categorias}">
//     <label class="form-check-label">${categorias}</label>
//   </div>`

//     checks.innerHTML = imprimirCheckbox;
//   })
// }
// imprimir()

// var checkBoxSelector = [];
// var checkbox = document.querySelectorAll('input[type=checkbox]');
// checkbox.forEach(check => check.addEventListener("click", (event) => {
//   var checked = event.target.checked
//   if (checked) {
//     checkBoxSelector.push(event.target.value)
//     filtrador()
//   } else {
//     checkBoxSelector = checkBoxSelector.filter(uncheck => uncheck !== event.target.value)
//   } filtrador()

// }))

// var buscador = document.querySelector("#search")
// buscador.addEventListener("keyup", (event) => {
//   texto = event.target.value
//   filtrador()
//   console.log(texto)
// })

// function filtrador() {
//   var datos = [];
//   if (checkBoxSelector.length > 0 && texto !== "") {
//     checkBoxSelector.map(selected => {
//       datos.push(...data.eventos.filter(evento => evento.name.toLowerCase().includes
//         (texto.trim().toLowerCase()) && evento.category == selected))
//     })
//   } else if (checkBoxSelector.length > 0 && texto === "") {
//     checkBoxSelector.map(selected => {
//       datos.push(...data.eventos.filter(eventos => eventos.category == selected))

//     })
//   } else if (checkBoxSelector.length == 0 && texto !== "") {
//     datos.push(...data.eventos.filter(evento => evento.name.toLowerCase().includes
//       (texto.trim().toLowerCase())))
//   }
//   else {
//     datos.push(...data.eventos)
//   }
//   console.log(checkBoxSelector);
//   mostrarTarjetas(datos);
// }
// filtrador()
async function fetchCards() {
  try {
    let urlApi = 'https://mh.up.railway.app/api/amazing-events';
    let response = await fetch(urlApi).then(res => res.json());
    let printEvents = (cardId, eventsArray) => {
      let card = document.getElementById(cardId);
      let cardsDelEvento = eventsArray
        .filter(event => event.date < response.currentDate)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(event => `
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
      card.innerHTML = cardsDelEvento.join('');
    };

    printEvents('cardEventsp', response.events);

  let categorias = [...new Set(response.events.map(evento => evento.category))];
  categorias = categorias.sort();
  let checkboxContainer = document.querySelector('#inlineCheckbox');
  let updateResults = async () => {
    try {
      let response = await fetch(urlApi).then(res => res.json());
      let events = response.events.filter(event => event.date);
      let checkedCategories = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value.toLowerCase());
      let searchTerm = searchInput.value.toLowerCase();
      let filteredEvents = events.filter(event => {
        return (
          event.name.toLowerCase().includes(searchTerm) &&
          (checkedCategories.length === 0 || checkedCategories.includes(event.category.toLowerCase())) && event.date < response.currentDate
        );
      });
      if (filteredEvents.length > 0) {
        printEvents('cardEventsp', filteredEvents);
      } else {
        swal("No matches found", "", "warning");
        searchInput.value = '';
        setTimeout(() => location.reload(), 2000);
      }
    } catch (error) {
      console.error('Error al recuperar los datos de la API:', error);
    }
  };

  categorias.forEach(categoria => {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = categoria;
    checkbox.value = categoria;
    checkbox.classList.add('form-check-input');
    checkbox.addEventListener('change', updateResults);

    let label = document.createElement('label');
    label.htmlFor = categoria;
    label.textContent = categoria;
    label.classList.add('form-check-label', 'blockquote');

    let div = document.createElement('div');
    div.classList.add('form-check', 'form-check-inline');
    div.appendChild(checkbox);
    div.appendChild(label);

    checkboxContainer.appendChild(div);
  });

  let checkboxes = document.querySelectorAll('input[type=checkbox]');
  let searchInput = document.querySelector('input[type=search]');

  checkboxes.forEach(checkbox => checkbox.addEventListener('change', updateResults));
  searchInput.addEventListener('input', updateResults);
} catch (error) {
  console.error('Error al recuperar los datos de la API:', error);
}
}

document.addEventListener('DOMContentLoaded', fetchCards);