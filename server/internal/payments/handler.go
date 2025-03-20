package payments

import (
	"context"
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
	router.POST("/payments/update", h.Update)
}

func (h *handler) Update(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var payment Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		h.logger.Error("Failed to decode request body", err)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.Update(context.Background(), payment); err != nil {
		h.logger.Error("Failed to update payment", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update payment")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Payment updated successfully"})
	h.logger.Info("Payment updated successfully.")
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