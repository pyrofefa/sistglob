import { CapturaSimtrampeo } from '../interfaces/captura-simtrampeo';

export function buildCapturaSimtrampeo(
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
  junta_id: string,
  personal_id: string,
  user_id: string,
  presicion: number,
  fecha: string,
  fechaHora: string,
  ano: string,
  semana: number,
  distancia_qr: number,
  id_bd_cel: number,
  version: string,
  siembra_id:number,
  instalacion:number,
  status:number,
): CapturaSimtrampeo {
  return {
    user_id,
    junta_id,
    personal_id,
    captura: {
      trampa_id: captura.trampa_id,
      captura: captura.captura,
      latitud_ins: captura.latitud_ins,
      longitud_ins: captura.longitud_ins,
      latitud_rev: captura.latitud_rev,
      longitud_rev: captura.longitud_rev,
      fecha_instalacion: captura.fecha_instalacion,
      id: captura.id
    },
    presicion,
    distancia_qr,
    fecha,
    fechaHora,
    semana,
    ano,
    id_bd_cel,
    version,
    siembra_id,
    instalacion,
    status
  };
}
