export interface CapturaSimdia {
  user_id: string;
  junta_id: string;
  personal_id: string;
  captura: {
    trampa_id: number;
    captura: number;
    fenologia: number;
    instalada: number;
    revisada: number;
    observacion: number;
    noa: number;
    non: number;
    nof: number;
    sua: number;
    sun: number;
    suf: number;
    esa: number;
    esn: number;
    esf: number;
    oea: number;
    oen: number;
    oef: number;
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
export function buildInsertPayloads(data: CapturaSimdia): {
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
    posicion: latitud + ',' + longitud,
    accuracy: presicion,
    distancia_qr,
    captura: captura.captura,
    fenologia_trampa_id: captura.fenologia,
    instalada: captura.instalada ? 1 : 0,
    revisada: captura.revisada ? 1 : 0,
    observacion: captura.observacion ? 1 : 0,
    noa: captura.noa ? 1 : 0,
    non: captura.non ? 1 : 0,
    nof: captura.nof,
    sua: captura.sua ? 1 : 0,
    sun: captura.sun ? 1 : 0,
    suf: captura.suf,
    esa: captura.esa ? 1 : 0,
    esn: captura.esn ? 1 : 0,
    esf: captura.esf,
    oea: captura.oea ? 1 : 0,
    oen: captura.oen ? 1 : 0,
    oef: captura.oef,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fecha_cel: fechaHora,
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
    captura.captura,
    captura.fenologia,
    captura.instalada,
    captura.revisada,
    captura.observacion,
    captura.noa,
    captura.non,
    captura.nof,
    captura.sua,
    captura.sun,
    captura.suf,
    captura.esa,
    captura.esn,
    captura.esf,
    captura.oea,
    captura.oen,
    captura.oef,
  ];

  return { params, values };
}

// 🔧 Función para construir el body del POST y los valores del UPDATE
export function buildUpdatePayloads(data: CapturaSimdia): {
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
    posicion: latitud + ',' + longitud,
    accuracy: presicion,
    distancia_qr,
    captura: captura.captura,
    fenologia_trampa_id: captura.fenologia,
    instalada: captura.instalada ?? 0,
    revisada: captura.revisada ?? 0,
    observacion: captura.observacion ?? 0,
    noa: captura.noa ?? 0,
    non: captura.non ?? 0,
    nof: captura.nof,
    sua: captura.sua ?? 0,
    sun: captura.sun ?? 0,
    suf: captura.suf,
    esa: captura.esa ?? 0,
    esn: captura.esn ?? 0,
    esf: captura.esf,
    oea: captura.oea ?? 0,
    oen: captura.oen ?? 0,
    oef: captura.oef,
    method: 1,
    user_id,
    personal_id,
    junta_id,
    id_bd_cel,
    fecha_cel: fechaHora,
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
    captura.captura,
    captura.fenologia,
    captura.instalada,
    captura.revisada,
    captura.observacion,
    captura.noa,
    captura.non,
    captura.nof,
    captura.sua,
    captura.sun,
    captura.suf,
    captura.esa,
    captura.esn,
    captura.esf,
    captura.oea,
    captura.oen,
    captura.oef,
    captura.id, // este va al final porque es el WHERE id = ?
  ];

  return { params, values };
}
