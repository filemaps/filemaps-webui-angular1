// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
        },
        controller: MapSettingsModalController,
        templateUrl: 'filemaps/map/mapSettingsModal.component.html'
    };

    angular
        .module('filemaps.map')
        .component('fmMapSettingsModal', component);

    // ------

    MapSettingsModalController.$inject = ['logger'];

    function MapSettingsModalController(logger) {
        var $ctrl = this;
    }
})();
