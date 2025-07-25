import { CapturaSimmoscas } from '../interfaces/captura-simmoscas';

export function buildCapturaSimmoscas(
  captura: {
    trampa_id: number;
    accion: number,
    omision: number,
    machos: number,
    hembras: number,
    instalada: number,
    gancho:  number,
    recebado: number,
    fenologia: number,
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
): CapturaSimmoscas {
  return {
      user_id,
      junta_id,
      personal_id,
      captura: {
      trampa_id: captura.trampa_id,
      accion: captura.accion,
      omision: captura.omision,
      machos: captura.machos,
      hembras: captura.hembras,
      instalada: captura.instalada ?? 0,
      gancho:  captura.gancho ?? 0,
      recebado: captura.recebado ?? 0,
      fenologia: captura.fenologia,
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
