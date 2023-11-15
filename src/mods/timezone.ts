import { Scope } from ".";

export function modifyTimezone (scope: Scope) {
  // // TODO(2023-11-11): Fix pass through timezone
  // addPatch(scope.Intl.DateTimeFormat.prototype, 'resolvedOptions', (resolvedOptions) => {
  //   return function (this: Intl.DateTimeFormat, ...args) {
  //     const opts = resolvedOptions.call(this, ...args);
  //     opts.timeZone = '';
  //     delete opts.timeZoneName;
  //     return opts;
  //   }
  // });
}
