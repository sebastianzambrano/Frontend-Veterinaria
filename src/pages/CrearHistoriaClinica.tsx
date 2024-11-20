import React, { FormEvent, useEffect, useState } from "react";
import { API_URL } from "./config/apiConfig";
import { IonContent } from "@ionic/react";
import { useHistory } from "react-router";

interface Cliente {
  id: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  numberDocument: string;
}

interface Mascotas {
  id: string;
  nombre: string;
}

interface HistoriaClinica {
  motivoConsulta: string;
  diagnostico: string;
  procedimiento: string;
  tratamiento: string;
  observacion: string;
  formula: string;
}

const CrearHistoriaClinica: React.FC = () => {
  const [cedulaCliente, setCedulaCliente] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [mascota, setMascota] = useState<Mascotas | null>(null);
  const [mascotas, setMascotas] = useState<Mascotas[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascotas | null>(null);

  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [procedimiento, setProcedimiento] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [observacion, setObservacion] = useState("");
  const [formula, setFormula] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const history = useHistory();

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

  // Función para buscar el cliente por cédula y cargar sus mascotas asociadas
  const buscarCliente = async () => {
    if (!cedulaCliente) {
      alert("Por favor, ingrese la cédula del cliente.");
      return; // Salir de la función si la cédula está vacía
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/v1/api/veterinaria/cliente/get-cliente/${cedulaCliente}`);
      const clienteData = await response.json();

      if (clienteData.data && clienteData.data.id) {
        setCliente(clienteData.data)
        const responseMascotas = await fetch(
          `${API_URL}/v1/api/veterinaria/mascota/get-mascota-cliente/${clienteData.data.id}`
        );
        const mascotasData = await responseMascotas.json();
        setMascotas(mascotasData.data || []);
        setMascota(mascotasData.data)
      } else {
        setMensaje("Cliente no encontrado.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al buscar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const saveHistoriaClinica = async () => {
    if (!cliente || !mascotaSeleccionada) {
      setMensaje("Debe seleccionar una mascota.");
      return;
    }

    const historiaClinicaData = {
      motivoConsulta: motivoConsulta,
      diagnostico: diagnostico,
      procedimiento: procedimiento,
      tratamiento: tratamiento,
      observacion: observacion,
      formula: formula,
      mascota: { id: mascotaSeleccionada.id }, // Usa solo el ID de la mascota seleccionada
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/v1/api/veterinaria/historia-clinica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historiaClinicaData),
      });

      if (response.ok) {
        setMensaje("Historia clínica guardada exitosamente.");
        setMotivoConsulta("");
        setDiagnostico("");
        setProcedimiento("");
        setTratamiento("");
        setObservacion("");
        setFormula("");
      } else {
        const errorData = await response.json();
        setMensaje(`Error al guardar historia clínica: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión al guardar historia clínica.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveHistoriaClinica();
  };

  return (
    <IonContent className="ion-padding">
      <div className="form-container">
        <h2>Crear Historia Clínica</h2>

        {/* Campo para ingresar la cédula del cliente */}
        <div className="form-group">
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
          <button onClick={buscarCliente} disabled={loading}>
            {loading ? "Buscando..." : "Buscar Cliente"}
          </button>
        </div>

        {/* Tabla de mascotas */}
        {cliente && mascotas.length > 0 && (
          <div>
            <h3>Cliente: {`${cliente.firstName} ${cliente.secondName} ${cliente.firstLastName} ${cliente.secondLastName}`}</h3>
            <h3>Mascotas Asociadas</h3>
            <table>
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => (
                  <tr key={mascota.id}>
                    <td>{mascota.nombre}</td>
                    <td>
                      <input
                        type="radio"
                        name="mascota"
                        value={mascota.id}
                        checked={mascotaSeleccionada?.id === mascota.id}
                        onChange={() => setMascotaSeleccionada(mascota)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulario de historia clínica, habilitado solo si hay una mascota seleccionada */}
        {mascotaSeleccionada && (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Motivo de Consulta</label>
              <input
                type="text"
                value={motivoConsulta}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setMotivoConsulta(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '50px' }}
              />
            </div>
            <div className="form-group">
              <label>Diagnóstico</label>
              <input
                type="text"
                value={diagnostico}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setDiagnostico(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '100px' }}
              />
            </div>
            <div className="form-group">
              <label>Procedimiento</label>
              <input
                type="text"
                value={procedimiento}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setProcedimiento(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '100px' }}
              />
            </div>
            <div className="form-group">
              <label>Tratamiento</label>
              <input
                type="text"
                value={tratamiento}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setTratamiento(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '100px' }}
              />
            </div>
            <div className="form-group">
              <label>Observación</label>
              <input
                type="text"
                value={observacion}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setObservacion(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '100px' }}
              />
            </div>
            <div className="form-group">
              <label>Fórmula</label>
              <input
                type="text"
                value={formula}
                onChange={(e) => {const value = e.target.value.toUpperCase();
                  // Elimina cualquier carácter que no sea una letra
                  const newValue = value.replace(/[^A-Za-z ]/g, '');
                  setFormula(newValue);
                }} // Convierte a mayúsculas y elimina números
                required
                style={{ height: '100px' }}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Historia Clínica"}
            </button>
          </form>
        )}

        {mensaje && <p className="message">{mensaje}</p>}
      </div>
    </IonContent>
  );
};

export default CrearHistoriaClinica;