import React, { useEffect, useState } from "react";
import { API_URL } from "./config/apiConfig";
import { IonContent } from "@ionic/react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  id: string;
  motivoConsulta: string;
  diagnostico: string;
  procedimiento: string;
  tratamiento: string;
  observacion: string;
  formula: string;
  createdAt: string;
}

const ConsultaHistoriaClinica: React.FC = () => {
  const [cedulaCliente, setCedulaCliente] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [mascotas, setMascotas] = useState<Mascotas[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascotas | null>(null);
  const [historiasClinicas, setHistoriasClinicas] = useState<HistoriaClinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Cargar mascotas al seleccionar cliente
  useEffect(() => {
    if (cliente) {
      const fetchMascotas = async () => {
        const response = await fetch(`${API_URL}/v1/api/veterinaria/mascota/get-mascota-cliente/${cliente.id}`);
        const mascotaData = await response.json();
        setMascotas(mascotaData.data || []);
      };
      fetchMascotas();
    }
  }, [cliente]);

  // Cargar historias clínicas al seleccionar una mascota
  useEffect(() => {
    if (mascotaSeleccionada) {
      const fetchHistoriasClinicas = async () => {
        try {
          const response = await fetch(`${API_URL}/v1/api/veterinaria/historia-clinica/get-historia-clinica-mascota/${mascotaSeleccionada.id}`);
          const historiaData = await response.json();
          setHistoriasClinicas(historiaData.data || []);
        } catch (error) {
          console.error("Error al obtener las historias clínicas:", error);
          setMensaje("Error al obtener las historias clínicas.");
        }
      };
      fetchHistoriasClinicas();
    }
  }, [mascotaSeleccionada]);

  // Buscar cliente por cédula
  const buscarCliente = async () => {
    if (!cedulaCliente) {
      alert("Por favor, ingrese la cédula del cliente.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/v1/api/veterinaria/cliente/get-cliente/${cedulaCliente}`);
      const clienteData = await response.json();

      if (clienteData.data && clienteData.data.id) {
        setCliente(clienteData.data);
        setMensaje("");
        setMascotaSeleccionada(null); // Reiniciar selección de mascota
        setHistoriasClinicas([]); // Limpiar lista de historias clínicas
      } else {
        setMensaje("Cliente no encontrado.");
        setCliente(null);
        setMascotas([]);
        setHistoriasClinicas([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al buscar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonContent className="ion-padding">
      <div className="form-container">
        <h2>Consulta de Historias Clínicas</h2>

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
            style={{
              backgroundColor: 'white', // Fondo blanco
              color: 'black',           // Texto negro
              border: '1px solid #ccc', // Borde gris claro
              padding: '8px',           // Espaciado interno
              width: '100%',            // Ancho completo
              boxSizing: 'border-box'   // Ajusta el contenido correctamente
            }}
          />
          <button onClick={buscarCliente} disabled={loading}>
            {loading ? "Buscando..." : "Buscar Cliente"}
          </button>
        </div>

        {/* Listado de mascotas asociadas */}
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

        {/* Listado de historias clínicas de la mascota seleccionada */}
        {mascotaSeleccionada && (
          <div>
            <h3>Historias Clínicas de {mascotaSeleccionada.nombre}</h3>
            <table>
              <thead>
                <tr>
                  <th>Fecha Consulta</th>
                  <th>Motivo Consulta</th>
                  <th>Diagnóstico</th>
                  <th>Procedimiento</th>
                  <th>Tratamiento</th>
                  <th>Observación</th>
                  <th>Fórmula</th>
                </tr>
              </thead>
              <tbody>
                {historiasClinicas.length > 0 ? (
                  historiasClinicas.map((historia) => {
                    // Convertir la cadena 'createdAt' en un objeto Date
                    const fecha = new Date(historia.createdAt);
                    return (
                      <tr key={historia.id}>
                        <td>
                          {/* Verifica si la fecha es válida antes de mostrarla */}
                          {fecha instanceof Date && !isNaN(fecha.getTime())
                            ? fecha.toLocaleDateString('es-ES')
                            : 'Fecha inválida'}
                        </td>
                        <td>{historia.motivoConsulta}</td>
                        <td>{historia.diagnostico}</td>
                        <td>{historia.procedimiento}</td>
                        <td>{historia.tratamiento}</td>
                        <td>{historia.observacion}</td>
                        <td>{historia.formula}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>No se encontraron historias clínicas para esta mascota.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {mensaje && <p className="message">{mensaje}</p>}
      </div>
    </IonContent>
  );
};

export default ConsultaHistoriaClinica;