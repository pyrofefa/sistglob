import { CapturaSimpicudo } from '../interfaces/captura-simpicudo';

export function buildCapturaSimpicudo(
  captura: {
    trampa_id: number;
    captura: number;
    fenologia: number;
    recomendacion: number;
    infestacion: number;
    feromona: number,
    accion: number,
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
): CapturaSimpicudo {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      accion: captura.accion,
      feromona: captura.feromona ?? 0,
      fenologia: captura.fenologia,
      captura: captura.captura,
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
