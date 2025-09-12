package main

import (
	"embed"
	"log"
	"wailstest/internal/config"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS
//go:embed config.yaml
var defaultConfig []byte

func main() {
	cnf, err := config.New(defaultConfig)


	if err != nil {
		log.Fatalf("cannot find config file: %v", err)
	}
	app, err := NewApp(cnf)
	if err != nil {
		log.Fatalf("cannot create app: %v", err)
	}

	
	err = wails.Run(&options.App{
		Title:  "todolist",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
