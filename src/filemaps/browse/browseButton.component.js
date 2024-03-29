// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {},
        controller: BrowseButtonController,
        templateUrl: 'filemaps/browse/browseButton.component.html'
    };

    angular
        .module('filemaps.browse')
        .component('fmBrowseButton', component);

    // -----

    BrowseButtonController.$inject = ['$rootScope', 'mapService', 'selectionService', 'logger'];

    function BrowseButtonController($rootScope, mapService, selectionService, logger) {
        var $ctrl = this;
        $ctrl.modalOpen = false;
        //$ctrl.startBrowse = startBrowse;
        $ctrl.modalReady = modalReady;
        $ctrl.modalComplete = modalComplete;
        $ctrl.setSelected = setSelected;
        $ctrl.rootScope = $rootScope;
        $ctrl.removeSelected = removeSelected;
        $ctrl.startSelection = startSelection;

        $rootScope.$on('fmChangeSelection', function(evt) {
            $ctrl.selection = selectionService.get();
            logger.debug('selection changed', $ctrl.selection);
        });

        function modalReady() {
            logger.debug('browse modal ready');
            $rootScope.$emit('fmStopControls');
            if ($ctrl.modalApi) {
                $ctrl.modalApi.modalReady();
            }
        }

        function modalComplete() {
            logger.debug('browse modal complete');
            $rootScope.$emit('fmResumeControls');
        }

        function setSelected(selected) {
            logger.debug('set selected', selected);
            addSelectedResources(selected);
        }

        function addSelectedResources(selected) {
            var paths = [];
            for (var i = 0; i < selected.length; i++) {
                paths.push({
                    type: selected[i].type,
                    path: selected[i].path,
                    pos: { x: 0, y: 0, z: 20 },
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

        function startSelection() {
            selectionService.startDrawing();
        }
    }
})();
