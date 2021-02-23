import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MatDialog, MatTableDataSource } from '@angular/material';
import { UsersModalComponent } from './users-modal/users-modal.component';
import { UpdateUsersComponent, UpdateUsersInterface } from './update-users/update-users.component';
// import { UserRoleInterface } from '../users/users';
import { UserService } from '../services/user/user.service';
import { StorageService } from '../services/storage.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';


export interface PeriodicElement {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    roles: string;
    created_at?: string;
    updated_at?: string;
    action?: string;
}


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

    animal: string;
    firstname: string;
    loading: boolean;


    // displayedColumns: string[] = ['position', 'firstname', 'lastname', 'user_role', 'phone', 'action'];
    displayedColumns: string[] = ['id', 'full_name', 'email', 'phone', 'created_at', 'roles', 'updated_at', 'action'];
    // dataSource = new MatTableDataSource(ELEMENT_DATA);
    dataSource: any;

    constructor(
        private matDialog: MatDialog,
        private userService: UserService,
        private storageService: StorageService,
    ) { }

    openCreate(): void {
        const dialogRef = this.matDialog.open(UsersModalComponent, {
            width: '500px',
            data: {firstname: this.firstname, animal: this.animal}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.collectionOfu();
            this.animal = result;
        });
    }

    // openImportUsers(): void {
    //     const dialogRef = this.matDialog.open(ImportUsersComponent, {
    //         width: '1000px'
    //     });
    //
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed');
    //         this.animal = result;
    //     });
    // }

    openUpdate(data: UpdateUsersInterface): void {
        console.log(data);
        const dialogRef = this.matDialog.open(UpdateUsersComponent, {
            data: data,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.collectionOfu();
            this.animal = result;
        });
    }

    delete(id: string) {
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'DELETE')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.userService.delete(`user/${id}`, headers)
            .subscribe((res: {message: string}) => {
                console.log(res.message);
                this.collectionOfu();
            }, (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }

    ngOnInit() {
        this.collectionOfu()
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    collectionOfu() {
        this.loading = true;
        const headers = new HttpHeaders()
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('X-Requested-With', 'XMLHttpRequest')
            .append('Access-Control-Allow-Headers', 'Content-Type')
            .append('Authorization', `Bearer ${this.storageService.getStorage('accessToken')}`);
        // .append('Authorization', 'Bearer ' + this.storageService.getStorage('accessToken'));
        return this.userService.gets(headers, '/users')
            .subscribe((res: any) => {
                this.loading = false;
                this.dataSource = new MatTableDataSource(res.users.data);
                console.log(res);
            }, (httpErrorResponse: HttpErrorResponse) => {
                this.loading = false;
                console.log(httpErrorResponse.status);
                console.log(httpErrorResponse);
            })
    }
}
