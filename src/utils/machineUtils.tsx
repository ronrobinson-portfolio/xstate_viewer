import type { AnyMachineSnapshot } from 'xstate';

/*
 * From Docs: The state.nextEvents property is removed, since it is not a completely safe/reliable way of
 * determining the next events that can be sent to the actor. If you want to get the next events
 * according to the previous behavior, you can use this helper function.
 *
 * https://stately.ai/docs/migration#statenextevents-has-been-removed
 */
export function getNextEvents(snapshot: AnyMachineSnapshot | undefined | null) {
  return snapshot
    ? [...new Set([...snapshot._nodes.flatMap((sn) => sn.ownEvents)])]
    : [];
}
