import { jsonHeader } from './json-header';

export function appHeader() {
    return { 'applicationname': 'pls-self-service-frontend', ...jsonHeader(), ...corsHeader() };
}

export function corsHeader() {
    return { 'Access-Control-Allow-Origin': '*' };
}