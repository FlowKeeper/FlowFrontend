package db

import (
	"context"
	"time"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTemplate(Name, Description string, Items []primitive.ObjectID, Triggers []primitive.ObjectID) (primitive.ObjectID, error) {
	template := models.Template{
		Name:        Name,
		Description: Description,
		ItemIDs:     Items,
		TriggerIDs:  Triggers,
	}

	if template.ItemIDs == nil {
		template.ItemIDs = make([]primitive.ObjectID, 0)
	}
	if template.TriggerIDs == nil {
		template.TriggerIDs = make([]primitive.ObjectID, 0)
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

func AddItemsToTemplate(TemplateID primitive.ObjectID, Items []primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$push": bson.M{"itemids": bson.M{"$each": Items}}})

	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't add items to template:", result.Err())
	}

	return result.Err()
}

func AddTriggersToTemplate(TemplateID primitive.ObjectID, Triggers []primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$push": bson.M{"triggerids": bson.M{"$each": Triggers}}})

	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't add triggers to template:", result.Err())
	}

	return result.Err()
}
