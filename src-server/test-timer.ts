import * as T from './../src';

export function run(main: T.MainEntryPoint_Timer, port = 9876) {
    console.log('Timer Started at http://localhost:' + port);

    let context: T.TimerContext = {
        log: (m, ...args) => console.log(m, ...args),
        done: () => {
            console.log('END Timer');
        }
    };

    main(context, { isPastDue: false })
        .then(() => { })
        .catch(err => console.error(err));

    // // Wait for cancel
    // http.createServer(function (req: any, res: any) {
    // }).listen(port);

}

