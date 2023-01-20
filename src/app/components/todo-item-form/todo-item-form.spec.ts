import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TodoItemFormComponent} from "./todo-item-form.component";
import {TodoItem} from "../../models/TodoItem";
import {TodoItemService} from "../../services/todo-item.service";
import {ToastrService} from "ngx-toastr";
import {By} from "@angular/platform-browser";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('TodoItemFormComponent tests', () => {
  let component: TodoItemFormComponent;
  let fixture: ComponentFixture<TodoItemFormComponent>;
  let mockTodoItemService;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  const todoItem: TodoItem = {
    id: 'testId',
    description: 'test text',
    isCompleted: false
  };
  const mockValidInput = 'test text';
  const mockInvalidInput = 'cat text';

  beforeEach(waitForAsync(() => {
    //mock service to simulate api return
    mockTodoItemService = jasmine.createSpyObj(['createNewTodoItems', 'getTodoItems', 'deleteItem']);
    mockTodoItemService.createNewTodoItems.and.returnValue(of(todoItem));
    //mock toastr service for notification
    mockToastrService = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [TodoItemFormComponent],
      providers: [{provide: TodoItemService, useValue: mockTodoItemService},
        {provide: ToastrService, useValue: mockToastrService}]
    }).compileComponents();
  }));

  beforeEach(() => {
    //initial fixture
    fixture = TestBed.createComponent(TodoItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TodoItemForm', () => {
    expect(component).toBeTruthy();
  });

  it('should show no error for valid input', () => {
    component.inputDescription = mockValidInput;
    component.onInputValueChange();
    expect(component.errorMessage).toBe('');
  });

  it('should show error for invalid input', () => {
    component.inputDescription = mockInvalidInput;
    component.onInputValueChange();
    expect(component.errorMessage).toBe('Input words contains forbidden value contains cat, dog, yes or no!');
  });

  it('input should be cleared once trigger clear button', () => {
    component.inputDescription = mockInvalidInput;
    const clearBtn = fixture.debugElement.query(By.css('#clearBtn'))
    clearBtn.triggerEventHandler('click', null);
    expect(component.inputDescription).toBe('');
  });

  it('todo item should create successfully for valid input by clicking submit', () => {
    component.inputDescription = mockValidInput;
    const submitBtn = fixture.debugElement.query(By.css('#addBtn'))
    submitBtn.triggerEventHandler('click', null);
    expect(mockToastrService.success).toHaveBeenCalledOnceWith('Successfully add todo' +
      ' item with description: test text');
  });
});
