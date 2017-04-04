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
        $ctrl.path = '/tmp';
        $ctrl.create = create;
        $ctrl.setPath = setPath;

        function create() {
            logger.debug('New Map Modal: Create new map');
            $ctrl.onCreate({
                name: $ctrl.name,
                path: $ctrl.path,
            });
        }

        function setPath(path) {
            $ctrl.path = path;
        }
    }
})();
