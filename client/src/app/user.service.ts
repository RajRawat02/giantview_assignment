import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  url='http://localhost:8000/';

    register(user: User) {
       var x={user:user}
        return this.http.post(this.url+'api/register', x);
    }
  
  getUsers(){
  return this.http.get(this.url+'api/student');
  }

  addStudent(user){
    return this.http.post(this.url+'api/addstudent',user)
  }
   updatestudent(user,id) {
      return this.http.patch( this.url+'api/addstudent/'+id , user);
  }
}
