// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            mapsModalOpen: '=',
        },
        controller: NavController,
        templateUrl: 'filemaps/layout/nav.component.html'
    };

    angular
        .module('filemaps.layout')
        .component('fmNav', component);

    // -----

    NavController.$inject = ['$rootScope', '$localStorage', 'mapService', 'selectionService', 'logger'];

    function NavController($rootScope, $localStorage, mapService, selectionService, logger) {
        var $ctrl = this;
        $ctrl.mapService = mapService;
        $ctrl.aboutModalOpen = false;
        $ctrl.aboutModalReady = aboutModalReady;
        $ctrl.aboutModalComplete = aboutModalComplete;
        $ctrl.newMapModalOpen = false;
        //($localStorage.lastMapId === undefined);
        $ctrl.newMapModalReady = newMapModalReady;
        $ctrl.newMapModalComplete = newMapModalComplete;
        //$ctrl.mapsModalOpen = false;
        $ctrl.mapsModalReady = mapsModalReady;
        $ctrl.mapsModalComplete = mapsModalComplete;
        $ctrl.mapSettingsModalOpen = false;
        $ctrl.mapSettingsModalReady = mapsModalReady;
        $ctrl.mapSettingsModalComplete = mapsModalComplete;
        $ctrl.generalSettingsModalOpen = false;
        $ctrl.generalSettingsModalReady = generalSettingsModalReady;
        $ctrl.generalSettingsModalComplete = generalSettingsModalComplete;

        $ctrl.rootScope = $rootScope;
        $ctrl.removeSelected = removeSelected;
        $ctrl.hideSideNav = hideSideNav;

        $rootScope.$on('gopenChangeSelection', function(evt) {
            $ctrl.selection = selectionService.get();
            logger.debug('selection changed', $ctrl.selection);
        });
        /*
        $rootScope.$watchCollection('selectedResources', function(oldSelections, newSelections) {
            vm.selectedResources = newSelections;
        }); */

        function aboutModalReady() {
            $rootScope.$emit('fmStopControls');
        }

        function aboutModalComplete() {
            logger.debug('about modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function newMapModalReady() {
            logger.debug('new map modal ready');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function newMapModalComplete() {
            logger.debug('new map modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function mapsModalReady() {
            logger.debug('maps modal ready');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function mapsModalComplete() {
            logger.debug('maps modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function mapSettingsModalReady() {
            logger.debug('map settings modal ready');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function mapSettingsModalComplete() {
            logger.debug('map settings modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function generalSettingsModalReady() {
            logger.debug('general settings modal ready');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function generalSettingsModalComplete() {
            logger.debug('general settings modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function hideSideNav() {
            // materializecss angular doesn't support hiding sideNav
            $('#side-nav-button').sideNav('hide');
        }

        function removeSelected() {
            // make a copy so it won't be changed
            var resources = angular.copy(selectionService.get());
            mapService.removeResources(resources);
            selectionService.clear();
        }
    }
})();
