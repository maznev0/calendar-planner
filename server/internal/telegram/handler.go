package telegram

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

func generateSignature(message string) string {
	h := hmac.New(sha256.New, []byte(os.Getenv("SECRET_KEY")))
	h.Write([]byte(message))
	return hex.EncodeToString(h.Sum(nil))
}

func sendPaymentData(paymentData Payment) error {
	jsonData, err := json.Marshal(paymentData)
	if err != nil {
		return err
	}

	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	message := fmt.Sprintf("%s%s%s%s", "POST", "/payments/update/bot", string(jsonData), timestamp)
	signature := generateSignature(message)

	req, err := http.NewRequest("POST", "https://localhost:8443/payments/update/bot", strings.NewReader(string(jsonData)))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-KEY", os.Getenv("API_KEY"))
	req.Header.Set("X-SIGNATURE", signature)
	req.Header.Set("X-TIMESTAMP", timestamp)


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
