import { CapturaSimto } from '../interfaces/captura-simto';

export function buildCapturaSimto(
  captura: {
    trampa_id: number;
    captura: number;
    fenologia: number;
    totalTrampas: number;
    totalInsectos: number;
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
): CapturaSimto {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      captura: captura.captura,
      fenologia: captura.fenologia,
      totalTrampas: captura.totalTrampas,
      totalInsectos: captura.totalInsectos,
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
