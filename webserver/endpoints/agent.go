package endpoints

import (
	"errors"
	"net/http"
	"strings"

	"github.com/FlowKeeper/FlowFrontend/v2/db"
	"github.com/FlowKeeper/FlowUtils/v2/dbtemplate"
	httphelper "gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpHelper"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpResponse"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

//GetAgents returns all agents from the database
func GetAgents(w http.ResponseWriter, r *http.Request) {
	agents, err := dbtemplate.GetAllAgents(db.Client())
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", agents)
}

//AddTemplateToAgent adds the one or more templates to the specified agent
func AddTemplateToAgent(w http.ResponseWriter, r *http.Request) {
	agentIDRAW := strings.Split(r.URL.Path, "/")[4]
	agentID, err := primitive.ObjectIDFromHex(agentIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified agent id was invalid")
		return
	}

	if httphelper.HasEmptyBody(w, r) {
		return
	}

	agent, err := dbtemplate.GetAgent(db.Client(), agentID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			httpResponse.UserError(w, 404, "Specified agent wasn't found")
			return
		}
		httpResponse.InternalError(w, r, err)
		return
	}

	var request struct {
		Templates []string
	}
	if httphelper.CastBodyToStruct(w, r, &request) != nil {
		return
	}

	if len(request.Templates) == 0 {
		httpResponse.UserError(w, 400, "At least one new template needs to be specified")
		return
	}

	newTemplates := make([]primitive.ObjectID, 0)
	for _, k := range request.Templates {
		templateID, err := primitive.ObjectIDFromHex(k)
		if err != nil {
			httpResponse.UserError(w, 400, "The following template id was invalid:"+k)
			return
		}

		newTemplates = append(newTemplates, templateID)
	}

	fetchedTemplates, err := dbtemplate.GetTemplates(db.Client(), newTemplates)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	if len(fetchedTemplates) != len(newTemplates) {
		httpResponse.UserError(w, 404, "At least one of the specified templates wasn't found")
		return
	}

	for _, k := range agent.TemplateIDs {
		if sliceContainsObjectID(newTemplates, k) {
			httpResponse.UserError(w, 400, "The following template is already linked to the template: "+k.Hex())
			return
		}
	}

	if err := db.AddTemplatesToAgent(agent.ID, newTemplates); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	agent, err = dbtemplate.GetAgent(db.Client(), agent.ID)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Added", agent)
}

func PatchAgent(w http.ResponseWriter, r *http.Request) {
	agentIDRAW := strings.Split(r.URL.Path, "/")[4]
	agentID, err := primitive.ObjectIDFromHex(agentIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified agent id was invalid")
		return
	}

	if httphelper.HasEmptyBody(w, r) {
		return
	}

	_, err = dbtemplate.GetAgent(db.Client(), agentID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			httpResponse.UserError(w, 404, "Specified agent wasn't found")
			return
		}
		httpResponse.InternalError(w, r, err)
		return
	}

	var request struct {
		Name        string  `bson:"name,omitempty"`
		Description *string `bson:"description,omitempty"` //Pointers are used to determine if the field got specified at all or is just an empty string / boolean
		Endpoint    string  `bson:"endpoint,omitempty"`
		Enabled     *bool   `bson:"enabled,omitempty"`
	}

	if httphelper.CastBodyToStruct(w, r, &request) != nil {
		return
	}

	if err := db.PatchAgent(agentID, request); err != nil {
		//Mongo driver doesn't seem to have the error we want mapped to any variable
		if strings.Contains(err.Error(), `'$set' is empty.`) {
			httpResponse.UserError(w, 400, "PATCH request must at least update one property")
			return
		}

		httpResponse.InternalError(w, r, err)
		return
	}

	//Return current agent struct to client
	agent, err := dbtemplate.GetAgent(db.Client(), agentID)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Patched", agent)
}

func DeleteAgent(w http.ResponseWriter, r *http.Request) {
	agentIDRAW := strings.Split(r.URL.Path, "/")[4]
	agentID, err := primitive.ObjectIDFromHex(agentIDRAW)
	if err != nil {
		httpResponse.UserError(w, 400, "Specified agent id was invalid")
		return
	}

	agent, err := dbtemplate.GetAgent(db.Client(), agentID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			httpResponse.UserError(w, 404, "Specified agent wasn't found")
			return
		}
		httpResponse.InternalError(w, r, err)
		return
	}

	update := struct {
		Deleted bool
	}{
		Deleted: true,
	}

	if err := db.PatchAgent(agent.ID, update); err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.Success(w, "Deleted", "Deleted agent "+agent.ID.Hex())
}
