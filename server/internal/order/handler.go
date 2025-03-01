package order

import (
	"encoding/json"
	"net/http"
	"server/internal/handlers"
	"server/internal/worker"
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
	router.GET("/orders/days", h.GetByDates)
	router.GET("/orders/day", h.GetByDate)  
	router.GET("/orders/day/:id", h.GetById)
	router.POST("/orders", h.Create)
}

func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var request struct {
		Order   Order          `json:"order" binding:"required"`
		Workers []worker.Worker `json:"workers"`
	}

	// Декодируем JSON
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		h.logger.Errorf("Invalid request: %v", w)
		return
	}

	// Логируем создание заказа
	h.logger.Info("Creating new order")

	// Вызываем сервис для создания заказа и добавления рабочих
	err := h.service.Create(r.Context(), &request.Order, request.Workers)
	if err != nil {
		h.logger.Errorf("Failed to create order: %v", err)
		http.Error(w, "Failed to create order", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Order created successfully"))
	h.logger.Info("Order created successfully")
}

func (h *handler) GetByDates(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("dates - orders"))
}

func (h *handler) GetByDate(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("date - order"))
}

func (h *handler) GetById(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("id - order"))
}

