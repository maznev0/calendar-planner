package user

import (
	"net/http"
	"server/internal/handlers"
	"server/pkg/logging"

	"github.com/julienschmidt/httprouter"
)

type handler struct {
	logger *logging.Logger
	service Service
}

func NewHandler(logger *logging.Logger, service Service) handlers.Handler {
	return &handler{
		logger: logger,
		service: service,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.GET("/users", h.GetAll)
	//router.GET("/users/:id", h.GetByID)
	//router.POST("/users", h.Create)
	//router.PUT("/users/:id", h.Update)
	//router.DELETE("/users/:id", h.Delete)
}

func (h *handler) GetAll(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("all users"))
}

// TODO: more methods