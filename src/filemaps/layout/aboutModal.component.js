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
        controller: AboutModalController,
        templateUrl: 'filemaps/layout/aboutModal.component.html'
    };

    angular
        .module('filemaps.layout')
        .component('fmAboutModal', component);

    // ------

    AboutModalController.$inject = ['logger'];

    function AboutModalController(logger) {
        var $ctrl = this;
    }
})();
