async function detalleEvento() { 
  try {
  let id = new URLSearchParams(location.search).get("id");
  let response = await fetch(`https://mh.up.railway.app/api/amazing-events/${id}`);
  let data = await response.json()
  let event = data.response 
  detalleCard(event); 
} catch (error) {
  console.error(error);
}
}

detalleEvento();

function detalleCard(evento) {
  let fecha = new Date(evento.date);
  fecha = fecha.toLocaleDateString();
  let cardQuantity = "";
  if (evento.assistance) {
    cardQuantity += "Assistance: " + evento.assistance;
  }
  if (evento.estimate) {
    cardQuantity += (cardQuantity ? " || " : "") + "Estimate: " + evento.estimate;
  }
  let cardDetails = `<div class="card text-center" style="width:30rem">
    <img src="${evento.image}" class="fotos card-img-top" style="height:250px" alt="${evento.name}">
    <div class="card-body">
      <h3 class="card-title">Name: ${evento.name}</h3>
      <p class="card-title">Date: ${fecha}</p>
      <p class="card-title">Description: ${evento.description}</p>
      <p class="card-title">Category: ${evento.category}</p>
      <p class="card-title">Place: ${evento.place}</p>
      <p class="card-title">Capacity: ${evento.capacity}</p>`;
  if (cardQuantity) {
    cardDetails += `<p class="card-title">${cardQuantity}</p>`;
  } cardDetails += `
      <p class="card-title">Price: ${evento.price}</p>
    </div>
  </div>`;
  document.querySelector("#cardEvents").innerHTML = cardDetails;  
}