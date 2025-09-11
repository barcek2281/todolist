package config

import (
	"os"

	_ "embed"
	"gopkg.in/yaml.v3"
)

//go:embed config.yaml
var defaultConfig []byte

const configPath = "config.yaml"

type Config struct {
	DB ConfigDB `yaml:"db"`
}

type ConfigDB struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
	Database string `yaml:"database"`
}

func New() (*Config, error) {
	var data []byte
	var err error

	// Try external file first
	data, err = os.ReadFile(configPath)
	if err != nil {
		// Fallback to embedded default
		data = defaultConfig
	}

	cfg := &Config{}
	err = yaml.Unmarshal(data, cfg)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}
