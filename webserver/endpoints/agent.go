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

func GetAgents(w http.ResponseWriter, r *http.Request) {
	agents, err := dbtemplate.GetAgents(db.Client())
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", agents)
}

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
