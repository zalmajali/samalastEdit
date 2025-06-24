import { Component, OnInit } from '@angular/core';
import {LoadingController,AlertController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import {Storage} from "@ionic/storage-angular";
import { Network } from '@capacitor/network';
import {UsersService} from "../../service/users.service";
import {AppinformationService} from "../../service/appinformation.service";
import {SearchComponent} from "../search/search.component";
import {RequestdetailsComponent} from "../requestdetails/requestdetails.component";
import {AddserviceComponent} from "../addservice/addservice.component";
@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
 //label for page
 public app_label_32:any;
 public app_label_33:any;
 public app_label_34:any;
 public app_label_9:any;
 public app_label_10:any;
 public app_label_45:any;
 public app_label_46:any;
 public price_free:any;
 public service_id:any;
 public from_date:any;
 public to_date:any;
 public note:any;
 public from_price:any;
 public to_price:any;
 public type:any;
 public error_internet:any;
 public loopingNumber:any = 1;
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
 public returnRequestsArray:any = [];
 public dataRequests:any;
 public lastScrollTop = 0;
 constructor(private appinformationService: AppinformationService,private modalController: ModalController,private usersService: UsersService,private storage: Storage,private translate: TranslateService,private router: Router,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController,private alertController:AlertController) { 
   this.platform.backButton.subscribeWithPriority(10, () => {
     this.navCtrl.navigateRoot("/tabs/home");
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
   this.translate.get('app_label_32').subscribe((res: string) => {
       this.app_label_32 = res;
   });
   this.translate.get('app_label_33').subscribe((res: string) => {
     this.app_label_33 = res;
   });
   this.translate.get('app_label_34').subscribe((res: string) => {
       this.app_label_34 = res;
   });
   this.translate.get('app_label_9').subscribe((res: string) => {
       this.app_label_9 = res;
   });
   this.translate.get('app_label_10').subscribe((res: string) => {
       this.app_label_10 = res;
   });  
   this.translate.get('app_label_45').subscribe((res: string) => {
       this.app_label_45 = res;
   });
    this.translate.get('app_label_46').subscribe((res: string) => {
       this.app_label_46 = res;
   });
   this.translate.get('price_free').subscribe((res: string) => {
    this.price_free = res;
  });
 }
 onScroll(event: any) {
   this.lastScrollTop = event.detail.scrollTop;
 }
 refrechPage(event:any){
   this.ngOnInit();
   setTimeout(() => {
       event.detail.complete();
     }, 2000);
 }
 async goToSearch(){
   let model = await this.modalController.create({
     component:SearchComponent,
     componentProps:{service_id:this.service_id,from_date:this.from_date,to_date:this.to_date,note:this.note,from_price:this.from_price,to_price:this.to_price,type:this.type,status_data:0,opType:1},
     animated:true,
     cssClass:"modalFilterSortCss"
   });
   model.onDidDismiss().then((data):any=>{
     this.service_id = data.data.service_id_data
     this.from_date = data.data.from_date_data
     this.to_date = data.data.to_date_data
     this.note = data.data.note_data
     this.from_price = data.data.from_price_data
     this.to_price = data.data.to_price_data
     this.type = data.data.type_data
     this.getUserRequiredServices(data.data.service_id_data,data.data.from_date_data,data.data.to_date_data,data.data.note_data,data.data.from_price_data,data.data.to_price_data,data.data.type_data)
   });
   await model.present();
 }
async ngOnInit() {
  await this.loadPage();
}
async ionViewWillEnter() {
  await this.loadPage();
}
async loadPage() {
   this.loopingNumber = 1;
   await this.getDeviceLanguage();
   await this.checkLoginUser();
   this.user_type = await this.storage.get('user_type');
   this.building_id = await this.storage.get('building_id');
   this.apartment_id = await this.storage.get('apartment_id');
   this.userId = await this.storage.get('userId');
   this.token = await this.storage.get('token');
   const status = await Network.getStatus();
   if(!status.connected) {
     this.displayResult(this.error_internet);
   }
   await this.getUserRequiredServices();
 }
 async getUserRequiredServices(service_id:any="",from_date:any="",to_date:any="",note:any="",from_price:any="",to_price:any="",type:any=2){
   let limitNew = this.loopingNumber;
   const status = await Network.getStatus();
   if(!status.connected) {
     this.displayResult(this.error_internet);
   }
   const loading = await this.loading.create({
       cssClass: 'my-custom-class',
       message: '',
       duration: 1500,
   });
   let sendValues = {'building_id':`${this.building_id}`,'apartment_id':`${this.apartment_id}`,'user_id':`${this.userId}`,'status':"0",'service_id':`${service_id}`,'from_date':`${from_date}`,'to_date':`${to_date}`,'note':`${note}`,'from_price':`${from_price}`,'to_price':`${to_price}`,'type':`${type}`,'limit':`${limitNew}`};
   this.appinformationService.getOldRequestsForOwner(sendValues).then(async data=>{
     this.returnResultData = data;
     let errorData = this.returnResultData.status;
     if(errorData == 1){
         this.returnOperationData = this.returnResultData.data;
         this.returnRequestsArray=[];
         for(let i = 0; i < this.returnOperationData.length;i++){
             this.returnRequestsArray[i]=[];
             this.returnRequestsArray[i]['request_id'] = this.returnOperationData[i].request_id;
             this.returnRequestsArray[i]['apartment_id'] = this.returnOperationData[i].apartment_id;
             this.returnRequestsArray[i]['service_id'] = this.returnOperationData[i].service_id;
             if(this.returnOperationData[i].service_price !=0)
              this.returnRequestsArray[i]['service_price'] = this.returnOperationData[i].service_price+" JD";
            else
              this.returnRequestsArray[i]['service_price'] =this.price_free;
             this.returnRequestsArray[i]['service_date'] = this.returnOperationData[i].service_date;
             let fruits = this.returnOperationData[i].service_schedule_time.split(" ");
             this.returnRequestsArray[i]['service_schedule_date'] = fruits[0];
             this.returnRequestsArray[i]['service_schedule_time'] = fruits[1];
             this.returnRequestsArray[i]['service_description'] = this.returnOperationData[i].service_description;
             if(this.returnOperationData[i].service_type == 1)
               this.returnRequestsArray[i]['service_type'] = this.app_label_45;
             else
               this.returnRequestsArray[i]['service_type'] = this.app_label_46;
             if(this.language == 'ar')
                 this.returnRequestsArray[i]['service_name'] = this.returnOperationData[i].service_name_ar;
             else
                 this.returnRequestsArray[i]['service_name'] = this.returnOperationData[i].service_name_en;
         }
         let countOfData = this.returnRequestsArray.length;
         if(countOfData == 0)
             this.dataRequests = 0;
         else{
             this.dataRequests = 1;
         }
     }else
         this.dataRequests = 0;
   }).catch(error=>{
       this.getUserRequiredServices(service_id,from_date,to_date,note,from_price,to_price,type)
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
 loadMoreData(event:any) {
   this.loopingNumber++;
   setTimeout(() => {
     if(this.lastScrollTop!=0)
      this.getUserRequiredServices(this.service_id,this.from_date,this.to_date,this.note,this.from_price,this.to_price,this.type)
     event.target.complete();
   }, 2000);
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
 async goToRequestdetails(request_id:any){
   let model = await this.modalController.create({
     component:RequestdetailsComponent,
     componentProps:{request_id:request_id,type:1},
     animated:true,
     cssClass:"modalFilterSortCss"
   });
   model.onDidDismiss().then((data):any=>{
   });
   await model.present();
 }
 async goToAddService(){
  let model = await this.modalController.create({
    component:AddserviceComponent,
    componentProps:{serv_id:0},
    animated:true,
    cssClass:"modalFilterSortCss"
  });
  model.onDidDismiss().then((data):any=>{
    this.ngOnInit();
  });
  await model.present();
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
 goToProfile(){
    this.navCtrl.navigateRoot("/tabs/account");
  }
  goToServices(){
    this.navCtrl.navigateRoot("/tabs/buildingservices");
  }
}
