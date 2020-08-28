import { Component, OnInit, Input } from '@angular/core';
import { Album } from '../praise.model';
import { PraiseService } from '../praise.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.scss'],
})
export class EditAlbumComponent implements OnInit {
  @Input() selectedAlbum: Album;

  constructor(
    private praiseService: PraiseService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onEditAlbum(inputData) {
    const albumName = inputData.form.value.albumName;
    this.modalCtrl.dismiss(null, albumName);
  }
  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
