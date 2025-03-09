/**
 * @module KoHash zobrist hash table handler
 */

/**
 * Initializes and returns new pseudorandom number array, 
 * adding each new number to given set for easy lookup.
 * @param {Set.<number>} numbers Set of unique numbers
 * @param {number} quantity Number of new numbers
 * @returns {Array.<number>} Array starting with 0, followed 
 * by [quantity] amount of unique pseudo-random numbers
 */
const initNumbers = (numbers,quantity) => {
    const newNumbers = [0];
    for (let val=1; val <= quantity; val++) {
        let num;
        do { // generate unique number not in numbers set
            num = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        } while (numbers.has(num)); // redo if number already exists
        numbers.add(num); // add to numbers set for easy access
        newNumbers.push(num);
    }
    return newNumbers;
}

class KoHash {
    /**
     * Initializes this.nums for making Zobrist hashes from board state
     * @param {number} size Number of vertices on board
     * @param {number} values Number of possible non-zero values at each vertex
     * @param {number} [situational=0] Whether to account for 
     * whose turn it is; set to falsey value for positional superko, or to 
     * number of players for situational superko. 
     */
    constructor (size, values, situational = 0) {
        const numbers = new Set();

        /**
         * Array containing one sub-array for each vertex.
         * Each vertex has one pseudo-random number for 
         * each possible non-empty state.
         * @type {Array<number[]>}
         */
        this.nums = [];

        for (let vertex=0; vertex < size; vertex++) {
            this.nums[vertex] = initNumbers(numbers,values);
        }

        if (situational) {
            /**
             * Array containing 0 followed by one number for 
             * each possible player.
             * @type {Array.<number>}
             */
            this.toPlay = initNumbers(numbers,situational); 
        }

        /**
         * Contains each state hash key added with this.add()
         * @type {Set.<number>}
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