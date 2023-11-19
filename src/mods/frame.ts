import { Scope, Modifier, install } from "../install";

export function modifyFrame ({scope, modifyGetter}: Modifier) {
  for (const elementType of [ scope.HTMLIFrameElement, scope.HTMLFrameElement ]) {
    modifyGetter(elementType.prototype, 'contentWindow', ({originalValue}) => {
      // console.log('Getting contentWindow');
      if (originalValue) {
        install(originalValue as Scope);
      } else {
        console.log('ABORT contentWindow because it is null');
      }
      return originalValue;
    });

    modifyGetter(elementType.prototype, 'contentDocument', ({originalValue}) => {
      // console.log('Getting contentDocument');
      if (originalValue && originalValue.defaultView) {
        install(originalValue.defaultView);
      } else {
        console.log('ABORT contentDocument because it is null');
      }
      return originalValue;
    });
  }

  // TODO(2023-11-18): Handle scope.frames getter and scope.window array
}

