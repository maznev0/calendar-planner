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
	router.POST("/payments/update/bot", h.UpdateBot)
	router.GET("/payments/statistics/week", h.GetWeekPayments)
}

func (h *handler) Update(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var payment Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		h.logger.Error("Failed to decode request body", err)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.Update(context.Background(), payment); err != nil {
		h.logger.Errorf("Failed to update payment: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update payment")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Payment updated successfully"})
	h.logger.Info("Payment updated successfully.")
}

func (h *handler) UpdateBot(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var payment PaymentBot
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		h.logger.Error("Failed to decode request body", err)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.UpdateBot(context.Background(), payment); err != nil {
		h.logger.Errorf("Failed to update payment: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update payment")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Payment updated-BOT successfully"})
	h.logger.Info("Payment updated-BOT successfully.")
}

func (h *handler) GetWeekPayments(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	startDate := r.URL.Query().Get("start")
	endDate := r.URL.Query().Get("end")

	if startDate == "" || endDate == "" {
		h.logger.Error("Missing required query parameters: start and end dates")
		h.respondWithError(w, http.StatusBadRequest, "Missing required query parameters: start_date and end_date")
		return
	}

	stats, err := h.service.GetWeekPayments(r.Context(), startDate, endDate)
	if err != nil {
		h.logger.Errorf("Failed to fetch statistics: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch statistics")
		return
	}

	h.respondWithJSON(w, http.StatusOK, stats)
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