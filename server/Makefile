BINARY_NAME=server
BINARY_NAME_BOT=bot
BUILD_DIR=bin
LDFLAGS=-ldflags="-s -w"

PLATFORMS=darwin/arm64 linux/amd64

build-mac:
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-mac cmd/app/main.go

build-mac-bot:
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME_BOT)-mac cmd/bot/main.go

build-linux-app:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux cmd/app/main.go

build-linux-bot:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux cmd/bot/main.go

build-all:
	@mkdir -p $(BUILD_DIR)
	@for platform in $(PLATFORMS); do \
		GOOS=$$(echo $$platform | cut -d'/' -f1); \
		GOARCH=$$(echo $$platform | cut -d'/' -f2); \
		OUTPUT=$(BUILD_DIR)/$(BINARY_NAME)-$$GOOS-$$GOARCH; \
		echo "🔨 Building for $$GOOS/$$GOARCH..."; \
		GOOS=$$GOOS GOARCH=$$GOARCH go build $(LDFLAGS) -o $$OUTPUT cmd/main.go; \
	done
	@echo "All builds completed. Launch one of them."

clean:
	rm -rf $(BUILD_DIR)
