import { CapturaSimdia } from '../interfaces/captura-simdia';

export function buildCapturaSimdia(
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
  },
  junta_id: string,
  personal_id: string,
  user_id: string,
  longitud: number,
  latitud: number,
  presicion: number,
  fecha: string,
  fechaHora: string,
  ano: string,
  semana: number,
  distancia_qr: number,
  id_bd_cel: number,
  version: string,
  siembra_id: number,
): CapturaSimdia {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      captura: captura.captura,
      fenologia: captura.fenologia,
      instalada: captura.instalada ?? 0,
      revisada: captura.revisada ?? 0,
      observacion: captura.observacion ?? 0,
      noa:  captura.noa ?? 0,
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
      id: captura.id
    },
    longitud,
    latitud,
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    trampa_id: captura.trampa_id,
    id_bd_cel,
    version,
    siembra_id
  };
}
