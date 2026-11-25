<script setup>
// The same page as RawApp.vue, written the way the README recommends: the Vue wrappers.
import { ref } from 'vue';
import {
  EvokeButton, EvokeInput, EvokeSelect, EvokeSwitch, EvokeTabs, EvokeList, EvokeTable,
  EvokeModal, EvokeDatepicker, EvokeSlider, EvokeMenu, EvokeStepper,
} from '@evoke-tech/stencil-ui-kit/vue';

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
</script>

<template>
  <main>
    <h1>Vue with the wrappers</h1>

    <EvokeButton id="count-btn" @click="n++">Count: {{ n }}</EvokeButton>

    <EvokeInput id="name" label="Name" :value="name" @evoke-input="(e) => (name = e.detail)" />
    <p id="out-name">Hello, {{ name }}</p>

    <EvokeSelect id="role" label="Role" :options="roles" @evoke-change="(e) => (role = e.detail)" />
    <p id="out-role">{{ role }}</p>
    <button id="add-role" type="button" @click="roles = [...roles, { label: 'Manager', value: 'mgr' }]">Add role</button>

    <EvokeSwitch id="switch" label="Email alerts" :checked="on" @evoke-change="(e) => (on = e.detail)" />
    <p id="out-on">{{ on ? 'on' : 'off' }}</p>

    <EvokeTabs id="tabs" label="Product" :options="[{ label: 'Overview', value: 'o' }, { label: 'Specs', value: 's' }]" :value="tab" @evoke-change="(e) => (tab = e.detail)">Panel</EvokeTabs>
    <p id="out-tab">{{ tab }}</p>

    <EvokeList id="list" appearance="selectable" label="Fruit" :items="[{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }]" @evoke-change="(e) => (fruit = e.detail)" />
    <p id="out-fruit">{{ fruit }}</p>

    <EvokeDatepicker id="date" label="Start date" :value="date" @evoke-change="(e) => (date = e.detail)" />
    <p id="out-date">{{ date }}</p>

    <EvokeSlider id="slider" label="Volume" :value="volume" @evoke-change="(e) => (volume = e.detail)" />
    <p id="out-volume">{{ volume }}</p>

    <EvokeMenu id="menu" label="Actions" :options="[{ label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'delete' }]" @evoke-select="(e) => (action = e.detail)" />
    <p id="out-action">{{ action }}</p>

    <EvokeStepper id="stepper" :steps="[{ label: 'Account' }, { label: 'Profile' }]" :current="step" @evoke-change="(e) => (step = e.detail)" @evoke-complete="done = true">Step content</EvokeStepper>
    <p id="out-step">{{ step }}{{ done ? ' done' : '' }}</p>

    <EvokeTable id="table" :columns="columns" :rows="rows" />
    <button id="add-row" type="button" @click="rows = [...rows, { name: 'Sam' }]">Add row</button>

    <button id="open-modal" type="button" @click="modalOpen = true">Open modal</button>
    <EvokeModal id="modal" heading="Confirm" :open="modalOpen" @evoke-close="modalOpen = false">Are you sure?</EvokeModal>
    <p id="out-modal">{{ modalOpen ? 'open' : 'closed' }}</p>
  </main>
</template>
