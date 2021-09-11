package db

import (
	"context"
	"time"

	"github.com/FlowKeeper/FlowUtils/v2/models"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//CreateItem creates an item with the specfied variables and returns the ID of the newly created document
func CreateItem(Name, Description string, ReturnType models.ReturnType, Unit string, Interval int, Command string, OS models.AgentOS) (primitive.ObjectID, error) {
	item := models.Item{
		Name:        Name,
		Description: Description,
		Returns:     ReturnType,
		Unit:        Unit,
		Interval:    Interval,
		Command:     Command,
		CheckOn:     OS,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	result, err := dbclient.Collection("items").InsertOne(ctx, item)
	if err != nil {
		logger.Error(loggingArea, "Couldn't add item:", err)
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}
