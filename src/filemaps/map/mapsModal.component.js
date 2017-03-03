// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            onOpen: '&', // callback
        },
        controller: MapsModalController,
        templateUrl: 'filemaps/map/mapsModal.component.html'
    };

    angular
        .module('filemaps.map')
        .component('fmMapsModal', component);

    // ------

    MapsModalController.$inject = ['logger', 'dataService', 'browseService', 'mapService'];

    function MapsModalController(logger, dataService, browseService, mapService) {
        var $ctrl = this;
        $ctrl.name = '';
        $ctrl.moveToParent = moveToParent;
        $ctrl.currentPath = '';
        $ctrl.mapClicked = mapClicked;
        $ctrl.entryClicked = entryClicked;
        $ctrl.create = create;
        $ctrl.cancel = cancel;
        $ctrl.parentPath = null;
        $ctrl.entries = [];
        $ctrl.selected = [];

        init();

        //logger.debug('options', modalOpts);

        function init() {
            _fetchDir('/tmp');
            //_fetchDir(modalOpts.defPath);
            _fetchMaps();
        }

        function moveToParent() {
            if ($ctrl.parentPath) {
                _fetchDir($ctrl.parentPath);
            }
        }

        function mapClicked(map) {
            logger.debug('map clicked', map);
            mapService.useMap(map.id);
        }

        function entryClicked(entry) {
            logger.debug('entry clicked', entry);
            if (entry.isDir) {
                _fetchDir(entry.fullPath);
            }
            else if (entry.isMapFile) {
                mapService.useMapByPath(entry.fullPath);
                //entry.selected = false;
            }
            /*
            else {
                vm.selected.push(entry);
                entry.selected = true;
            }
            */
        }

        function create() {
            logger.debug('New Map Modal: Create new map');
            /*
            var selected = [];
            for (var i = 0; i < vm.entries.length; i++) {
                if (vm.entries[i].selected) {
                    selected.push(vm.entries[i]);
                }
            }
            */
            $ctrl.onCreate({
                name: $ctrl.name,
                path: $ctrl.currentPath,
            });
        }

        function cancel() {
            logger.debug('cancel');
            //$uibModalInstance.dismiss();
        }

        function _fetchDir(path) {
            $ctrl.currentPath = path;
            browseService.readDir(path)
                .then(function(result) {
                    logger.info('readDir', result);
                    $ctrl.parentPath = result.data.parentPath;
                    $ctrl.entries = result.data.files;
                }, function(err) {
                    logger.error('Error when fetching directory content', err);
                });
        }

        function _fetchMaps() {
            dataService.getMaps()
                .then(function(result) {
                    logger.info('get maps', result);
                    $ctrl.maps = result.data.maps;
                }, function(err) {
                    logger.error('Error when reading maps', err);
                });
        }
    }
})();
