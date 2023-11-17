import { Scope, modifyGetter } from ".";

export function modifyDoNotTrack (scope: Scope) {
  modifyGetter(scope.Navigator.prototype, 'doNotTrack', ({ random }) => {
    // TODO(2023-11-17): Include '0' setting?
    return random.nextChoice([null, '1']);
  });
}
