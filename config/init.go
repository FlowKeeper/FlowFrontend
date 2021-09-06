package config

import (
	"encoding/json"
	"fmt"
	"os"
	"runtime"
	"strconv"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/stringHelper"
)

type SampleConfig struct {
	Debug         bool
	ListenAddress string
	ListenPort    int
	MongoDB       string
	Redis         string
}

const linuxConfigPath = "/etc/flowfrontend/config.json"
const windowsConfigPath = `C:\flowfrontend\config.json`

var configPath = ""

var Config SampleConfig

const loggingArea = "CONFIG"

//Init initializes the config struct
func Init() {
	var useENV bool
	var err error
	if !stringHelper.IsEmpty(os.Getenv("FLOW_ENV")) {
		useENV, err = strconv.ParseBool(os.Getenv("FLOW_ENV"))
	}

	//Determine OS and use specific paths for config and cache
	switch runtime.GOOS {
	case "windows":
		configPath = windowsConfigPath
	case "linux":
		configPath = linuxConfigPath
	default:
		logger.Fatal(loggingArea, "Frontend is running on unsupported platform:", runtime.GOOS)
	}

	if !useENV || err != nil {
		content, err := os.ReadFile(configPath)
		if os.IsNotExist(err) {
			logger.Fatal(loggingArea, fmt.Sprintf("No such file or directory: %s. Was the frontend intalled properly?", configPath))
		}

		if err := json.Unmarshal(content, &Config); err != nil {
			logger.Fatal(loggingArea, "Couldn't parse config:", err)
		}
	} else {
		readEnv()
	}

	//Sanity check config
	if stringHelper.IsEmpty(Config.ListenAddress) {
		if !useENV {
			logger.Fatal(loggingArea, "ListenAddress is malformed. Example: \"0.0.0.0\"")
		} else {
			logger.Warning(loggingArea, "Using default ListenAddress: 0.0.0.0")
			Config.ListenAddress = "0.0.0.0"
		}
	}

	if Config.ListenPort == 0 {
		if !useENV {
			logger.Fatal(loggingArea, "ListenPort is malformed. Example: 5000")
		} else {
			logger.Warning(loggingArea, "Using default ListenPort: 5000")
			Config.ListenPort = 5000
		}
	}

	if stringHelper.IsEmpty(Config.MongoDB) {
		if !useENV {
			logger.Fatal(loggingArea, "MongoDB is malformed. Example: mongodb://localhost")
		} else {
			logger.Warning(loggingArea, "MongoDB is malformed / not set. Please set the ENV Variable: FLOW_MONGODB = mongodb://localhost")
			logger.Warning(loggingArea, "Using default address for mongodb: mongodb://localhost:27017")
			Config.MongoDB = "mongodb://localhost:27017"
		}
	}

	if stringHelper.IsEmpty(Config.Redis) {
		if !useENV {
			logger.Fatal(loggingArea, "Redis is malformed. Example: redis://localhost")
		} else {
			logger.Warning(loggingArea, "Redis is malformed / not set. Please set the ENV Variable: FLOW_REDIS = redis://localhost")
			logger.Warning(loggingArea, "Using default address for mongodb: redis://localhost:6379")
			Config.Redis = "redis://localhost:6379"
		}
	}

	if Config.Debug {
		logger.EnableDebugLog()
		logger.Debug(loggingArea, "Enabled debug logging")
	}

	logger.Info(loggingArea, "Config is operational")
}

func readEnv() {
	logger.Info(loggingArea, "Using ENV Variables as config")

	Config.ListenAddress = os.Getenv("FLOW_LISTEN_ADDRESS")
	Config.MongoDB = os.Getenv("FLOW_MONGODB")
	Config.Redis = os.Getenv("FLOW_REDIS")

	if port, err := strconv.Atoi(os.Getenv("FLOW_LISTEN_PORT")); err == nil {
		Config.ListenPort = port
	}

	if debugBoolean, err := strconv.ParseBool(os.Getenv("FLOW_DEBUG")); err == nil {
		Config.Debug = debugBoolean
	}
}
