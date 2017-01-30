import { Platform } from '@told/platform/lib/src';

let http = Platform.http();

async function GetJsonData(url: string) {
    try {
        let r = await http.request<{ value: boolean }>(url);
        if (r.data.value === true) {
            document.body.appendChild(document.createTextNode('Json Request SUCCESS url=' + url));
        } else {
            document.body.appendChild(document.createTextNode('Json Request FAILED url=' + url));
        }
    } catch (err) {
        document.body.appendChild(document.createTextNode('Json Request ERROR url=' + url + ' err=' + err));
    }
}

function setup() {
    (async () => {
        await GetJsonData('./data/data.json');
        await GetJsonData('./data/data.json.txt');
        await GetJsonData('./data/example-data.json');
        await GetJsonData('./data2/data.json');
        await GetJsonData('./data2/data.json.txt');
        await GetJsonData('./data2/example-data.json');
    })().then();
}

setup();