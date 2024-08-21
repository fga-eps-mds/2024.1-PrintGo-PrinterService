import { nthIndexOf, getLocalizacaoQuery } from "../../src/utils/utils";

describe('nthIndexOf', () => {
    it('should return the index of the 1st occurrence of the pattern', () => {
        const result = nthIndexOf('hello world', 'o', 1);
        expect(result).toBe(4);
    });

    it('should return the index of the 2nd occurrence of the pattern', () => {
        const result = nthIndexOf('hello world', 'o', 2);
        expect(result).toBe(7);
    });

    it('should return -1 if the pattern is not found', () => {
        const result = nthIndexOf('hello world', 'x', 1);
        expect(result).toBe(-1);  // 'x' is not found in the string
    });

    it('should return -1 if n is greater than the number of occurrences', () => {
        const result = nthIndexOf('hello world', 'o', 3);
        expect(result).toBe(-1);
    });

    it('should return the index of the nth occurrence even with repeated patterns', () => {
        const result = nthIndexOf('banana', 'a', 2);
        expect(result).toBe(3);
    });

    it('should return -1 if the string is empty', () => {
        const result = nthIndexOf('', 'a', 1);
        expect(result).toBe(-1);
    });

    it('should return -1 if n is zero', () => {
        const result = nthIndexOf('hello', 'o', 0);
        expect(result).toBe(-1);
    });

    it('should return -1 if n is negative', () => {
        const result = nthIndexOf('hello', 'o', -1);
        expect(result).toBe(-1);
    });
});

describe('getLocalizacaoQuery', () => {
    it('should return undefined if cidadeTodas is true', () => {
        const result = getLocalizacaoQuery('123456;789012;345678', true, false, false);
        expect(result).toBeUndefined();
    });

    it('should return the substring up to and including the first semicolon if regionalTodas is true', () => {
        const result = getLocalizacaoQuery('123456;789012;345678', false, true, false);
        expect(result).toBe('123456;');
    });

    it('should return the substring up to and including the second semicolon if unidadeTodas is true', () => {
        const result = getLocalizacaoQuery('123456;789012;345678', false, false, true);
        expect(result).toBe('123456;789012;');
    });

    it('should return the full localizacao if all flags are false', () => {
        const result = getLocalizacaoQuery('123456;789012;345678', false, false, false);
        expect(result).toBe('123456;789012;345678');
    });

    it('should return undefined if localizacao is null', () => {
        const result = getLocalizacaoQuery(null, false, false, false);
        expect(result).toBeUndefined();
    });

    it('should handle case when localizacao has only one part', () => {
        const result = getLocalizacaoQuery('123456;', false, true, false);
        expect(result).toBe('123456;');
    });

    it('should handle case when localizacao has only two parts', () => {
        const result = getLocalizacaoQuery('123456;789012;', false, false, true);
        expect(result).toBe('123456;789012;');
    });
});