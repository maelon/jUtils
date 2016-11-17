const assert = require('assert');

const jutils = require('jutils');

describe('makeSimpleGUID', function() {
    it('should return success when makeSimpleGUID is correct', function() {
        assert('00000000-0000-0000-0000-000000000000', jutils.makeSimpleGUID());
    });
});
