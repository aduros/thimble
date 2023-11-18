import { Scope, modifyAll, modifyGetter } from ".";

export function modifyFrame (scope: Scope) {
  for (const elementType of [ scope.HTMLIFrameElement, scope.HTMLFrameElement ]) {
    modifyGetter(elementType.prototype, 'contentWindow', ({originalValue}) => {
      // console.log('Getting contentWindow');
      if (originalValue) {
        modifyAll(originalValue as Scope);
      } else {
        console.log('ABORT contentWindow because it is null');
      }
      return originalValue;
    });

    modifyGetter(elementType.prototype, 'contentDocument', ({originalValue}) => {
      // console.log('Getting contentDocument');
      if (originalValue && originalValue.defaultView) {
        modifyAll(originalValue.defaultView);
      } else {
        console.log('ABORT contentDocument because it is null');
      }
      return originalValue;
    });
  }

  // TODO(2023-11-18): Handle scope.frames getter and scope.window array
}

