import { Scope, modifyGetter } from ".";

declare global {
  interface BatteryManager {
    charging: boolean,
    chargingTime: number,
    dischargingTime: number,
    level: number,
  }

  interface Navigator {
    getBattery?(): Promise<BatteryManager>
  }

  var BatteryManager: {
    prototype: BatteryManager
  } | undefined;
}

export function modifyBattery (scope: Scope) {
  if (scope.BatteryManager) {
    modifyGetter(scope.BatteryManager.prototype, 'charging', () => true);
    modifyGetter(scope.BatteryManager.prototype, 'chargingTime', () => 0);
    modifyGetter(scope.BatteryManager.prototype, 'dischargingTime', () => Infinity);
    modifyGetter(scope.BatteryManager.prototype, 'level', () => 1);
  }
}
