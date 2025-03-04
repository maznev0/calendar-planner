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
	router.GET("/orders/days", h.GetQuantityByDates)
	router.GET("/orders/day", h.GetOrdersByDate)  
	router.GET("/orders/day/:id", h.GetById)
	router.POST("/orders", h.Create)
}

func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var request struct {
		Order   Order          `json:"order" binding:"required"`
		Workers []worker.Worker `json:"workers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		h.logger.Errorf("Invalid request: %v", w)
		return
	}

	h.logger.Info("Creating new order")

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

func (h *handler) GetQuantityByDates(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	startDate := r.URL.Query().Get("start")
	endDate := r.URL.Query().Get("end")

	if startDate == "" || endDate == "" {
		h.logger.Error("Missing start or end date")
		http.Error(w, "Missing start or end date", http.StatusBadRequest)
		return
	}

	dates, err := h.service.GetQuantityByDates(r.Context(), startDate, endDate)
	if err != nil {
		h.logger.Errorf("Failed to get orders by dates: %v", err)
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(dates)
	h.logger.Info("Get Quantity By Dates succesfully working.")
}

func (h *handler) GetOrdersByDate(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Error("Date is empty.")
		http.Error(w, "Missing 'date' query parameter", http.StatusBadRequest)
		return
	}

	orders, err := h.service.GetOrdersByDate(r.Context(), date)
	if err != nil {
		h.logger.Errorf("Failed to get orders: %v", err)
		http.Error(w, "Failed to get orders", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(orders)
	h.logger.Info("Get Orders By Date succesfully working.")
}


func (h *handler) GetById(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	w.WriteHeader(200)
	w.Write([]byte("id - order"))
}

