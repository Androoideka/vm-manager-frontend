import { Component, OnInit } from '@angular/core';
import {PERMISSION_REPRESENTATIONS} from "../model/permission-model";
import {Observer} from "rxjs";
import {Machine, MachinePage} from "../model/machine-model";
import {AuthenticationService} from "../services/authentication.service";
import {MachineManagementService} from "../services/machine-management.service";

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Machine[] = [];
  current_page: number = 0;
  total_pages: number = 0;
  page_numbers: number[] = [];

  name_filter: string = '';
  from_filter: Date | undefined = undefined;
  to_filter: Date | undefined = undefined;
  stopped: boolean = true;
  running: boolean = true;

  constructor(private authenticationService: AuthenticationService,
              private machineManagementService: MachineManagementService) {
    this.refresh();
  }

  ngOnInit(): void {
  }

  get can_start(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[5]];
  }

  get can_stop(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[6]];
  }

  get can_restart(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[7]];
  }

  get can_destroy(): boolean {
    return this.authenticationService.permissions[PERMISSION_REPRESENTATIONS[9]];
  }

  refresh(): void {
    this.selectPage(this.current_page);
  }

  selectPage(page: number): void {
    const listObserver: Observer<MachinePage> = {
      next: response => {
        this.machines = response.content;
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
    this.machineManagementService.searchMachines(this.name_filter, this.from_filter, this.to_filter, this.stopped, this.running, page).subscribe(listObserver);
  }

  nextPage(): void {
    this.selectPage(this.current_page + 1);
  }

  prevPage(): void {
    this.selectPage(this.current_page - 1);
  }

  startMachine(machine: Machine): void {
    const operateObserver: Observer<void> = {
      next: () => {},
      error: err => alert(err),
      complete: () => {}
    }
    this.machineManagementService.startMachine(machine).subscribe(operateObserver);
  }

  stopMachine(machine: Machine): void {
    const operateObserver: Observer<void> = {
      next: () => {},
      error: err => alert(err),
      complete: () => {}
    }
    this.machineManagementService.stopMachine(machine).subscribe(operateObserver);
  }

  restartMachine(machine: Machine): void {
    const operateObserver: Observer<void> = {
      next: () => {},
      error: err => alert(err),
      complete: () => {}
    }
    this.machineManagementService.restartMachine(machine).subscribe(operateObserver);
  }

  confirmDestroy(machine: Machine): void {
    if(confirm("Are you sure you want to delete this machine?")) {
      this.destroyMachine(machine);
    }
  }

  destroyMachine(machine: Machine): void {
    const deleteObserver: Observer<void> = {
      next: () => {},
      error: err => alert(err),
      complete: () => {
        const index: number = this.machines.indexOf(machine, 0);
        this.machines.splice(index, 1);
      }
    }
    this.machineManagementService.destroyMachine(machine).subscribe(deleteObserver);
  }

}
