package endpoints

import (
	"net/http"

	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/httpResponse"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/db"
)

func GetAgents(w http.ResponseWriter, r *http.Request) {
	agents, err := db.GetAgents()
	if err != nil {
		httpResponse.InternalError(w, r, err)
		return
	}

	httpResponse.SuccessWithPayload(w, "OK", agents)
}
