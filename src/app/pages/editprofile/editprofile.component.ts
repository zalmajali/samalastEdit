import { Component, OnInit } from '@angular/core';
import {LoadingController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import {Storage} from "@ionic/storage-angular";
import { Network } from '@capacitor/network';
import {UsersService} from "../../service/users.service";
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
})
export class EditprofileComponent  implements OnInit {
  //label for page
  public app_label_192: any;
  public app_label_193: any;
  public app_label_194: any;
  public app_label_195: any;
  public app_label_196: any;
  public app_label_197: any;
  public app_label_198: any;
  public app_label_199: any;
  public app_label_200: any;
  public app_label_201: any;
  public account_information: any;
  public account_edit_button: any;  
  public error_internet:any;
  //check name  information
  public fullName: any;
  public errorFullName:any="";
  public isErrorFullName:any = 1;
  public register_full_name:any;
  public register_full_name_field:any;
  //check mobile  information
  public mobileUser: any;
  public mobileInsert: any='962';
  public errorMobile:any="";
  public isErrorMobile:any = 1;
  public register_full_mobile:any;
  public register_full_mobile_field:any;
  //menu lable
  public dir: any;
  public floatD: any;
  //system label
  public checkLanguage: any=0;
  public language: any;
  //login label
  public token:any;
  public userId:any;
  public mobile:any;
  public name:any;
  public user_type:any;
  public building_id:any;
  public apartment_id:any;
  public email:any;
  public password:any;
  //return result
  public returnResultData:any;
  public account_edit_error_one: any;
  public account_edit_error_tow: any;
  public account_edit_error_three: any;
  public account_edit_error_fore: any;
  public returnResultInfoData:any;
  public returnOperationData: any;
  public returnInfoArray:any = [];
  public nameOfUser: any;
  public emailOfUser: any;
  public apartmentOfUser: any;
  public ownershipDocUrlOfUser: any;
  public buildingOfUser: any;
  public addressOfUser: any;
  public dateOwnerOfUser: any;
  public mobileOfUser: any;
  constructor(private modalController: ModalController,private usersService: UsersService,private storage: Storage,private translate: TranslateService,private router: Router,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss({})
    });
  }
  initialiseTranslation(){
    this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
    this.translate.get('account_information').subscribe((res: string) => {
      this.account_information = res;
    });
    this.translate.get('register_full_name').subscribe((res: string) => {
      this.register_full_name = res;
    });
    this.translate.get('register_full_name_field').subscribe((res: string) => {
      this.register_full_name_field = res;
    });
    this.translate.get('register_full_mobile').subscribe((res: string) => {
      this.register_full_mobile = res;
    });
    this.translate.get('register_full_mobile_field').subscribe((res: string) => {
      this.register_full_mobile_field = res;
    });
    this.translate.get('account_edit_button').subscribe((res: string) => {
      this.account_edit_button = res;
    });
    this.translate.get('account_edit_error_one').subscribe((res: string) => {
      this.account_edit_error_one = res;
    });
    this.translate.get('account_edit_error_tow').subscribe((res: string) => {
      this.account_edit_error_tow = res;
    });
    this.translate.get('account_edit_error_three').subscribe((res: string) => {
      this.account_edit_error_three = res;
    });
    this.translate.get('account_edit_error_fore').subscribe((res: string) => {
      this.account_edit_error_fore = res;
    });
    this.translate.get('error_internet').subscribe((res: string) => {
      this.error_internet = res;
    });
    this.translate.get('app_label_192').subscribe((res: string) => {
      this.app_label_192 = res;
    });
     this.translate.get('app_label_193').subscribe((res: string) => {
      this.app_label_193 = res;
    });
     this.translate.get('app_label_194').subscribe((res: string) => {
      this.app_label_194 = res;
    });
     this.translate.get('app_label_195').subscribe((res: string) => {
      this.app_label_195 = res;
    });
     this.translate.get('app_label_196').subscribe((res: string) => {
      this.app_label_196 = res;
    });
     this.translate.get('app_label_197').subscribe((res: string) => {
      this.app_label_197 = res;
    });
     this.translate.get('app_label_198').subscribe((res: string) => {
      this.app_label_198 = res;
    });
     this.translate.get('app_label_199').subscribe((res: string) => {
      this.app_label_199 = res;
    });
     this.translate.get('app_label_200').subscribe((res: string) => {
      this.app_label_200 = res;
    });
    this.translate.get('app_label_201').subscribe((res: string) => {
      this.app_label_201 = res;
    });
  }
  checkFullName(event:any){
    this.errorFullName = "successStyleFull";
    this.isErrorFullName = 1;
    this.fullName = event.target.value;
    if(this.fullName == "" || this.fullName == undefined){
      this.errorFullName = "errorStyleEmpty";
      this.isErrorFullName = 0;
    }
  }
  checkMobile(event:any){
    this.mobileUser = event.target.value;
    if(this.mobileUser == "" || this.mobileUser == undefined){
     this.mobileInsert = "962";
    }else{
      this.mobileInsert = this.mobileUser;
    }
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    await this.checkLoginUser();
    this.user_type = await this.storage.get('user_type');
    this.userId = await this.storage.get('userId');
    this.fullName = await this.storage.get('name');
    this.mobileUser = await this.storage.get('mobile');
    const status = await Network.getStatus();
    if(!status.connected) {
      this.displayResult(this.error_internet);
    }
    await this.getInformation(this.userId);
  }
  async openFileUser(file:any){
    await Browser.open({ url: `${file}` });
  }
  async getInformation(userId:any){
    const status = await Network.getStatus();
    if(!status.connected) {
      this.displayResult(this.error_internet);
    }
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 1500,
    });
     let sendValues = {'user_id':this.userId};
      this.usersService.getProfile(sendValues).then(async data=>{
      this.returnResultInfoData = data;
      let errorData = this.returnResultInfoData.status;
      if(errorData == 1){
        this.returnOperationData = this.returnResultInfoData.data;
        this.nameOfUser = this.returnOperationData.user.name;
        this.emailOfUser = this.returnOperationData.user.email;
        this.mobileOfUser = this.returnOperationData.user.mobile;
        this.apartmentOfUser = this.returnOperationData.ownership.apartment.apartment_number;
        this.dateOwnerOfUser = this.returnOperationData.ownership.ownership_date;
        this.ownershipDocUrlOfUser = this.returnOperationData.ownership.ownership_documentation_url;
        if(this.language == 'ar'){
          this.buildingOfUser = this.returnOperationData.ownership.apartment.building.name_ar;
          this.addressOfUser = this.returnOperationData.ownership.apartment.building.address_ar;
        }
        else{
          this.buildingOfUser = this.returnOperationData.ownership.apartment.building.name_en;
          this.addressOfUser = this.returnOperationData.ownership.apartment.building.address_en;
        }
      }
      }).catch(error=>{
          this.getInformation(userId)
      });
    await loading.present();
  }
  async checkLoginUser(){
    this.token = await this.storage.get('token');
    this.userId = await this.storage.get('userId');
    this.email = await this.storage.get('email');
    this.password = await this.storage.get('password');
    if(this.token == null || this.token == undefined || this.userId == null || this.userId == undefined || this.password == null || this.password == undefined || this.email == null || this.email == undefined){
      this.storage.remove('token');
      this.storage.remove('userId');
      this.storage.remove('name');
      this.storage.remove('mobile');
      this.storage.remove('user_type');
      this.storage.remove('building_id');
      this.storage.remove('apartment_id');
      this.storage.remove('email');
      this.storage.remove('password');
      this.navCtrl.navigateRoot('login');
    }
  }
  async editProfile(){
    const status = await Network.getStatus();
    if(!status.connected) {
      this.displayResult(this.error_internet);
    }
    if(this.fullName == undefined || this.fullName == ""){
      this.errorFullName = "errorStyleEmpty";
      this.isErrorFullName = 0;
      return false;
    }
    if(this.fullName != undefined) {
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 1500,
      });
      let sendValues = {'full_name':this.fullName,'mobile':this.mobileInsert,'user_id':this.userId};
      this.usersService.updateUserInfo(sendValues).then(async data=>{
        this.returnResultData = data;
        let errorData = this.returnResultData.status;
        if(errorData == 1){
          await this.storage.set('name',this.fullName);
          await this.storage.set('mobile',this.mobileInsert);
          this.displayResult(this.account_edit_error_one);
          this.modalController.dismiss({})
        }else if(errorData == 2){
          this.displayResult(this.account_edit_error_tow);
        }else if(errorData == 3){
          this.displayResult(this.account_edit_error_three);
        }else if(errorData == 4){
          this.displayResult(this.account_edit_error_fore);
        }
      });
      await loading.present();
    }
    return true;
  }
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage!=undefined && this.checkLanguage!=null && this.checkLanguage!=""){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    }else{
      const info = await Device.getLanguageCode();
      this.translate.setDefaultLang(info.value); // اللغة الافتراضية
       this.translate.use(info.value);
      this.language = info.value;
      this.initialiseTranslation();
    }
  }
  closePage(){
    this.modalController.dismiss({
    })
  }
  async displayResult(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
}
