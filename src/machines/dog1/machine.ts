import { createMachine } from 'xstate';
export const machine = createMachine({
    "id": "dog",
    "description": "Only states. There’s no transitions which means the awake state cannot be reached.",
    "initial": "asleep",
    "states": {
        "asleep": {
            "description": "![sleeping puppy](https://raw.githubusercontent.com/statelyai/assets/main/example-images/dogs/asleep.svg)"
        },
        "awake": {
            "description": "![happy awake puppy](https://raw.githubusercontent.com/statelyai/assets/main/example-images/dogs/walking.svg)"
        }
    },
    "types": {}
}, {
    actions:   {},
    actors:   {},
    guards:   {},
    delays:   {},
})