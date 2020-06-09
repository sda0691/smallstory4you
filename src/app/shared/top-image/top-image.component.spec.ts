import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopImageComponent } from './top-image.component';

describe('TopImageComponent', () => {
  let component: TopImageComponent;
  let fixture: ComponentFixture<TopImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopImageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
