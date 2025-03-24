package middleware

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

func verifySignature(message, receivedSignature string) bool {
	h := hmac.New(sha256.New, []byte(os.Getenv("SECRET_KEY")))
	h.Write([]byte(message))
	computedSignature := hex.EncodeToString(h.Sum(nil))
	fmt.Println("Message:", message)
	fmt.Println("Received Signature:", receivedSignature)
	fmt.Println("Computed Signature:", computedSignature)
	return hmac.Equal([]byte(computedSignature), []byte(receivedSignature))
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-KEY")
		signature := r.Header.Get("X-SIGNATURE")
		timestamp := r.Header.Get("X-TIMESTAMP")

		if apiKey == "" || signature == "" || timestamp == "" {
			http.Error(w, "Bye-Bye, sweety", http.StatusUnauthorized)
			return
		}

		currentTime := time.Now().Unix()
		requestTime, err := strconv.ParseInt(timestamp, 10, 64)
		if err != nil || currentTime-requestTime > 120 { // 120 seconds
			http.Error(w, "Bye-bye, sweety", http.StatusForbidden)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close() 

		message := fmt.Sprintf("%s%s%s%s", r.Method, r.URL.Path, string(body), timestamp)

		if !verifySignature(message, signature) {
			http.Error(w, "Ah, go away!", http.StatusForbidden)
			return
		}

		r.Body = io.NopCloser(bytes.NewBuffer(body))

		next.ServeHTTP(w, r)
	})
}