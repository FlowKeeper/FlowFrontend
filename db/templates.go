package db

import (
	"context"
	"time"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTemplate(Name, Description string, Items []primitive.ObjectID, Triggers []primitive.ObjectID) (primitive.ObjectID, error) {
	template := models.Template{
		Name:        Name,
		Description: Description,
		ItemIDs:     Items,
		TriggerIDs:  Triggers,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	result, err := dbclient.Collection("templates").InsertOne(ctx, template)
	if err != nil {
		logger.Error(loggingArea, "Couldn't add template:", err)
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}
