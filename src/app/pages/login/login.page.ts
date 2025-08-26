import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AssetsService } from 'src/app/services/assests.service';
import { GPSSiafeson } from 'src/app/plugins/gpssiafeson';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  usuario: string = '';
  pass: string = '';

  showPassword = false;
  passwordToggleIcon = 'eye';

  constructor(
    private authService: AuthenticationService,
    public extras: AssetsService
  ) {}

  async ngOnInit() {
    try {
      await GPSSiafeson.requestPermissions();
    } catch (error) {
      console.error('Error obteniendo posición:', error);
    }
  }

  async login() {
    this.extras.cargandoMessage('Iniciando');
    try {
      const result: any = await this.authService.login(this.usuario, this.pass);

      if (result.status === 0) {
        setTimeout(() => {
          this.extras.loading.dismiss();
          this.extras.presentToast('❌ Ocurrió un error al iniciar sesión, por favor intente más tarde.');
        }, 1500);
      } else if (result.success === false) {
        setTimeout(() => {
          this.extras.loading.dismiss();
          this.extras.presentToast('❌ '+result.msj);
        }, 1500);
      } else {
        setTimeout(() => {
          this.extras.loading.dismiss();
          this.extras.presentToast('⚠️ Por favor actualiza tablas y ubicaciones antes de iniciar.');
        }, 1500);
      }
    } catch (error) {
      console.error('Error', error);
      this.extras.presentToast('❌ Ocurrió un error al iniciar sesión, por favor intente más tarde.');
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off' : 'eye';
  }
}
