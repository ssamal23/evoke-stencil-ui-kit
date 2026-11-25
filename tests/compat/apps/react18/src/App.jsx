// React 18: custom elements only get string attributes, so object and array props are set as properties and
// events are listened to with addEventListener, both from a ref. The Evoke helper below does that, which is what the
// README tells React 18 users to do. It is the same page as ../../react/src/App.jsx (the checks in specs/react run on both).
import { useEffect, useRef, useState } from 'react';

/** Renders <tag> and sets props as properties and `events` as listeners, from a ref. */
function Evoke({ tag: Tag, props = {}, events = {}, children, ...attrs }) {
  const ref = useRef(null);
  // Properties are set after every render; they only change the element when the value really changed.
  useEffect(() => {
    for (const [key, value] of Object.entries(props)) if (ref.current[key] !== value) ref.current[key] = value;
  });
  const latest = useRef(events);
  latest.current = events;
  useEffect(() => {
    const el = ref.current;
    const offs = Object.keys(events).map((name) => {
      const handler = (e) => latest.current[name]?.(e);
      el.addEventListener(name, handler);
      return () => el.removeEventListener(name, handler);
    });
    return () => offs.forEach((off) => off());
  }, []);
  return <Tag ref={ref} {...attrs}>{children}</Tag>;
}

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
      <h1>React 18</h1>

      <evoke-button id="count-btn" onClick={() => setN((v) => v + 1)}>Count: {n}</evoke-button>

      <Evoke tag="evoke-input" id="name" label="Name" props={{ value: name }} events={{ evokeInput: (e) => setName(e.detail) }} />
      <p id="out-name">Hello, {name}</p>

      <Evoke tag="evoke-select" id="role" label="Role" props={{ options: roles }} events={{ evokeChange: (e) => setRole(e.detail) }} />
      <p id="out-role">{role}</p>
      <button id="add-role" type="button" onClick={() => setRoles([...roles, { label: 'Manager', value: 'mgr' }])}>Add role</button>

      <Evoke tag="evoke-switch" id="switch" label="Email alerts" props={{ checked: on }} events={{ evokeChange: (e) => setOn(e.detail) }} />
      <p id="out-on">{on ? 'on' : 'off'}</p>

      <Evoke tag="evoke-tabs" id="tabs" label="Product" props={{ options: tabOptions, value: tab }} events={{ evokeChange: (e) => setTab(e.detail) }}>Panel</Evoke>
      <p id="out-tab">{tab}</p>

      <Evoke tag="evoke-list" id="list" appearance="selectable" label="Fruit" props={{ items: fruitItems }} events={{ evokeChange: (e) => setFruit(e.detail) }} />
      <p id="out-fruit">{fruit}</p>

      <Evoke tag="evoke-datepicker" id="date" label="Start date" props={{ value: date }} events={{ evokeChange: (e) => setDate(e.detail) }} />
      <p id="out-date">{date}</p>

      <Evoke tag="evoke-slider" id="slider" label="Volume" props={{ value: volume }} events={{ evokeChange: (e) => setVolume(e.detail) }} />
      <p id="out-volume">{volume}</p>

      <Evoke tag="evoke-menu" id="menu" label="Actions" props={{ options: menuOptions }} events={{ evokeSelect: (e) => setAction(e.detail) }} />
      <p id="out-action">{action}</p>

      <Evoke tag="evoke-stepper" id="stepper" props={{ steps, current: step }} events={{ evokeChange: (e) => setStep(e.detail), evokeComplete: () => setDone(true) }}>Step content</Evoke>
      <p id="out-step">{step}{done ? ' done' : ''}</p>

      <Evoke tag="evoke-table" id="table" props={{ columns, rows }} />
      <button id="add-row" type="button" onClick={() => setRows([...rows, { name: 'Sam' }])}>Add row</button>

      <button id="open-modal" type="button" onClick={() => setModalOpen(true)}>Open modal</button>
      <Evoke tag="evoke-modal" id="modal" heading="Confirm" props={{ open: modalOpen }} events={{ evokeClose: () => setModalOpen(false) }}>Are you sure?</Evoke>
      <p id="out-modal">{modalOpen ? 'open' : 'closed'}</p>
    </main>
  );
}
