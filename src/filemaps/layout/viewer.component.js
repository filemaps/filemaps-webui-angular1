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

    ViewerController.$inject = ['$rootScope', 'logger', 'mapService'];

    function ViewerController($rootScope, logger, mapService) {
        var $ctrl = this;
        $ctrl.createMap = createMap;
        $ctrl.openMap = openMap;
        $ctrl.newMapModalReady = newMapModalReady;
        $ctrl.mapsModalReady = mapsModalReady;
        $ctrl.aboutModalReady = aboutModalReady;
        $ctrl.mapSettingsModalReady = mapSettingsModalReady;
        $ctrl.generalSettingsModalReady = generalSettingsModalReady;
        $ctrl.modalComplete = modalComplete;

        $ctrl.mapsModalOpen = false;
        $ctrl.closeMapsModal = closeMapsModal;

        function createMap(name, path) {
            logger.debug('Create new map', name, path);
            mapService.createMap(name, path, 'map.filemap');
        }

        function openMap(id) {
            logger.debug('Open map', id);
        }

        function newMapModalReady() {
            $rootScope.$emit('fmStopControls');
            if ($ctrl.newMapModalApi) {
                $ctrl.newMapModalApi.modalReady();
            }
            _hideSideNav();
        }

        function mapsModalReady() {
            $rootScope.$emit('fmStopControls');
            if ($ctrl.mapsModalApi) {
                $ctrl.mapsModalApi.modalReady();
            }
            _hideSideNav();
        }

        function aboutModalReady() {
            $rootScope.$emit('fmStopControls');
            _hideSideNav();
        }

        function mapSettingsModalReady() {
            $rootScope.$emit('fmStopControls');
            _hideSideNav();
        }

        function generalSettingsModalReady() {
            $rootScope.$emit('fmStopControls');
            _hideSideNav();
        }

        function modalComplete() {
            $rootScope.$emit('fmResumeControls');
        }

        function closeMapsModal() {
            logger.debug('Close maps modal');
            $ctrl.mapsModalOpen = false;
        }

        function _hideSideNav() {
            // materializecss angular doesn't support hiding sideNav
            $('#side-nav-button').sideNav('hide');
        }
    }
})();
