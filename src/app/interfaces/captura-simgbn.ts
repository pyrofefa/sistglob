export interface CapturaSimgbn {
  user_id: string;
  junta_id: string;
  personal_id:  string;
  captura: {
    trampa_id: number;
    captura: number;
    fenologia: number;
    id: number;
  },
  longitud: number;
  latitud: number;
  presicion: number;
  distancia_qr: number;
  fecha: string;
  fechaHora: string;
  semana: number;
  ano: string;
  id_bd_cel: number;
  version: string;
  siembra_id:number
}

// 🔧 Función para construir el body del POST y los valores del INSERT
export function buildInsertPayloads(data: CapturaSimgbn): {
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
    captura: captura.captura,
    fenologia_id: captura.fenologia,
    fecha,
    semana,
    ano,
    latitud,
    longitud,
    accuracy: presicion,
    distancia_qr,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
    siembra_id,
    tipo: 'Captura'
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
    captura.fenologia,
    captura.captura
  ];

  return { params, values };
}

// 🔧 Función para construir el body del POST y los valores del UPDATE
export function buildUpdatePayloads(data: CapturaSimgbn): {
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
    siembra_id
  } = data;

  const params = {
    fecha,
    semana,
    ano,
    latitud,
    longitud,
    accuracy: presicion,
    distancia_qr,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
    siembra_id,
    trampa_id: captura.trampa_id,
    fenologia_id: captura.fenologia,
    captura: captura.captura,
    tipo: 'Captura'
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
    version,
    captura.trampa_id,
    siembra_id,
    captura.fenologia,
    captura.captura,
    captura.id // este va al final porque es el WHERE id = ?
  ];

  return { params, values };
}
