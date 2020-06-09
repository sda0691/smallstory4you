import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BinderPage } from './binder.page';

describe('BinderPage', () => {
  let component: BinderPage;
  let fixture: ComponentFixture<BinderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
