import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { InfoService } from './info.service';
import { TablasService } from './tablas.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(
    private plt: Platform,
    public http: HttpClient,
    public info: InfoService,
    public tablas: TablasService
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  async checkToken() {
    const res = await Preferences.get({ key: environment.TOKEN_KEY });
    console.log(res);
    if (res.value) {
      this.authenticationState.next(true);
    }
  }

  login(username: string, password: string): Promise<any> {
    const url = `${environment.APIUrl}login/trampeo`;
    const params = { username, password };

    return new Promise((resolve) => {
      this.http.post(url, params).subscribe(
        async (data: any) => {
          if (data.success) {
const personalId = data?.data?.personal_id;
const juntaId = data?.data?.junta_id;
const tipo = data?.tipo;
const userId = data?.data?.user_id;

if (
  userId === undefined || personalId === undefined ||
  juntaId === undefined || tipo === undefined
) {
  console.error('❌ Uno o más valores requeridos son undefined');
  resolve({ success: false, message: 'Datos incompletos del servidor' });
  return;
}

            await Preferences.set({
              key: environment.TOKEN_KEY,
              value: data.data.user_id.toString(),
            });
            await Preferences.set({
              key: environment.PERSONAL_KEY,
              value: data.data.personal_id.toString(),
            });
            await Preferences.set({
              key: environment.JUNTA_KEY,
              value: data.data.junta_id.toString(),
            });
            await Preferences.set({
              key: environment.TIPO_KEY,
              value: data.tipo.toString(),
            });

            await this.info.saveProfile(
              data.data.user_id,
              data.data.username,
              data.data.nombre,
              data.data.apellido_paterno,
              data.data.apellido_materno,
              data.data.junta_id,
              data.data.estado_id,
              data.data.junta_name,
              data.data.personal_id,
              data.data.junta_sicafi_id,
              data.data.email
            );
            // Ejecutar operaciones secuenciales
            await this.tablas.getServicesTablas();
            await this.tablas.getServicesBrotes();
            await this.tablas.getServicesObservaciones();
            await this.tablas.getServicesAcciones();
            await this.tablas.getServicesOmisiones();
            await this.tablas.getServicesRecomendaciones();
            await this.tablas.getServiceUbicaciones(
              data.data.personal_id,
              data.data.junta_id
            );
            await this.tablas.getSimtrampeo(
              data.data.personal_id,
              data.data.junta_id
            );

            this.authenticationState.next(true);
            resolve(data);
          } else {
            resolve(data);
          }
        },
        (error) => {
          resolve({ success: false, message: 'Error de red', error });
        }
      );
    });
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: environment.TOKEN_KEY });
    await this.info.deleteProfile(); // asumes que este método es una promesa
    this.authenticationState.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticationState.value;
  }

  async getUser(): Promise<any> {
    try {
      const { value } = await Preferences.get({ key: environment.TOKEN_KEY });
      if (!value) return;

      const data: any = await this.http.get(
        `${environment.APIUrl}getUsuario/${value}`
      );
      await this.info.updateProfile(
        data.data.user_id,
        data.data.username,
        data.data.nombre,
        data.data.apellido_paterno,
        data.data.apellido_materno,
        data.data.junta_id,
        data.data.junta_name,
        data.data.personal_id,
        data.data.junta_sicafi_id,
        data.data.email
      );
      return data;
    } catch (error) {
      //console.error('Error al obtener datos del usuario:', error);
    }
  }
}
