import React, { useState } from 'react';
import './CrearCliente.css'; // Asegúrate de importar el archivo CSS
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { API_URL } from './config/apiConfig';

const CrearCliente: React.FC = () => {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [lugarResidencia, setLugarResidencia] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  // Función para convertir la fecha a formato dd/MM/yyyy
  const convertToDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString); // El formato de entrada es yyyy-MM-dd
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const saveEntity = async (entityData: any, entityType: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/v1/api/veterinaria/${entityType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entityData),
      });

      setLoading(false);

      if (response.ok) {
        const result = await response.json();
        setMensaje(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} guardado exitosamente.`);
        return result;
      } else {
        const errorData = await response.json();
        setMensaje(`Error al guardar ${entityType}: ${errorData.message}`);
        return null;
      }
    } catch (error) {
      setLoading(false);
      setMensaje(`Error de conexión al guardar ${entityType}: ${error}`);
      console.error('Error:', error);
      return null;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Convertir la fecha a formato dd/MM/yyyy antes de enviarla
    const fechaFormato = convertToDDMMYYYY(fechaNacimiento);

    const clienteData = {
      typeDocument: tipoDocumento,
      numberDocument: numeroDocumento,
      dateBirth: fechaFormato, // Enviamos la fecha en formato dd/MM/yyyy
      firstName: primerNombre,
      secondName: segundoNombre,
      firstLastName: primerApellido,
      secondLastName: segundoApellido,
      locationResidence: lugarResidencia,
      addressResidence: direccion,
      phoneMovil: telefono
    };

    saveEntity(clienteData, 'cliente');

    setTipoDocumento('');
    setNumeroDocumento('');
    setFechaNacimiento('');
    setPrimerNombre('');
    setSegundoNombre('');
    setPrimerApellido('');
    setSegundoApellido('');
    setLugarResidencia('');
    setDireccion('');
    setTelefono('');
  };

  const handleCreateMascota = () => {
    history.push('/crear-mascota'); 
  };

  return (
    <IonContent className="ion-padding scrollable-content">
      <div className="form-container">
        <h2>Crear Cliente</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Tipo Documento</label>
            <input
              type="text"
              value={tipoDocumento}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z]/g, '');
                setTipoDocumento(newValue);
              }} // Convierte a mayúsculas y elimina números
              required
            />
          </div>

          <div className="form-group">
            <label>Numero Documento</label>
            <input
                type="number"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                onKeyDown={(e) => {
                  // Permite solo números y teclas de control (backspace, delete, tab)
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
                    e.preventDefault(); // Evita la entrada de cualquier tecla no numérica
                  }
                }}
                required
              />
          </div>
          <div className="form-group">
            <label>Fecha Nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Primer Nombre</label>
            <input
              type="text"
              value={primerNombre}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setPrimerNombre(newValue);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Segundo Nombre</label>
            <input
              type="text"
              value={segundoNombre}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setSegundoNombre(newValue);
              }}
            />
          </div>
          <div className="form-group">
            <label>Primer Apellido</label>
            <input
              type="text"
              value={primerApellido}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setPrimerApellido(newValue);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Segundo Apellido</label>
            <input
              type="text"
              value={segundoApellido}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setSegundoApellido(newValue);
              }}
            />
          </div>
          <div className="form-group">
            <label>Lugar Residencia</label>
            <input
              type="text"
              value={lugarResidencia}
              onChange={(e) => {const value = e.target.value.toUpperCase();
                // Elimina cualquier carácter que no sea una letra
                const newValue = value.replace(/[^A-Za-z ]/g, '');
                setLugarResidencia(newValue);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, ''); // Elimina cualquier carácter que no sea un número
                // Limita el valor a 10 dígitos
                if (newValue.length <= 10) {
                  setTelefono(newValue);
                }
              }}
              onKeyDown={(e) => {
                // Permite solo números y teclas de control (Backspace, Delete, Tab)
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
                  e.preventDefault(); // Previene la entrada de cualquier tecla no numérica
                }
              }}
              required
            />
            {telefono.length !== 10 && telefono.length > 0 && (
              <p style={{ color: 'red' }}>El teléfono debe tener 10 dígitos.</p>
            )}
          </div>
          <div>
            {mensaje && <p className="message">{mensaje}</p>}
          </div>
          <div className="button-container">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
            <button
              type="button" // Cambiamos el tipo del botón para evitar que ejecute el submit
              disabled={loading}
              className="submit-button"
              onClick={handleCreateMascota} // Llamamos a la función de redirección
            >
              {loading ? 'Guardando...' : 'Crear Mascota'}
            </button>
          </div>
        </form>
      </div>
    </IonContent>
  );
};

export default CrearCliente;