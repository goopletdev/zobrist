//import KoHash from "./zobrist-hash-class.js";
const KoHash = require("./zobrist-hash-class.js");

describe('KoHash', () => {
    let zobrist = new KoHash(81,2,2);
    let arr;
    beforeEach(() => {
        zobrist = new KoHash(81,2,2);
        arr = new Array(81).fill(0);
    });

    it('should handle adding positions', () => {
        arr[10] = 2;
        arr[11] = 1;
        const hash1 = zobrist.add(arr);
        expect(() => zobrist.add(arr)).toThrow();
        arr[12] = 2;
        const hash2 = zobrist.add(arr);
        expect(hash1).not.toEqual(hash2);

    });
});