module main

import os
import veb
import siguici.vite

const port = 8082

pub struct Context {
	veb.Context
	vite.ViteContext
}

pub struct App {
	veb.StaticHandler
	veb.Middleware[Context]
}

pub fn App.new() &App {
	return &App{}
}

pub fn (app App) before_request(ctx Context) {
	println('[v-vite] before_request: ${ctx.req.method} ${ctx.req.url}')
}

pub fn (mut ctx Context) not_found() veb.Result {
	ctx.res.set_status(.not_found)

	title := '404 | Not Found'
	res := $tmpl('templates/errors/404.html')

	return ctx.html(res)
}

pub fn (app &App) index() veb.Result {
	title := 'cv'
	message := 'Your new V web app is powered by veb.'
	return $veb.html()
}

@['/health'; get]
pub fn (app &App) health(mut ctx Context) veb.Result {
	return ctx.text('ok')
}

fn main() {
	// Keep asset and template paths stable for `v run .`.
	os.chdir(os.dir(@FILE))!
	mut app := App.new()
	app.handle_static('public', true)!

	veb.run[App, Context](mut app, port)
}
