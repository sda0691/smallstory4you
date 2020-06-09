import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MediasPage } from './medias.page';

describe('MediasPage', () => {
  let component: MediasPage;
  let fixture: ComponentFixture<MediasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MediasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
