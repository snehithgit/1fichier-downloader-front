import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaballeComponent } from './baballe.component';

describe('BaballeComponent', () => {
  let component: BaballeComponent;
  let fixture: ComponentFixture<BaballeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaballeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaballeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
