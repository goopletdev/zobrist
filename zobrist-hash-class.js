/**
 * Zobrist hash table handler
 * @module ZobristHash
 */

/**
 * Generates a new random bigint
 * @param {number} bits Size of bigint
 * @returns {BigInt}
 */
const randomBigInt = (bits) => {
    let binary = '0b';
    while (bits-- > 0) {
        binary += Math.floor(Math.random() * 2);
    }
    return BigInt(binary);
}

/**
 * Initializes and returns new pseudorandom number array, 
 * adding each new number to given set for easy lookup.
 * @param {Set.<BigInt>} bigints Set of unique numbers
 * @param {number} quantity Number of new numbers
 * @returns {Array.<BigInt>} Array starting with empty element, 
 * followed by [quantity] amount of unique pseudo-random numbers
 */
const initBigInts = (bigints,quantity) => {
    const newNumbers = [0];
    for (let val=1; val <= quantity; val++) {
        let num;
        do { // generate unique 64-bit bigint not in bigints set
            num = randomBigInt(64);
        } while (bigints.has(num)); // redo if number already exists
        bigints.add(num); // add to bigints set for easy access
        newNumbers.push(num);
    }
    return newNumbers;
}

class ZobristHash {
    /**
     * Initializes this.nums for making Zobrist hashes from board state
     * @param {number} size Number of vertices on board
     * @param {number} values Number of possible non-zero values at each vertex
     * @param {number} [situational=0] Whether to account for 
     * whose turn it is; set to falsey value for positional superko, or to 
     * number of players for situational superko. 
     */
    constructor (size, values, situational = 0) {
        // keep track of bigints during initialization to ensure uniqueness
        const bigints = new Set();

        /**
         * Array containing one sub-array for each vertex.
         * Each vertex has one pseudo-random BigInt for 
         * each possible non-empty state.
         * @type {Array<BigInt[]>}
         */
        this.nums = [];

        for (let vertex=0; vertex < size; vertex++) {
            this.nums[vertex] = initBigInts(bigints,values);
        }

        if (situational) {
            /**
             * Array containing 0 followed by one number for 
             * each possible player.
             * @type {Array.<BigInt>}
             */
            this.toPlay = initBigInts(bigints,situational); 
        }

        /**
         * Contains each state hash key added with this.add()
         * @type {Set.<BigInt>}
         */
        this.keys = new Set();
    }

    /**
     * Generate a hash key based on current board state.
     * @param {Array.<number>} state 1-d Board state of length this.nums
     * @param {number} [toPlay=0] Player to play, for situational superko
     * @returns {number} New hash key
     */
    hash = (state, toPlay=0) => {
        let hash = state.reduce((hash,val,i) => hash ^ this.nums[i][val]);
        return this.toPlay ? hash ^ this.toPlay[toPlay] : hash;
    }

    /**
     * Returns and adds a unique hash key to this.keys, or throws an error
     * if this.keys already contains the new hash
     * @param {Array.<number>} state 1-d Board state of length this.nums
     * @param {number} [toPlay=0] Player to play, for situational superko
     * @returns {BigInt} Unique hash key
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

module.exports = ZobristHash;