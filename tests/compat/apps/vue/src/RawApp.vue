<script setup>
// The same page as App.vue, written with the raw evoke-* tags (the "Using the raw tags instead?" part of the README).
// Two things differ from the wrappers, and both are in the README:
//   1. Dynamic text goes inside an element: <evoke-button><span>Count: {{ n }}</span></evoke-button>.
//   2. Events are listened to with addEventListener: Vue turns @evokeChange into "evoke-change", which the
//      components do not emit. useEvent() below does that for every event this page needs.
import { ref, onMounted, onBeforeUnmount } from 'vue';

const root = ref(null);
const n = ref(0);
const name = ref('');
const role = ref('');
const roles = ref([{ label: 'Developer', value: 'dev' }, { label: 'Designer', value: 'design' }]);
const on = ref(false);
const tab = ref('o');
const fruit = ref('');
const date = ref('2025-03-15');
const volume = ref(30);
const action = ref('');
const step = ref(0);
const done = ref(false);
const modalOpen = ref(false);
const rows = ref([{ name: 'Maya' }, { name: 'Ravi' }]);
const columns = [{ key: 'name', label: 'Name' }];
const tabOptions = [{ label: 'Overview', value: 'o' }, { label: 'Specs', value: 's' }];
const fruitItems = [{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }];
const menuOptions = [{ label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'delete' }];
const steps = [{ label: 'Account' }, { label: 'Profile' }];

const listeners = [];
function useEvent(id, event, handler) {
  const el = root.value.querySelector(`#${id}`);
  el.addEventListener(event, handler);
  listeners.push(() => el.removeEventListener(event, handler));
}
onMounted(() => {
  useEvent('name', 'evokeInput', (e) => (name.value = e.detail));
  useEvent('role', 'evokeChange', (e) => (role.value = e.detail));
  useEvent('switch', 'evokeChange', (e) => (on.value = e.detail));
  useEvent('tabs', 'evokeChange', (e) => (tab.value = e.detail));
  useEvent('list', 'evokeChange', (e) => (fruit.value = e.detail));
  useEvent('date', 'evokeChange', (e) => (date.value = e.detail));
  useEvent('slider', 'evokeChange', (e) => (volume.value = e.detail));
  useEvent('menu', 'evokeSelect', (e) => (action.value = e.detail));
  useEvent('stepper', 'evokeChange', (e) => (step.value = e.detail));
  useEvent('stepper', 'evokeComplete', () => (done.value = true));
  useEvent('modal', 'evokeClose', () => (modalOpen.value = false));
});
onBeforeUnmount(() => listeners.forEach((off) => off()));
</script>

<template>
  <main ref="root">
    <h1>Vue with the raw tags</h1>

    <evoke-button id="count-btn" @click="n++"><span>Count: {{ n }}</span></evoke-button>

    <evoke-input id="name" label="Name" :value="name"></evoke-input>
    <p id="out-name">Hello, {{ name }}</p>

    <evoke-select id="role" label="Role" :options="roles"></evoke-select>
    <p id="out-role">{{ role }}</p>
    <button id="add-role" type="button" @click="roles = [...roles, { label: 'Manager', value: 'mgr' }]">Add role</button>

    <evoke-switch id="switch" label="Email alerts" :checked="on"></evoke-switch>
    <p id="out-on">{{ on ? 'on' : 'off' }}</p>

    <evoke-tabs id="tabs" label="Product" :options="tabOptions" :value="tab"><span>Panel</span></evoke-tabs>
    <p id="out-tab">{{ tab }}</p>

    <evoke-list id="list" appearance="selectable" label="Fruit" :items="fruitItems"></evoke-list>
    <p id="out-fruit">{{ fruit }}</p>

    <evoke-datepicker id="date" label="Start date" :value="date"></evoke-datepicker>
    <p id="out-date">{{ date }}</p>

    <evoke-slider id="slider" label="Volume" :value="volume"></evoke-slider>
    <p id="out-volume">{{ volume }}</p>

    <evoke-menu id="menu" label="Actions" :options="menuOptions"></evoke-menu>
    <p id="out-action">{{ action }}</p>

    <evoke-stepper id="stepper" :steps="steps" :current="step"><span>Step content</span></evoke-stepper>
    <p id="out-step">{{ step }}{{ done ? ' done' : '' }}</p>

    <evoke-table id="table" :columns="columns" :rows="rows"></evoke-table>
    <button id="add-row" type="button" @click="rows = [...rows, { name: 'Sam' }]">Add row</button>

    <button id="open-modal" type="button" @click="modalOpen = true">Open modal</button>
    <evoke-modal id="modal" heading="Confirm" :open="modalOpen"><span>Are you sure?</span></evoke-modal>
    <p id="out-modal">{{ modalOpen ? 'open' : 'closed' }}</p>
  </main>
</template>
