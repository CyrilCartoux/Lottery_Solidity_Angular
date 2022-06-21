import { HeaderComponent } from './header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
describe('HeaderComponent', () => {
  let headerComponent: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    headerComponent = fixture.componentInstance;
  });
  it('should create', () => {
    expect(headerComponent).toBeTruthy();
  });
  it('should have a connect button if user is not logged in', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const button = element.getElementsByTagName('button')[0];
    expect(button).toBeTruthy();
  });
  it("shouldn't have a connect button if user is logged in", () => {
    const element: HTMLElement = fixture.nativeElement;
    headerComponent.account = '0xBbfaa2fb032296a1619a56f5440bd89770456697';
    fixture.detectChanges();
    const button = element.getElementsByTagName('button')[0];
    expect(button).not.toBeTruthy();
  });
  it("shouldn't dislay user address & balance if is NOT logged in", () => {
    const element: HTMLElement = fixture.nativeElement;
    headerComponent.account = undefined;
    headerComponent.userBalance = undefined;
    fixture.detectChanges();
    const paragraphs = element.getElementsByTagName('p');
    expect(paragraphs[0]).not.toBeTruthy();
  });
  it('should dislay user address & balance if is logged in', () => {
    const element: HTMLElement = fixture.nativeElement;
    headerComponent.account = '0xBbfaa2fb032296a1619a56f5440bd89770456697';
    headerComponent.userBalance = '0.05';
    fixture.detectChanges();
    const paragraphs = element.getElementsByTagName('p');
    expect(paragraphs[0].innerText).toEqual(headerComponent.account);
    expect(paragraphs[1].innerText).toEqual(
      headerComponent.userBalance + ' ether'
    );
  });
  it('button should call onConnectAccount when clicked', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const button = element.getElementsByTagName('button')[0];
    spyOn(headerComponent, 'onConnectAccount');
    button.click();
    expect(headerComponent.onConnectAccount).toHaveBeenCalled();
  });
});
