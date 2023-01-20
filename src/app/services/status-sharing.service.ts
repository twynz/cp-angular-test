import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ItemStatus} from "../models/ItemStatus";


@Injectable({
  providedIn: 'root'
})
export class StatusSharingService {

  //a status service that when a new item created, will use this to notify todoItem list component to update
  public refreshTodoItemList: BehaviorSubject<ItemStatus> = new BehaviorSubject<ItemStatus>({
    action: '',
    todoItem: {
      description: '',
      isCompleted: false
    }
  });
}
