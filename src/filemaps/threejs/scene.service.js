// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

(function() {
    'use strict';

    angular
        .module('filemaps.threejs')
        .factory('sceneService', sceneService);

    sceneService.$inject = ['logger'];

    function sceneService(logger) {

        var renderer;
        var scene;
        var camera;
        var ground;
        var objects = [];
        var controls;

        var selectionLine;
        var selectionPos;
        var selectionCorner;
        var raycaster;
        var mouse;
        var mouseGround;

        var service = {
            init: init,
            getCamera: getCamera,
            getGround: getGround,
            getObjects: getObjects,
            addObject: addObject,
            stopControls: stopControls,
            resumeControls: resumeControls,
            startSelection: startSelection,
        };

        return service;

        // -----

        function init(_renderer, _scene, _camera, _controls, _ground) {
            renderer = _renderer;
            scene = _scene;
            camera = _camera;
            controls = _controls;
            ground = _ground;

            initSelection();
        }

        function getCamera() {
            return camera;
        }

        function getGround() {
            return ground;
        }

        function getObjects() {
            return objects;
        }

        function addObject(object) {
            scene.add(object);
            objects.push(object);
        }

        function stopControls() {
            controls.enabled = false;
        }

        function resumeControls() {
            controls.enabled = true;
        }

        function startSelection() {
            stopControls();
	    renderer.domElement.style.cursor = 'crosshair';
            document.addEventListener('mousemove', mousemove, false);
            document.addEventListener('mousedown', mousedown, false);
            document.addEventListener('mouseup', mouseup, false);
        }

        function stopSelection() {
            var selected = getObjectsInArea(selectionPos[0], selectionPos[1], selectionPos[6], selectionPos[7]);

            selectionLine.visible = false;
	    document.removeEventListener('mousemove', mousemove, false);
	    document.removeEventListener('mousedown', mousedown, false);
	    document.removeEventListener('mouseup', mouseup, false);
	    renderer.domElement.style.cursor = 'auto';
            resumeControls();
            logger.debug('SELECTED', selected);
        }

        function initSelection() {
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();
            mouseGround = new THREE.Vector3();

            var geometry = new THREE.BufferGeometry();
            selectionPos = new Float32Array(5 * 3);
            geometry.addAttribute('position', new THREE.BufferAttribute(selectionPos, 3));

            var material = new THREE.LineBasicMaterial({
                color: 0xff0000,
                lineWidth: 2
            });

            selectionLine = new THREE.Line(geometry, material);
            selectionLine.geometry.setDrawRange(0, 5);
            selectionLine.visible = false;

            scene.add(selectionLine);
        }

        function mousemove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObject(ground);
            if (intersects.length > 0) {
                mouseGround.x = intersects[0].point.x;
                mouseGround.y = intersects[0].point.y;
                mouseGround.z = intersects[0].point.z;
                updateSelectionLine();
            }
            else {
                mouseGround.x = 0;
                mouseGround.y = 0;
                mouseGround.z = 0;
            }
        };

        function mousedown(event) {
            // first corner for selection rectangle
            selectionCorner = new THREE.Vector2();
            selectionCorner.x = mouseGround.x;
            selectionCorner.y = mouseGround.y;

            selectionPos[0] = mouseGround.x;
            selectionPos[1] = mouseGround.y;
            selectionPos[2] = 1;

            selectionPos[3] = mouseGround.x;
            selectionPos[4] = mouseGround.y;
            selectionPos[5] = 1;

            selectionPos[6] = mouseGround.x;
            selectionPos[7] = mouseGround.y;
            selectionPos[8] = 1;

            selectionPos[9] = mouseGround.x;
            selectionPos[10] = mouseGround.y;
            selectionPos[11] = 1;

            selectionPos[12] = mouseGround.x;
            selectionPos[13] = mouseGround.y;
            selectionPos[14] = 1;

            selectionLine.visible = true;
        }

        function mouseup(event) {
            selectionCorner = undefined;
            stopSelection();
        }

        function updateSelectionLine() {
            selectionPos[4] = mouseGround.y;
            selectionPos[6] = mouseGround.x;
            selectionPos[7] = mouseGround.y;
            selectionPos[9] = mouseGround.x;
            selectionLine.geometry.attributes.position.needsUpdate = true;
        }

        function getObjectsInArea(x1, y1, x2, y2) {
            var sel = [];
            for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                if (obj.position.x >= x1 && obj.position.x <= x2 &&
                    obj.position.y >= y1 && obj.position.y <= y2) {
                    sel.push(obj);
                }
            }
            return sel;
        }
    }
})();
