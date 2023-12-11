import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private chat: ChatService) {}

  joinRoomForm!: FormGroup;

  ngOnInit(): void {
    this.joinRoomForm = this.fb.group({
      user: ['', Validators.required],
      room: ['', Validators.required]
    })
  }

  joinRoom() {
    const {user, room} = this.joinRoomForm.value;
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('room', room);
    this.chat.joinRoom(user, room)
    .then(() => {
      this.router.navigate(['chat']);
    }).catch((e) => {
      console.log(e);
    })
  }
}
