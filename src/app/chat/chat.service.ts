import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket = io('http://localhost:3000');
  constructor() { }

  sendMessage(username, message) {
    this.socket.emit('new-message', { message: message, username: username });
  }

  receiveMessage() {
    const observable = new Observable<Message>(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
