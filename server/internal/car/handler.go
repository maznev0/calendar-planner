package car

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
	router.POST("/car", h.Create)
	router.GET("/cars", h.GetAll)
}

func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var request Car

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		h.logger.Errorf("Invalid request body: %v", err)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	err := h.service.Create(r.Context(), &request, request.DriverId)
	if err != nil {
		h.logger.Errorf("Failed to create car: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to create car")
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Car created successfully"))
	h.logger.Info("Car created.")
}

func (h *handler) GetAll(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	cars, err := h.service.GetAll(r.Context())
	if err != nil {
		h.logger.Errorf("Failed to get cars: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch cars")
		return
	}

	h.respondWithJSON(w, http.StatusOK, cars)
	h.logger.Info("Get All cars succesfully working.")
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