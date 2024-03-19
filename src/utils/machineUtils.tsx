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

// TODO: optimize
export function getNextEventsWithMeta(
  snapshot: AnyMachineSnapshot | undefined | null,
) {
  const mergeParsedObjects = (inputObj: any) => {
    // The object that will accumulate all merged JSON objects
    const mergedObject = {};

    // Iterate through each key-value pair in the input object
    Object.entries(inputObj).forEach(([key, value]) => {
      // Check if the value starts with 'p:'
      if (typeof value === 'string' && value.startsWith('p:')) {
        try {
          // Parse the JSON string after removing the leading 'p:'
          const parsedJson = JSON.parse(value.slice(2));

          // Merge the parsed JSON into the accumulated object
          Object.assign(mergedObject, parsedJson);
        } catch (error) {
          console.error(`Error parsing JSON for key: ${key}`, error);
        }
      }
    });

    return mergedObject;
  };

  // Get params from meta
  const eventParams: any = mergeParsedObjects(snapshot?.getMeta() ?? {});

  // Get next events
  const events = snapshot
    ? [...new Set([...snapshot._nodes.flatMap((sn) => sn.ownEvents)])]
    : [];

  // Merge event with params
  const resultObject: any = {};

  events.forEach((key) => {
    // Check if the key exists in the valuesObject
    if (key in eventParams) {
      // If the key exists, use its value from the valuesObject
      resultObject[key] = eventParams[key];
    } else {
      // If the key does not exist, initialize with an empty array
      resultObject[key] = [];
    }
  });

  return resultObject;
}
