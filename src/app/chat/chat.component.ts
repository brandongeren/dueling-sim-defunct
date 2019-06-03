import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { Message } from './message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Array<Message> = [];
  message: String;
  username: String;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    // receive messages and display them
    this.chatService.receiveMessage().subscribe((data) => {
      this.messages.push(data);
    });

    // determine the username of the logged in user
    this.authService.me()
      .subscribe((user) => {
        this.username = user.user.username;
      });
  }
	
  sendMessage() {
    this.chatService.sendMessage(this.username, this.message);
    this.messages.push({ username: this.username, message: this.message });
    this.message = '';
  }
}
