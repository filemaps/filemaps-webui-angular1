// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular.module('filemaps.core', []);

    var module = angular.module('filemaps.core');

    // constants
    module
        .constant('DirItemTypes', {
            FILE: 0,
            DIR: 1
        });

    module.config(testConfig);
    testConfig.$inject = ['$httpProvider'];
    function testConfig($httpProvider) {
        console.log('Testing...');
    }
})();
