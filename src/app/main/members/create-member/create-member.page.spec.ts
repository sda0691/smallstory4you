import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMemberPage } from './create-member.page';

describe('CreateMemberPage', () => {
  let component: CreateMemberPage;
  let fixture: ComponentFixture<CreateMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
