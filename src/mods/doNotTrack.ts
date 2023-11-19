import { Modifier } from "../install";

export function modifyDoNotTrack ({ scope, modifyGetter }: Modifier) {
  modifyGetter(scope.Navigator.prototype, 'doNotTrack', ({ random }) => {
    // TODO(2023-11-17): Include '0' setting?
    return random.nextChoice([null, '1']);
  });
}
