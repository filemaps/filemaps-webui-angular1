// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.services')
        .factory('logger', logger);

    logger.$inject = ['$log'];

    function logger($log) {
        var level = {
            DEBUG: 'DEBUG',
            INFO: 'INFO',
            WARNING: 'WARNING',
            ERROR: 'ERROR'
        };

        var service = {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug: debug
        };

        return service;

        ////////////////////

        function log() {
            /* jshint validthis:true */
            return $log.log.apply(this, arguments);
        }

        function info() {
            /* jshint validthis:true */
            return $log.info.apply(this, arguments);
        }

        function warn() {
            /* jshint validthis:true */
            $log.warn.apply(this, arguments);
        }

        function error() {
            /* jshint validthis:true */
            $log.error.apply(this, arguments);
        }

        function debug() {
            /* jshint validthis:true */
            $log.debug.apply(this, arguments);
        }
    }
})();
