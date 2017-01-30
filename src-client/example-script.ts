import { Platform } from '@told/platform/lib/src';

let http = Platform.http();

function setup() {
    (async () => {
        let r = await http.request<{ value: boolean }>('./data/data.json');
        if (r.data.value === true) {
            document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
        } else {
            document.body.appendChild(document.createTextNode('Json Request FAILED'));
        }

        r = await http.request<{ value: boolean }>('./data/data.json.txt');
        if (r.data.value === true) {
            document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
        } else {
            document.body.appendChild(document.createTextNode('Json Request FAILED'));
        }

        r = await http.request<{ value: boolean }>('./data/example-data.json');
        if (r.data.value === true) {
            document.body.appendChild(document.createTextNode('Json Request SUCCESS'));
        } else {
            document.body.appendChild(document.createTextNode('Json Request FAILED'));
        }
    })().then();
}

setup();