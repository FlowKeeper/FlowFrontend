package endpoints

import (
	"errors"
	"net/http"
	"strings"

	"github.com/FlowKeeper/FlowFrontend/v2/db"
	"github.com/FlowKeeper/FlowUtils/v2/dbtemplate"
	"github.com/FlowKeeper/FlowUtils/v2/models"
	httphelper "gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpHelper"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpResponse"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/stringHelper"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//GetTemplates returns all templates to the client
func GetTemplates(w http.ResponseWriter, r *http.Request) {
	templates, err := dbtemplate.GetAllTemplates(db.Client())
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", templates)
}

//GetTemplate returns a single template from the database
func GetTemplate(w http.ResponseWriter, r *http.Request) {
	templateIDRAW := strings.Split(r.URL.Path, "/")[4]
	templateID, err := primitive.ObjectIDFromHex(templateIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified template id was invalid")
		return
	}

	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.UserError(w, 404, "Specified template wasn't found")
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", templates[0])
}

//CreateTemplate creates a new template and persists it in the database
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

	templateID, err := db.CreateTemplate(request.Name, request.Description, template.ItemIDs, template.TriggerIDs)
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

//AddItemToTemplate adds one or multiple items to the specified template
func AddItemToTemplate(w http.ResponseWriter, r *http.Request) {
	templateIDRAW := strings.Split(r.URL.Path, "/")[4]
	templateID, err := primitive.ObjectIDFromHex(templateIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified template id was invalid")
		return
	}

	if httphelper.HasEmptyBody(w, r) {
		return
	}

	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.UserError(w, 404, "Specified template id wasn't found")
		return
	}

	template := templates[0]

	var request struct {
		Items []string
	}
	if httphelper.CastBodyToStruct(w, r, &request) != nil {
		return
	}

	if len(request.Items) == 0 {
		httpResponse.UserError(w, 400, "At least one new item needs to be specified")
		return
	}

	newItems := make([]primitive.ObjectID, 0)
	for _, k := range request.Items {
		itemID, err := primitive.ObjectIDFromHex(k)
		if err != nil {
			httpResponse.UserError(w, 400, "The following item id was invalid:"+k)
			return
		}

		newItems = append(newItems, itemID)
	}

	fetchedItems, err := dbtemplate.GetItems(db.Client(), newItems)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(fetchedItems) != len(newItems) {
		httpResponse.UserError(w, 404, "At least one of the specified items wasn't found")
		return
	}

	for _, k := range template.ItemIDs {
		if sliceContainsObjectID(newItems, k) {
			httpResponse.UserError(w, 400, "The following item is already linked to the template: "+k.Hex())
			return
		}
	}

	if err := db.AddItemsToTemplate(template.ID, newItems); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	templates, err = dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{template.ID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Added", templates[0])
}

//AddTriggerToTemplate adds one or multiple triggers to the specified template
func AddTriggerToTemplate(w http.ResponseWriter, r *http.Request) {
	templateIDRAW := strings.Split(r.URL.Path, "/")[4]
	templateID, err := primitive.ObjectIDFromHex(templateIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified template id was invalid")
		return
	}

	if httphelper.HasEmptyBody(w, r) {
		return
	}

	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.UserError(w, 404, "Specified template id wasn't found")
		return
	}

	template := templates[0]

	var request struct {
		Triggers []string
	}
	if httphelper.CastBodyToStruct(w, r, &request) != nil {
		return
	}

	if len(request.Triggers) == 0 {
		httpResponse.UserError(w, 400, "At least one new trigger needs to be specified")
		return
	}

	newTriggers := make([]primitive.ObjectID, 0)
	for _, k := range request.Triggers {
		triggerID, err := primitive.ObjectIDFromHex(k)
		if err != nil {
			httpResponse.UserError(w, 400, "The following trigger id was invalid:"+k)
			return
		}

		newTriggers = append(newTriggers, triggerID)
	}

	fetchedTriggers, err := dbtemplate.GetTriggers(db.Client(), newTriggers)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(fetchedTriggers) != len(newTriggers) {
		httpResponse.UserError(w, 404, "At least one of the specified triggers wasn't found")
		return
	}

	for _, k := range template.TriggerIDs {
		if sliceContainsObjectID(newTriggers, k) {
			httpResponse.UserError(w, 400, "The following trigger is already linked to the template: "+k.Hex())
			return
		}
	}

	if err := db.AddTriggersToTemplate(template.ID, newTriggers); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	templates, err = dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{template.ID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Added", templates[0])
}

//RemoveItemFromTemplate unlinks the specified item from the template
func RemoveItemFromTemplate(w http.ResponseWriter, r *http.Request) {
	templateIDRAW := strings.Split(r.URL.Path, "/")[4]
	templateID, err := primitive.ObjectIDFromHex(templateIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified template id was invalid")
		return
	}

	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.UserError(w, 404, "Specified template wasn't found")
		return
	}

	//We need a function for retrieving a single template
	template := templates[0]

	//Retrieve specified item
	itemIDRAW := strings.Split(r.URL.Path, "/")[6]
	itemID, err := primitive.ObjectIDFromHex(itemIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified item id was invalid")
		return
	}

	resolvedItems, err := dbtemplate.GetItems(db.Client(), []primitive.ObjectID{itemID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(resolvedItems) == 0 {
		httpResponse.UserError(w, 404, "Specified item wasn't found")
		return
	}

	if !sliceContainsObjectID(template.ItemIDs, itemID) {
		httpResponse.UserError(w, 404, "Specified item isn't linked to the template")
		return
	}

	if err := db.UnlinkItemFromTemplate(templateID, itemID); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	//Return the newly updated template
	templates, err = dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.InternalError(w, r, errors.New("template vanished after unlinking item?"))
		return
	}
	httpResponse.SuccessWithPayload(w, "Deleted", templates[0])
}

//RemoveTriggerFromTemplate unlinks the specified trigger from the template
func RemoveTriggerFromTemplate(w http.ResponseWriter, r *http.Request) {
	templateIDRAW := strings.Split(r.URL.Path, "/")[4]
	templateID, err := primitive.ObjectIDFromHex(templateIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified template id was invalid")
		return
	}

	templates, err := dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.UserError(w, 404, "Specified template wasn't found")
		return
	}

	//We need a function for retrieving a single template
	template := templates[0]

	//Retrieve specified trigger
	triggerIDRAW := strings.Split(r.URL.Path, "/")[6]
	triggerID, err := primitive.ObjectIDFromHex(triggerIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified trigger id was invalid")
		return
	}

	_, err = dbtemplate.GetTrigger(db.Client(), triggerID)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if !sliceContainsObjectID(template.TriggerIDs, triggerID) {
		httpResponse.UserError(w, 404, "Specified trigger isn't linked to the template")
		return
	}

	if err := db.UnlinkTriggerFromTemplate(templateID, triggerID); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	//Return the newly updated template
	templates, err = dbtemplate.GetTemplates(db.Client(), []primitive.ObjectID{templateID})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(templates) == 0 {
		httpResponse.InternalError(w, r, errors.New("template vanished after unlinking trigger?"))
		return
	}
	httpResponse.SuccessWithPayload(w, "Deleted", templates[0])
}

func sliceContainsObjectID(Slice []primitive.ObjectID, ID primitive.ObjectID) bool {
	for _, k := range Slice {
		if k == ID {
			return true
		}
	}
	return false
}
