export interface CapturaSimep {
  user_id: string;
  junta_id: string;
  personal_id:  string;
  captura: {
    trampa_id: number;
    captura: number;
    instalada: number;
    recomendacion: number;
    siembra_id: number;
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
}

// 🔧 Función para construir el body del POST y los valores del INSERT
export function buildInsertPayloads(data: CapturaSimep): {
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
    version
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
    captura: captura.captura,
    trampas_instaladas: captura.instalada,
    recomendacion_id: captura.recomendacion ?? null,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
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
    captura.trampa_id,
    captura.captura,
    captura.instalada,
    ano,
    semana,
    id_bd_cel,
    captura.siembra_id,
    null, // revisada
    captura.recomendacion,
    version
  ];



  return { params, values };
}

// 🔧 Función para construir el body del POST y los valores del UPDATE
export function buildUpdatePayloads(data: CapturaSimep): {
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
    version
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
    captura: captura.captura,
    trampas_instaladas: captura.instalada,
    recomendacion_id: captura.recomendacion ?? null,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 1,
    version,
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
    captura.trampa_id,
    captura.captura,
    captura.instalada,
    ano,
    semana,
    captura.siembra_id,
    null, // revisada
    captura.recomendacion,
    version,
    captura.id // este va al final porque es el WHERE id = ?
  ];

  return { params, values };
}
