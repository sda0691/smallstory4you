import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditMemberPage } from './edit-member.page';

describe('EditMemberPage', () => {
  let component: EditMemberPage;
  let fixture: ComponentFixture<EditMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
