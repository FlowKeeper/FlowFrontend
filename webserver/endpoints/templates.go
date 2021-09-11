package endpoints

import (
	"net/http"

	httphelper "gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpHelper"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpResponse"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/stringHelper"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/db"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/dbtemplate"
	"gitlab.cloud.spuda.net/flowkeeper/flowutils/v2/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetTemplates(w http.ResponseWriter, r *http.Request) {
	templates, err := dbtemplate.GetAllTemplates(db.Client())
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", templates)
}

func CreateTemplate(w http.ResponseWriter, r *http.Request) {
	if httphelper.HasEmptyBody(w, r) {
		return
	}

	var request struct {
		Name, Description string
		Items             []string
		Triggers          []string
	}

	if err := httphelper.CastBodyToStruct(w, r, &request); err != nil {
		return
	}

	if stringHelper.IsEmpty(request.Name) {
		httpResponse.UserError(w, 400, "Please specify a name for the new template")
		return
	}

	var template models.Template
	for _, k := range request.Items {
		id, err := primitive.ObjectIDFromHex(k)
		if err != nil {
			httpResponse.UserError(w, 400, "The specified item id wasn't valid:"+k)
			return
		}

		template.ItemIDs = append(template.ItemIDs, id)
	}

	for _, k := range request.Triggers {
		id, err := primitive.ObjectIDFromHex(k)
		if err != nil {
			httpResponse.UserError(w, 400, "The specified trigger id wasn't valid:"+k)
			return
		}

		template.TriggerIDs = append(template.TriggerIDs, id)
	}

	//Check if some items / triggers were specified multiple times
	duplicatesCheck := make([]primitive.ObjectID, 0)
	for _, k := range template.ItemIDs {
		if !sliceContainsObjectID(duplicatesCheck, k) {
			duplicatesCheck = append(duplicatesCheck, k)
		} else {
			httpResponse.UserError(w, 400, "The following item id was specified multiple times:"+k.Hex())
			return
		}
	}

	for _, k := range template.TriggerIDs {
		if !sliceContainsObjectID(duplicatesCheck, k) {
			duplicatesCheck = append(duplicatesCheck, k)
		} else {
			httpResponse.UserError(w, 400, "The following item trigger was specified multiple times:"+k.Hex())
			return
		}
	}

	templateID, err := db.CreateTemplate(template.Name, template.Description, template.ItemIDs, template.TriggerIDs)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	//Return the newly create template
	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Created", templates[0])
}

func sliceContainsObjectID(Slice []primitive.ObjectID, ID primitive.ObjectID) bool {
	for _, k := range Slice {
		if k == ID {
			return true
		}
	}
	return false
}
