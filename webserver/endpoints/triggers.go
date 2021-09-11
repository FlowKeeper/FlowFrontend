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
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTrigger(w http.ResponseWriter, r *http.Request) {
	if httphelper.HasEmptyBody(w, r) {
		return
	}

	var request struct {
		Name, Description, Severity, Expression string
	}

	var triggerSeverity models.TriggerSeverity

	if err := httphelper.CastBodyToStruct(w, r, &request); err != nil {
		return
	}

	if stringHelper.IsEmpty(request.Name) {
		httpResponse.UserError(w, 400, "Please specify a name for the new trigger")
		return
	}
	if stringHelper.IsEmpty(request.Severity) {
		httpResponse.UserError(w, 400, `Please specify a severity (info / low / medium / high) for the new trigger`)
		return
	}
	if stringHelper.IsEmpty(request.Expression) {
		httpResponse.UserError(w, 400, "Please specify a expression for the new trigger")
		return
	}

	//Check if an trigger with that name can be found in the db -> If so no error is returned by the function
	//If an error is returned -> Check if it is the error we wanted
	if _, err := dbtemplate.GetTriggerByName(db.Client(), request.Name); err == nil {
		httpResponse.UserError(w, 400, "A trigger with that name already exists")
		return
	} else {
		if !errors.Is(err, mongo.ErrNoDocuments) {
			httpResponse.InternalError(w, r, err)
			return
		}
	}

	switch strings.ToLower(request.Severity) {
	case "info":
		triggerSeverity = models.LOW
	case "low":
		triggerSeverity = models.LOW
	case "medium":
		triggerSeverity = models.MEDIUM
	case "high":
		triggerSeverity = models.HIGH
	default:
		httpResponse.UserError(w, 400, `Please specify one of the following as severity: info,low,medium,high`)
		return
	}

	triggerid, err := db.CreateTrigger(request.Name, request.Description, triggerSeverity, request.Expression)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	trigger, err := dbtemplate.GetTrigger(db.Client(), triggerid)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Created", trigger)
}
