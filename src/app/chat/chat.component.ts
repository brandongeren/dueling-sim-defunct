import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { Message } from './message.model';
import { userInfo } from 'os';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Array<Message> = [];
  message: String;
  // TODO: create an user type
  user: any;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    // determine the username of the logged in user
    this.authService.me()
      .subscribe((user) => {
        this.user = user.user;
        this.chatService.userConnect(user.user);
      });


    // receive messages and display them
    this.chatService.receiveMessage().subscribe((data) => {
      if (data.from.username === this.user.username) {
        data.color = "primary";
      }
      else {
        data.color = "accent";
      }
      this.messages.push(data);
    });

  }
	
  sendMessage() {
    this.chatService.sendMessage(this.user, this.message);
    this.message = '';
  }
}
