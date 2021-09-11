package db

import (
	"context"
	"time"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//AddTemplatesToAgent adds the secified templates to the specified agent
func AddTemplatesToAgent(AgentID primitive.ObjectID, Templates []primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("agents").FindOneAndUpdate(ctx, bson.M{"_id": AgentID}, bson.M{"$push": bson.M{"templateids": bson.M{"$each": Templates}}})

	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't add templates to agent:", result.Err())
	}

	return result.Err()
}
