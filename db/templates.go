package db

import (
	"context"
	"time"

	"github.com/FlowKeeper/FlowUtils/v2/models"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//CreateTemplate creates a template from the specified variables and returns the ID of the newly created document
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

//AddItemsToTemplate adds the specified items to the specified template
func AddItemsToTemplate(TemplateID primitive.ObjectID, Items []primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$push": bson.M{"itemids": bson.M{"$each": Items}}})

	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't add items to template:", result.Err())
	}

	return result.Err()
}

//AddTriggersToTemplate adds the specified triggers to the specified template
func AddTriggersToTemplate(TemplateID primitive.ObjectID, Triggers []primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$push": bson.M{"triggerids": bson.M{"$each": Triggers}}})

	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't add triggers to template:", result.Err())
	}

	return result.Err()
}

func UnlinkItemFromTemplate(TemplateID primitive.ObjectID, ItemID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$pull": bson.M{"itemids": ItemID}})
	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't unlink item from template:", result.Err())
	}

	return result.Err()
}

func UnlinkTriggerFromTemplate(TemplateID primitive.ObjectID, TriggerID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	result := dbclient.Collection("templates").FindOneAndUpdate(ctx, bson.M{"_id": TemplateID}, bson.M{"$pull": bson.M{"triggerids": TriggerID}})
	if result.Err() != nil {
		logger.Error(loggingArea, "Couldn't unlink trigger from template:", result.Err())
	}

	return result.Err()
}
