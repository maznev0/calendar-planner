package user

import (
	"net/http"
	"server/internal/handlers"
	"server/pkg/logging"

	"github.com/julienschmidt/httprouter"
)

type handler struct {
	logger *logging.Logger
}

func NewHandler(logger *logging.Logger) handlers.Handler {
	return &handler{
		logger: logger,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.GET("/users", h.GetUsers)
	// TODO: more routes
}

func (h *handler) GetUsers(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("all users"))
}

// TODO: more methods