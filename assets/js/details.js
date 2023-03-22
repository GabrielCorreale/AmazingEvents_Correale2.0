
let apiUrl = "https://mindhub-xj03.onrender.com/api/amazing"

fetch(apiUrl)

  .then(response => response.json())
  .then(data => {
    console.log(data)
    const id = new URLSearchParams(location.search).get("id")
    const cartas = data.events.find(elemento => elemento._id == id)
    createCard(cartas)
  })
  .catch(error => console.log(error))
  
function createCard(card) {
    const card_details = document.getElementById("cardEvents")
    let div = document.createElement('div')
    div.classList.add("card", "mb-3", "d-flex", "justify-content-center")
    div.style.width = "50rem"
    div.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex">
        <img src="${card.image}" class="img-fluid rounded-start object-fit-cover w-100" style="height: 26rem;" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <div class="d-flex flex-column">
          <h1 class="d-flex justify-content-center mb-5">${card.name}</h1>
            <ul>
              <li><strong>Date</strong>: ${card.date}</li>
              <li><strong>Description</strong>: ${card.description}</li>
              <li><strong>Category</strong>: ${card.category}</li>
              <li><strong>Place</strong>: ${card.place}</li>
              <li><strong>Capacity</strong>: ${card.capacity}</li>
              <li><strong>Assitance or estimate</strong>: ${card.assistance}</li>
              <li><strong>Price</strong>: ${card.price} U$D</li>
            </ul>
          </div>
        </div>
      </div>
    </div>`
    card_details.appendChild(div)
}