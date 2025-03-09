/**
 * @module KoHash zobrist hash table handler
 */

/**
 * Initializes and returns new hash array, 
 * adding each new hash to given set for easy lookup.
 * @param {Set.<number>} hashes Set of unique hashes
 * @param {number} numKeys Number of new hash keys
 * @returns {Array.<number>} Array starting with 0, 
 * followed [numValues] amount of unique hashes
 */
const initHash = (hashes,numKeys) => {
    const newHashes = [0];
    for (let val=1; val <= numKeys; val++) {
        let hash;
        do { // generate unique hash not in hashes set
            hash = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        } while (hashes.has(hash)); // redo if hash already exists
        hashes.add(hash); // add to hashes set for easy access
        newHashes.push(hash);
    }
    return newHashes;
}

class KoHash {
    /**
     * Initializes this.hashes for making Zobrist hashes from board state
     * @param {number} size Number of vertices on board
     * @param {number} values Number of possible non-zero values at each vertex
     * @param {number} [situational=0] Whether to account for 
     * whose turn it is; set to falsey value for positional superko, or to 
     * number of players for situational superko. 
     */
    constructor (size, values, situational = 0) {
        const hashes = new Set();

        /**
         * Array containing one sub-array for each vertex.
         * Each vertex has one hash key for each possible 
         * non-empty state.
         * @type {Array<number[]>}
         */
        this.hashes = [];

        for (let vertex=0; vertex < size; vertex++) {
            this.hashes[vertex] = initHash(hashes,values);
        }

        if (situational) {
            /**
             * Array containing 0 followed by one hash key for 
             * each possible player.
             * @type {Array.<number>}
             */
            this.toPlay = initHash(hashes,situational); 
        }

        /**
         * Contains each state hash key added with this.add()
         * @type {Set.<number>}
         */
        this.keys = new Set();
    }

    /**
     * Generate a hash key based on current board state.
     * @param {Array.<number>} state 1-d Board state of length this.hashes
     * @param {number} [toPlay=0] Player to play, for situational superko
     * @returns {number} New hash key
     */
    hash = (state, toPlay=0) => {
        let hash = state.reduce((hash,val,i) => hash ^ this.hashes[i][val]);
        return this.toPlay ? hash ^ this.toPlay[toPlay] : hash;
    }

    /**
     * Returns and adds a unique hash key to this.keys, or throws an error
     * if this.keys already contains the new hash
     * @param {Array.<number>} state 1-d Board state of length this.hashes
     * @param {number} [toPlay=0] Player to play, for situational superko
     * @returns {number} Unique hash key
     * @throws If the new hash key is not unique in this.keys
     */
    add = (state, toPlay=0) => {
        const hash = this.hash(state,toPlay);

        if (this.keys.has(hash)) {
            throw new Error (`${hash} already in this.keys`);
        } 
        this.keys.add(hash);
        return hash;
    }

    /**
     * Deletes a given hash key from this.keys
     * @param {number} key Hash key from position
     * @returns {boolean} Whether value was successfully removed
     */
    remove = (key) => this.keys.delete(key);
}

module.exports = KoHash;