[**delphirtl**](../README.md) • **Docs**

***

[delphirtl](../globals.md) / Queue

# Class: Queue\<T\>

A first in, first out class

## Type Parameters

• **T**

## Constructors

### new Queue()

> **new Queue**\<`T`\>(): [`Queue`](Queue.md)\<`T`\>

#### Returns

[`Queue`](Queue.md)\<`T`\>

## Accessors

### length

#### Get Signature

> **get** **length**(): `number`

The number of values in the store

##### Returns

`number`

#### Defined in

[src/collections.ts:42](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L42)

## Methods

### next()

> **next**(): `undefined` \| `T`

#### Returns

`undefined` \| `T`

The first value in the store

#### Defined in

[src/collections.ts:30](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L30)

***

### pop()

> **pop**(): `undefined` \| `T`

#### Returns

`undefined` \| `T`

The first value in the store

#### Defined in

[src/collections.ts:22](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L22)

***

### push()

> **push**(`val`): `void`

#### Parameters

• **val**: `T`

Puts the given value into the class

#### Returns

`void`

#### Defined in

[src/collections.ts:14](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L14)
