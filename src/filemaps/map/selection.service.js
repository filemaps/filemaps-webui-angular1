// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.map')
        .factory('selectionService', selectionService);

    selectionService.$inject = ['$rootScope', 'logger'];

    function selectionService($rootScope, logger) {

        var selections = [];

        var service = {
            get: get,
            add: add,
            replace: replace,
            clear: clear,
        };

        return service;

        // -----

        function get() {
            return selections;
        }

        function add(resource) {
            selections.push(resource);
            $rootScope.$emit('fmChangeSelection');
        }

        function replace(resources) {
            selections = resources;
            $rootScope.$emit('fmChangeSelection');
        }

        function clear() {
            selections.length = 0;
            $rootScope.$emit('fmChangeSelection');
        }
    }
})();
