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
        controller: Controller,
        templateUrl: 'filemaps/threejs/threeViewer.component.html'
    };

    angular
        .module('filemaps.settings')
        .component('fmThreeViewer', component);

    // -----

    Controller.$inject = ['$rootScope', 'dataService', 'mapService',
        'selectionService', 'logger', 'THREEService', 'THREEPlugins'];

    function Controller($rootScope, dataService, mapService,
                        selectionService, logger, THREEService, THREEPlugins) {
        var $ctrl = this;
        $ctrl.init = init;

        $rootScope.selectedResources = [];
        var container, viewSize, camera, scene;
        var geometry, material, torus;
        var renderer, animation;
        var controls;
        var stage, w, h;
        var objects = [];
        var labels = [];
        var update = true;
        init();

        function init() {
            //THREEService.load().then(function(THREE) {
                //THREEPlugins.load(['DragControls', 'TrackballControls']).then(function(THREE) {

                $rootScope.$on('fmAddResource', function(evt, resourceIds) {
                    for (var i = 0; i < resourceIds.length; i++) {
                        drawResource(resourceIds[i], mapService.current.map.resources[resourceIds[i]]);
                    }
                    update = true;
                });

                $rootScope.$on('fmStopControls', function(evt) {
                    logger.debug('fmStopControls');
                    controls.enabled = false;
                });

                $rootScope.$on('fmResumeControls', function(evt) {
                    logger.debug('fmResumeControls');
                    controls.enabled = true;
                });

                $rootScope.$on('fmRemoveResources', function(evt, resources) {
                    logger.debug('fmRemoveResources', resources);
                    for (var i = 0; i < resources.length; i++) {
                        removeResource(resources[i].id);
                    }
                    update = true;
                });

                $rootScope.$on('fmChangeMap', function(evt, mapId) {
                    logger.debug('Map changed', mapService.current);
                    removeAll();
                    for (var id in mapService.current.map.resources) {
                        drawResource(id, mapService.current.map.resources[id]);
                    }
                    update = true;
                    updateLabels();
                });

                renderer = THREEService.getRenderer();

                boxInit();
                animate();
                onCameraChange();

                function boxInit() {
                    //container = canvasElement;
                    container = document.getElementById('the-canvas');
                    //document.body.appendChild(container);
                    //viewSize = container.clientWidth;

                    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
                    camera.position.z = 1000;

                    controls = new THREE.TrackballControls(camera);
                    controls.rotateSpeed = 1.0;
                    controls.zoomSpeed = 1.2;
                    controls.panSpeed = 0.8;
                    controls.noZoom = false;
                    controls.noPan = false;
                    controls.staticMoving = true;
                    controls.dynamicDampingFactor = 0.3;
                    controls.keys = [ 65, 83, 68 ];
                    controls.addEventListener('change', function() {
                        onCameraChange();
                    });
                    // hide labels during camera change for performance reason
                    controls.addEventListener('start', function() {
                        hideLabels();
                    });
                    controls.addEventListener('end', function() {
                        updateLabels();
                    });

                    scene = new THREE.Scene();
                    scene.add(new THREE.AmbientLight(0x505050));

                    var light = new THREE.SpotLight(0xffffff, 1.5);
                    light.position.set(0, 70, 2000);
                    light.castShadow = true;

                    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 200, 10000));
                    light.shadow.bias = - 0.00022;

                    light.shadow.mapSize.width = 2048;
                    light.shadow.mapSize.height = 2048;

                    scene.add(light);

                    // Ground
                    var groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
                    var ground = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(5000, 5000), groundMaterial
                    );
                    //ground.rotation.x = - Math.PI / 2; // rotate X/Y to X/Z
                    ground.receiveShadow = true;
                    scene.add(ground);

                    // Grid
                    /*
                    var grid = new THREE.GridHelper(5000, 200, 0xdddddd, 0xdddddd);
                    grid.position.set(100, 100, 0);
                    grid.rotation.x = Math.PI / 2;
                    grid.receiveShadow = true;
                    scene.add(grid);
                    */

                    // ground material
                    var textureLoader = new THREE.TextureLoader();
                    textureLoader.load('images/grid.png', function(texture) {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(100, 100);
                        groundMaterial.map = texture;
                        groundMaterial.needsUpdate = true;
                    });

                    geometry = new THREE.BoxGeometry(40, 56.57, 6);
                    for (var i = 0; i < 0; i++) {
                        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                            color: Math.random() * 0xffffff
                        }));

                        object.position.x = Math.random() * 1000 - 500;
                        object.position.y = Math.random() * 600 - 300;
                        object.position.z = Math.random() * 800 - 400;

                        //object.rotation.x = Math.random() * 2 * Math.PI;
                        //object.rotation.y = Math.random() * 2 * Math.PI;
                        //object.rotation.z = Math.random() * 2 * Math.PI;

                        object.rotation.x = 1;
                        object.rotation.y = 1;
                        object.rotation.z = 1;

                        //object.scale.x = Math.random() * 2 * 1;
                        //object.scale.y = Math.random() * 2 * 1;
                        //object.scale.z = Math.random() * 2 * 1;

                        object.scale.x = 1;
                        object.scale.y = 1;
                        object.scale.z = 1;


                        object.castShadow = true;
                        object.receiveShadow = true;

                        scene.add(object);

                        objects.push(object);
                    }


                    renderer.setClearColor(0xf0f0f0);
                    renderer.setPixelRatio(1);
                    //renderer.setPixelRatio(window.devicePixelRatio);
                    //renderer.setSize(viewSize, viewSize);
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    console.log('WINDOW SIZE', window.innerWidth, window.innerHeight);
                    renderer.sortObjects = false;

                    renderer.shadowMap.enabled = true;
                    renderer.shadowMap.type = THREE.PCFShadowMap;

                    container.appendChild(renderer.domElement);

                    var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
                    dragControls.addEventListener('dragstart', function(event) {
                        controls.enabled = false;
                        event.object.userData.startPos = {
                            x: event.object.position.x,
                            y: event.object.position.y,
                            z: event.object.position.z,
                            time: new Date().getTime(),
                        };
                    });
                    dragControls.addEventListener('dragend', function(event) {
                        controls.enabled = true;
                        var threshold = 10;
                        var resource = event.object.userData.resource;
                        if (Math.abs(event.object.position.x - event.object.userData.startPos.x) < threshold &&
                            Math.abs(event.object.position.y - event.object.userData.startPos.y) < threshold &&
                            Math.abs(event.object.position.z - event.object.userData.startPos.z) < threshold) {

                            // check how long user pressed it
                            var elapsed = new Date().getTime() - event.object.userData.startPos.time;
                            var selectionTime = 500;
                            if (elapsed < selectionTime) {
                                // didnt move much, open it
                                logger.debug('Open resource', mapService.current.map, resource);
                                dataService.openResource(mapService.current.map.id, resource.id);
                            }
                            else {
                                logger.debug('SET SELECTED', resource);
                                // $apply needed because outside of Angular
                                $rootScope.$apply(function() {
                                    selectionService.replace([resource]);
                                });
                            }

                        }
                        else {
                            // moved enough to not to be opened
                            resource.pos.x = event.object.position.x;
                            resource.pos.y = event.object.position.y;
                            resource.pos.z = event.object.position.z;
                            dataService.updateResources(1, [ resource ]);
                            onCameraChange();
                        }
                        updateLabels();
                    });

                    window.addEventListener('resize', onWindowResize, false);

                    // initialize map
                    mapService.init();
                }

                // ---------------------------------
                // Event listeners
                // ---------------------------------
                // Cancel animation when view route or state changes
                // e.g. watch for state change when using ui-router:
                $rootScope.$on('$stateChangeStart', function() {
                    cancelAnimationFrame(animation);
                });

                // ---------------------------------
                // Draw and Animate
                // ---------------------------------
                function animate() {
                    setTimeout(function() {
                        animation = requestAnimationFrame(animate);
                    }, 1000 / 60);
                    render();
                }

                function render() {
                    //torus.rotation.x += 0.006;
                    //torus.rotation.y += 0.006;
                    //renderer.render(scene, camera, null, true); // forceClear == true
                    controls.update();
                    renderer.render(scene, camera);
                }

                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);

                    controls.handleResize();
                    render();
                }

                function drawResource(id, resource) {
                    logger.debug('drawResource', resource);
                    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                        color: Math.random() * 0xffffff
                    }));

                    resource.id = parseInt(id);
                    object.userData = {
                        label: null,
                        resource: resource,
                    };

                    object.position.x = resource.pos.x;
                    object.position.y = resource.pos.y;
                    object.position.z = resource.pos.z;

                    object.rotation.x = 0;
                    object.rotation.y = 0;
                    object.rotation.z = 0;

                    //object.scale.x = Math.random() * 2 * 1;
                    //object.scale.y = Math.random() * 2 * 1;
                    //object.scale.z = Math.random() * 2 * 1;

                    object.scale.x = 1;
                    object.scale.y = 1;
                    object.scale.z = 1;

                    object.castShadow = true;
                    object.receiveShadow = true;

                    scene.add(object);

                    objects.push(object);

                    // label
                    var text2 = document.createElement('div');
                    text2.style.display = 'none';
                    text2.style.position = 'absolute';
                    text2.style.width = 100;
                    text2.style.height = 100;
                    text2.style.zindex = 1;
                    //text2.style.backgroundColor = 'blue';
                    text2.innerHTML = resource.path;
                    /*
                    var ppos = toScreenPosition(object);
                    text2.style.left = ppos.x + 'px';
                    text2.style.top = ppos.y + 'px';
                    */
                    document.body.appendChild(text2);
                    labels.push(text2);
                }

                function removeResource(resourceId) {
                    for (var i = 0; i < objects.length; i++) {
                        if (objects[i].userData.resource.id === resourceId) {
                            scene.remove(objects[i]);
                            objects.splice(i, 1);
                            labels[i].remove();
                            labels.splice(i, 1);
                            logger.debug('removed', resourceId);
                            return true;
                        }
                    }
                    logger.debug('Remove: not found', resourceId);
                    return false;
                }

                function removeAll() {
                    for (var i = 0; i < objects.length; i++) {
                        scene.remove(objects[i]);
                        labels[i].remove();
                    }
                    objects.length = 0;
                    labels.length = 0;
                    logger.debug('All resources removed');
                }

                function onCameraChange() {
                    /*
                    for (var i = 0; i < objects.length; i++) {
                        var object = objects[i];
                        var proj = toScreenPosition(object);
                        labels[i].style.left = proj.x + 'px';
                        labels[i].style.top = proj.y + 'px';
                    }
                    */
                    var selection = selectionService.get();
                    if (selection.length) {
                        // $apply needed because outside of Angular
                        $rootScope.$apply(function() {
                            selectionService.clear();
                        });
                    }
                }

                function updateLabels() {
                    for (var i = 0; i < objects.length; i++) {
                        var proj = toScreenPosition(objects[i]);
                        labels[i].style.display = 'block';
                        labels[i].style.left = proj.x + 'px';
                        labels[i].style.top = (proj.y + 20) + 'px';
                    }
                }

                function hideLabels() {
                    for (var i = 0; i < objects.length; i++) {
                        labels[i].style.display = 'none';
                        var object = objects[i];
                        var proj = toScreenPosition(objects[i]);
                        labels[i].style.left = proj.x + 'px';
                        labels[i].style.top = proj.y + 'px';
                    }
                }

                function toScreenPosition(obj) {
                    var vector = new THREE.Vector3();
                    var widthHalf = 0.5*renderer.context.canvas.width;
                    var heightHalf = 0.5*renderer.context.canvas.height;

                    obj.updateMatrixWorld();
                    vector.setFromMatrixPosition(obj.matrixWorld);
                    //console.debug('FOO', vector);
                    //vector.map(camera);

                    vector.x = (vector.x * widthHalf) + widthHalf;
                    vector.y = - (vector.y * heightHalf) + heightHalf;
                    return {
                        x: vector.x,
                        y: vector.y
                    };
                }
            //});
            //});
        }

        function tick(event) {
        }
    }
})();
