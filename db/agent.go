package db

import (
	"context"
	"time"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetAgents() ([]models.Agent, error) {
	var agents []models.Agent

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	result, err := dbclient.Collection("agents").Find(ctx, bson.M{})

	if err != nil {
		logger.Error(loggingArea, "Couldn't fetch agents from db:", err)
		return agents, err
	}

	err = result.All(ctx, &agents)

	if err != nil {
		logger.Error(loggingArea, "Couldn't decode agents:", err)
	}

	return agents, nil
}
