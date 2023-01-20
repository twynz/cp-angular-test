import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TodoItemListComponent} from "./todo-item-list.component";
import {TodoItem} from "../../models/TodoItem";
import {TodoItemService} from "../../services/todo-item.service";
import {ToastrService} from "ngx-toastr";
import {By} from "@angular/platform-browser";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('TodoItemFormComponent tests', () => {
  let component: TodoItemListComponent;
  let fixture: ComponentFixture<TodoItemListComponent>;
  let mockTodoItemService;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  //test data initialization
  const todoItem: TodoItem = {
    id: 'c-testId',
    description: 'test text',
    isCompleted: false
  };
  const testTodoItemList: TodoItem[] = [
    {
      id: 'a-testId',
      description: 'test a',
      isCompleted: false
    },
    {
      id: 'd-testId',
      description: 'test d',
      isCompleted: false
    },
    {
      id: 'b-testId',
      description: 'test b',
      isCompleted: false
    }
  ];

  beforeEach(waitForAsync(() => {
    //mock service to simulate api return
    mockTodoItemService = jasmine.createSpyObj(['updateItem', 'getTodoItems', 'deleteItem']);
    mockTodoItemService.updateItem.and.returnValue(of({
      id: 'a-testId',
      description: 'test a',
      isCompleted: true
    }));
    mockTodoItemService.getTodoItems.and.returnValue(of(testTodoItemList));
    mockTodoItemService.deleteItem.and.returnValue(of({status: 204}));
    //mock toastr service for notification
    mockToastrService = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TodoItemListComponent],
      providers: [{provide: TodoItemService, useValue: mockTodoItemService},
        {provide: ToastrService, useValue: mockToastrService}]
    }).compileComponents();
  }));

  //initial fixture
  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TodoItemList', () => {
    expect(component).toBeTruthy();
  });

  it('should display TodoItemList correctly(correct length&sorting by description ASC)', () => {
    component.todoItemList = testTodoItemList;
    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(4);
    expect(tableRows[0].cells[0].innerHTML).toBe('Id');
    //check is sorting by description ASC
    expect(tableRows[2].cells[1].innerHTML).toBe('test b');
    expect(tableRows[3].cells[1].innerHTML).toBe('test d');
  });

  it('should successfully update complete by click item tick', () => {
    component.todoItemList = testTodoItemList;
    const tickBox = fixture.debugElement.query(By.css('#a-testId'));
    tickBox.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tableRows = fixture.nativeElement.querySelectorAll('tr');
      expect(tableRows[1].cells[2].textContent.trim()).toBe('true');
    });
  });

  it('should refresh to reflect changes', () => {
    const testList: TodoItem[] = [todoItem];
    component.todoItemList = testList;
    fixture.detectChanges();
    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(2);
    testList.push({
      id: 'b-testId',
      description: 'test b',
      isCompleted: false
    });
    fixture.detectChanges();
    component.todoItemList = testList;
    const refreshBtn = fixture.debugElement.query(By.css('#refreshBtn'));
    refreshBtn.nativeElement.click();
    tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(3);
  });

  it('should successfully delete by clicking button', () => {
    const testList: TodoItem[] = [todoItem];
    component.todoItemList = testList;
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.query(By.css('#deleteBtn-c-testId'));
    deleteBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tableRows = fixture.nativeElement.querySelectorAll('tr');
      expect(tableRows.length).toBe(1);
    });
  });

  it('toastr service should successfully show message', () => {
    const testList: TodoItem[] = [todoItem];
    component.todoItemList = testList;
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.query(By.css('#deleteBtn-c-testId'));
    deleteBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockToastrService.success).toHaveBeenCalledOnceWith('Successfully delete todo item with id: c-testId');
    });
  });
});
