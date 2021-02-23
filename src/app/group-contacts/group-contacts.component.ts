import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { GroupContactsModalComponent } from './group-contacts-modal/group-contacts-modal.component';
import { UpdateContactInterface } from '../contacts/update-contact/update-contact.component';
import { StorageService } from '../services/storage.service';
import { TeamService } from '../services/team/team.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UpdateGroupContactsComponent, UpdateGroupContactsInterface } from './update-group-contacts/update-group-contacts.component';

export interface PeriodicElement {
    id: number;
    name: string;
    // description: string
    // number_of_contacts?: number;
    // fellowship_id: number;
    created_by: string;
    updated_by?: string;
    action?: string
    // university: string;
    // phone: string;
}


@Component({
  selector: 'app-group-contacts',
  templateUrl: './group-contacts.component.html',
  styleUrls: ['./group-contacts.component.scss']
})
export class GroupContactsComponent implements OnInit {

    animal: string;
    groupname: string;
    loading: boolean;


    displayedColumns: string[] = ['id', 'name', 'created_by', 'created_at', 'updated_at', 'action'];
    // dataSource = new MatTableDataSource(ELEMENT_DATA);
    dataSource: any;

    constructor(
        private matDialog: MatDialog,
        private teamService: TeamService,
        private storageService: StorageService,
    ) { }

    openCreate(): void {
        const dialogRef = this.matDialog.open(GroupContactsModalComponent, {
            width: '500px',
            data: {groupname: this.groupname, animal: this.animal}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.collectionOfcon();
            this.animal = result;
        });
    }

    openUpdate(data: UpdateGroupContactsInterface): void {
        console.log(data);
        const dialogRef = this.matDialog.open(UpdateGroupContactsComponent, {
            data: data,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.collectionOfcon();
            this.animal = result;
        });
    }

    deleteContact(id: string) {
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'DELETE')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.teamService.delete(`team/${id}`, headers)
            .subscribe((res: {message: string}) => {
                console.log(res.message);
                this.collectionOfcon();
            }, (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }

    collectionOfcon() {
        this.loading = true;
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.teamService.gets(headers, '/teams')
            .subscribe((res: any) => {
                this.loading = false;
                this.dataSource = new MatTableDataSource(res.teams.data);
                console.log(res)
            }, (httpErrorResponse: HttpErrorResponse) => {
                this.loading = false;
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }

    ngOnInit() {
        this.collectionOfcon()
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
