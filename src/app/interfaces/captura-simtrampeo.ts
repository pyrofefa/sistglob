export interface CapturaSimtrampeo {
  user_id: string;
  junta_id: string;
  personal_id:  string;
  captura: {
    trampa_id: number;
    captura: number;
    latitud_ins: number;
    longitud_ins: number;
    latitud_rev: number;
    longitud_rev: number;
    fecha_instalacion: string;
    id: number;
  },
  presicion: number;
  distancia_qr: number;
  fecha: string;
  fechaHora: string;
  semana: number;
  ano: string;
  id_bd_cel: number;
  version: string;
  siembra_id:number;
  instalacion:number;
  status:number
}
export function buildInsertInstallPayloads(data: CapturaSimtrampeo): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    id_bd_cel,
    version,
    siembra_id,
    status
  } = data;

  const params = {
    trampa_id: captura.trampa_id,
    fecha,
    semana,
    ano,
    latitud_ins: captura.latitud_ins,
    longitud_ins: captura.longitud_ins,
    latitud_rev: captura.latitud_rev,
    longitud_rev: captura.longitud_rev,
    accuracy: presicion,
    distancia_qr,
    fecha_instalacion: captura.fecha_instalacion,
    captura: captura.captura,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 3,
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
    presicion,
    distancia_qr,
    3, // status local
    ano,
    semana,
    id_bd_cel,
    version,
    captura.trampa_id,
    siembra_id,
    captura.latitud_ins,
    captura.longitud_ins,
    captura.latitud_rev,
    captura.longitud_rev,
    captura.fecha_instalacion,
    captura.captura
  ];

  return { params, values };
}

export function buildUpdatePayloadsInstalacion(data: CapturaSimtrampeo): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
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
    latitud_ins: captura.latitud_ins,
    longitud_ins: captura.longitud_ins,
    latitud_rev: captura.latitud_rev,
    longitud_rev: captura.longitud_rev,
    accuracy: presicion,
    distancia_qr,
    fecha_instalacion: captura.fecha_instalacion,
    captura: captura.captura,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fechaHora_cel: fechaHora,
    status: 3,
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
    presicion,
    distancia_qr,
    3, // status local
    ano,
    semana,
    version,
    captura.latitud_ins,
    captura.longitud_ins,
    captura.fecha_instalacion,
    captura.id
  ];

  return { params, values };
}

export function buildUpdatePayloads(data: CapturaSimtrampeo): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
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
    latitud_ins: captura.latitud_ins,
    longitud_ins: captura.longitud_ins,
    latitud_rev: captura.latitud_rev,
    longitud_rev: captura.longitud_rev,
    accuracy: presicion,
    distancia_qr,
    fecha_instalacion: captura.fecha_instalacion,
    captura: captura.captura,
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
    presicion,
    distancia_qr,
    2, // status local
    ano,
    semana,
    version,
    captura.latitud_rev,
    captura.longitud_rev,
    captura.fecha_instalacion,
    captura.captura,
    captura.id
  ];

  return { params, values };
}
export function buildInserPayloads(data: CapturaSimtrampeo): {
  params: any;
  values: any[];
} {
  const {
    user_id,
    junta_id,
    personal_id,
    captura,
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    id_bd_cel,
    version,
    siembra_id,
    status
  } = data;

  const params = {
    trampa_id: captura.trampa_id,
    fecha,
    semana,
    ano,
    latitud_ins: captura.latitud_ins,
    longitud_ins: captura.longitud_ins,
    latitud_rev: captura.latitud_rev,
    longitud_rev: captura.longitud_rev,
    accuracy: presicion,
    distancia_qr,
    fecha_instalacion: captura.fecha_instalacion,
    captura: captura.captura,
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
    presicion,
    distancia_qr,
    2, // status local
    ano,
    semana,
    id_bd_cel,
    version,
    captura.trampa_id,
    siembra_id,
    captura.latitud_ins,
    captura.longitud_ins,
    captura.latitud_rev,
    captura.longitud_rev,
    captura.fecha_instalacion,
    captura.captura
  ];

  return { params, values };
}
