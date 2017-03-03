// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.services')
        .factory('dataService', dataService);

    dataService.$inject = ['$http', 'logger'];

    function dataService($http, logger) {
        var service = {
            readDir: readDir,
            getMaps: getMaps,
            getMap: getMap,
            getMapByPath: getMapByPath,
            createMap: createMap,
            addResources: addResources,
            openResource: openResource,
            moveResources: moveResources,
            removeResources: removeResources,
        };
        return service;

        // -----

        function readDir(path) {
            logger.debug('dataService.readDir', path);
            return $http.get('/api/browse?path=' + path);
            /*.success(function() {
            });*/
        }

        function getMaps() {
            logger.debug('dataService.getMaps');
            return $http.get('/api/maps');
        }

        function getMap(id) {
            logger.debug('dataService.getMap', id);
            return $http.get('/api/map?id=' + id);
        }

        function getMapByPath(path) {
            logger.debug('dataService.getMapByPath', path);
            return $http.get('/api/mappath?path=' + path);
        }

        function createMap(name, path, filename) {
            logger.debug('dataService.createMap', name, path, filename);
            var url = '/api/maps';
            return $http.post(url, {
                name: name,
                path: path,
                filename: filename,
            });
        }

        function addResources(mapId, paths) {
            logger.debug('dataService.addResources', mapId, paths);
            var url = '/api/add';
            return $http.post(url, {
                mapID: mapId,
                paths: paths,
            });
        }

        function openResource(mapId, resource) {
            return $http.get('/api/open?map=' + mapId + '&resource=' + resource.id);
        }

        function moveResources(mapId, resources) {
            var url = '/api/move';
            var positions = [];
            for (var i = 0; i < resources.length; i++) {
                positions.push({
                    ResourceID: resources[i].id,
                    Position:   resources[i].pos,
                });
            }
            return $http.post(url, {
                mapID: mapId,
                positions: positions,
            });
        }

        function removeResources(mapId, resources) {
            var url = '/api/remove';
            var ids = [];
            for (var i = 0; i < resources.length; i++) {
                ids.push(resources[i].id);
            }
            return $http.post(url, {
                mapID: mapId,
                resourceIDs: ids,
            });
        }
    }
})();
