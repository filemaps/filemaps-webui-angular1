// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {},
        controller: ViewerController,
        templateUrl: 'filemaps/layout/viewer.component.html'
    };

    angular
        .module('filemaps.layout')
        .component('fmViewer', component);

    ViewerController.$inject = ['logger', 'mapService'];

    function ViewerController(logger, mapService) {
        var $ctrl = this;
        $ctrl.createMap = createMap;
        $ctrl.openMap = openMap;

        function createMap(name, path) {
            logger.debug('Create new map', name, path);
            mapService.createMap(name, path, 'map.filemap');
        }

        function openMap(id) {
            logger.debug('Open map', id);
        }
    }
})();
