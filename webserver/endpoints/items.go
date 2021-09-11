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
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateItem(w http.ResponseWriter, r *http.Request) {
	if httphelper.HasEmptyBody(w, r) {
		return
	}

	var request struct {
		Name, Description string
		Type              string
		Unit              string
		Interval          int
		Command           string
		OS                string
	}

	var returnType models.ReturnType
	var checkOnOS models.AgentOS

	if err := httphelper.CastBodyToStruct(w, r, &request); err != nil {
		return
	}

	if stringHelper.IsEmpty(request.Name) {
		httpResponse.UserError(w, 400, "Please specify a name for the new item")
		return
	}
	if stringHelper.IsEmpty(request.Type) {
		httpResponse.UserError(w, 400, `Please specify a type (numeric / text) for the new item`)
		return
	}
	if stringHelper.IsEmpty(request.Command) {
		httpResponse.UserError(w, 400, "Please specify a command for the new item")
		return
	}
	if stringHelper.IsEmpty(request.OS) {
		httpResponse.UserError(w, 400, `Please specify a os (windows / linux) for the new item`)
		return
	}

	if request.Interval <= 0 {
		httpResponse.UserError(w, 400, "Please specify a valid interval (greater than 0)")
		return
	}

	//Check if an item with that name can be found in the db -> If so no error is returned by the function
	//If an error is returned -> Check if it is the error we wanted
	if _, err := dbtemplate.GetItemByName(db.Client(), request.Name); err == nil {
		httpResponse.UserError(w, 400, "A item with that name already exists")
		return
	} else {
		if !errors.Is(err, mongo.ErrNoDocuments) {
			httpResponse.InternalError(w, r, err)
			return
		}
	}

	switch strings.ToLower(request.Type) {
	case "numeric":
		returnType = models.Numeric
	case "text":
		returnType = models.Text
	default:
		httpResponse.UserError(w, 400, `Please specify either numeric or "text" as item type`)
		return
	}

	switch strings.ToLower(request.OS) {
	case "windows":
		checkOnOS = models.Windows
	case "linux":
		checkOnOS = models.Linux
	default:
		httpResponse.UserError(w, 400, `Please specify either windows or linux as item type`)
		return
	}

	itemid, err := db.CreateItem(request.Name, request.Description, returnType, request.Unit, request.Interval, request.Command, checkOnOS)
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	item, err := dbtemplate.GetItems(db.Client(), []primitive.ObjectID{itemid})
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "Created", item[0])
}
