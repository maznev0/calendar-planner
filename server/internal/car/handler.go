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
	router.GET("/cars", h.GetAll)
	router.POST("/car", h.Create)
	router.POST("/cars/swap", h.Swap)
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

func (h *handler) Swap(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var req struct {
		DriverID1 string `json:"driver_id1"`
		DriverID2 string `json:"driver_id2"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if req.DriverID1 == "" || req.DriverID2 == "" {
		h.respondWithError(w, http.StatusBadRequest, "One or more drivers id are empty")
		return
	}

	if err := h.service.Swap(r.Context(), req.DriverID1, req.DriverID2); err != nil {
		h.logger.Errorf("Error to swap cars: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to swap cars")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Cars swaped successfully"})
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