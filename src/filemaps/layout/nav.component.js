// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
        },
        controller: NavController,
        templateUrl: 'filemaps/layout/nav.component.html'
    };

    angular
        .module('filemaps.layout')
        .component('fmNav', component);

    // -----

    NavController.$inject = ['$rootScope', 'mapService', 'selectionService', 'logger'];

    function NavController($rootScope, mapService, selectionService, logger) {
        var $ctrl = this;
        $ctrl.mapService = mapService;
        $ctrl.aboutModalOpen = false;
        $ctrl.aboutModalReady = aboutModalReady;
        $ctrl.aboutModalComplete = aboutModalComplete;
        $ctrl.newMapModalOpen = false;
        $ctrl.newMapModalReady = newMapModalReady;
        $ctrl.newMapModalComplete = newMapModalComplete;
        $ctrl.mapsModalOpen = false;
        $ctrl.mapsModalReady = mapsModalReady;
        $ctrl.mapsModalComplete = mapsModalComplete;
        $ctrl.mapSettingsModalOpen = false;
        $ctrl.mapSettingsModalReady = mapsModalReady;
        $ctrl.mapSettingsModalComplete = mapsModalComplete;
        $ctrl.generalSettingsModalOpen = false;
        $ctrl.generalSettingsModalReady = generalSettingsModalReady;
        $ctrl.generalSettingsModalComplete = generalSettingsModalComplete;

        $ctrl.setSelected = setSelected;
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
            logger.debug('COMPLETE');
            $rootScope.$emit('fmResumeControls');
        }

        function newMapModalReady() {
            logger.debug('READY');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function newMapModalComplete() {
            logger.debug('COMPLETE');
            $rootScope.$emit('fmResumeControls');
        }

        function mapsModalReady() {
            logger.debug('READY');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function mapsModalComplete() {
            logger.debug('COMPLETE');
            $rootScope.$emit('fmResumeControls');
        }

        function mapSettingsModalReady() {
            logger.debug('READY');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function mapSettingsModalComplete() {
            logger.debug('COMPLETE');
            $rootScope.$emit('fmResumeControls');
        }

        function generalSettingsModalReady() {
            logger.debug('READY');
            $rootScope.$emit('fmStopControls');
            hideSideNav();
        }

        function generalSettingsModalComplete() {
            logger.debug('COMPLETE');
            $rootScope.$emit('fmResumeControls');
        }

        function setSelected(selected) {
            logger.debug('set selected', selected);
            addSelectedResources(selected);
        }

        function hideSideNav() {
            // materializecss angular doesn't support hiding sideNav
            $('#side-nav-button').sideNav('hide');
        }

        function addSelectedResources(selected) {
            var paths = [];
            for (var i = 0; i < selected.length; i++) {
                paths.push({
                    isDir: selected[i].isDir,
                    path: selected[i].fullPath,
                    pos: [0, 0, 0],
                });
            }
            mapService.addResources(paths);
        }

        function removeSelected() {
            // make a copy so it won't be changed
            var resources = angular.copy(selectionService.get());
            mapService.removeResources(resources);
            selectionService.clear();
        }
    }
})();
