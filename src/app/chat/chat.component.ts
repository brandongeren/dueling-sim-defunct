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
    // determine the username of the logged in user
    this.authService.me()
      .subscribe((user) => {
        this.username = user.user.username;
        this.chatService.userConnect(user.user.username);
      });


    // receive messages and display them
    this.chatService.receiveMessage().subscribe((data) => {
      data.color = "accent";
      this.messages.push(data);
    });

  }
	
  sendMessage() {
    this.chatService.sendMessage(this.username, this.message);
    this.messages.push({ username: this.username, message: this.message, color: "primary" });
    this.message = '';
  }
}
