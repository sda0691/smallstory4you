import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.scss'],
})
export class NewAlbumComponent implements OnInit {
  albumName = '';

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onAddAlbum(inputData) {
    this.modalCtrl.dismiss(null, inputData.form.value.albumName);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
