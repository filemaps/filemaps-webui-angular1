// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.services')
        .factory('infoService', infoService);

    infoService.$inject = ['dataService', 'logger'];

    function infoService(dataService, logger) {

        var info = {};

        var service = {
            info: info,
        };

        init();

        return service;

        // -----

        function init() {
            info.promise = dataService.getInfo();
            info.promise.then(function(result) {
                logger.debug('INFO', result.data);
                info.data = result.data;
            });
        }
    }
})();
