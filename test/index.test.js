const Axel = require('../lib/index')
const chai = require('chai')
const expect = chai.expect
const path = require('path')
const STORAGE_PATH = path.resolve() + '/storage'

describe('src/index.js', () => {
    it('test',async () => {
        const axel = new Axel();
        console.log(STORAGE_PATH)
        axel.download({n: 2, c: true}, {cwd: path.resolve() + '/storage/node'}, 'https://nodejs.org/dist/v10.13.0/node-v10.13.0.pkg')
    });
});