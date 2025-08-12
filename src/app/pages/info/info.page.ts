import { Component, OnInit, OnDestroy } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InfoService } from 'src/app/services/info.service';
import { registerPlugin } from '@capacitor/core';
import { DatabaseCopierPlugin } from 'src/app/interfaces/database-copier-plugin';

// Plugin personalizado para copiar base de datos
const DatabaseCopier = registerPlugin<DatabaseCopierPlugin>('CopyFileSiafeson');

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: false,
})
export class InfoPage implements OnInit, OnDestroy {
  perfil: any = [];
  private intervalId: any;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private emailComposer: EmailComposer,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private file: File,
    private infoService: InfoService,
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.copyDatabaseToExternalStorage();
    this.copyDatabaseOldToExternalStorage();
    this.startUserUpdateInterval();
  }

  ngOnDestroy() {
    this.stopUserUpdateInterval();
  }

  private async loadUserInfo(): Promise<void> {
    try {
      this.perfil = await this.infoService.getProfile();
    } catch (error) {
      console.warn('Error obteniendo perfil:', error);
    }
  }

  private startUserUpdateInterval(): void {
    this.intervalId = setInterval(() => {
      this.authService.getUser();
      this.loadUserInfo();
    }, 4000);
  }

  private stopUserUpdateInterval(): void {
    clearInterval(this.intervalId);
  }

  async presentActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          icon: 'log-out-outline',
          text: 'Cerrar sesión',
          handler: () => this.confirmLogout(),
        },
        {
          text: 'Enviar archivo',
          icon: 'share-outline',
          handler: () => this.sendDatabaseByEmail(),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  private async confirmLogout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      subHeader: '¿Estás seguro que quieres cerrar sesión?',
      message:'Atención: Esta acción eliminará todos tus registros',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.authService.logout();
            this.stopUserUpdateInterval();
            this.loadUserInfo();
          },
        },
      ],
    });
    await alert.present();
  }

  private async copyDatabaseToExternalStorage(): Promise<void> {
    try {
      await DatabaseCopier.copyDatabaseToExternal({
        dbName: 'trampeoSQLite.db',
      });
      console.log('Base de datos copiada exitosamente');
    } catch (error) {
      console.error('Error copiando base de datos:', error);
    }
  }
   private async copyDatabaseOldToExternalStorage(): Promise<void> {
    try {
      await DatabaseCopier.copyDatabaseToExternal({
        dbName: 'trampeo.db',
      });
      console.log('Base de datos copiada exitosamente');
    } catch (error) {
      console.error('Error copiando base de datos:', error);
    }
  }

  private sendDatabaseByEmail(): void {
    const dbFileName = 'trampeoSQLite.db';
    const filePath = this.file.externalDataDirectory + dbFileName;

    const dbOldFileName = 'trampeo.db';
    const filePathOld = this.file.externalDataDirectory + dbOldFileName;


    const email = {
      attachments: [filePath, filePathOld],
      subject: 'Archivo base de datos SISTGLOB',
      body: 'Adjunto archivo de base de datos.',
      isHtml: true,
    };

    this.emailComposer.open(email).catch((err) => {
      console.error('Error abriendo email composer:', err);
    });
  }
}
