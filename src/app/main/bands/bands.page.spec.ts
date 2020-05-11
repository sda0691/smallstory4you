import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BandsPage } from './bands.page';

describe('BandsPage', () => {
  let component: BandsPage;
  let fixture: ComponentFixture<BandsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BandsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
