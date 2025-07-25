import { CapturaSimep } from '../interfaces/captura-simep'

export function buildCapturaSimep(
  captura: {
    trampa_id: number;
    captura: number;
    instalada: number;
    recomendacion: number;
    id: number;
  },
  siembra_id: number,
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
  version: string
): CapturaSimep {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id ?? null,
      captura: captura.captura,
      instalada: captura.instalada ?? 0,
      recomendacion: captura.recomendacion,
      siembra_id: siembra_id,
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
    version
  };
}
