package redis

import (
	"github.com/FlowKeeper/FlowFrontend/v2/config"
	"github.com/go-redis/redis"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
)

var connection *redis.Client

const loggingArea = "Redis"

//Init is called to initialize the connection
func Init() {
	logger.Info(loggingArea, "Redis is being initialized")

	opts, err := redis.ParseURL(config.Config.Redis)
	if err != nil {
		logger.Fatal(loggingArea, "Couldn't interpret Redis URL:", err)
	}
	connection = redis.NewClient(opts)

	_, err = connection.Ping().Result()
	if err != nil {
		logger.Fatal(loggingArea, "Couldn't connect to redis: ", err)
	}

	logger.Info(loggingArea, "Connection to Redis established")
}

//Alive returns wheter the redis connection is alive or not
func Alive() bool {
	_, err := connection.Ping().Result()
	if err != nil {
		return false
	}

	return true
}
