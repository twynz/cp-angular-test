import {Component, OnInit} from '@angular/core';
import {TodoItem} from '../../models/TodoItem';
import {TodoItemService} from "../../services/todo-item.service";
import {StatusSharingService} from "../../services/status-sharing.service";
import {Operation} from "../todo-item-form/todo-item-form.component";
import {ToastrService} from "ngx-toastr";
import {HttpResponse} from "@angular/common/http";
import {ApiError} from "../../models/ApiError";

@Component({
  selector: 'app-todo-item-list',
  templateUrl: './todo-item-list.component.html',
  styles: []
})
export class TodoItemListComponent implements OnInit {

  //used to put todo items data
  public todoItemList: TodoItem[] = [];

  public constructor(public todoItemService: TodoItemService,
              private statusSharingService: StatusSharingService,
              private toasterService: ToastrService) {
    //listen to statusSharing service, if create a new one from form component, will get this event to add to list.
    this.statusSharingService.refreshTodoItemList.subscribe(status => {
      if (status !== null) {
        //if match condition, do add this payload to list
        if (status.action === Operation.CREATE.toString()) {
          const newItem = status.todoItem;
          this.todoItemList.push(newItem);
          //make it still asc order
          this.todoItemList.sort((a, b) => a.description > b.description ? 1 : -1);

        }
      }
    });
  }

  public ngOnInit(): void {
    //load data on init from backend
    this.todoItemService.getTodoItems().subscribe((data: TodoItem[]) => {
      //make it still asc order
      data = data.sort((a, b) => a.description > b.description ? 1 : -1);
      this.todoItemList = data
    });

  }

  //when click refresh, pull data from backend again
  public refresh(): void {
    this.todoItemService.getTodoItems().subscribe((data: TodoItem[]) => {
      data = data.sort((a, b) => a.description > b.description ? 1 : -1);
      this.todoItemList = data
    });

  }

  //when click delete, call api to backend
  public onDelete(todoItem: TodoItem): void {
    if (todoItem.id === undefined) {
      this.toasterService.error('Cannot be empty id!');
    } else {
      this.todoItemService.deleteItem(todoItem.id).subscribe((response) => {
          //if succeeded, delete from current list
          if (response.status === 204) {
            this.todoItemList = this.todoItemList.filter(element => element.id != todoItem.id);
            this.toasterService.success('Successfully delete todo item with id: ' + todoItem.id);
          }
        },
        //error handle to notify user
        (error: HttpResponse<object>) => {
          const displayMsg: ApiError = {
            status: error.status,
            error_message: error.statusText,
            description: 'Failed to delete this todo item!'
          }
          this.toasterService.error(JSON.stringify(displayMsg));
        }
      )
    }
  }

  //if user tick/un-tick mark as done check box, do relevant operation
  public onChangeIsCompleted(todoItem: TodoItem): void {
    if (todoItem.id === undefined) {
      this.toasterService.error('Cannot be empty id!');
    } else {
      todoItem.isCompleted = !todoItem.isCompleted;
      //update on backend
      this.todoItemService.updateItem(todoItem).subscribe((data) => {
        //if succeeded, reflect on list UI and notify user
          this.todoItemList.forEach(element => {
            if (element.id === data.id) {
              this.toasterService.success('Successfully update status of todo item with id: ' + todoItem.id);
              element.isCompleted === data.isCompleted;
            }
          })
        },
        //if error, notify user
        (error: HttpResponse<object>) => {
          const displayMsg: ApiError = {
            status: error.status,
            error_message: error.statusText,
            description: 'Failed to update this todo item status!'
          }
          this.toasterService.error(JSON.stringify(displayMsg));
        }
      )
    }
  }
}
