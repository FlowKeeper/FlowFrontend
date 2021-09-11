package main

import (
	"fmt"

	"github.com/FlowKeeper/FlowFrontend/v2/config"
	"github.com/FlowKeeper/FlowFrontend/v2/db"
	"github.com/FlowKeeper/FlowFrontend/v2/redis"
	"github.com/FlowKeeper/FlowFrontend/v2/webserver"
	"github.com/FlowKeeper/FlowUtils/v2/flowutils"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
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
