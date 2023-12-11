import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  inputMessage!: string;
  loggedInUser = sessionStorage.getItem('user');
  chatRoom = sessionStorage.getItem('room');
  connectedUsers: any[] = [];
  @ViewChild('scrollMe') private scrollMe!: ElementRef;

  constructor(
    private router: Router,
    private chatService: ChatService,
    ) {}

  leaveChat() {
    this.chatService.leaveChat()
      .then(() => {
        this.router.navigate(['welcome']);
        sessionStorage.clear();
        setTimeout(() => {
          location.reload();
        }, 0);
      })
      .catch((error) => {
        console.log(error);
      }) 
  }

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = "";
      })
      .catch((error) => {
        console.log(error);
      })
  }

  ngAfterViewChecked(): void {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
  }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(res => {
      this.messages = res;
    })

    this.chatService.connectedUsers$.subscribe(res => {
      this.connectedUsers = res;
    })
  }
}
