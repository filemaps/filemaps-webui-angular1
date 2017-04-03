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
            onPathLoaded: '&',
            onSelect: '&',
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
        $ctrl.moveToParent = moveToParent;
        $ctrl.currentPath = '';
        $ctrl.entryClicked = entryClicked;
        $ctrl.select = select;
        $ctrl.cancel = cancel;
        $ctrl.parentPath = null;
        $ctrl.entries = [];
        $ctrl.selected = [];
        $ctrl.filter = {};

        // lifecycle hooks
        $ctrl.$onInit = init;

        function init() {
            _fetchDir($ctrl.initPath);
            if ($ctrl.dirsOnly) {
                $ctrl.filter.type = DirItemTypes.DIR;
            }
            //_fetchDir(modalOpts.defPath);
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
            else if (entry.selected) {
                // remove from selections
                entry.selected = false;
            }
            else {
                $ctrl.selected.push(entry);
                entry.selected = true;
            }
        }

        function select() {
            logger.debug('File(s) selected');
            var selected = [];
            for (var i = 0; i < $ctrl.entries.length; i++) {
                if ($ctrl.entries[i].selected) {
                    selected.push($ctrl.entries[i]);
                }
            }
            $ctrl.onSelect({
                selected: selected
            });
        }

        function cancel() {
            logger.debug('cancel');
        }

        function _fetchDir(path) {
            $ctrl.currentPath = path;
            browseService.readDir(path)
                .then(function(result) {
                    $ctrl.onPathLoaded({ path: path });
                    logger.info('readDir', result);
                    $ctrl.parent = result.data.parent;
                    $ctrl.entries = result.data.contents;
                }, function(err) {
                    logger.error('Error when fetching directory content', err);
                });
        }

    }
})();
