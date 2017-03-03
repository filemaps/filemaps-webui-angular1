// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            onSelect: '&', // callback
        },
        controller: BrowseModalController,
        templateUrl: 'filemaps/browse/browseModal.component.html'
    };

    angular
        .module('filemaps.browse')
        .component('fmBrowseModal', component);

    // ------

    BrowseModalController.$inject = ['logger', 'browseService'];

    function BrowseModalController(logger, browseService) {
        var $ctrl = this;
        $ctrl.moveToParent = moveToParent;
        $ctrl.currentPath = '';
        $ctrl.entryClicked = entryClicked;
        $ctrl.select = select;
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

            /*
            $uibModalInstance.close({
                selected: selected,
            });
            */
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
    }
})();
