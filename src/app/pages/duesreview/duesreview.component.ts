import { Component, OnInit,Input } from '@angular/core';
import {LoadingController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import {Storage} from "@ionic/storage-angular";
import { Network } from '@capacitor/network';
import {UsersService} from "../../service/users.service";
import {AppinformationService} from "../../service/appinformation.service";
@Component({
  selector: 'app-duesreview',
  templateUrl: './duesreview.component.html',
  styleUrls: ['./duesreview.component.scss'],
})
export class DuesreviewComponent  implements OnInit {
  @Input() due_id: string | any;
  public app_label_69:any;//تاكيد
  public app_label_180:any;//tit
  public error_internet:any;
  //check Note  information
  public reqNote: any;
  public errorReqNoteDate:any="";
  public isErrorReqNoteDate:any = 1;
  public app_label_39:any;
  public app_label_66:any;
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
  public returnOperationData: any;
  public app_label_181:any;//تاكيد
  public app_label_182:any;//تاكيد
  constructor(private appinformationService: AppinformationService,private modalController: ModalController,private usersService: UsersService,private storage: Storage,private translate: TranslateService,private router: Router,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) { 
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
    this.translate.get('error_internet').subscribe((res: string) => {
      this.error_internet = res;
    });
    this.translate.get('app_label_69').subscribe((res: string) => {
      this.app_label_69 = res;
   });
    this.translate.get('app_label_39').subscribe((res: string) => {
      this.app_label_39 = res;
   });
    this.translate.get('app_label_66').subscribe((res: string) => {
      this.app_label_66 = res;
   });
   this.translate.get('app_label_180').subscribe((res: string) => {
    this.app_label_180 = res;
    });
    this.translate.get('app_label_181').subscribe((res: string) => {
      this.app_label_181 = res;
    });
    this.translate.get('app_label_182').subscribe((res: string) => {
      this.app_label_182 = res;
    });
  }
  checkNote(event:any){
    this.errorReqNoteDate = "successStyleFull";
    this.isErrorReqNoteDate = 1;
    this.reqNote = event.target.value;
    if(this.reqNote == "" || this.reqNote == undefined){
      this.errorReqNoteDate = "errorStyleEmpty";
      this.isErrorReqNoteDate = 0;
    }
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    this.user_type = await this.storage.get('user_type');
    this.name = await this.storage.get('name');
    this.building_id = await this.storage.get('building_id');
    this.apartment_id = await this.storage.get('apartment_id');
    this.userId = await this.storage.get('userId');
    const status = await Network.getStatus();
    if(!status.connected) {
      this.displayResult(this.error_internet);
    }
  }
  async reviwDues(){
    const status = await Network.getStatus();
    if(!status.connected) {
      this.displayResult(this.error_internet);
    }
    if(this.reqNote == undefined || this.reqNote == ""){
      this.errorReqNoteDate = "errorStyleEmpty";
      this.isErrorReqNoteDate = 0;
      return false;
    }
    if(this.reqNote != undefined) {
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 1500,
      });
      let sendValues = {'building_id':this.building_id,'user_id':`${this.userId}`,'due_id':`${this.due_id}`,'review':'1','text':`${this.reqNote}`};
      this.appinformationService.reviewDuePayment(sendValues).then(async data=>{
        this.returnResultData = data;
        let errorData = this.returnResultData.status;
        if(errorData == 1){
          this.displayResult(this.app_label_181);
          this.modalController.dismiss({
          })
        }else{
          this.displayResult(this.app_label_182);
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
