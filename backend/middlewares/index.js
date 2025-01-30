import express from 'express';
import morgan from 'morgan';

const reqisterMiddlewares = (app) => {
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(morgan('dev'))
}

export default reqisterMiddlewares;
