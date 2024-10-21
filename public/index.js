// Variables globales
let editModal;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  editModal = new bootstrap.Modal(document.getElementById("editModal"));
  cargarRoommates();
  cargarGastos();
});

// Funciones para manejar roommates
async function agregarRoommate() {
  try {
    const response = await fetch("/roommate", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Error al agregar roommate");

    await cargarRoommates();
    await cargarGastos();
  } catch (error) {
    alert("Error al agregar roommate: " + error.message);
  }
}

async function cargarRoommates() {
  try {
    const response = await fetch("/roommate");
    const roommates = await response.json();

    // Actualizar lista de roommates
    const roommatesList = document.getElementById("roommates-list");
    roommatesList.innerHTML = roommates
      .map(
        (roommate) => `
             <tr>
                 <td>${roommate.nombre}</td>
                 <td class="text-danger">-$${roommate.debe.toFixed(2)}</td>
                 <td class="text-success">$${roommate.recibe.toFixed(2)}</td>
             </tr>
         `
      )
      .join("");

    // Actualizar selects de roommates
    const selects = ["roommate-select", "edit-roommate"];
    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      select.innerHTML = roommates
        .map(
          (roommate) => `
                 <option value="${roommate.id}">${roommate.nombre}</option>
             `
        )
        .join("");
    });
  } catch (error) {
    alert("Error al cargar roommates: " + error.message);
  }
}

// Funciones para manejar gastos
async function agregarGasto(event) {
  event.preventDefault();

  const gasto = {
    roommate: document.getElementById("roommate-select").value,
    descripcion: document.getElementById("descripcion-input").value,
    monto: parseFloat(document.getElementById("monto-input").value),
  };

  try {
    const response = await fetch("/gasto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gasto),
    });

    if (!response.ok) throw new Error("Error al agregar gasto");

    document.getElementById("gasto-form").reset();
    await cargarGastos();
    await cargarRoommates();
  } catch (error) {
    alert("Error al agregar gasto: " + error.message);
  }
}

async function cargarGastos() {
  try {
    const [gastosResponse, roommatesResponse] = await Promise.all([
      fetch("/gastos"),
      fetch("/roommate"),
    ]);

    const gastos = await gastosResponse.json();
    const roommates = await roommatesResponse.json();
    console.log(gastos);
    console.log(roommates);

    const gastosList = document.getElementById("gastos-list");
    gastosList.innerHTML = gastos
      .map((gasto) => {
        const roommate = roommates.find((r) => r.id === gasto.roommate);
        return `
                 <tr>
                     <td>${roommate ? roommate.nombre : "Desconocido"}</td>
                     <td>${gasto.descripcion}</td>
                     <td>$${gasto.monto.toFixed(2)}</td>
                     <td>
                     <span class="icon-group d-flex flex-row">
                            <i class="fas fa-edit text-warning mx-2" style="cursor: pointer;"
                                onclick='editarGasto(${JSON.stringify(gasto)})'>
                            </i>
                            <i class="fas fa-trash-alt text-danger mx-2" style="cursor: pointer;" 
                            onclick="eliminarGasto('${gasto.id}')">
                            </i>
                     </span> 
                     </td>
                 </tr>
             `;
      })
      .join("");
  } catch (error) {
    alert("Error al cargar gastos: " + error.message);
  }
}

function editarGasto(gasto) {
  console.log(gasto);
  document.getElementById("edit-id").value = gasto.id;
  document.getElementById("edit-roommate").value = gasto.roommate;
  document.getElementById("edit-descripcion").value = gasto.descripcion;
  document.getElementById("edit-monto").value = gasto.monto;
  editModal.show();
}

async function guardarEdicion() {
  const gasto = {
    id: document.getElementById("edit-id").value,
    roommate: document.getElementById("edit-roommate").value,
    descripcion: document.getElementById("edit-descripcion").value,
    monto: parseFloat(document.getElementById("edit-monto").value),
  };

  try {
    const response = await fetch("/gasto", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gasto),
    });

    if (!response.ok) throw new Error("Error al actualizar gasto");

    editModal.hide();
    await cargarGastos();
    await cargarRoommates();
  } catch (error) {
    alert("Error al actualizar gasto: " + error.message);
  }
}

async function eliminarGasto(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este gasto?")) return;

  try {
    const response = await fetch(`/gasto?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar gasto");

    await cargarGastos();
    await cargarRoommates();
  } catch (error) {
    alert("Error al eliminar gasto: " + error.message);
  }
}
