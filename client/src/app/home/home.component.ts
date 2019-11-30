import { Component, OnInit,OnDestroy,ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router,NavigationEnd } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  users: Array<any> = [];
userForm: FormGroup;
columns: string[];
usersc: Array<any> = [];
count = 0;
p :number=1;
dropdown=1;
order="first";
isDesc: boolean = false;
ascending = true;
//searchText='';
formFlag = 'add';
mySubscription: any;
sortarr = [{ 'id': 1, name: 'Sort by Name(A - Z)' },
  { 'id': 2, name: 'Sort by Name(Z - A)' }];
userFilter: any = { name: '' };
@ViewChild('modalClose') modalClose:ElementRef;
  constructor(private userService : UserService, private router:Router) { 
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      '_id': new FormControl(null),
		  'name': new FormControl(null, Validators.required),
		  'rollno': new FormControl(null, Validators.required),
      'degree': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required)
		});
    this.fetchData();    
  }
  initUser(){
		//User form reset
		this.userForm.reset();
		this.formFlag = 'add';
	}

  sort() {
    console.log("asa" + this.dropdown)
    if (this.dropdown == 1)
      this.ascending = true;
    else
      this.ascending = false;
  }
getData(item)
	{
		this.userForm.patchValue(item);
		this.formFlag = 'edit';
	}
  saveUser(){
		if(this.formFlag == 'add')
		{
			//this.userForm.value.id= this.persons.length + 1;
			//this.persons.unshift(this.userForm.value);
      this.userService.addStudent(this.userForm.value).subscribe((res:any)=>{
      //this.users=res;
      //this.usersc = res
      //this.count = this.usersc.length
      //console.log("savd response "+res);
      this.fetchData();
    })
		}
		else
		{
          console.log(this.userForm.value);
      this.userService.updatestudent(this.userForm.value,this.userForm.value._id).subscribe((res:any)=>{
      //this.users=res;
      //this.usersc = res
      //this.count = this.usersc.length
      console.log("savd response "+res);
      this.fetchData();
    })
			//var index = this.persons.findIndex(x => x.id== this.userForm.value.id);
			//if (index !== -1) {
			  //this.persons[index] = this.userForm.value;
		//	}
    
		}
    //this.fetchData();
		//this.reloadTableManually();
		//Close modal
		this.modalClose.nativeElement.click();
		//User form reset
		this.userForm.reset();
    
  };
	
  fetchData(){
  this.userService.getUsers().subscribe((res:any)=>{
      this.users=res;
      this.usersc = res
      this.count = this.usersc.length
      //console.log("tabl res "+JSON.stringify(res));
    })
  }
  ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}
}
