// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    var component = {
        bindings: {
            modalApi: '=',
        },
        controller: GeneralSettingsModalController,
        templateUrl: 'filemaps/settings/generalSettingsModal.component.html'
    };

    angular
        .module('filemaps.settings')
        .component('fmGeneralSettingsModal', component);

    // ------

    GeneralSettingsModalController.$inject = ['logger', 'dataService'];

    function GeneralSettingsModalController(logger, dataService) {
        var $ctrl = this;
        $ctrl.save = save;
        $ctrl.$onInit = init;

        var Config = dataService.getConfig();

        function init() {
            $ctrl.modalApi = {};
            $ctrl.modalApi.modalReady = modalReady;
        }

        function modalReady() {
            $ctrl.config = Config.get(null, function(response) {
                logger.debug("JEE", response);
                $ctrl.config = response.config;
                $ctrl.fileApps = response.fileApps;
            });
        }

        function save() {
            Config.update(null, $ctrl.config);
        }
    }
})();
