/*
 * Copyright (c) 2017 MolQL contributors. licensed under MIT, See LICENSE file for more info.
 */


/**
 * The purpose of the type system is to provide annotations for symbol table to
 * be able to more easily generate documentation.
 */

type Type =
    | Type.Value
    | Type.Primitive.Regex
    | Type.Primitive.List
    | Type.Primitive.Map
    | Type.Primitive.Set
    | Type.Structure.ElementSymbol
    | Type.Structure.AtomSet
    | Type.Structure.AtomSetSeq
    | Type.Function
    | Type.Tuple
    | Type.ZeroOrMore
    | Type.OneOrMore
    | Type.Optional
    | Type.ListOf

namespace Type {
    interface Base { prefix?: string }

    export interface Value extends Base { kind: 'value' }
    export const value: Value = { kind: 'value' };

    export namespace Primitive {
        export interface Regex extends Base { kind: 'regex' }
        export interface List extends Base { kind: 'list' }
        export interface Set extends Base { kind: 'set' }
        export interface Map extends Base { kind: 'map' }

        export const regex: Regex = { kind: 'regex' };
        export const list: List = { kind: 'list' };
        export const map: Map = { kind: 'map' };
        export const set: Set = { kind: 'set' };
    }

    export namespace Structure {
        export interface ElementSymbol extends Base { kind: 'element-symbol' }
        export interface AtomSet extends Base { kind: 'atom-set' }
        export interface AtomSetSeq extends Base { kind: 'atom-set-seq' }

        export const elementSymbol: ElementSymbol = { kind: 'element-symbol' };
        export const atomSet: AtomSet = { kind: 'atom-set' };
        export const atomSetSeq: AtomSetSeq = { kind: 'atom-set-seq' };
    }

    export interface Function { kind: 'function', args: Type, result: Type }
    export interface Optional { kind: 'optional', type: Type }
    export interface Tuple { kind: 'tuple', types: Type[] }
    export interface OneOrMore { kind: 'one-or-more', type: Type }
    export interface ZeroOrMore { kind: 'zero-or-more', type: Type }
    export interface ListOf { kind: 'list-of', type: Type }

    export function fn(args: Type, result: Type): Function { return { kind: 'function', args, result }; }
    export function optional(type: Type): Optional { return { kind: 'optional', type }; }
    export function zeroOrMore(type: Type): ZeroOrMore { return { kind: 'zero-or-more', type }; }
    export function oneOrMore(type: Type): OneOrMore { return { kind: 'one-or-more', type }; }
    export function tuple(...types: Type[]): Tuple { return { kind: 'tuple', types }; }
    export function listOf(type: Type): ListOf { return { kind: 'list-of', type }; }

    export function format(type: Type): string {
        switch (type.kind) {
            case 'optional': return `?${format(type.type)}`;
            case 'zero-or-more': return `${format(type.type)}*`;
            case 'one-or-more': return `${format(type.type)}+`;
            case 'list-of': return `list-of<${format(type.type)}>`;
            case 'tuple': return `(${type.types.map(t => format(t)).join(' ')})`;
            case 'function': return `${format(type.args)}->${format(type.result)}`;
            default: return type.prefix ? `${type.prefix}.${type.kind}` : type.kind;
        }
    }
}

export default Type