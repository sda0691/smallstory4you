import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { NgForm, FormGroup, FormControl, Validators, Validator, ValidatorFn, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-auth',
  templateUrl: './create-auth.component.html',
  styleUrls: ['./create-auth.component.scss'],
})
export class CreateAuthComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  passwordType = 'password';
  show_hide = 'show';
  confirmPasswordType = 'password';
  show_hide_confirm = 'show';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(3)]
      }),
      // at least 8 characters, 1 number , 1 letter , 1 special character
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [
          Validators.required,
          // 6-20, number and letters
          // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z]{8,}$/)
          // Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/)
          Validators.pattern(/^(?=.*\d)(?=.*[A-Za-z])\w{6,20}$/)
          // at least 8 characters, 1 number , 1 letter , 1 special character
          // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/)
        ]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6),
        this.equalto('password')],
      })
    // tslint:disable-next-line: whitespace
    }
    /* ,
    {
      validator: this.matchingPasswords('password', 'confirmPassword')
    } */
    );


  }

  equalto(password): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const input = control.value;
        const isValid = control.root.value[password] === input;
        if (!isValid) {
          return {'equalTo': {isValid}};
        } else {
          return null;
        }
    };
  }
  showPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.show_hide = this.show_hide === 'show' ? 'hide' : 'show';
  }
  showConfirmPassword() {
    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.show_hide_confirm = this.show_hide_confirm === 'show' ? 'hide' : 'show';
  }  
  onSignup() {
    const email = this.form.value.email;
    const name = this.form.value.name;
    const password = this.form.value.password;
    this.isLoading = true;
    this.loadingCtrl.create({message: 'Logging In...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.signup(email, password, name)
        .then(result => {
            loadingEl.dismiss();
            this.isLoading = false;
            this.modalCtrl.dismiss(null, 'signup-success');
            this.router.navigateByUrl('/main/tabs/medias');
        })
        .catch (error => {
          loadingEl.dismiss();
          this.authService.logout();
          const code = error.code;
          let message = error.message;
/*             if (
            code === 'auth/email-already-in-use' ||
            code === 'auth/invalid-email' ||
            code === 'auth/operation-not-allowed' ||
            code === 'Thrown if the password is not strong enoug') {
            message = 'Email and password is not correct.';
          } else {
            message = error.message;
          } */
          this.showAlert(message);
        });
      });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  onFormSubmit() {
    if (!this.form.value) {
      return;
    }
 /*     const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
 */
    this.onSignup();
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
