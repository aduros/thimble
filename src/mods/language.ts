import { Scope, modifyGetter } from '.';

export function modifyLanguage (scope: Scope) {
  modifyGetter(scope.Navigator.prototype, 'language', ({originalValue, random}) => {
    return `${originalValue}-${random.nextWord(1)}-${random.nextWord(6)}`;
  });

  modifyGetter(scope.Navigator.prototype, 'languages', ({self, random}) => {
    // TODO(2023-11-13): Add one other random language?
    return [self.language];
  });
}
