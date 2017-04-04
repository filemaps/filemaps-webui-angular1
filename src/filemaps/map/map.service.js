// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.map')
        .factory('mapService', mapService);

    mapService.$inject = ['$rootScope', '$localStorage', 'dataService', 'logger'];

    function mapService($rootScope, $localStorage, dataService, logger) {
        var current = {
            map: null,
        };
        var service = {
            init: init,
            current: current,
            useMap: useMap,
            useMapByPath: useMapByPath,
            createMap: createMap,
            addResources: addResources,
            removeResources: removeResources,
        };

        /*
        // get map by id 1
        dataService.getMap(1)
            .then(function(result) {
                service.current.map = result.data;
                logger.debug("Map loaded", service.current.map);
                $rootScope.$emit('gopenFetchMap', service.current.map.id);
            });
*/
        return service;

        // -----

        function init() {
            //useMap(1);
            if ($localStorage.lastMapId) {
                logger.debug('mapService init: last map id:', $localStorage.lastMapId);
            }
            else {
                logger.debug('mapService init: no last map id');
            }
        }

        function useMap(mapId) {
            dataService.getMap(mapId)
                .then(function(result) {
                    service.current.map = result.data;
                    logger.debug('Map loaded', service.current.map);
                    $rootScope.$emit('fmChangeMap', service.current.map.id);
                });
        }

        function useMapByPath(path) {
            dataService.importMap(path)
                .then(function(result) {
                    service.current.map = result.data;
                    logger.debug('Map loaded', service.current.map);
                    $rootScope.$emit('fmChangeMap', service.current.map.id);
                });
        }

        function createMap(name, path, filename) {
            dataService.createMap(name, path, filename)
                .then(function(result) {
                    service.current.map = result.data;
                    $rootScope.$emit('fmCreateMap', service.current.map);
                });
        }

        function addResources(selected) {
            var map = service.current.map;
            dataService.addResources(map.id, selected)
                .then(function(result) {
                    var newIds = [];
                    for (var i = 0; i < result.data.resources.length; i++) {
                        var resource = result.data.resources[i];
                        map.resources[resource.id] = resource;
                        newIds.push(resource.id);
                    }
                    $rootScope.$emit('fmAddResource', newIds);
                });
        }

        function removeResources(resources) {
            logger.debug('resources now', resources);
            var map = service.current.map;
            dataService.removeResources(map.id, resources)
                .then(function(result) {
                    logger.debug('resources then', resources);
                    $rootScope.$emit('fmRemoveResources', resources);
                    logger.debug('resources removed');
                });
        }
    }
})();
