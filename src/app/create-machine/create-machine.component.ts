import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MachineManagementService} from "../services/machine-management.service";
import {Observer} from "rxjs";
import {Machine, MachineCreateRequest} from "../model/machine-model";

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css']
})
export class CreateMachineComponent implements OnInit {

  formGroup: FormGroup;
  created: boolean;
  machineName: string;

  constructor(private formBuilder: FormBuilder,
              private machineManagementService: MachineManagementService) {
    this.formGroup = new FormGroup({});
    this.created = false;
    this.machineName = "";
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name_input: ['', Validators.required],
    });
  }

  get name(): string {
    return this.formGroup.get('name_input')?.value;
  }

  createMachine(): void {
    this.created = false;
    if(!this.formGroup.valid) {
      alert('Please fill in the fields correctly.');
      return;
    }
    const machine: MachineCreateRequest = {
      name: this.name
    }
    const createObserver: Observer<Machine> = {
      next: response => {
        console.log(response);
        this.created = true;
        this.machineName = machine.name;
      },
      error: err => alert(err),
      complete: () => {
      }
    }
    this.machineManagementService.createMachine(machine).subscribe(createObserver);
  }
}
