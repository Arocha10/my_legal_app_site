import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Errors, TagsService, UserService } from '../core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authForm: FormGroup;
  codeForm: FormGroup;
  isSubmitting = false;
  errors: Errors = {errors: {}};

  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService,
    private fb: FormBuilder
    ) {

    this.authForm = this.fb.group({
      'email': ['',Validators.required],
      'first_name': ['',Validators.required],
      'last_name': ['',Validators.required],
      'mobile_phone': ['',Validators.required],
      'home_phone': ['',Validators.required],
      'address': ['',Validators.required],
      'birth_day': ['',Validators.required],
      'type':['user']
    });


    this.codeForm = this.fb.group({
      'email': ['',Validators.required]
    });
  }

  isAuthenticated: boolean;
  listConfig: string;
  tags: Array<string> = [];
  tagsLoaded = false;
  createF: boolean;

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
        console.log("Hoola");
        console.log(authenticated);
        console.log(this.userService.getCurrentUser());
        console.log(this.userService.getToken());

        // set the article list accordingly
        if (authenticated) {
          this.createF = true;

          this.setListTo('invitation');
        } else {
          this.createF = false;

          this.setListTo('create');
        }
      }
    );
  }

  setListTo(type: string = '') {
    // If feed is requested but user is not authenticated, redirect to login
    if ( this.createF && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.changeF();

    // Otherwise, set the list object
    this.listConfig = type;
  }

  changeF() {
    this.createF = !this.createF;
  }

  submitForm() {
    console.log("submit");
    console.log(this.createF);
    if (  !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }
    let credentials = { };
    this.isSubmitting = true;
    this.errors = {errors: {}};

    if(this.createF){
      credentials = this.codeForm.value;
    }else{
      credentials = this.authForm.value;
    }

    this.userService
    .inviteUser(this.listConfig, credentials)
    .subscribe(
    data => {

      console.log("got it");
      console.log(data);
      this.router.navigateByUrl('/');
    },
      err => {
        console.log(err);
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }
}
