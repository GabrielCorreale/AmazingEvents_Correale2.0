let arrayFromAPI;
let arrayEvents = [];
let eventsPast = [];
let eventsUpcoming = [];
let categorias = [];
async function getDataFromApi() {
  await fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then((resp) => resp.json())
    .then((json) => (arrayFromAPI = json));
  arrayEvents = arrayFromAPI.events;
  eventsPast.push(
    ...arrayEvents.filter((event) => event.date < arrayFromAPI.currentDate)
  );
  eventsUpcoming.push(
    ...arrayEvents.filter((event) => event.date > arrayFromAPI.currentDate)
  );
  let arrayPast = [];
  eventsPast.filter((event) =>
    arrayPast.push({
      percentage: ((event.assistance * 100) / event.capacity).toFixed(2),
      name: event.name,
      assistance: event.assistance,
      capacity: event.capacity,
      category: event.category,
      price: event.price,
      revenues: event.assistance * event.price,
    })
  );
  console.log("Eventos pasados %", arrayPast);
  let arrayUpc = [];
  eventsUpcoming.filter((event) =>
    arrayUpc.push({
      percentage: ((event.estimate * 100) / event.capacity).toFixed(2),
      name: event.name,
      estimate: event.estimate,
      capacity: event.capacity,
      category: event.category,
      price: event.price,
      revenues: event.estimate * event.price,
    })
  );
  console.log("Eventos futuros %", arrayUpc);

  function tabla1() {
    var listaOrdPast = "";
    listaOrdPast = arrayPast
      .filter((p) => p.percentage)
      .sort((a, b) => b.percentage - a.percentage);

    listaOrdCapacidad = "";
    listaOrdCapacidad = arrayEvents
      .filter((card) => card.capacity)
      .sort((a, b) => b.capacity - a.capacity);

    var templateTabla1 = `
            <tr>
                <td>${
                  listaOrdPast[0].name + " " + listaOrdPast[0].percentage
                }%</td>
                <td>${
                  listaOrdPast[listaOrdPast.length - 1].name +
                  " " +
                  listaOrdPast[listaOrdPast.length - 1].percentage
                }%</td>
                <td>${
                  listaOrdCapacidad[0].name +
                  " capacity " +
                  listaOrdCapacidad[0].capacity
                }</td>
            </tr>`;
    document.querySelector("#tbodyT1").innerHTML = templateTabla1;
  }
  tabla1();
  //Tabla Upcoming
  function tablaUPC() {
    var mapeoCategorias = arrayUpc.map((cat) => cat.category);
    const arrayCategorias = new Set(mapeoCategorias);
    categorias = [...arrayCategorias];
    let porCategoriaUpc = [];
    let ingresosPorcentajes = [];
    categorias.forEach((cat) => {
      porCategoriaUpc.push({
        categoria: cat,
        data: arrayUpc.filter((datos) => datos.category == cat),
      });
    });
    console.log("AgrupadosPorCat(upc)", porCategoriaUpc);

    porCategoriaUpc.map((datos) => {
      ingresosPorcentajes.push({
        category: datos.categoria,
        estimate: datos.data.map((item) => item.estimate),
        capacity: datos.data.map((item) => item.capacity),
        estimateRevenue: datos.data.map((item) => item.estimate * item.price),
      });
    });
    console.log("datosPorCAT(upc)", ingresosPorcentajes);
    ingresosPorcentajes.forEach((cat) => {
      let totalEstimate = 0;
      cat.estimate.forEach((estimate) => (totalEstimate += Number(estimate)));
      cat.estimate = totalEstimate;

      let totalCapacityFut = 0;
      cat.capacity.forEach(
        (capacity) => (totalCapacityFut += Number(capacity))
      );
      cat.capacity = totalCapacityFut;

      let totalEstimateRevenue = 0;
      cat.estimateRevenue.forEach(
        (estimateRevenue) => (totalEstimateRevenue += Number(estimateRevenue))
      );
      cat.estimateRevenue = totalEstimateRevenue;

      cat.porcentajeAttendace = (
        (totalEstimate * 100) /
        totalCapacityFut
      ).toFixed(2);
    });
    console.log(ingresosPorcentajes);
    let listOrdCatUpc = "";
    listOrdCatUpc = ingresosPorcentajes
      .filter((cat) => cat.porcentajeAttendace)
      .sort((a, b) => b.porcentajeAttendace - a.porcentajeAttendace);
    console.log("OrdenadosPorGanancia(upc)", listOrdCatUpc);

    var templateTabla2 = "";
    listOrdCatUpc.forEach((e) => {
      e.listOrdCatUpc;
      templateTabla2 += `
    <tr>
    <td>${e.category}</td>
    <td>US$ ${e.estimateRevenue}</td>
    <td>${e.porcentajeAttendace}%</td>
  </tr>`;
      document.querySelector("#tbodyT2").innerHTML = templateTabla2;
    });
  }
  tablaUPC();
  //Tabla past
  function tablaPAST() {
    var mapeoCategorias = arrayPast.map((cat) => cat.category);
    const arrayCategorias = new Set(mapeoCategorias);
    categorias = [...arrayCategorias];
    let porCategoriaPast = [];
    let ingresosPorcentajes = [];
    categorias.forEach((cat) => {
      porCategoriaPast.push({
        categoria: cat,
        data: arrayPast.filter((datos) => datos.category == cat),
      });
    });
    console.log("AgrupadosPorCat(past)", porCategoriaPast);

    porCategoriaPast.map((datos) => {
      ingresosPorcentajes.push({
        category: datos.categoria,
        assistance: datos.data.map((item) => item.assistance),
        capacity: datos.data.map((item) => item.capacity),
        revenue: datos.data.map((item) => item.assistance * item.price),
      });
    });
    console.log("datosPorCAT(past)", ingresosPorcentajes);
    ingresosPorcentajes.forEach((cat) => {
      let totalAssistance = 0;
      cat.assistance.forEach(
        (assistance) => (totalAssistance += Number(assistance))
      );
      cat.assistance = totalAssistance;

      let totalCapacity = 0;
      cat.capacity.forEach((capacity) => (totalCapacity += Number(capacity)));
      cat.capacity = totalCapacity;

      let totalRevenue = 0;
      cat.revenue.forEach((revenue) => (totalRevenue += Number(revenue)));
      cat.revenue = totalRevenue;

      cat.porcentajeAttendace = (
        (totalAssistance * 100) /
        totalCapacity
      ).toFixed(2);
    });
    console.log(ingresosPorcentajes);
    let listOrdCatPast = "";
    listOrdCatPast = ingresosPorcentajes
      .filter((cat) => cat.porcentajeAttendace)
      .sort((a, b) => b.porcentajeAttendace - a.porcentajeAttendace);
    console.log("OrdenadosPorGanancia(upc)", listOrdCatPast);

    var templateTabla3 = "";
    listOrdCatPast.forEach((e) => {
      e.listOrdCatUpc;
      templateTabla3 += `
        <tr>
        <td>${e.category}</td>
        <td>US$ ${e.revenue}</td>
        <td>${e.porcentajeAttendace}%</td>
      </tr>`;
      document.querySelector("#tbodyT3").innerHTML = templateTabla3;
    });
  }
  tablaPAST();
}
getDataFromApi();
