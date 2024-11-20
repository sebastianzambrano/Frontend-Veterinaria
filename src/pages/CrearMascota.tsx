// src/pages/CrearMascota.tsx
import React, { useEffect, useState } from 'react';
import { API_URL } from './config/apiConfig';
import { IonContent } from '@ionic/react';

interface Cliente {
  id: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  numberDocument: string;
}

interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  sexo: string;
  fechaNacimiento: string;
  raza: string;
  codigoCollar: string;
}


// Función para convertir la fecha a formato dd/MM/yyyy
const convertToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString); // El formato de entrada es yyyy-MM-dd
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CrearMascota: React.FC = () => {
  // Estado para la cédula ingresada y la información del cliente
  const [cedulaCliente, setCedulaCliente] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);

  // Estado para almacenar las mascotas existentes y las nuevas
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

  // Estados para los campos del formulario de mascota
  const [nombreMascota, setNombreMascota] = useState('');
  const [especieMascota, setEspecieMascota] = useState('');
  const [sexoMascota, setSexoMascota] = useState('');
  const [fechaNacimientoMascota, setFechaNacimientoMascota] = useState('');
  const [razaMascota, setRazaMascota] = useState('');
  const [codigoCollar, setCodigoCollar] = useState('');

  useEffect(() => {
    if (cliente) {
      const fetchMascotas = async () => {
        const response_mascota = await fetch(`${API_URL}/v1/api/veterinaria/mascota/get-mascota-cliente/${cliente.id}`);
        const mascotaData = await response_mascota.json();
        setMascotas(mascotaData.data || []);
      };
      fetchMascotas();
    }
  }, [cliente]);  // El useEffect se ejecuta cada vez que el cliente cambia

  // Función para buscar el cliente por cédula
  // Función para buscar el cliente por cédula
  const buscarCliente = async () => {

    if (!cedulaCliente) {
      alert("Por favor, ingrese la cédula del cliente.");
      return; // Salir de la función si la cédula está vacía
    }
    try {
      const response_cliente = await fetch(`${API_URL}/v1/api/veterinaria/cliente/get-cliente/${cedulaCliente}`);
      const clienteData = await response_cliente.json();

      if (clienteData.data && clienteData.data.id) {
        setCliente(clienteData.data);

        // Ahora, directamente después de encontrar al cliente, obtenemos las mascotas
        const response_mascota = await fetch(`${API_URL}/v1/api/veterinaria/mascota/get-mascota-cliente/${clienteData.data.id}`);
        const mascotaData = await response_mascota.json();
        setMascotas(mascotaData.data || []); // Actualiza las mascotas inmediatamente
      } else {
        console.error("Cliente no encontrado o no tiene un ID válido");
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
    }
  };


  const handleGrabarMascota = async () => {
    if (!cliente) {
      alert("Primero debes buscar y seleccionar un cliente.");
      return;
    }

    const fechaFormato = convertToDDMMYYYY(fechaNacimientoMascota);

    const mascotaData = {
      id: mascotaSeleccionada ? mascotaSeleccionada.id : '', // Si está seleccionada, usas su ID
      nombre: nombreMascota,
      especie: especieMascota,
      sexo: sexoMascota,
      fechaNacimiento: fechaFormato,
      raza: razaMascota,
      codigoCollar: codigoCollar,
      cliente: { id: cliente.id }
    };

    try {
      let response;
      if (mascotaSeleccionada) {
        // Si hay una mascota seleccionada, hacemos un PUT para actualizar
        response = await fetch(`${API_URL}/v1/api/veterinaria/mascota/${mascotaSeleccionada.id}`, {
          method: 'PUT', // Cambia a PUT para actualización
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mascotaData),
        });
      } else {
        // Si no hay mascota seleccionada, creamos una nueva
        response = await fetch(`${API_URL}/v1/api/veterinaria/mascota`, {
          method: 'POST', // Método POST para creación
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mascotaData),
        });
      }

      if (response.ok) {
        // Después de guardar o actualizar, volvemos a obtener las mascotas
        const response_mascotas = await fetch(`${API_URL}/v1/api/veterinaria/mascota/get-mascota-cliente/${cliente.id}`);
        const mascotaData = await response_mascotas.json();
        setMascotas(mascotaData.data || []); // Actualizamos las mascotas

        // Resetear los campos del formulario
        setNombreMascota('');
        setEspecieMascota('');
        setSexoMascota('');
        setFechaNacimientoMascota('');
        setRazaMascota('');
        setCodigoCollar('');
        setMascotaSeleccionada(null); // Limpiar la selección de mascota
      } else {
        console.error("Error al guardar la mascota.");
      }
    } catch (error) {
      console.error("Error en la solicitud para guardar mascota:", error);
    }
  };

  const handleEditarMascota = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota); // Cargar los datos de la mascota seleccionada
    setNombreMascota(mascota.nombre);
    setEspecieMascota(mascota.especie);
    setSexoMascota(mascota.sexo);
    setFechaNacimientoMascota(mascota.fechaNacimiento);
    setRazaMascota(mascota.raza);
    setCodigoCollar(mascota.codigoCollar);
  };

  const handleEliminarMascota = async (mascotaId: string) => {
    if (!cliente) {
      alert("Primero debes buscar y seleccionar un cliente.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/v1/api/veterinaria/mascota/${mascotaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Si la mascota fue eliminada con éxito, actualizar la lista
        setMascotas((prevMascotas) =>
          prevMascotas.filter((mascota) => mascota.id !== mascotaId)
        );
        console.log("Mascota eliminada con éxito");
      } else {
        console.error("Error al eliminar la mascota");
      }
    } catch (error) {
      console.error("Error en la solicitud para eliminar mascota:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedulaCliente) {
      alert('El nombre de la mascota es obligatorio');
      return;
    }
    // Lógica para enviar el formulario...
  };


  return (
    <IonContent className="ion-padding scrollable-content">
      <div className="form-container">
        <h2>Crear Mascota</h2>
        <form onSubmit={handleSubmit}>
          {/* Sección de búsqueda de cliente */}
          <label>Cédula del Cliente</label>
          <input
            type="text"
            value={cedulaCliente}
            onChange={(e) => setCedulaCliente(e.target.value)}
            onKeyDown={(e) => {
              // Permite solo números y teclas de control (backspace, delete, tab)
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
                e.preventDefault(); // Evita la entrada de cualquier tecla no numérica
              }
            }}
            required
          />
          <button onClick={buscarCliente}>Buscar Cliente</button>
        </form>

        {cliente && (
          <div >
            <h3>Cliente: {`${cliente.firstName} ${cliente.secondName} ${cliente.firstLastName} ${cliente.secondLastName}`}</h3>

            {/* Sección del formulario de creación de mascota */}
            <label>Nombre Mascota</label>
            <input
              type="text"
              value={nombreMascota}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setNombreMascota(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />

            <label>Especie de la Mascota</label>
            <input
              type="text"
              value={especieMascota}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setEspecieMascota(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />

            <label>Sexo de la Mascota</label>
            <input
              type="text"
              value={sexoMascota}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setSexoMascota(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />

            <label>Fecha de Nacimiento de la Mascota</label>
            <input
              type="date"
              value={fechaNacimientoMascota}
              onChange={(e) => setFechaNacimientoMascota(e.target.value)}
            />

            <label>Raza de la Mascota</label>
            <input
              type="text"
              value={razaMascota}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setRazaMascota(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />

            <label>Codigo Collar</label>
            <input
              type="text"
              value={codigoCollar}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z0-9 ]/g, '');
                setCodigoCollar(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />

            <button onClick={handleGrabarMascota}>Guardar Mascota</button>

            {/* Tabla para mostrar las mascotas del cliente */}
            <h3>Mascotas del Cliente</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Sexo</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Raza</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => (
                  <tr key={mascota.id}>
                    <td>{mascota.nombre}</td>
                    <td>{mascota.especie}</td>
                    <td>{mascota.sexo}</td>
                    <td>{mascota.fechaNacimiento}</td>
                    <td>{mascota.raza}</td>
                    <td>
                      <button onClick={() => handleEditarMascota(mascota)}>Editar</button>
                      <button onClick={() => handleEliminarMascota(mascota.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </IonContent>
  );
};

export default CrearMascota;