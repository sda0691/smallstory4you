import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPraiseComponent } from './edit-praise.component';

describe('EditPraiseComponent', () => {
  let component: EditPraiseComponent;
  let fixture: ComponentFixture<EditPraiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPraiseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPraiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
