'use strict';

var zonda = require('./zonda.js');

// ----------------------------------------------------------------------------
// ---------------------------------------------------------------------------
class bitbay extends zonda {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitbay',
            'alias': true,
        });
    }
}

module.exports = bitbay;
