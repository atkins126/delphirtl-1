[**delphirtl**](../README.md) • **Docs**

***

[delphirtl](../globals.md) / Stack

# Class: Stack\<T\>

A last in, first out class

 Stack

## Type Parameters

• **T**

## Constructors

### new Stack()

> **new Stack**\<`T`\>(): [`Stack`](Stack.md)\<`T`\>

#### Returns

[`Stack`](Stack.md)\<`T`\>

## Accessors

### length

#### Get Signature

> **get** **length**(): `number`

The number of items in the store

##### Returns

`number`

#### Defined in

[src/collections.ts:83](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L83)

## Methods

### pop()

> **pop**(): `undefined` \| `T`

#### Returns

`undefined` \| `T`

The last value that was pushed into the store

#### Defined in

[src/collections.ts:71](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L71)

***

### push()

> **push**(`v`): `void`

#### Parameters

• **v**: `T`

Puts the given value into the store

#### Returns

`void`

#### Defined in

[src/collections.ts:63](https://github.com/chuacw/delphirtl/blob/90bd0c730c5c81cc0765c7e7f88c8237ad1647eb/src/collections.ts#L63)
