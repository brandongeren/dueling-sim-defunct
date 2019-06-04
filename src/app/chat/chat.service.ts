import { Injectable } from '@angular/core';
// TODO: add socket.io to package.json
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Message } from './message.model';
import { MESSAGE_SENT, MESSAGE_RECEIVED, USER_CONNECTED } from '../../../events';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket = io('http://localhost:3000');
  constructor() { }

  userConnect(username) {
    this.socket.emit(USER_CONNECTED, { username: username });
  }

  sendMessage(username, message) {
    this.socket.emit(MESSAGE_SENT, { message: message, username: username });
  }

  receiveMessage() {
    const observable = new Observable<Message>(observer => {
      this.socket.on(MESSAGE_RECEIVED, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
