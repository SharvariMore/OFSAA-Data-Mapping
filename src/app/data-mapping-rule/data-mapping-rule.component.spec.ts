import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMappingRuleComponent } from './data-mapping-rule.component';

describe('DataMappingRuleComponent', () => {
  let component: DataMappingRuleComponent;
  let fixture: ComponentFixture<DataMappingRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataMappingRuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataMappingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
