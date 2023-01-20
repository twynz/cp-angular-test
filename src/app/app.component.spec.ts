import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {TodoItemListComponent} from "./components/todo-item-list/todo-item-list.component";
import {of} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {TodoItemService} from "./services/todo-item.service";
import {TodoItem} from "./models/TodoItem";
import {TodoItemFormComponent} from "./components/todo-item-form/todo-item-form.component";

describe('AppComponent', () => {
  let mockTodoItemService;
  let mockToastrService;
  const todoItem: TodoItem = {
    id: 'testId',
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
  beforeEach(async () => {
    mockTodoItemService = jasmine.createSpyObj(['createNewTodoItems', 'getTodoItems', 'deleteItem']);
    mockToastrService = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    mockTodoItemService.createNewTodoItems.and.returnValue(of(todoItem));
    mockTodoItemService.getTodoItems.and.returnValue(of(testTodoItemList));
    mockTodoItemService.deleteItem.and.returnValue(of({status: 204}));
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [
        AppComponent,
        TodoItemListComponent,
        TodoItemFormComponent
      ],
      providers: [{provide: TodoItemService, useValue: mockTodoItemService},
        {provide: ToastrService, useValue: mockToastrService}]
    }).compileComponents();
  });

  it('should display the title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.h4')?.textContent).toContain('Todo List App (Angular)');
  });
});
