import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChurchPage } from './church.page';

describe('ChurchPage', () => {
  let component: ChurchPage;
  let fixture: ComponentFixture<ChurchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChurchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChurchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
