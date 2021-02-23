import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { SmsPortService } from '../../services/sms-port/sms-port.service';
import { PeriodicMessageService } from '../../services/periodic-message/periodic-message.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PeriodInterface } from '../periodic';
import * as moment from 'moment';

interface PeriodicMessageModalInterface {
    port_name: string;
    team: string;
    type: string;
    start_date: string;
    end_date: string;
    sent_time: string;
    message: string
}

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-periodic-message-modal',
  templateUrl: './periodic-message-modal.component.html',
  styleUrls: ['./periodic-message-modal.component.scss']
})
export class PeriodicMessageModalComponent implements OnInit {

  periodicMessageModalForm: any;
    smsPorts: any;
    groupNames: any;
    periods: PeriodInterface[] = [
        {type : 'daily', name: 'Daily'},
        {type : 'weekly', name: 'Weekly'},
        {type : 'monthly', name: 'Monthly'},
    ];

  constructor(
      private formBuilder: FormBuilder,
      private storageService: StorageService,
      private smsPortService: SmsPortService,
      private periodicMessageService: PeriodicMessageService,
      public dialogRef: MatDialogRef<PeriodicMessageModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

  ngOnInit(): void {
      this.getSmsPorts();
      this.getGroupName();
    this.periodicMessageModalForm = this.formBuilder.group({
        port_name: [null, [Validators.required]],
        team: [null, [Validators.required]],
        type: [null, [Validators.required]],
        start_date: [null, [Validators.required]],
        end_date: [null, [Validators.required]],
        sent_time: [null, [Validators.required]],
        message: [null, [Validators.required]]
    });

  }

    periodicmessageModal(periodicMessageModalInterface: PeriodicMessageModalInterface) {
        periodicMessageModalInterface['start_date'] =
            moment(periodicMessageModalInterface.start_date).format('YYYY-MM-DD').toString();
        periodicMessageModalInterface['end_date'] =
            moment(periodicMessageModalInterface.end_date).format('YYYY-MM-DD').toString();
        console.log(periodicMessageModalInterface);
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'POST')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.periodicMessageService.create(periodicMessageModalInterface, headers, '/scheduled-message/team')
            .subscribe((res: {message: string}) => {
                console.log(res.message);
                this.dialogRef.close();
            }, (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
                this.dialogRef.close();
            })
    }

    getSmsPorts() {
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.smsPortService.gets(headers, '/sms-ports')
            .subscribe((res: any) => {
                console.log(res);
                this.smsPorts = res
            }, (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }

    getGroupName() {
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.periodicMessageService.gets(headers, '/teams')
            .subscribe((res: any) => {
                console.log(res);
                this.groupNames = res
            }, (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }

}
