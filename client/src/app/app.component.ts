import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  public title = 'SPOTIFLY';
  public user: User;
  public indentity; //Comprobar datos del usuario 
  public token;

  constructor(){
    this.user = new User('','','','','','ROLE_USER','');

  }

  public onSubmit(){
    console.log(this.user);
  }
}