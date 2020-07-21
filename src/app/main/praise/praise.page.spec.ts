import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PraisePage } from './praise.page';

describe('PraisePage', () => {
  let component: PraisePage;
  let fixture: ComponentFixture<PraisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PraisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
