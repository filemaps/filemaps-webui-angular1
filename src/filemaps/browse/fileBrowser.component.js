// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            initPath: '<path',
            dirsOnly: '<', // one-way binding
            filemapsOnly: '<',
            onPathLoaded: '&',
            onFileClick: '&?',
            onSelect: '&',
            onUnselect: '&',
            browserApi: '=?',
        },
        controller: FileBrowserController,
        templateUrl: 'filemaps/browse/fileBrowser.component.html'
    };

    angular
        .module('filemaps.browse')
        .component('fmFileBrowser', component);

    // -----

    FileBrowserController.$inject = ['browseService', 'DirItemTypes', 'logger'];

    function FileBrowserController(browseService, DirItemTypes, logger) {
        var $ctrl = this;

        // object for all selected paths
        var selected = {};

        $ctrl.moveToParent = moveToParent;
        $ctrl.currentPath = '';
        $ctrl.entryClicked = entryClicked;
        $ctrl.parentPath = null;
        $ctrl.entries = [];
        $ctrl.filter = {};

        // lifecycle hooks
        $ctrl.$onInit = init;

        function init() {
            // provide api for parent component
            $ctrl.browserApi = {};
            $ctrl.browserApi.reset = reset;

            _fetchDir($ctrl.initPath);
            if ($ctrl.dirsOnly) {
                $ctrl.filter.type = DirItemTypes.DIR;
            }
            else if ($ctrl.filemapsOnly) {
                $ctrl.filter = filterFilemaps;
            }
        }

        function reset() {
            selected = {};
            _fetchDir($ctrl.currentPath);
        }

        function moveToParent() {
            if ($ctrl.parent) {
                _fetchDir($ctrl.parent);
            }
        }

        function entryClicked(entry) {
            logger.debug('entry clicked', entry);
            if (entry.type === DirItemTypes.DIR) {
                _fetchDir(entry.path);
            }
            else if ($ctrl.onFileClick) {
                $ctrl.onFileClick({ entry: entry });
            }
            else {
                // toggle file selection
                if (entry.selected) {
                    // remove from selections
                    entry.selected = false;
                    $ctrl.onUnselect({ entry: entry });
                    delete selected[entry.path];
                }
                else {
                    //$ctrl.selected.push(entry);
                    entry.selected = true;
                    $ctrl.onSelect({ entry: entry });
                    selected[entry.path] = true;
                }
            }
        }

        function _fetchDir(path) {
            $ctrl.currentPath = path;
            browseService.readDir(path)
                .then(function(result) {
                    $ctrl.onPathLoaded({ path: path });
                    logger.info('readDir', result);
                    $ctrl.parent = result.data.parent;
                    $ctrl.entries = result.data.contents || [];
                    logger.debug('already selected', selected);

                    // check if some entries have already been selected
                    for (var i = 0; i < $ctrl.entries.length; i++) {
                        if (selected[$ctrl.entries[i].path]) {
                            $ctrl.entries[i].selected = true;
                        }
                    }
                }, function(err) {
                    logger.error('Error when fetching directory content', err);
                });
        }

        function filterFilemaps(entry, index, arr) {
            return (entry.type === DirItemTypes.DIR ||
                    entry.name.match(/\.filemap$/));
        }
    }
})();
