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
            modalApi: '=',
        },
        controller: BrowseModalController,
        templateUrl: 'filemaps/browse/browseModal.component.html'
    };

    angular
        .module('filemaps.browse')
        .component('fmBrowseModal', component);

    // ------

    BrowseModalController.$inject = ['logger', 'browseService', 'DirItemTypes'];

    function BrowseModalController(logger, browseService, DirItemTypes) {
        var $ctrl = this;

        var selected = [];

        $ctrl.path = '/tmp';
        $ctrl.selectEntry = selectEntry;
        $ctrl.unselectEntry = unselectEntry;
        $ctrl.select = select;

        $ctrl.$onInit = init;

        function init() {
            // provide api for parent component
            $ctrl.modalApi = {};
            $ctrl.modalApi.modalReady = modalReady;
        }

        function modalReady() {
            // reset selections
            selected = [];
            if ($ctrl.browserApi) {
                $ctrl.browserApi.reset();
            }
        }

        function selectEntry(entry) {
            selected.push(entry);
        }

        function unselectEntry(entry) {
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].path === entry.path) {
                    selected.splice(i);
                    break;
                }
            }
        }

        function select() {
            logger.debug(selected.length, 'file(s) selected');
            if (selected.length) {
                $ctrl.onSelect({
                    selected: selected
                });
            }
        }
    }
})();
