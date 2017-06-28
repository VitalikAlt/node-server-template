# config-json
## Description
Node module for reading and caching json configs.

## Usage

Use libary:
```
const config = require("config-json");
```

Use configs data:
```
const config = require("config-json").data;
```

Config list template:
```
//local.json
{
  "includes": [
    "secrets/api_conf.json",
    "secrets/server_version.json",
    "secrets/admin_secret.json",

    "shared_config/shared_config.common.json",
    "shared_config/locations/locations.json",
    "shared_config/texts/texts.json",
    "shared_config/products/",
    "shared_config/items/",
    "shared_config/actions/",
    "shared_config/quests/",
    "shared_config/shared_config.local.json"
  ]
}
```

Add config list:
```
config.loadList(path.join(appRoot, 'config', `local.json`));
```

*If you want to load configs recursive, and your confgis include some list files you must name them "includes_list.json"

Add config file:
```
config.load(path.join(appRoot, 'config', `local.json`));
```

Add configs data:
```
config.data.database = require(path.join(appRoot, 'config', 'database', `database.${process.env.NODE_ENV}.json`));
```

Add configs data from env:
```
const secret_params = ['admin_secret', 'server_version']; //if you run your project with ADMIN_SECRET=value1 then configs.data.admin_sercret will be value1
config.setParamsToCfgFromEnv(secret_params);
```
