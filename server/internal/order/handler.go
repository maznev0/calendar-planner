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
	router.GET("/orders/workers", h.GetWorkers)
	router.POST("/orders", h.Create)
	router.POST("/orders/send", h.SendOrder)
	router.POST("/orders/update", h.Update)
	router.POST("/orders/update/workers&drivers", h.UpdateWorkersAndDriver)
	router.DELETE("/orders/delete/:id", h.Delete)
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
	var order Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.service.Update(r.Context(), order); err != nil {
		h.logger.Errorf("Failed to update order: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update order")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order updated successfully"})
	h.logger.Info("Order updated successfully")
}

func (h *handler) UpdateWorkersAndDriver(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	type UpdateWorkersDriversRequest struct {
		OrderID   string   `json:"order_id"`
		DriverID  *string  `json:"driver_id"`
		WorkerIDs *[]string `json:"worker_ids"`
	}

	var req UpdateWorkersDriversRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	err := h.service.UpdateWorkersAndDriver(r.Context(), req.OrderID, req.DriverID, req.WorkerIDs)
	if err != nil {
		h.logger.Errorf("Failed to update workers and driver: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update order assignments")
		return
	}

	newState := "Ожидает назначения"
	if req.DriverID != nil {
		newState = "Ожидает отправления"
	}
	err = h.service.UpdateOrderState(r.Context(), req.OrderID, newState)
	if err != nil {
		h.logger.Errorf("Failed to update order state: %v", err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update order state")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order assignments updated successfully"})
}

func (h *handler) Delete(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	id := params.ByName("id")
	if id == "" {
		h.respondWithError(w, http.StatusBadRequest, "Missing Order Id")
		h.logger.Error("Missing Order Id")
		return
	}

	err := h.service.Delete(r.Context(), id)
	if err != nil {
		h.logger.Errorf("Failed to delete order with id %s: %v", id, err)
		h.respondWithError(w, http.StatusInternalServerError, "Failed to delete order")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order Deleted"})
	h.logger.Info("Order Deleted")
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
			OrderId      string  `json:"id"`
			DriverId     string  `json:"driver_id"`
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

	orderId := payload.Order.OrderId
	h.logger.Infof("order id: %s", orderId)
	ctx := r.Context()

	orderData, err := json.Marshal(payload)
	if err != nil {
		h.service.UpdateOrderState(ctx, orderId, "Ошибка отправления")
		h.respondWithError(w, http.StatusInternalServerError, "Failed to encode order")
		return
	}

	if err := h.natsConn.Publish("new_order", orderData); err != nil {
		h.service.UpdateOrderState(ctx, orderId, "Ошибка отправления")
		h.respondWithError(w, http.StatusInternalServerError, "Failed to publish order")
		return
	}

	if err := h.service.UpdateOrderState(ctx, orderId, "Отправлено"); err != nil {
		h.respondWithError(w, http.StatusInternalServerError, "Failed to update order status")
		return
	}

	h.respondWithJSON(w, http.StatusOK, map[string]string{"message": "Order sent successfully"})
	h.logger.Info("Order sent successfully.")
}

func (h *handler) GetWorkers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	orderId := r.URL.Query().Get("order_id")
	if orderId == "" {
		h.logger.Error("order_id is required")
		h.respondWithError(w, http.StatusBadRequest, "order_id is required")
		return
	}

	workerIDs, err := h.service.GetWorkers(r.Context(), orderId)
	if err != nil {
		h.logger.Error("Failed to fetch workers")
		h.respondWithError(w, http.StatusInternalServerError, "Failed to fetch workers")
		return
	}

	h.respondWithJSON(w, http.StatusOK, workerIDs)
	h.logger.Infof("Get Workers for order_id: %s", orderId)
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