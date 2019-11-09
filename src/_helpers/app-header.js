import { jsonHeader } from './json-header';

export function appHeader() {
    return { 'applicationname': 'pls-self-service-frontend', ...jsonHeader() };
}