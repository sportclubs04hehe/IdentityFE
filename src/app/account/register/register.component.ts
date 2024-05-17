import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit{
  @ViewChild('loginInput') loginInputElment!: ElementRef;
  registerForm!: FormGroup;
  submitted: boolean = false;
  errorMessage: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
  ) {
    accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          router.navigateByUrl('/');
        }
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.loginInputElment.nativeElement.focus();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
  }

  register() {
    this.submitted = true;
    this.errorMessage = [];
    
    if(this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (res: any) => {   
          this.sharedService.showNotification(true, res.value.title, res.value.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (err) => {
          if(err.error.errors) {
            this.errorMessage = err.error.errors;
          } else {
            this.errorMessage.push(err.error);
          }
        },
      });
    }
  }

}
