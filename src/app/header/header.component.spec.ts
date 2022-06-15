import { HeaderComponent } from './header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
describe("HeaderComponent", () => {
    let headerComponent: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    beforeEach(async() => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent]
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        headerComponent = fixture.componentInstance;
        
    })
    it("should create", () => {
        expect(headerComponent).toBeTruthy();
    });
    it("should have a connect button", () => {
        const element:HTMLElement = fixture.nativeElement;
        // element.getElementsByClassName("")
    })
});