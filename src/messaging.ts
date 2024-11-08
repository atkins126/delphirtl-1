/*
* A simple messaging system by Chee Wee Chua, Jul 2022
* See examples in ./examples
*
*/

const SMethodNotImplemented = "Method not implemented.";
const SFunction = 'function';

/**
 * Description placeholder
 *
 * @interface IMessageName
 * @typedef {IMessageName}
 * @category Messaging
 */
interface IMessageName {
    getName(): string
}

/**
 * Description placeholder
 *
 * @interface IMessage
 * @typedef {IMessage}
 * @template T
 * @extends {IMessageName}
 * @category Messaging
 */
interface IMessage<T> extends IMessageName {
    readonly value: T
}

/**
 * Description placeholder
 *
 * @interface IMessageConstructor
 * @typedef {IMessageConstructor}
 * @template T
 * @category Messaging
 */
interface IMessageConstructor<T> {
    new(aValue: T): IMessage<T>
}

/**
 * Description placeholder
 *
 * @abstract
 * @class TMessageBase
 * @typedef {TMessageBase}
 * @template T
 * @implements {IMessage<T>}
 * @implements {IMessageName}
 * @category Messaging
 */
abstract class TMessageBase<T> implements IMessage<T>, IMessageName {
    public readonly value: T;
    constructor(aValue: T) { this.value = aValue }
    getName(): string {
        return typeof this.value;
    }
}

/**
 * Description placeholder
 *
 * @class TMessage
 * @typedef {TMessage}
 * @template T
 * @extends {TMessageBase<T>}
 * @category Messaging
 */
class TMessage<T> extends TMessageBase<T> {
}

/**
 * Description placeholder
 *
 * @interface ICallback
 * @typedef {ICallback}
 * @template T
 * @category Messaging
 */
interface ICallback<T> {
    (aMessage: TMessage<T>): void;
}

/**
 * Description placeholder
 *
 * @class TCallback
 * @typedef {TCallback}
 * @template T
 * @implements {IMessageName}
 * @category Messaging
 */
class TCallback<T> implements IMessageName {
    getName(): string {
        throw new Error(SMethodNotImplemented);
    }
    fCallback: ICallback<T>;
    constructor(aCallback: ICallback<T>) {
        this.fCallback = aCallback;
    }
}

type SubscriptionIdentifierType = Function | string
type SubscriptionIndex = number
export type MessageType = Date | boolean | number | string | {}

/**
 * Description placeholder
 *
 * @class TMessageManager
 * @typedef {TMessageManager}
 * @category Messaging
 */
class TMessageManager {
    private fListeners: Map<any, Array<any>> = new Map();
    private fDisabledTypes: string[] = [];
    private static fDefaultManager: TMessageManager;

    constructor() {
        this.reset();
    }

    reset() {
        // Enums works similarly to number during runtime, so, disable Number as a native type from working
        this.fDisabledTypes = []
        this.fDisabledTypes.push(Number.name);
        this.fListeners = new Map();
    }

    public disableType(aType: SubscriptionIdentifierType) {
        const lTypeName = (typeof aType === 'function') ? (aType.name) : aType;
        this.fDisabledTypes.push(lTypeName)
    }

    public enableType(aType: SubscriptionIdentifierType) {
        let lIndex = -1;
        const lTypeName = (typeof aType === 'function') ? (aType.name) : aType;
        for (let i = 0; i < this.fDisabledTypes.length; i++) {
            if (lTypeName === this.fDisabledTypes[i]) {
                lIndex = i; break;
            }
        }
        if (lIndex != -1) {
            this.fDisabledTypes.splice(lIndex, 1)
        }
    }

    ensureTypeEnabled(aSuffix: string) {
        for (const lType of this.fDisabledTypes) {
            if (aSuffix === lType) {
                throw new Error(`${aSuffix} not enabled`);
            }
        }
    }

    public typesDisabled(): string[] {
        return this.fDisabledTypes
    }

    public static getDefaultManager(): TMessageManager {
        if (!TMessageManager.fDefaultManager) {
            this.fDefaultManager = new TMessageManager()
        }
        return this.fDefaultManager;
    }


