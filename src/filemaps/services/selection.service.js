// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.services')
        .factory('selectionService', selectionService);

    selectionService.$inject = ['$rootScope', 'logger'];

    function selectionService($rootScope, logger) {

        var selections = [];

        var service = {
            get: get,
            add: add,
            replace: replace,
            clear: clear,
            startDrawing: startDrawing,
            stopDrawing: stopDrawing,
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

        function startDrawing() {
            logger.debug('start drawing');
            $rootScope.$emit('fmStartArea');
        }

        function stopDrawing() {
            logger.debug('stop drawing');
            $rootScope.$emit('fmStopArea');
        }
    }
})();
