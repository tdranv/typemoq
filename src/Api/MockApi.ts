import * as common from "../Common/_all";
import { MockBehavior } from "./MockBehavior";
import { IMock } from "./IMock";
import { StaticMock } from "../StaticMock";
import { DynamicMock } from "../DynamicMock";

export class MockApi {
    static ofInstance = <U>(
        targetInstance: U,
        behavior = MockBehavior.Loose,
        shouldOverrideTarget = true
    ): IMock<U> => StaticMock.ofInstance(
            targetInstance,
            behavior,
            shouldOverrideTarget
        )

    static ofType = <U extends object>(
        targetConstructor?: common.ConstructorWithArgs<U>,
        behavior = MockBehavior.Loose,
        shouldOverrideTarget = true,
        ...targetConstructorArgs: any[]
    ): IMock<U> =>
        targetConstructor
            ? StaticMock.ofType(
                targetConstructor,
                behavior,
                shouldOverrideTarget,
                targetConstructorArgs
            )
            : DynamicMock.ofType<U>(undefined, behavior, shouldOverrideTarget);
}
