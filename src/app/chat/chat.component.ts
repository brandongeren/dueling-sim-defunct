import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

	message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
	}
	
}
