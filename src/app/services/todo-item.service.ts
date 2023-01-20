import {Injectable} from '@angular/core';
import {TodoItem} from '../models/TodoItem';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//service layer to define some method will be used by component
export class TodoItemService {

  private apiURL = 'http://localhost:7002';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //need httpclient to interact with backend
  public constructor(private http: HttpClient) {
  }

  //get items by calling api
  public getTodoItems(): Observable<TodoItem[]> {
    return this.http
      .get<TodoItem[]>(this.apiURL + '/api/todoItems').pipe()
  }

  //create item by calling api
  public createNewTodoItems(todoItem: TodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(
      this.apiURL + '/api/todoItems',
      JSON.stringify(todoItem),
      this.httpOptions
    );
  }

  //update item by calling api
  public updateItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(
      this.apiURL + '/api/todoItems/' + todoItem.id,
      JSON.stringify(todoItem),
      this.httpOptions
    );
  }

  //delete item by calling api
  public deleteItem(id: string): Observable<HttpResponse<object>> {
    return this.http.delete<HttpResponse<object>>(
      this.apiURL + '/api/todoItems/' + id,
      {
        observe: 'response',
        ...this.httpOptions
      }
    );
  }
}
