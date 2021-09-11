package webserver

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gitlab.cloud.spuda.net/Wieneo/golangutils/v2/logger"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/config"
	"gitlab.cloud.spuda.net/flowkeeper/flowfrontend/v2/webserver/endpoints"
)

const loggingArea = "WEB"

//Init starts the http server
func Init() {
	listenString := fmt.Sprintf("%s:%d", config.Config.ListenAddress, config.Config.ListenPort)
	logger.Info(loggingArea, "Listening on", listenString)
	router := mux.NewRouter()
	router.Use(loggingMiddleware)

	router.HandleFunc("/api/v1/agent", endpoints.GetAgents).Methods("GET")

	router.HandleFunc("/api/v1/template", endpoints.GetTemplates).Methods("GET")
	router.HandleFunc("/api/v1/template", endpoints.CreateTemplate).Methods("POST")

	router.HandleFunc("/api/v1/item", endpoints.CreateItem).Methods("POST")

	srv := &http.Server{
		Handler:      router,
		Addr:         listenString,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		logger.Fatal(loggingArea, "Couldn't open websocket:", err)
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info(loggingArea, r.Method, r.RemoteAddr, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}
