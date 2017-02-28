import * as T from './../src/index';

export function run(tick: T.MainEntryPoint_Timer): T.MainEntryPoint_Timer_Sync {
    return (context: T.TimerContext, timer: T.Timer) => {
        tick(context, timer)
            .then(() => { })
            .catch(err => console.error(err));
    };

}

