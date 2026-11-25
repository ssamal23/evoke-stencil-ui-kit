// The same page as the Vue and React apps (the checks in specs/framework run against all of them).
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main>
      <h1>Angular</h1>

      <evoke-button id="count-btn" (click)="n.set(n() + 1)">Count: {{ n() }}</evoke-button>

      <evoke-input id="name" label="Name" [value]="name()" (evokeInput)="name.set($event.detail)"></evoke-input>
      <p id="out-name">Hello, {{ name() }}</p>

      <evoke-select id="role" label="Role" [options]="roles()" (evokeChange)="role.set(text($event.detail))"></evoke-select>
      <p id="out-role">{{ role() }}</p>
      <button id="add-role" type="button" (click)="addRole()">Add role</button>

      <evoke-switch id="switch" label="Email alerts" [checked]="on()" (evokeChange)="on.set($event.detail)"></evoke-switch>
      <p id="out-on">{{ on() ? 'on' : 'off' }}</p>

      <evoke-tabs id="tabs" label="Product" [options]="tabOptions" [value]="tab()" (evokeChange)="tab.set($event.detail)">Panel</evoke-tabs>
      <p id="out-tab">{{ tab() }}</p>

      <evoke-list id="list" appearance="selectable" label="Fruit" [items]="fruitItems" (evokeChange)="fruit.set(text($event.detail))"></evoke-list>
      <p id="out-fruit">{{ fruit() }}</p>

      <evoke-datepicker id="date" label="Start date" [value]="date()" (evokeChange)="date.set($event.detail)"></evoke-datepicker>
      <p id="out-date">{{ date() }}</p>

      <evoke-slider id="slider" label="Volume" [value]="volume()" (evokeChange)="volume.set($event.detail)"></evoke-slider>
      <p id="out-volume">{{ volume() }}</p>

      <evoke-menu id="menu" label="Actions" [options]="menuOptions" (evokeSelect)="action.set($event.detail)"></evoke-menu>
      <p id="out-action">{{ action() }}</p>

      <evoke-stepper id="stepper" [steps]="steps" [current]="step()" (evokeChange)="step.set($event.detail)" (evokeComplete)="done.set(true)">Step content</evoke-stepper>
      <p id="out-step">{{ step() }}{{ done() ? ' done' : '' }}</p>

      <evoke-table id="table" [columns]="columns" [rows]="rows()"></evoke-table>
      <button id="add-row" type="button" (click)="addRow()">Add row</button>

      <button id="open-modal" type="button" (click)="modalOpen.set(true)">Open modal</button>
      <evoke-modal id="modal" heading="Confirm" [open]="modalOpen()" (evokeClose)="modalOpen.set(false)">Are you sure?</evoke-modal>
      <p id="out-modal">{{ modalOpen() ? 'open' : 'closed' }}</p>
    </main>
  `,
})
export class AppComponent {
  n = signal(0);
  name = signal('');
  role = signal('');
  roles = signal([{ label: 'Developer', value: 'dev' }, { label: 'Designer', value: 'design' }]);
  on = signal(false);
  tab = signal('o');
  fruit = signal('');
  date = signal('2025-03-15');
  volume = signal(30);
  action = signal('');
  step = signal(0);
  done = signal(false);
  modalOpen = signal(false);
  rows = signal([{ name: 'Maya' }, { name: 'Ravi' }]);

  tabOptions = [{ label: 'Overview', value: 'o' }, { label: 'Specs', value: 's' }];
  fruitItems = [{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }];
  menuOptions = [{ label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'delete' }];
  steps = [{ label: 'Account' }, { label: 'Profile' }];
  columns = [{ key: 'name', label: 'Name' }];

  // select and list can be multi-select, so their event value is a string or a list of strings.
  text(value: string | string[]) { return Array.isArray(value) ? value.join(',') : value; }

  addRole() { this.roles.update((r) => [...r, { label: 'Manager', value: 'mgr' }]); }
  addRow() { this.rows.update((r) => [...r, { name: 'Sam' }]); }
}
