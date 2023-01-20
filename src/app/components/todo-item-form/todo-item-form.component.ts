import {Component, Input} from '@angular/core';
import {TodoItem} from '../../models/TodoItem';
import {TodoItemService} from "../../services/todo-item.service";
import {ToastrService} from 'ngx-toastr';
import {StatusSharingService} from "../../services/status-sharing.service";
import {checkContainsForbiddenWord} from "../../utils/words-validator.util";
import {ApiError} from "../../models/ApiError";
import {HttpResponse} from "@angular/common/http";

//define operations
export enum Operation {
  CREATE,
  UPDATE,
  DELETE
}

@Component({
  selector: 'app-todo-item-form',
  templateUrl: './todo-item-form.component.html',
  styles: []
})
export class TodoItemFormComponent {

  //the input field that binds the input from template
  @Input() public inputDescription = '';

  //use to put error message
  public errorMessage = '';

  //needed dependencies for this component
  public constructor(public todoItemService: TodoItemService, private toasterService: ToastrService,
              private statusSharingService: StatusSharingService) {
  }

  //check is valid input when template input text changes
  public onInputValueChange(): void {
    if (checkContainsForbiddenWord(this.inputDescription)) {
      this.errorMessage = 'Input words contains forbidden value contains cat, dog, yes or no!'
    } else {
      this.errorMessage = ''
    }
  }

  //submit function when click submit button
  public onSubmit(): void {
    const todoItem: TodoItem = {
      description: this.inputDescription,
      isCompleted: false
    }
    //input double check for forbidden word
    if (checkContainsForbiddenWord(this.inputDescription)) {
      this.errorMessage = 'Input words contains forbidden value contains cat, dog, yes or no!';
      return;
    }
    //input double check for empty
    if (this.inputDescription.trim().length == 0) {
      this.errorMessage = 'Not allow empty string!';
      return;
    }

    //then create item
    this.todoItemService.createNewTodoItems(todoItem).subscribe((data: TodoItem) => {
       //send an event to notify item-list component
        this.statusSharingService.refreshTodoItemList.next({
            action: Operation.CREATE.toString(),
            todoItem: data
          }
        );
        //if success, notify user
        this.toasterService.success('Successfully add todo item with description: ' + todoItem.description);
      },
      (error: HttpResponse<object>) => {
        //if failed, notify user
        const displayMsg: ApiError = {
          status: error.status,
          error_message: error.statusText,
          description: 'Failed to create new todo item!'
        }
        this.toasterService.error(JSON.stringify(displayMsg));
      });
  }

  //clear the input if click this btn
  public onClear(): void {
    this.inputDescription = '';
  }
}
