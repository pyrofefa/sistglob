import { CapturaSimgbn } from '../interfaces/captura-simgbn';

export function buildCapturaSimgbn(
  captura: {
    trampa_id: number;
    accion: number,
    observacion: number;
    captura: number;
    fenologia: number;
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
): CapturaSimgbn {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      fenologia: captura.fenologia,
      captura: captura.captura,
      feromona: captura.feromona ?? 0,
      accion: captura.accion,
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
