package main

import (
	"fmt"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/config"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/db"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/redis"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/webserver"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/flowutils"
)

func main() {
	logger.Info("MAIN", "Starting up FlowKeeper FlowFrontend!")
	utilsVersion := flowutils.Version()
	logger.Info("UTILS", fmt.Sprintf("Running FlowUtils Version: %d-%d-%s", utilsVersion.Major, utilsVersion.Minor, utilsVersion.Comment))

	config.Init()
	if err := db.Connect(); err != nil {
		logger.Fatal("DB", "Couldn't connect to database:", err)
	}

	//Redis init throws fatal if connection fails
	redis.Init()
	webserver.Init()
}
