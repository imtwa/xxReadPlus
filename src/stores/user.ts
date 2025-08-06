import { defineStore } from 'pinia';

export const useUser = defineStore('user', {
    state() {
        return {
            title: 'Pinia Store',
        };
    },
    getters: {},
    actions: {
        setTitle(title: string) {
            this.title = title;
        },
    }
});
