package user

import (
	"encoding/json"
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
	router.GET("/users/all", h.GetAll)
	router.GET("/users/workers&drivers", h.GetWorkersAndDrivers)
	//router.GET("/users/:id", h.GetByID)
	router.POST("/users", h.Create)
	//router.PUT("/users/:id", h.Update)
	//router.DELETE("/users/:id", h.Delete)
}

func (h *handler) GetAll(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	users, err := h.service.GetAll(r.Context())
	if err != nil {
		h.logger.Error("failed to get users", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	h.respondWithJSON(w, http.StatusOK, users)
}

func (h *handler) GetWorkersAndDrivers(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Error("Date parameter is missing")
		h.respondWithError(w, http.StatusBadRequest, "Missing 'date' query parameter")
		return
	}

	drivers, workers, err := h.service.GetWorkersAndDrivers(r.Context(), date)
	if err != nil {
		h.logger.Errorf("Failed to get users: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	response := map[string]interface{}{
		"drivers": drivers,
		"workers": workers,
	}

	h.respondWithJSON(w, http.StatusOK, response)
}



func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		h.logger.Error("failed to decode user", err)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.Create(r.Context(), &user); err != nil {
		h.logger.Error("failed to create user", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User created"))
}

func (h *handler) respondWithError(w http.ResponseWriter, code int, message string) {
	h.respondWithJSON(w, code, map[string]string{"error": message})
}

func (h *handler) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		h.logger.Errorf("Failed to encode response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
