/*import { Component } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { DatabaseExportService } from 'src/app/services/database-export.service';

const sqlite = new SQLiteConnection(CapacitorSQLite);

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: false,
})
export class InfoPage {
  constructor(private dbExportService: DatabaseExportService) {}

  ngOnInit() {
    // Aquí puedes llamar la función si quieres exportar al cargar la página
  }
  enviarBaseDatos() {
    this.dbExportService.exportarComoJsonYEnviar();
  }

   enviarBaseDatos2() {
    this.dbExportService.exportarDbYEnviar();
  }
}*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InfoService } from 'src/app/services/info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: false
})
export class InfoPage implements OnInit, OnDestroy {
  perfil: any = [];
  interval: any;

  constructor(
    public actionSheetController: ActionSheetController,
    private emailComposer: EmailComposer,
    public alertController: AlertController,
    private login: AuthenticationService,
    private file: File,
    public info: InfoService
  ) {}

  ngOnInit() {
    this.getPerfil();
    // Copiar BD a externalDataDirectory (o a la carpeta que quieras)
    /*this.file
      .copyFile(
        this.file.dataDirectory,
        'simpra.db',
        this.file.externalDataDirectory,
        'simpra.db'
      )
      .then(() => {
        console.log('Archivo copiado a:', this.file.externalDataDirectory);
      })
      .catch((err) => {
        console.error('Error copiando archivo:', err);
      });*/

    this.getUser();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getPerfil() {
    this.info
      .getProfile()
      .then((res) => {
        this.perfil = res;
      })
      .catch(() => {});
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          icon: 'log-out-outline',
          text: 'Cerrar sesión',
          handler: () => this.presentAlert(),
        },
        {
          text: 'Enviar archivo',
          icon: 'share-outline',
          handler: () => this.enviar(),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        }
      ],
    });
    await actionSheet.present();
  }

  getUser() {
    this.interval = setInterval(() => {
      this.login.getUser();
      this.getPerfil();
    }, 4000);
  }

  enviar() {
    const filePath = this.file.externalDataDirectory + 'simpra.db';
    const email = {
      attachments: [filePath],
      subject: 'Archivo base de datos SIMPRA',
      isHtml: true,
    };
    this.emailComposer.open(email).catch((err) => {
      console.error('Error abriendo email composer:', err);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message:
        '¿Estás seguro que quieres cerrar sesión? <br><br> <strong>Atención:</strong> Esta acción eliminará todos tus registros',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.login.logout();
            this.ngOnDestroy();
            this.getPerfil();
          },
        },
      ],
    });
    await alert.present();
  }
}
