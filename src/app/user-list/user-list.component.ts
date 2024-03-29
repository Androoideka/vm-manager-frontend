import { Component, OnInit } from '@angular/core';
import {Observer} from "rxjs";
import {User, UserPage} from "@model/user-model";
import {PERMISSION_REPRESENTATIONS} from "@model/permission-model";
import {AuthenticationService} from "@services/authentication.service";
import {CrudService} from "@services/crud.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  current_page: number = 0;
  total_pages: number = 0;
  page_numbers: number[] = [];

  constructor(private authenticationService: AuthenticationService,
              private crudService: CrudService) {
    this.refresh();
  }

  ngOnInit(): void {
  }

  get can_update(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[2]];
  }

  get can_delete(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[3]];
  }

  refresh(): void {
    this.selectPage(this.current_page);
  }

  selectPage(page: number): void {
    const listObserver: Observer<UserPage> = {
      next: response => {
        this.users = response.content;
        this.total_pages = response.totalPages;
        this.page_numbers = [];
        for(let i = 0; i < this.total_pages; i++) {
          this.page_numbers.push(i);
        }
        this.current_page = page;
      },
      error: err => alert(err),
      complete: () => {}
    }
    this.crudService.listUsers(page).subscribe(listObserver);
  }

  nextPage(): void {
    this.selectPage(this.current_page + 1);
  }

  prevPage(): void {
    this.selectPage(this.current_page - 1);
  }

  deleteUser(user: User): void {
    const deleteObserver: Observer<void> = {
      next: () => {},
      error: err => alert(err),
      complete: () => {
        const index: number = this.users.indexOf(user, 0);
        this.users.splice(index, 1);
      }
    }
    this.crudService.deleteUser(user).subscribe(deleteObserver);
  }

}
