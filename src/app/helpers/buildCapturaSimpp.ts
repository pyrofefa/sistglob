import { CapturaSimpp } from '../interfaces/captura-simpp';

export function buildCapturaSimpp(
  captura: {
    trampa_id: number;
    accion: number,
    observacion: number;
    captura: number;
    fenologia: number;
    atrayente: number;
    feromona: number,
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
  siembra_id:number
): CapturaSimpp {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      accion: captura.accion,
      observacion: captura.observacion,
      captura: captura.captura,
      fenologia: captura.fenologia,
      atrayente: captura.atrayente ?? 0,
      feromona: captura.feromona ?? 0,
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
    id_bd_cel,
    version,
    siembra_id
  };
}
