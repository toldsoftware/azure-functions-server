import * as T from '../src/types';

// https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer
// {second} {minute} {hour} {day} {month} {day of the week}
// schedule: 0 0 0 * * *
export async function tick(context: T.TimerContext, timer: T.Timer) {
    let timeStamp = new Date().toISOString();

    if (timer.isPastDue) {
        console.log('Timer is Past Due');
    }
    context.log('Timer ran!', timeStamp);
    context.done();
}