package telegram

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func sendPaymentData(paymentData Payment) error {
	jsonData, err := json.Marshal(paymentData)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "http://localhost:10000/payments/update", strings.NewReader(string(jsonData)))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("ошибка сервера: %s", string(body))
	}

	return nil
}
