#! /usr/bin/env bash
#title           :rude-v-mod.generator.sh
#description     :This script will make a vertical crud module .
#author          :matenoz
#date            :25-11-2015
#version         :0.1
#usage           :sh rude-v-mod.generator.sh my_module_name
#notes           :MEAN.js version 0.4.2
## Author name   : Massimo
####################################################################
#                                                                  #
####################################################################

MODULE_NAME=$1
#OPTION=$1

#Client
mkdir -p  modules/"$MODULE_NAME"s/client
cp template/client/client.module.js modules/"$MODULE_NAME"s/client/"$MODULE_NAME"s.client.module.js

#Client config
mkdir -p  modules/"$MODULE_NAME"s/client/config
cp template/client/config/client.config.js modules/"$MODULE_NAME"s/client/config/"$MODULE_NAME"s.client.config.js
cp template/client/config/client.routes.js modules/"$MODULE_NAME"s/client/config/"$MODULE_NAME"s.client.routes.js

#Client controllers
mkdir -p  modules/"$MODULE_NAME"s/client/controllers
cp template/client/controllers/client.controller.js modules/"$MODULE_NAME"s/client/controllers/"$MODULE_NAME"s.client.controller.js

#Client services
mkdir -p  modules/"$MODULE_NAME"s/client/services
cp template/client/services/client.service.js modules/"$MODULE_NAME"s/client/services/"$MODULE_NAME"s.client.services.js

# Client views
mkdir -p  modules/"$MODULE_NAME"s/client/views
cp template/client/views/create.client.view.html modules/"$MODULE_NAME"s/client/views/create-"$MODULE_NAME".client.view.html
cp template/client/views/edit.client.view.html modules/"$MODULE_NAME"s/client/views/edit-"$MODULE_NAME".client.view.html
cp template/client/views/list.client.view.html modules/"$MODULE_NAME"s/client/views/list-"$MODULE_NAME"s.client.view.html
cp template/client/views/view.client.view.html modules/"$MODULE_NAME"s/client/views/view-"$MODULE_NAME".client.view.html

#Server
mkdir -p  modules/"$MODULE_NAME"s/server

# Server config
mkdir -p  modules/"$MODULE_NAME"s/server/config
cp template/server/config/server.config.js modules/"$MODULE_NAME"s/server/config/"$MODULE_NAME"s.server.config.js

# Server controllers
mkdir -p  modules/"$MODULE_NAME"s/server/controllers
cp template/server/controllers/server.controller.js modules/"$MODULE_NAME"s/server/controllers/"$MODULE_NAME"s.server.controller.js

# Server models
mkdir -p  modules/"$MODULE_NAME"s/server/models
cp template/server/models/server.model.js modules/"$MODULE_NAME"s/server/models/"$MODULE_NAME".server.model.js

# Server policies
mkdir -p  modules/"$MODULE_NAME"s/server/policies
cp template/server/policies/server.policy.js modules/"$MODULE_NAME"s/server/policies/"$MODULE_NAME"s.server.policy.js

# Server routes
mkdir -p  modules/"$MODULE_NAME"s/server/routes
cp template/server/routes/server.routes.js modules/"$MODULE_NAME"s/server/routes/"$MODULE_NAME"s.server.routes.js

# Tests client
mkdir -p  modules/"$MODULE_NAME"s/tests/client
cp template/tests/client/client.controller.tests.js modules/"$MODULE_NAME"s/tests/client/"$MODULE_NAME"s.client.controller.tests.js

# Tests e2e
mkdir -p  modules/"$MODULE_NAME"s/tests/e2e
cp template/tests/e2e/e2e.tests.js modules/"$MODULE_NAME"s/tests/e2e/"$MODULE_NAME"s.e2e.tests.js

# Tests server
mkdir -p  modules/"$MODULE_NAME"s/tests/server
cp template/tests/server/server.model.tests.js modules/"$MODULE_NAME"s/tests/server/"$MODULE_NAME".server.model.tests.js
cp template/tests/server/server.routes.tests.js modules/"$MODULE_NAME"s/tests/server/"$MODULE_NAME".server.routes.tests.js


find modules/$MODULE_NAME's' -type f -exec sed -i -e 's/classe/'$MODULE_NAME'/g' {} \;
find modules/$MODULE_NAME's' -type f -exec sed -i -e 's/Classe/'${MODULE_NAME^}'/g' {} \;
echo ' create module '$MODULE_NAME's'
tree -a modules/$MODULE_NAME's'

exit 1
