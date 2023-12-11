import { Injectable } from '@angular/core';
import * as SignalR from "@microsoft/signalr"
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
    this.start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      this.messages = [...this.messages, {user, message, messageTime}];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser", (users) => {
      this.connectedUsers$.next(users);
    })
   }

  public connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat")
  .configureLogging(SignalR.LogLevel.Information)
  .build();

  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public connectedUsers: any[] = [];



  //hub connection
  public async start() {
    try {
      await this.connection.start();
      console.log("Connection is established");
    } catch(e) {
      console.log(e);
    }
  }

  //Join Room
  public async joinRoom(User: string, Room: string) {
    return this.connection.invoke("JoinRoom", {User, Room})
  }

  //Send Messages
  public async sendMessage(message: string) {
    return this.connection.invoke("SendMessage", message)
  }

  //leave
  public async leaveChat() {
    return this.connection.stop();
  }
}
