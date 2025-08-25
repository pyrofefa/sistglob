export interface CapturaSimmoscas {
  user_id: string;
  junta_id: string;
  personal_id: string;
  captura: {
    trampa_id: number;
    accion: number,
    omision: number,
    machos: number,
    hembras: number,
    instalada: number,
    gancho:  number,
    recebado: number,
    fenologia: number,
    id: number;
  };
  longitud: number;
  latitud: number;
  presicion: number;
  distancia_qr: number;
  fecha: string;
  fechaHora: string;
  semana: number;
  ano: string;
  trampa_id: number;
  id_bd_cel: number;
  version: string;
  siembra_id: number;
}

// 🔧 Función para construir el body del POST y los valores del INSERT
export function buildInsertPayloads(data: CapturaSimmoscas): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
    longitud,
    latitud,
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    id_bd_cel,
    version,
    siembra_id,
  } = data;

  const params = {
    trampa_id: captura.trampa_id,
    fecha,
    semana,
    ano,
    latitud,
    longitud,
    accuracy: presicion,
    distancia_qr,
    accion: captura.accion,
    fenologia: captura.fenologia,
    omision: captura.omision ? 1 : 0,
    machos: captura.machos,
    hembras: captura.hembras,
    instalada: captura.instalada ? 1 : 0,
    gancho: captura.gancho ? 1 : 0,
    recebado: captura.recebado ? 1 : 0,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
    siembra_id,
    tipo: 'Captura',
  };

  const values = [
    personal_id,
    junta_id,
    user_id,
    fecha,
    fechaHora,
    longitud,
    latitud,
    presicion,
    distancia_qr,
    2, // status local
    ano,
    semana,
    id_bd_cel,
    version,
    captura.trampa_id,
    siembra_id,
    captura.accion,
    captura.omision,
    captura.machos,
    captura.hembras,
    captura.instalada,
    captura.gancho,
    captura.recebado,
    captura.fenologia,
  ];

  return { params, values };
}

// 🔧 Función para construir el body del POST y los valores del UPDATE
export function buildUpdatePayloads(data: CapturaSimmoscas): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
    longitud,
    latitud,
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    id_bd_cel,
    version,
    siembra_id,
  } = data;

  const params = {
    trampa_id: captura.trampa_id,
    fecha,
    semana,
    ano,
    latitud,
    longitud,
    accuracy: presicion,
    distancia_qr,
    accion: captura.accion,
    fenologia: captura.fenologia,
    omision: captura.omision ? 1 : 0,
    machos: captura.machos,
    hembras: captura.hembras,
    instalada: captura.instalada ? 1 : 0,
    gancho: captura.gancho ? 1 : 0,
    recebado: captura.recebado ? 1 : 0,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
    siembra_id,
    tipo: 'Captura',
  };

  const values = [
    personal_id,
    junta_id,
    user_id,
    fecha,
    fechaHora,
    longitud,
    latitud,
    presicion,
    distancia_qr,
    2, // status local
    ano,
    semana,
    id_bd_cel,
    version,
    captura.trampa_id,
    siembra_id,
    captura.accion,
    captura.omision,
    captura.machos,
    captura.hembras,
    captura.instalada,
    captura.gancho,
    captura.recebado,
    captura.fenologia,
    captura.id, // este va al final porque es el WHERE id = ?
  ];

  return { params, values };
}
