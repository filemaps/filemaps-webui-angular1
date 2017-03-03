// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            onCreate: '&', // callback
        },
        controller: NewMapModalController,
        templateUrl: 'filemaps/map/newMapModal.component.html'
    };

    angular
        .module('filemaps.map')
        .component('fmNewMapModal', component);

    // ------

    NewMapModalController.$inject = ['logger', 'browseService'];

    function NewMapModalController(logger, browseService) {
        var $ctrl = this;
        $ctrl.name = '';
        $ctrl.moveToParent = moveToParent;
        $ctrl.currentPath = '';
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
        }

        function moveToParent() {
            if ($ctrl.parentPath) {
                _fetchDir($ctrl.parentPath);
            }
        }

        function entryClicked(entry) {
            logger.debug('entry clicked', entry);
            if (entry.isDir) {
                _fetchDir(entry.fullPath);
            }
            /*
            else if (entry.selected) {
                // remove from selections
                entry.selected = false;
            }
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
                    logger.error('Error when fetching directory contents', err);
                });
        }
    }
})();
