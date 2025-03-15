package order

import (
	"encoding/json"
	"net/http"
	"server/internal/handlers"
	"server/internal/worker"
	"server/pkg/logging"

	"github.com/julienschmidt/httprouter"
	"github.com/nats-io/nats.go"
)

type handler struct {
	logger *logging.Logger
	service Service
	natsConn *nats.Conn
}

func NewHandler(logger *logging.Logger, service Service, natsConn *nats.Conn) handlers.Handler {
	return &handler{
		logger: logger,
		service: service,
		natsConn: natsConn,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.GET("/orders/days", h.GetQuantityByDates)
	router.GET("/orders/day", h.GetOrdersByDate)  
	router.GET("/orders/day/:id", h.GetById)
	router.POST("/orders", h.Create)
	router.POST("/orders/send", h.SendOrder)
	router.POST("/orders/update", h.Update)
}

func (h *handler) Create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	var request struct {
		Order   Order          `json:"order" binding:"required"`
		Workers []worker.Worker `json:"workers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		h.logger.Errorf("Invalid request: %v", w)
		h.respondWithError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	h.logger.Info("Creating new order")

	err := h.service.Create(r.Context(), &request.Order, request.Workers)
	if err != nil {
		h.logger.Errorf("Failed to create order: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to create order")
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Order created successfully"))
	h.logger.Info("Order created successfully")
}

func (h *handler) Update(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	ctx := r.Context()

	var order Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.Update(ctx, order); err != nil {
		h.logger.Errorf("Failed to update order: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update order")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order updated successfully"})
	h.logger.Info("Order updated successfully")
}


func (h *handler) GetQuantityByDates(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	startDate := r.URL.Query().Get("start")
	endDate := r.URL.Query().Get("end")

	if startDate == "" || endDate == "" {
		h.logger.Error("Missing start or end date")
		h.respondWithError(w, http.StatusBadRequest, "Missing start or end date")
		return
	}

	dates, err := h.service.GetQuantityByDates(r.Context(), startDate, endDate)
	if err != nil {
		h.logger.Errorf("Failed to get orders by dates: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch data")
		return
	}

	h.respondWithJSON(w, http.StatusOK, dates)
	h.logger.Info("Get Quantity By Dates succesfully working.")
}

func (h *handler) GetOrdersByDate(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Error("Date is empty.")
		h.respondWithError(w, http.StatusBadRequest, "Missing 'date' query parameter")
		return
	}

	orders, err := h.service.GetOrdersByDate(r.Context(), date)
	if err != nil {
		h.logger.Errorf("Failed to get orders: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to get orders")
		return
	}

	h.respondWithJSON(w, http.StatusOK, orders)
	h.logger.Info("Get Orders By Date succesfully working.")
}


func (h *handler) GetById(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	id := params.ByName("id")

	order, workers, payments, err := h.service.GetById(r.Context(), id)
	if err != nil {
		h.logger.Errorf("failed to get order by id: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "failed to get order")
		return
	}

	response := struct {
		Order    Order    `json:"order"`
		Workers  []Worker `json:"workers"`
		Payments Payments `json:"payments"`
	}{
		Order:    order,
		Workers:  workers,
		Payments: payments,
	}

	h.respondWithJSON(w, http.StatusOK, response)
	h.logger.Info("Get Orders By ID succesfully working.")
}

func (h *handler) SendOrder(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var payload struct {
		Order struct {
			OrderID      string  `json:"order_id"`
			OrderDate    string  `json:"order_date"`
			OrderAddress string  `json:"order_address"`
			PhoneNumber  string  `json:"phone_number"`
			Meters       int     `json:"meters"`
			Price        int     `json:"price"`
			ChatId       int64   `json:"chat_id"`
			Note         string  `json:"note"`
		} `json:"order"`
		Workers []struct {
			Workername string `json:"workername"`
			WorkerId   string `json:"worker_id"`
		} `json:"workers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	orderData, err := json.Marshal(payload)
	if err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "Failed to encode order")
		return
	}

	if err := h.natsConn.Publish("new_order", orderData); err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "Failed to publish order")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order sent successfully"})
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