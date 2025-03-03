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
}

func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var request Car // Используем модель из model.go

	// Декодируем JSON
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		h.logger.Errorf("Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Вызываем сервис для сохранения машины
	err := h.service.Create(r.Context(), &request, request.DriverId)
	if err != nil {
		h.logger.Errorf("Failed to create car: %v", err)
		http.Error(w, "Failed to create car", http.StatusInternalServerError)
		return
	}

	// Отправляем успешный ответ
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Car created successfully"))
}

