// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            onClose: '&',
            modalApi: '=',
        },
        controller: MapsModalController,
        templateUrl: 'filemaps/map/mapsModal.component.html'
    };

    angular
        .module('filemaps.map')
        .component('fmMapsModal', component);

    // ------

    MapsModalController.$inject = ['logger', 'dataService', 'mapService'];

    function MapsModalController(logger, dataService, mapService) {
        var $ctrl = this;
        $ctrl.mapClicked = mapClicked;
        $ctrl.openFile = openFile;

        // lifecycle hooks
        $ctrl.$onInit = init;

        function init() {
            // provide api for parent component
            $ctrl.modalApi = {};
            $ctrl.modalApi.modalReady = modalReady;
        }

        function modalReady() {
            if ($ctrl.browserApi) {

                // update recent maps
                dataService.getMaps().then(function(result) {
                    $ctrl.maps = result.data.maps;
                });

                // update browser
                $ctrl.browserApi.reset();
            }
        }

        function mapClicked(map) {
            logger.debug('map clicked', map);
            $ctrl.onClose();
            mapService.useMap(map.id);
        }

        function openFile(entry) {
            mapService.useMapByPath(entry.path);
            $ctrl.onClose();
        }
    }
})();
