// React 19: custom elements are supported natively. Object and array props are set as properties, and an event
// handler named onXxx listens for the event "Xxx" with its capitals kept, so onevokeChange listens for "evokeChange".
// This is the same page as ../../react18/src/App.jsx and ../../vue (the checks in specs/react run against all of them).
import { useState } from 'react';

const tabOptions = [{ label: 'Overview', value: 'o' }, { label: 'Specs', value: 's' }];
const fruitItems = [{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }];
const menuOptions = [{ label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'delete' }];
const steps = [{ label: 'Account' }, { label: 'Profile' }];
const columns = [{ key: 'name', label: 'Name' }];

export default function App() {
  const [n, setN] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([{ label: 'Developer', value: 'dev' }, { label: 'Designer', value: 'design' }]);
  const [on, setOn] = useState(false);
  const [tab, setTab] = useState('o');
  const [fruit, setFruit] = useState('');
  const [date, setDate] = useState('2025-03-15');
  const [volume, setVolume] = useState(30);
  const [action, setAction] = useState('');
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([{ name: 'Maya' }, { name: 'Ravi' }]);

  return (
    <main>
      <h1>React 19</h1>

      <evoke-button id="count-btn" onClick={() => setN((v) => v + 1)}>Count: {n}</evoke-button>

      <evoke-input id="name" label="Name" value={name} onevokeInput={(e) => setName(e.detail)}></evoke-input>
      <p id="out-name">Hello, {name}</p>

      <evoke-select id="role" label="Role" options={roles} onevokeChange={(e) => setRole(e.detail)}></evoke-select>
      <p id="out-role">{role}</p>
      <button id="add-role" type="button" onClick={() => setRoles([...roles, { label: 'Manager', value: 'mgr' }])}>Add role</button>

      <evoke-switch id="switch" label="Email alerts" checked={on} onevokeChange={(e) => setOn(e.detail)}></evoke-switch>
      <p id="out-on">{on ? 'on' : 'off'}</p>

      <evoke-tabs id="tabs" label="Product" options={tabOptions} value={tab} onevokeChange={(e) => setTab(e.detail)}>Panel</evoke-tabs>
      <p id="out-tab">{tab}</p>

      <evoke-list id="list" appearance="selectable" label="Fruit" items={fruitItems} onevokeChange={(e) => setFruit(e.detail)}></evoke-list>
      <p id="out-fruit">{fruit}</p>

      <evoke-datepicker id="date" label="Start date" value={date} onevokeChange={(e) => setDate(e.detail)}></evoke-datepicker>
      <p id="out-date">{date}</p>

      <evoke-slider id="slider" label="Volume" value={volume} onevokeChange={(e) => setVolume(e.detail)}></evoke-slider>
      <p id="out-volume">{volume}</p>

      <evoke-menu id="menu" label="Actions" options={menuOptions} onevokeSelect={(e) => setAction(e.detail)}></evoke-menu>
      <p id="out-action">{action}</p>

      <evoke-stepper id="stepper" steps={steps} current={step} onevokeChange={(e) => setStep(e.detail)} onevokeComplete={() => setDone(true)}>Step content</evoke-stepper>
      <p id="out-step">{step}{done ? ' done' : ''}</p>

      <evoke-table id="table" columns={columns} rows={rows}></evoke-table>
      <button id="add-row" type="button" onClick={() => setRows([...rows, { name: 'Sam' }])}>Add row</button>

      <button id="open-modal" type="button" onClick={() => setModalOpen(true)}>Open modal</button>
      <evoke-modal id="modal" heading="Confirm" open={modalOpen} onevokeClose={() => setModalOpen(false)}>Are you sure?</evoke-modal>
      <p id="out-modal">{modalOpen ? 'open' : 'closed'}</p>
    </main>
  );
}