    /**
     * Description placeholder
     *
     * @template {MessageType} T
     * @param {SubscriptionIdentifierType} aClass
     * @param {T} aMessage
     * @category Messaging
     */
    sendMessage<T extends MessageType>(aClass: SubscriptionIdentifierType, aMessage: T) {
        const lClassName = (typeof aClass === 'function') ? (aClass.name) : aClass;
        const lMessageClassName = `${lClassName.toUpperCase()}`
        const lListenerList = this.fListeners.get(lMessageClassName);
        if (lListenerList !== undefined) {
            for (const lListener of lListenerList) {
                try {
                    lListener(aMessage);
                } catch (e) {
                    // keep going
                }
            }
        }
    }

    /**
     * Description placeholder
     *
     * @template {MessageType} T
     * @param {SubscriptionIdentifierType} aClass
     * @param {(aMessage: T) => void} aMessageListener
     * @returns {SubscriptionIndex}
     * @category Messaging
     */
    subscribeToMessage<T extends MessageType>(aClass: SubscriptionIdentifierType, aMessageListener: (aMessage: T) => void): SubscriptionIndex {
        const lSuffix = (typeof aClass === 'function') ? (aClass.name) : aClass;
        this.ensureTypeEnabled(lSuffix);
        const lMessageClassName = `${lSuffix.toUpperCase()}`;       // TMessage<Number>, TMessage<String>, TMessage<Date>
        let lListenerList = this.fListeners.get(lMessageClassName); // name is erased, so aMessageClass is always TMessage
        if (!lListenerList) {
            lListenerList = new Array();
            this.fListeners.set(lMessageClassName, lListenerList);
        }
        const index = lListenerList.push(aMessageListener) - 1;
        return index;
    }

    public unsubscribe(aClass: SubscriptionIdentifierType, aSubscriptionIndex: SubscriptionIndex) {
        const lClassName = (typeof aClass === 'function') ? (aClass.name) : aClass;
        const lMessageClassName = `${lClassName.toUpperCase()}`
        const lListenerList = this.fListeners.get(lMessageClassName);
        if (lListenerList != undefined) {
            lListenerList.splice(aSubscriptionIndex, 1)
            if (lListenerList.length === 0) {
                this.fListeners.delete(lMessageClassName);
            }
        }
    }

    sendWrappedMessage<T extends MessageType>(aClass: SubscriptionIdentifierType, aMessage: TMessage<T>) {
        const lClassName = (typeof aMessage.value) != "object" ? (typeof aMessage.value).toUpperCase() : (aMessage.value as unknown as object).constructor.name.toUpperCase();
        const lMessageClassName = `${aMessage.constructor.name}<${lClassName}>`
        const lListenerList = this.fListeners.get(lMessageClassName);
        if (lListenerList !== undefined) {
            for (const lListener of lListenerList) {
                try {
                    lListener(aMessage);
                } catch (e) {
                    // keep going
                }
            }
        }
    }

    // wrapped message
    subscribeToWrappedMessage<T extends MessageType>(aClass: SubscriptionIdentifierType, aMessageListener: (aMessage: TMessage<T>) => void): SubscriptionIndex {
        const lSuffix = (typeof aClass === 'function') ? (aClass.name) : aClass;
        this.ensureTypeEnabled(lSuffix);
        const lMessageClassName = `${TMessage.name}<${lSuffix.toUpperCase()}>`; // TMessage<NUMBER>, TMessage<STRING>, TMessage<DATE>
        let lListenerList = this.fListeners.get(lMessageClassName); // name is erased, so aMessageClass is always TMessage
        if (!lListenerList) {
            lListenerList = new Array();
            this.fListeners.set(lMessageClassName, lListenerList);
        }
        const index = lListenerList.push(aMessageListener) - 1;
        return index;
    }

    unsubscribeWrappedMessage(aClass: SubscriptionIdentifierType, aSubscriptionIndex: SubscriptionIndex) {
        const lSuffix = (typeof aClass === 'function') ? (aClass.name) : aClass;
        const lMessageClassName = `${TMessage.name}<${lSuffix.toUpperCase()}>`; // TMessage<NUMBER>, TMessage<STRING>, TMessage<DATE> 
        let lListenerList = this.fListeners.get(lMessageClassName);
        if (lListenerList !== undefined) {
            lListenerList.splice(aSubscriptionIndex, 1)
            if (lListenerList.length === 0) {
                this.fListeners.delete(lMessageClassName);
            }
        }
    }
}

export {
    SubscriptionIndex, SubscriptionIdentifierType,
    TMessage,
    TMessageManager,
    SMethodNotImplemented, SFunction
}