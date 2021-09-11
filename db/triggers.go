package db

import (
	"context"
	"time"

	"github.com/FlowKeeper/FlowUtils/v2/models"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//CreateTrigger creates a trigger from the specified variables and returns the ID of the newly created document
func CreateTrigger(Name, Description string, Severity models.TriggerSeverity, Expression string) (primitive.ObjectID, error) {
	trigger := models.Trigger{
		Name:        Name,
		Description: Description,
		Enabled:     true,
		Severity:    Severity,
		Expression:  Expression,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	result, err := dbclient.Collection("triggers").InsertOne(ctx, trigger)
	if err != nil {
		logger.Error(loggingArea, "Couldn't add trigger:", err)
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}
