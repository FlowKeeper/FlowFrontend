package db

import (
	"context"
	"time"

	"github.com/FlowKeeper/FlowFrontend/v2/config"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var rawclient *mongo.Client
var dbclient *mongo.Database

const loggingArea = "DB"

func Connect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.Config.MongoDB))

	if err != nil {
		return err
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return err
	}

	rawclient = client
	dbclient = client.Database("flowkeeper")
	logger.Info(loggingArea, "Connected to MongoDB")

	ensureIndexes()
	logger.Info(loggingArea, "DB subsystem is ready")
	return nil
}

func Client() *mongo.Database {
	return dbclient
}
