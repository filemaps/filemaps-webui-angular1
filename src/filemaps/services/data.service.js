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

        var baseUrl = '/api/';

        var service = {
            readDir: readDir,
            getMaps: getMaps,
            getMap: getMap,
            importMap: importMap,
            createMap: createMap,
            addResources: addResources,
            openResource: openResource,
            updateResources: updateResources,
            removeResources: removeResources,
        };
        return service;

        // -----

        function readDir(path) {
            logger.debug('dataService.readDir', path);
            return $http.post(baseUrl + 'browse', {
                path: path,
            });
        }

        function getMaps() {
            logger.debug('dataService.getMaps');
            return $http.get(baseUrl + 'maps');
        }

        function getMap(id) {
            logger.debug('dataService.getMap', id);
            return $http.get(baseUrl + 'maps/' + id);
        }

        function importMap(path) {
            logger.debug('dataService.importMap', path);
            return $http.post(baseUrl + 'maps/import', {
                path: path
            });
        }

        function createMap(title, base, filename) {
            logger.debug('dataService.createMap', title, base, filename);
            return $http.post(baseUrl + 'maps', {
                title: title,
                base: base,
                filename: filename,
            });
        }

        function addResources(mapId, paths) {
            logger.debug('dataService.addResources', mapId, paths);
            var url = baseUrl + 'maps/' + mapId + '/resources';
            var items = [];
            for (var i = 0; i < paths.length; i++) {
                items.push({
                    path: paths[i]
                });
            }
            return $http.post(url, {
                items: items
            });
        }

        function openResource(mapId, resourceId) {
            var url = baseUrl + 'maps/' + mapId + '/resources/' + resourceId + '/open';
            return $http.get(url);
        }

        function updateResources(mapId, resources) {
            var url = baseUrl + 'maps/' + mapId + '/resources';
            return $http.put(url, {
                resources: resources
            });
        }

        function removeResources(mapId, resources) {
            var url = baseUrl + 'maps/' + mapId + '/resources/delete';
            var ids = [];
            for (var i = 0; i < resources.length; i++) {
                ids.push(resources[i].id);
            }
            return $http.post(url, {
                ids: ids
            });
        }
    }
})();
