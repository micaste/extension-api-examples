/**
 * Licensed to the Symphony Software Foundation (SSF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The SSF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 **/

// This is the message controller service, to be used for static and dynamic rendering
var messageControllerService = SYMPHONY.services.register("message:controller");

// All Symphony services are namespaced with SYMPHONY
SYMPHONY.remote.hello().then(
  function(data) {
    // Register our application with the Symphony client:
    // Subscribe the application to remote (i.e. Symphony's) services
    // Register our own local services
    SYMPHONY.application
      .register("hello", ["entity"], ["message:controller"])
      .then(
        function(response) {
          var entityService = SYMPHONY.services.subscribe("entity");
          entityService.registerRenderer(
            "com.symphony.hello",
            {},
            "message:controller"
          );

          var getStaticActionData = instanceId => ({
            "action-true": {
              service: "message:controller",
              label: "True",
              data: {
                instanceId,
                type: true
              }
            },
            "action-false": {
              service: "message:controller",
              label: "False",
              data: {
                instanceId,
                type: false
              }
            }
          });

          const generateMessageML = boolean => `<messageML>
              <action id="action-${boolean}" class="button tempo-btn"/>
          </messageML>`;

          messageControllerService.implement({
            action: function(data) {
              entityService.update(
                data.instanceId,
                generateMessageML(!data.type),
                getStaticActionData(data.instanceId)
              );
            },

            // Render the message sent by the app
            render: function() {
              // Generate a id for each entity (unique enough for sampling purposes)
              // Consider how to translate uuids as list indexing for more robust id marking
              var instanceId = Math.floor(Math.random() * 1000000);
              return {
                entityInstanceId: instanceId,
                template: generateMessageML(true),
                data: getStaticActionData(instanceId)
              };
            }
          });
        }.bind(this)
      );
  }.bind(this)
);
