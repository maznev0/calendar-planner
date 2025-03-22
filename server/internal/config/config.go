package config

import (
	"server/pkg/logging"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	IsDebug *bool `yaml:"is_debug" env-required:"true"`
	Listen struct {
		Type   string `yaml:"type" env-default:"port"`
		BindIP string `yaml:"bind_ip" env-default:"127.0.0.1"`
		Port   string `yaml:"port" env-default:"8080"`
	} `yaml:"listen"`

	Database DBConfig `yaml:"database"`
	TLS      TLSConfig `yaml:"tls"`
	Telegram TGConfig `yaml:"telegram"`
}

type DBConfig struct {
	Host     string `yaml:"host" env-default:"localhost"`
	Port     string `yaml:"port" env-default:"5432"`
	Name     string `yaml:"name" env-default:"postgres"`
	SSLMode  string `yaml:"sslmode" env-default:"disable"`
	User     string `env:"DB_USER"`
	Password string `env:"DB_PASSWORD"`
} 

type TLSConfig struct {
	CertFile string `yaml:"cert_file" env:"TLS_CERT_FILE"`
	KeyFile  string `yaml:"key_file" env:"TLS_KEY_FILE"`
}

type TGConfig struct {
	Token string `env:"TG_BOT_TOKEN"`
}

var instance *Config
var once sync.Once

func GetConfig() *Config {
	once.Do(func() {
		logger := logging.GetLogger()
		logger.Info("read server config")

		if err := godotenv.Load(); err != nil {
			logger.Warn("No .env file found, using system environment variables")
		}

		instance = &Config{}
		if err := cleanenv.ReadConfig("config.yml", instance); err != nil {
			help, _ := cleanenv.GetDescription(instance, nil)
			logger.Info(help)
			logger.Fatal(err)
		}

		if err := cleanenv.ReadEnv(instance); err != nil {
			logger.Fatal(err)
		}
	})
	return instance
}
